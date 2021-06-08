import {Restaurant} from '../../utils/models';
import {AccAdd, AccEdit, AccRemove, AccSet, addToAcc, editAcc, removeFromAcc, setAcc} from '../../utils/helpers';
const computeRating = restaurant =>
  restaurant.reviews.length > 0 ?
    restaurant.reviews.reduce((acc, {rating}) => acc + rating, 0) / restaurant.reviews.length :
    0;

// tslint:disable-next-line:no-shadowed-variable
const getReviewForResponse = ({restaurantsData, reviewResponseData}) =>
  restaurantsData.map(restaurant => restaurant.reviews.find(review => review.id === reviewResponseData.reviewId))[0];
export const addReviewResponse = (reviewResponseData, restaurantsData) => {
  const review = getReviewForResponse({restaurantsData, reviewResponseData});
  review.response = reviewResponseData.text;
  return restaurantsData;
};
export const addReview = (reviewData, restaurantsData) => {
  // tslint:disable-next-line:no-shadowed-variable
  const restaurant = restaurantsData.find(restaurant => restaurant.id === reviewData.restaurantId);
  restaurant.reviews.push(reviewData);
  restaurant.rating = computeRating(restaurant);
  return restaurantsData;
};
export const deleteReview = reviewToDelete => restaurants => {
  const {id: reviewId, restaurantId} = reviewToDelete;
  const restaurant = restaurants.find(({id}) => id === restaurantId);
  restaurant.reviews = restaurant.reviews.filter(r => r.id !== reviewId);
  restaurant.rating = computeRating(restaurant);
  return restaurants;
};
export const editReview = reviewToEdit => restaurants => {
  const {id: reviewId, restaurantId} = reviewToEdit;
  const restaurant = restaurants.find(({id}) => id === restaurantId);
  const reviewIndex = restaurant.reviews.findIndex(r => r.id === reviewId);
  restaurant.reviews[reviewIndex] = reviewToEdit;
  restaurant.rating = computeRating(restaurant);
  return restaurants;
};
export const editRestaurant: AccEdit<Restaurant> = editAcc;
export const setRestaurants: AccSet<Restaurant> = setAcc;
export const addRestaurant: AccAdd<Restaurant> = addToAcc;
export const addReviewToRestaurantAndUpdateRating =
    response => restaurantsData => addReviewResponse(response, restaurantsData);
export const addResponseToReview = review => restaurantsData => addReview(review, restaurantsData);
export const removeRestaurant: AccRemove<Restaurant> = removeFromAcc;
export const deleteResponse = responseToDelete => restaurantsData => {
  const review = getReviewForResponse({restaurantsData, reviewResponseData: responseToDelete});
  review.response = '';
  return restaurantsData;
};
export const editResponse = responseToEdit => restaurantsData => {
  const review = getReviewForResponse({restaurantsData, reviewResponseData: responseToEdit});
  review.response = responseToEdit;
  return restaurantsData;
};
