const devServerUrl = 'http://localhost:5001/restaurants-a4c31/us-central1/api/';
const prodServerUrl = 'https://us-central1-restaurants-a4c31.cloudfunctions.net/api';
export const serverUrl = devServerUrl;

export const usersUrl = 'users';
export const restaurantsUrl = 'restaurants';
export const restaurantUrl = 'restaurants/:id';
export const reviewUrl = 'restaurants/:id/reviews';
export const reviewResponseUrl = 'reviews/:id/response';
export const editSelfUrl = 'users/:id';
export const editUserUrl = 'users/:id';
export const editReviewUrl = 'reviews/:id';
export const deleteReviewUrl = 'reviews/:id';
export const userTypes = ['Regular', 'Owner', 'Admin'];

export const maxRestaurantNameLength = 30;
export const maxReviewTextLength = 100;
export const maxReviewResponseLength = 100;
