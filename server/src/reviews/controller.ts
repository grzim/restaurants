import {Request, Response} from "express";
import * as admin from 'firebase-admin'
import {Restaurant, Review, ReviewResponse} from "../models";
import {
    filterUndefinedFields,
    findMissingKeys,
    handleError,
    isReviewResponseNotToLong,
    isReviewTextNotToLong,
    maxReviewResponseLength,
    maxReviewTextLength
} from "../utils/funcs";
import {recalculateRating, updateRestaurantFn} from "../restaurants/restaurant-helpers";
export const editReview = async (req: Request & {body: Review}, res: Response) => {
    try {
        const review = req.body;
        const reviewId = req.params.id;
        if(review.text.replace(/\s/g, '') !== review.text && review.text.replace(/\s/g, '').length === 0)
            return res.status(400).send({message: `Review text cannot consist of only white spaces`});
        if(!isReviewTextNotToLong(review))
            return res.status(400).send({message: `Review text can have up to ${maxReviewTextLength} characters`});
        if(review.rating < 1 || review.rating > 5) {
            return res.status(400).send({message: "Improper rating value"});
        }
        const reviewDoc = await admin.firestore().collection('reviews').doc(reviewId);
        const dataToUpdate = filterUndefinedFields({
            text: review.text,
            rating: review.rating,
            authorName: review.authorName,
            dateOfVisit: review.dateOfVisit,
            response: review.response
        });
        await reviewDoc.update(dataToUpdate);
        const reviewAfterEdition = await reviewDoc.get();
        const restaurantId = (reviewAfterEdition.data() as Review).restaurantId;
        const restaurantDoc = admin.firestore().collection('restaurants').doc(restaurantId);
        const restaurant = await restaurantDoc.get();
        const restaurantData = restaurant.data() as Restaurant;
        await updateRestaurantFn({
            id: restaurantId,
            rating: await recalculateRating({restaurantData, review})
        });
        return res.status(200).send({
            id: reviewAfterEdition.id,
            ...reviewAfterEdition.data()
        });
    }
    catch (err) {
        return handleError(res, err);
    }
}

export const addReview = async (req: Request & {body: Review}, res: Response) => {
    try {
        const review = req.body as Review;
        const restaurantId = req.params.id;
        // @ts-ignore
        const userId = review.userId;
        if(review.text.replace(/\s/g, '') !== review.text && review.text.replace(/\s/g, '').length === 0)
            return res.status(400).send({message: `Review text cannot consist of only white spaces`});
        if(!isReviewTextNotToLong(review))
            return res.status(400).send({message: `Review text can have up to ${maxReviewTextLength} characters`});
        const missingFields = findMissingKeys(req.body, ['userId', 'rating', 'dateOfVisit'])
        if (missingFields) {
            return res.status(400).send({message: missingFields});
        }
        if(review.rating < 1 || review.rating > 5) {
            return res.status(400).send({message: "Improper rating value"});
        }
        const restaurantDoc = admin.firestore().collection('restaurants').doc(restaurantId);
        const restaurant = await restaurantDoc.get();
        const restaurantData = restaurant.data() as Restaurant;

        if (restaurantData.ownerId === userId) {
            return res.status(400).send({message: 'Adding reviews to your own restaurants is forbidden'});
        }
        const reviewAdded = await admin.firestore().collection('reviews').add({
                restaurantId,
                text: review.text?.trim() || '',
                dateOfVisit: review.dateOfVisit,
                authorName: review.authorName?.trim() || 'Anonymous',
                rating: review.rating
            });
        const reviewAddedDoc = await reviewAdded.get();
        const reviewsToAddToRestaurant = [...restaurantData.reviews, reviewAdded];

        const updatedRating = await recalculateRating({restaurantData, review});
        const dataToUpdate = {
            rating: updatedRating,
            reviews: reviewsToAddToRestaurant
        }

        await updateRestaurantFn({
            id: restaurantId,
            ...dataToUpdate
        });
        return res.status(200).send({
            id: reviewAddedDoc.id,
            ...reviewAddedDoc.data()
        });
    }
    catch (err) {
        return handleError(res, err);
    }
}

export const addReviewResponse = async (req: Request & {body: ReviewResponse}, res: Response) => {
    const response = req.body.text.trim();
    const reviewId = req.params.id;
    const reviewDoc = await admin.firestore().collection('reviews').doc(reviewId);
    if(response.length === 0)
        return res.status(400).send({message: `Review response text cannot be empty`});

    if(!isReviewResponseNotToLong(response))
        return res.status(400).send({message: `Review response text can have up to ${maxReviewResponseLength} characters`});
    const hasResponseAlready = !!(await reviewDoc.get()).data()?.response;
    if(hasResponseAlready)
        return res.status(400).send({message: 'You can add only one response'});
    await reviewDoc.update({response});

    return res.status(200).send({
        reviewId,
        text: response});
}

export const deleteReview = async (req: Request, res: Response) => {
    const reviewId = req.params.id;
    const reviewDoc = admin.firestore().collection('reviews').doc(reviewId);

    const review = (await reviewDoc.get()).data() as Review;
    const restaurantId = review.restaurantId;
    const restaurantDoc = admin.firestore().collection('restaurants').doc(restaurantId);
    const restaurantData = (await restaurantDoc.get()).data() as Restaurant;
    const reviews = restaurantData.reviews.filter(doc => doc.id !== reviewId);
    const rating = reviews.length ? (reviews.map(({rating}) => rating).reduce((acc, curr) => acc + curr) / reviews.length) : 0

    await updateRestaurantFn({
        id: restaurantId,
        rating,
        reviews });
    await admin.firestore().collection('reviews').doc(req.params.id).delete();
    return res.status(200).send({id: req.params.id, restaurantId});
}

export const deleteResponse = async (req: Request, res: Response) => {
    req.body = {response: ''};
    return await editReview(req, res);
}

export const editResponse = async (req: Request, res: Response) => {
    req.body = {response: req.body.text};
    return await editReview(req, res);
}


