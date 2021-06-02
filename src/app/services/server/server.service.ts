import {forwardRef, Inject, Injectable, NgZone} from '@angular/core';
import {combineLatest, merge, Observable, partition, ReplaySubject} from 'rxjs';
import {Credentials, Restaurant, Review, ReviewResponse, User} from '../../utils/models';
import {HttpClient} from '@angular/common/http';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import {filter, first, map, mapTo, scan, share, shareReplay, startWith} from 'rxjs/operators';
import {identity} from '../../utils/helpers';
import {MatSnackBar} from '@angular/material/snack-bar';
import {httpCreator, messageText, openSnackBarAndRunZone} from './server-service-utils';
import {usersFacade} from './users-facade';
import {restaurantsFacade} from './restaurants-facade';
import {authFacade} from './auth-facade';
import {isAdmin} from '../../utils/validators';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  addRestaurant = new ReplaySubject<{ name: string, ownerId: string }>();
  addRestaurantReview = new ReplaySubject<Review>();
  addReviewResponse = new ReplaySubject<ReviewResponse>();
  addUser = new ReplaySubject<User>();

  editRestaurant = new ReplaySubject<{ name: string }>();
  editUser = new ReplaySubject<Partial<User> & { userId: string }>();
  editSelf = new ReplaySubject<User>();
  editReview = new ReplaySubject<Review>();

  getUsers = new ReplaySubject();
  getRestaurants = new ReplaySubject();

  deleteUser = new ReplaySubject<{id: string}>();
  deleteSelf = new ReplaySubject<User>();
  deleteRestaurant = new ReplaySubject<{ id: string }>();
  deleteReview = new ReplaySubject<{ id: string }>();

  logOut = new ReplaySubject();
  authenticate = new ReplaySubject<Credentials>();
  register = new ReplaySubject<User>();

  reviewAdded$;
  userEdited$: Observable<User>;
  selfData$: Observable<User>;
  users$: Observable<User[]>;
  isAuthenticating$: Observable<boolean>;
  reviewResponseAdded$;
  restaurants$: Observable<Restaurant[]>;
  authenticatedUserData$: Observable<User>;
  editedReview$: Observable<Review>;
  deletedReview$: Observable<{id: string, restaurantId: string}>;
  editedRestaurant$: Observable<Restaurant>;
  isFetching$: Observable<boolean>;
  userAdded$: Observable<User>;
  userDeletedId$: Observable<{id: string}>;
  addedRestaurant$: Observable<Restaurant>;
  restaurantDeletedId$: Observable<{id: string}>;
  userLoggedIn$;
  userLoggedOut$;
  successMsgs$;
  error$;

  constructor(
    zone: NgZone,
    http: HttpClient,
    @Inject(forwardRef(() => MatSnackBar))
    private snackBar: MatSnackBar,
  ) {
    const auth = firebase.auth();
    const server = ['put', 'get', 'post', 'delete'].map(httpCreator(http));

    const {
      userAuth$, logoutSuccess$, logoutError$,
      editSelfSuccess$, editSelfError$,
      deleteSelfSuccess$, deleteSelfError$,
      registrationSuccess$, registrationError$,
      authSuccess$, authError$
    } = authFacade({
      deleteSelf: this.deleteSelf,
      auth, server, logOut: this.logOut,
      editSelf: this.editSelf, register: this.register,
      authenticate: this.authenticate
    });

    const [userStatusChangedToLoggedIn$, userStatusChangedToLoggedOut$] = partition(userAuth$, identity);

    this.authenticatedUserData$ = merge(registrationSuccess$, userAuth$).pipe(
      filter(identity),
      shareReplay(1));

    const {
      userEditSuccess$, userEditError$, usersSuccess$, usersError$,
      addUserSuccess$, addUserError$, deleteUserSuccess$, deleteUserError$
    } = usersFacade({
      deleteUser: this.deleteUser, userAuth$,
      editUser: this.editUser, server, getUsers: this.getUsers, addUser: this.addUser
    });

    const {
      restaurantEditSuccess$, restaurantEditError$, restaurantsSuccess$, restaurantError$,
      restaurantDeleteSuccess$, restaurantDeleteError$,
      addReviewSuccess$, addReviewError$, addRestaurantSuccess$,
      addRestaurantError$, addReviewResponseSuccess$, addReviewResponseError,
      reviewEditSuccess$, reviewEditError$, reviewDeleteSuccess$, reviewDeleteError$
    } = restaurantsFacade({
      editReview: this.editReview,
      deleteReview: this.deleteReview,
      addReviewResponse: this.addReviewResponse,
      server, editRestaurant: this.editRestaurant,
      deleteRestaurant: this.deleteRestaurant, getRestaurants: this.getRestaurants,
      addRestaurantReview: this.addRestaurantReview, userAuth$, addRestaurant: this.addRestaurant
    });

    this.error$ = merge(
      deleteUserError$, deleteSelfError$, reviewEditError$, reviewDeleteError$,
      addUserError$, restaurantDeleteError$, addRestaurantError$,
      authError$, restaurantEditError$, editSelfError$, logoutError$, addReviewResponseError,
      usersError$, userEditError$, registrationError$, restaurantError$, addReviewError$);

    const success$ = merge(
      deleteUserSuccess$, deleteSelfSuccess$, reviewDeleteSuccess$, reviewEditSuccess$,
      addUserSuccess$, restaurantDeleteSuccess$, addRestaurantSuccess$,
      authSuccess$, restaurantEditSuccess$, editSelfSuccess$, logoutSuccess$, addReviewResponseSuccess$,
      usersSuccess$, userEditSuccess$, registrationSuccess$, restaurantsSuccess$, addReviewSuccess$);

    this.successMsgs$ = merge(editSelfSuccess$.pipe(mapTo(messageText('user data updated'))),
      logoutSuccess$.pipe(mapTo(messageText('you are signed out'))),
      registrationSuccess$.pipe(mapTo(messageText('Registration email has been sent'))))
      .pipe(shareReplay(1));

    this.successMsgs$
      .pipe(map(
        openSnackBarAndRunZone({snackBar: this.snackBar, zone, initialMsg: 'Success!'})
      ), share()).subscribe();

    // this.error$
    //   .pipe(map(
    //     openSnackBarAndRunZone({snackBar: this.snackBar, zone, initialMsg: 'Error!'})
    //   ), share()).subscribe();

    userAuth$
      .pipe(filter(isAdmin), share())
      .subscribe(this.getUsers);

    userAuth$
      .pipe(filter(identity), share())
      .subscribe(this.getRestaurants);

    const fetchStart$ = merge(
      this.addRestaurant,
      this.addRestaurantReview,
      this.addReviewResponse,

      this.editRestaurant,
      this.editUser,
      this.editSelf,

      this.getUsers,
      this.getRestaurants,

      this.deleteUser,
      this.deleteSelf,
      this.deleteRestaurant,

      this.logOut,
      this.authenticate,
      this.register,
    ).pipe(
      scan((acc) => 1 + acc, 0));

    const fetchEnd$ = merge(this.error$, success$).pipe(
      scan((acc) => acc + 1, 0));
    deleteSelfSuccess$
      .pipe(share())
      .subscribe(this.logOut);
    this.deletedReview$ = reviewDeleteSuccess$.pipe(shareReplay(1));
    this.editedReview$ = reviewEditSuccess$.pipe(shareReplay(1));
    this.users$ = usersSuccess$.pipe(shareReplay(1));
    this.userEdited$ = userEditSuccess$.pipe(shareReplay(1));
    this.restaurantDeletedId$ = restaurantDeleteSuccess$.pipe(shareReplay(1));
    this.selfData$ = editSelfSuccess$.pipe(shareReplay(1));
    this.reviewAdded$ = addReviewSuccess$.pipe(shareReplay(1));
    this.reviewResponseAdded$ = addReviewResponseSuccess$.pipe(shareReplay(1));
    this.restaurants$ = restaurantsSuccess$.pipe(shareReplay(1));
    this.userLoggedOut$ = merge(userStatusChangedToLoggedOut$, logoutSuccess$).pipe(mapTo(true));
    this.userLoggedIn$ = merge(userStatusChangedToLoggedIn$, authSuccess$).pipe(mapTo(true));
    this.isAuthenticating$ = userAuth$.pipe(first(), mapTo(false), startWith(true), share());
    this.editedRestaurant$ = restaurantEditSuccess$.pipe(shareReplay(1));
    this.addedRestaurant$ = addRestaurantSuccess$.pipe(shareReplay(1));
    this.userAdded$ = addUserSuccess$.pipe(shareReplay(1));
    this.userDeletedId$ = deleteUserSuccess$.pipe(shareReplay(1));
    this.isFetching$ = combineLatest([fetchStart$, fetchEnd$]).pipe(map( ([startCount, endCount]) => startCount - endCount > 0),
      shareReplay(1),
      startWith(false) );
  }

}
