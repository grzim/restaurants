import {Injectable} from '@angular/core';
import {merge, Observable, ReplaySubject, Subject} from 'rxjs';
import {ServerService} from '../server/server.service';
import {Restaurant, Review, ReviewResponse} from '../../utils/models';
import {finalize, map, mergeMap, scan, shareReplay} from 'rxjs/operators';
import {applyTransformation} from '../../utils/helpers';
import {
  addResponseToReview,
  addRestaurant,
  editReview,
  deleteReview,
  addReviewToRestaurantAndUpdateRating,
  editRestaurant,
  removeRestaurant,
  setRestaurants, deleteResponse, editResponse
} from './restaurant-service-utils';

@Injectable({
  providedIn: 'root'
})
export class RestaurantsService {

  // inputs
  submitReview = new ReplaySubject<Review>();
  submitReviewResponse = new ReplaySubject<ReviewResponse>();
  submitRestaurant = new ReplaySubject<Restaurant>();
  remove = new ReplaySubject<{ id: string }>();
  add = new ReplaySubject<{ name: string , ownerId: string}>();
  resetToInitial = new ReplaySubject();
  deleteReview = new ReplaySubject<{ id: string }>();
  deleteResponse = new ReplaySubject<{ id: string }>();
  editResponse = new ReplaySubject<ReviewResponse>();
  editReview = new ReplaySubject<Review>();

  // outputs
  data$: Observable<Restaurant[]>;

  constructor(server: ServerService) {
    const initialData$ = this.resetToInitial.pipe(mergeMap(() => server.restaurants$));
    const restaurantDataSources = [
      server.deletedReview$.pipe(map(deleteReview)),
      server.editedReview$.pipe(map(editReview)),
      server.restaurants$.pipe(map(setRestaurants)),
      server.addedRestaurant$.pipe(map(addRestaurant)),
      server.restaurantDeletedId$.pipe(map(removeRestaurant)),
      server.editedRestaurant$.pipe(map(editRestaurant)),
      initialData$.pipe(map(setRestaurants)),
      server.reviewResponseAdded$.pipe(map(addReviewToRestaurantAndUpdateRating)),
      server.reviewAdded$.pipe(map(addResponseToReview)),
    ];

    const restaurants$ = merge(
      ...restaurantDataSources,
    ).pipe(
      scan(applyTransformation, []));
    this.data$ = restaurants$.pipe(shareReplay(1));
    this.deleteReview.subscribe(server.deleteReview);
    this.editReview.subscribe(server.editReview);
    this.submitRestaurant.subscribe(server.editRestaurant);
    this.remove.subscribe(server.deleteRestaurant);
    this.add.subscribe(server.addRestaurant);
    this.submitReview.subscribe(server.addRestaurantReview);
    this.submitReviewResponse.subscribe(server.addReviewResponse);
  }
}
