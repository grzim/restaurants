import {Restaurant, User} from '../utils/models';
import {editSelfUrl, restaurantsUrl, reviewResponseUrl, reviewUrl, usersUrl} from '../utils/constants';
import {of} from 'rxjs';

const addReview = (restaurant, data) => {
  restaurant.reviews.push({...data, id: Math.random()});
  // simplification for mock only
  restaurant.rating = (restaurant.rating + data.rating) / 2;
  return restaurant;
};

const addReviewResponse = (review, data) => {
  review.response = data;
  return review;
};

export const mockHttpClientSuccess = {
  get(url): any {
    switch (url) {
      case restaurantsUrl:
        return of(restaurants);
      case usersUrl:
        return of(users);
    }
  },
  post(url, data): any {
    switch (url) {
      case restaurantsUrl:
        return of(restaurantsMemo = restaurantsMemo.concat(data));
      case reviewResponseUrl:
        return of({...data, id: 121});
      case reviewUrl:
        return of({...data, id: 222});
    }
  },
  put(url, data): any {
    switch (url) {
      case editSelfUrl:
        return of(userMemo = {...userMemo, ...data});
      case restaurantsUrl:
        return of(restaurants.map(restaurant => restaurant.id === data.id ? {...data, ...restaurant} : restaurant));
    }
  }
};

export const restaurants: Restaurant[] = [
  {
    id: '1', name: 'restaurant 1', rating: 3, ownerId: 'Mario', reviews: [{
      id: '1a',
      restaurantId: '1',
      dateOfVisit: new Date(1995, 11, 17, 3, 24, 0),
      text: 'Yummy',
      authorName: 'Timmy',
      rating: 4,
      response: 'Thanks'
    }, {
      id: '1b',
      restaurantId: '1',
      dateOfVisit: new Date(2005, 11, 17, 3, 24, 0),
      text: 'Not yummy at all!',
      authorName: 'Jerry',
      rating: 3,
      response: 'So sad:('
    }, {
      id: '1c',
      restaurantId: '1',
      dateOfVisit: new Date(2005, 11, 17, 3, 24, 0),
      text: 'Bellisimo!',
      authorName: 'Fiona',
      rating: 5
    }]
  },
  {id: '2', name: 'restaurant 2', rating: 3.21, ownerId: 'Kubson', reviews: []},
  {id: '3', name: 'restaurant 3', rating: 3.93, ownerId: 'Viola', reviews: []},
];
export const users: User[] = [
  {id: '1', type: 'Regular', email: 'sample@sample.sample', displayName: 'Janusz'},
  {id: '2', type: 'Owner', email: 'sa2mple@sample.sample', displayName: 'Jessica'},
  {id: '3', type: 'Admin', email: 'sam3ple@sample.sample', displayName: 'Albert'},
];

export const loggedUserRegular: User = {
  id: '1', type: 'Regular', email: 'sample@sample.sample', displayName: 'Janusz'
};

export const loggedUsedOwner: User = {
  id: '2', type: 'Owner', email: 'sa2mple@sample.sample', displayName: 'Jessica'
};

export const loggedUserAdmin: User = {
  id: '3', type: 'Admin', email: 'sam3ple@sample.sample', displayName: 'Albert'
};

let restaurantsMemo = restaurants;
let userMemo = loggedUserRegular;
