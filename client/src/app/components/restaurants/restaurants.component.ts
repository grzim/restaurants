import {ApplicationRef, Component, EventEmitter, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {RestaurantsService} from '../../services/restaurants/restaurants.service';
import {combineLatest, merge, Observable, Subject} from 'rxjs';
import {Restaurant, Review} from '../../utils/models';
import {filter, map, mergeMap, pluck, share, shareReplay, startWith, takeUntil, tap, withLatestFrom} from 'rxjs/operators';
import {LoggedUserService} from '../../services/logged-user/logged-user.service';
import {isAdmin, isOwner} from '../../utils/validators';
import {identity, not} from '../../utils/helpers';
import {MatDialog} from '@angular/material/dialog';
import {
  addIsOwnerProp,
  animations,
  modalsHandlers,
  toHighestRated,
  toLowestRated,
  toOnlyUsersRestaurant,
  toSortedByLatest
} from './restaurants-helpers';
import {MatAccordion} from '@angular/material/expansion';
import {replicatePairs} from '../../utils/replications';

@Component({
  animations,
  selector: 'rr-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.css', '../../common-styles/table.css']
})
export class RestaurantsComponent implements OnInit, OnDestroy {
  limit = 1;
  minRating = 0;
  showPendingReviews = false;
  destroy = new Subject();
  toHighestRated = toHighestRated;
  toLowestRated = toLowestRated;
  toSortedByLatest = toSortedByLatest;
  selectElement = new EventEmitter<Restaurant>();
  showOnlyMyRestaurants = new EventEmitter<void>();
  showAllRestaurants = new EventEmitter<void>();
  openResponseModalWithData = new EventEmitter();
  openAddReviewModalWithData = new EventEmitter();
  opeEditRestaurantModalWithData = new EventEmitter();
  openEditReviewModalWithData = new EventEmitter<{ review: Review, restaurant: Restaurant & {isOwnedByUser: boolean} }>();
  openCreateNewRestaurantModal = new EventEmitter();
  submitResponse = new EventEmitter();
  deleteReview = new EventEmitter();
  submitReview = new EventEmitter();
  reviewToAdd$;
  reviewsWithPendingResponses$;
  highestReview$;
  restaurantShowPredicate$;
  restaurantPredicateWithRoleApplied$;
  lastReviews$;
  selectedElement$;
  isAdmin$: Observable<boolean>;
  isNotOwner$: Observable<boolean>;
  restaurants$: Observable<(Restaurant & {isOwnedByUser: boolean})[]>;
  responseModalData$: Observable<Review>;
  reviews$: Observable<Review[]>;
  isResponseModalVisible$: Observable<boolean>;
  isReviewModalVisible$: Observable<boolean>;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  expandedElement: Restaurant | null;

  constructor(restaurantsService: RestaurantsService, appRef: ApplicationRef,
              loggedUserService: LoggedUserService, public dialog: MatDialog) {

    this.responseModalData$ = this.openResponseModalWithData.pipe(shareReplay(1));
    const allRestaurants$ = restaurantsService.data$;
    this.isNotOwner$ = loggedUserService.data$.pipe(filter(identity),
      map(not(isOwner)));

    const myRestaurants$ = allRestaurants$.pipe(
      withLatestFrom(loggedUserService.data$),
      map(toOnlyUsersRestaurant));

    this.isAdmin$ = loggedUserService.data$.pipe(map(isAdmin));
    this.restaurants$ = merge(
      this.showAllRestaurants.pipe(startWith(null), mergeMap(() => allRestaurants$)),
      this.showOnlyMyRestaurants.pipe(mergeMap(() => myRestaurants$)),
    ).pipe(
      withLatestFrom(loggedUserService.data$),
      map(addIsOwnerProp)
    );

    merge(this.openAddReviewModalWithData, this.opeEditRestaurantModalWithData)
      .pipe(takeUntil(this.destroy))
      .subscribe(({event}) => event.stopImmediatePropagation());

    this.submitResponse.pipe(
      takeUntil(this.destroy),
      withLatestFrom(this.responseModalData$),
      map(([response, {id: reviewId}]) => ({...response, reviewId})))
      .subscribe(restaurantsService.submitReviewResponse);

    this.reviews$ = this.restaurants$.pipe(
      map(restaurants => restaurants.reduce((acc, {reviews}) => [...acc, ...reviews], [])),
      shareReplay(1));

    this.reviewsWithPendingResponses$ = this.reviews$.pipe(
      map(reviews => reviews.filter(({response}) => !response))
    );
    this.selectedElement$ = this.selectElement.pipe(shareReplay(1));

    const {
      reviewToEdit$, restaurantDataToEdit$, restaurantIdToDelete$, reviewToAdd$, restaurantToCreate$, reviewResponseToAdd$
    } = modalsHandlers({
      dialog: this.dialog,
      openEditReviewModalWithData: this.openEditReviewModalWithData,
      opeEditRestaurantModalWithData: this.opeEditRestaurantModalWithData,
      openAddReviewModalWithData: this.openAddReviewModalWithData,
      openCreateNewRestaurantModal: this.openCreateNewRestaurantModal,
      openResponseModalWithData: this.openResponseModalWithData
    });

    const reviewToDelete$ = this.deleteReview.pipe(
      map(data => window.confirm('Are you sure, you want to delete the review?') && data),
      filter(identity),
    );

    const restaurantToCreateWithOwnerId$ = restaurantToCreate$.pipe(
      takeUntil(this.destroy),
      withLatestFrom(loggedUserService.data$),
      map(([restaurantData, {id}]) => ({
        ...restaurantData,
        ownerId: id
      })));

    replicatePairs([
      [reviewResponseToAdd$, restaurantsService.submitReviewResponse],
      [reviewToAdd$, restaurantsService.submitReview],
      [reviewToEdit$, restaurantsService.editReview],
      [reviewToDelete$, restaurantsService.deleteReview],
      [restaurantDataToEdit$, restaurantsService.submitRestaurant],
      [restaurantIdToDelete$, restaurantsService.remove],
      [restaurantToCreateWithOwnerId$, restaurantsService.add],
    ]);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy.next();
  }

  restaurantIdentify(index, restaurant): string{
    return restaurant.id;
  }
}

