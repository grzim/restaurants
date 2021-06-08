import {deleteReviewUrl, editReviewUrl, restaurantsUrl, restaurantUrl, reviewResponseUrl, reviewUrl} from '../../utils/constants';
import {addUserId, modifyReviewUrlMap, responseUrlMap, restaurantUrlMap, reviewUrlMap} from './server-service-utils';
import {combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';

export const restaurantsFacade = ({
                                    deleteReview, editReview,
                                    server, editRestaurant, deleteRestaurant, getRestaurants,
                                    addReviewResponse, addRestaurantReview, userAuth$, addRestaurant
                                  }) => {
  const [put, get, post, remove] = server;

  const [restaurantEditSuccess$, restaurantEditError$] =
    put({source$: editRestaurant, url: restaurantUrl, urlMap: restaurantUrlMap});

  const [reviewEditSuccess$, reviewEditError$] =
    put({source$: editReview, url: editReviewUrl, urlMap: modifyReviewUrlMap});

  const [reviewDeleteSuccess$, reviewDeleteError$] =
    remove({source$: deleteReview, url: deleteReviewUrl, urlMap: modifyReviewUrlMap});

  const [restaurantsSuccess$, restaurantError$] = get({source$: getRestaurants, url: restaurantsUrl});

  const [restaurantDeleteSuccess$, restaurantDeleteError$] =
    remove({source$: deleteRestaurant, url: restaurantUrl, urlMap: restaurantUrlMap});

  const [addReviewSuccess$, addReviewError$] = post({
    source$: combineLatest(addRestaurantReview, userAuth$).pipe(map(addUserId)),
    url: reviewUrl,
    urlMap: reviewUrlMap
  });

  const [addRestaurantSuccess$, addRestaurantError$] = post({
    source$: addRestaurant,
    url: restaurantsUrl
  });

  const [addReviewResponseSuccess$, addReviewResponseError] = post({
    source$: addReviewResponse,
    url: reviewResponseUrl,
    urlMap: responseUrlMap
  });

  return {
    reviewEditSuccess$, reviewEditError$, reviewDeleteSuccess$, reviewDeleteError$,
    restaurantEditSuccess$, restaurantEditError$, restaurantsSuccess$, restaurantError$,
    restaurantDeleteSuccess$, restaurantDeleteError$,
    addReviewSuccess$, addReviewError$, addRestaurantSuccess$,
    addRestaurantError$, addReviewResponseSuccess$, addReviewResponseError
  };
};
