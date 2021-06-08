import {animate, state, style, transition, trigger} from '@angular/animations';
import {partition} from 'rxjs';
import {concatMap, filter, pluck, share, takeUntil} from 'rxjs/operators';
import {EditRestaurantDialogComponent} from './components/edit-restaurant-dialog/edit-restaurant-dialog.component';
import {identity} from '../../utils/helpers';
import {AddReviewDialogComponent} from './components/add-review-dialog/add-review-dialog.component';
import {AddRestaurantDialogComponent} from './components/add-restaurant-dialog/add-restaurant-dialog.component';
import {AddReviewResponseDialogComponent} from './components/add-review-response-dialog/add-review-response-dialog.component';
import {EditReviewDialogComponent} from './components/edit-review-dialog/edit-review-dialog.component';

export const animations = [
  trigger('detailExpand', [
    state('collapsed', style({height: '0px', minHeight: '0'})),
    state('expanded', style({height: '*'})),
    transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
  ])
];
export const addIsOwnerProp = ([restaurants, {id}]) => restaurants.map((restaurant) => ({
  ...restaurant,
  isOwnedByUser: restaurant.ownerId === id
}));
export const toOnlyUsersRestaurant = ([restaurants, {id}]) => restaurants.filter(({ownerId}) => ownerId === id);
export const toHighestRated = (a, b) => b.rating - a.rating;
export const toLowestRated = (a, b) => a.rating - b.rating;
export const toSortedByLatest = (a, b) => new Date(b.dateOfVisit).getTime() - new Date(a.dateOfVisit).getTime();
export const modalsHandlers = (
  {dialog, openEditReviewModalWithData,
    opeEditRestaurantModalWithData, openAddReviewModalWithData,
    openCreateNewRestaurantModal, openResponseModalWithData}
) => {
  const [restaurantDataToEdit$, restaurantIdToDelete$] = partition(
    opeEditRestaurantModalWithData
      .pipe(
        pluck('restaurant'),
        concatMap(
          (data) => dialog.open(EditRestaurantDialogComponent, {
            data
          }).afterClosed()
        ),
        filter(identity),
        share()),
    (({action}) => action === 'update'));

  const reviewToAdd$ = openAddReviewModalWithData
    .pipe(
      pluck('restaurant'),
      concatMap(
        (data) => dialog.open(AddReviewDialogComponent, {
          data
        }).afterClosed()
      ),
      filter(identity));

  const restaurantToCreate$ = openCreateNewRestaurantModal
    .pipe(
      concatMap(
        (data) => dialog.open(AddRestaurantDialogComponent, {
          data
        }).afterClosed()
      ),
      filter(identity));

  const reviewResponseToAdd$ = openResponseModalWithData
    .pipe(
      pluck('reviewId'),
      concatMap(
        (data) => dialog.open(AddReviewResponseDialogComponent, {
          data
        }).afterClosed()
      ),
      filter(identity));

  const reviewToEdit$ = openEditReviewModalWithData.pipe(
    concatMap(
      (data) => dialog.open(EditReviewDialogComponent, {
        data
      }).afterClosed()
    ),
    filter(identity));

  return {
    reviewToEdit$, restaurantDataToEdit$, restaurantIdToDelete$, reviewToAdd$, restaurantToCreate$, reviewResponseToAdd$
  };
};
