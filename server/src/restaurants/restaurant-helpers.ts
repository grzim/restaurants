
import * as admin from "firebase-admin";
import {Restaurant, Review} from "../models";

export const updateRestaurantFn = async ({ id, ...data}: any) => {
    const updatedRestaurantDoc = admin.firestore().collection('restaurants').doc(id);
    await updatedRestaurantDoc.update(data);
    const updatedRestaurantData = await updatedRestaurantDoc.get();
    return {id: updatedRestaurantData.id, ...updatedRestaurantData.data()};
};

export const recalculateRating = async ({restaurantData, review, exclude = false}: {
                                                restaurantData: Restaurant,
                                                review: Review,
                                                exclude?: boolean}): Promise<number> => {
    // @ts-ignore
    const reviewsIds = (await Promise.all(restaurantData.reviews.map( reviewDoc => (reviewDoc.get())))).map(({id}) => id);

    const allReviews = await admin.firestore().collection('reviews').get();
    const reviewsRatingsSoFar = allReviews
        .docs
        .map(doc => ({id: doc.id, ...doc.data()}))
        .filter(doc => reviewsIds.includes(doc.id))
        // @ts-ignore
        .map(({ rating }) => rating);

    const allRatings = exclude ?
        reviewsRatingsSoFar.filter(r => r.id !== review.id) :
        [...reviewsRatingsSoFar, review.rating];

    return allRatings.length > 0 ?
        allRatings
        .reduce((acc, curr: Review) => acc + curr, 0) / allRatings.length : 0;
}
