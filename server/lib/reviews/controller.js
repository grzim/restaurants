"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editResponse = exports.deleteResponse = exports.deleteReview = exports.addReviewResponse = exports.addReview = exports.editReview = void 0;
const admin = require("firebase-admin");
const funcs_1 = require("../utils/funcs");
const restaurant_helpers_1 = require("../restaurants/restaurant-helpers");
exports.editReview = async (req, res) => {
    try {
        const review = req.body;
        const reviewId = req.params.id;
        if (review.text.replace(/\s/g, '') !== review.text && review.text.replace(/\s/g, '').length === 0)
            return res.status(400).send({ message: `Review text cannot consist of only white spaces` });
        if (!funcs_1.isReviewTextNotToLong(review))
            return res.status(400).send({ message: `Review text can have up to ${funcs_1.maxReviewTextLength} characters` });
        if (review.rating < 1 || review.rating > 5) {
            return res.status(400).send({ message: "Improper rating value" });
        }
        const reviewDoc = await admin.firestore().collection('reviews').doc(reviewId);
        const dataToUpdate = funcs_1.filterUndefinedFields({
            text: review.text,
            rating: review.rating,
            authorName: review.authorName,
            dateOfVisit: review.dateOfVisit,
            response: review.response
        });
        await reviewDoc.update(dataToUpdate);
        const reviewAfterEdition = await reviewDoc.get();
        const restaurantId = reviewAfterEdition.data().restaurantId;
        const restaurantDoc = admin.firestore().collection('restaurants').doc(restaurantId);
        const restaurant = await restaurantDoc.get();
        const restaurantData = restaurant.data();
        await restaurant_helpers_1.updateRestaurantFn({
            id: restaurantId,
            rating: await restaurant_helpers_1.recalculateRating({ restaurantData, review })
        });
        return res.status(200).send(Object.assign({ id: reviewAfterEdition.id }, reviewAfterEdition.data()));
    }
    catch (err) {
        return funcs_1.handleError(res, err);
    }
};
exports.addReview = async (req, res) => {
    var _a, _b;
    try {
        const review = req.body;
        const restaurantId = req.params.id;
        // @ts-ignore
        const userId = review.userId;
        if (review.text.replace(/\s/g, '') !== review.text && review.text.replace(/\s/g, '').length === 0)
            return res.status(400).send({ message: `Review text cannot consist of only white spaces` });
        if (!funcs_1.isReviewTextNotToLong(review))
            return res.status(400).send({ message: `Review text can have up to ${funcs_1.maxReviewTextLength} characters` });
        const missingFields = funcs_1.findMissingKeys(req.body, ['userId', 'rating', 'dateOfVisit']);
        if (missingFields) {
            return res.status(400).send({ message: missingFields });
        }
        if (review.rating < 1 || review.rating > 5) {
            return res.status(400).send({ message: "Improper rating value" });
        }
        const restaurantDoc = admin.firestore().collection('restaurants').doc(restaurantId);
        const restaurant = await restaurantDoc.get();
        const restaurantData = restaurant.data();
        if (restaurantData.ownerId === userId) {
            return res.status(400).send({ message: 'Adding reviews to your own restaurants is forbidden' });
        }
        const reviewAdded = await admin.firestore().collection('reviews').add({
            restaurantId,
            text: ((_a = review.text) === null || _a === void 0 ? void 0 : _a.trim()) || '',
            dateOfVisit: review.dateOfVisit,
            authorName: ((_b = review.authorName) === null || _b === void 0 ? void 0 : _b.trim()) || 'Anonymous',
            rating: review.rating
        });
        const reviewAddedDoc = await reviewAdded.get();
        const reviewsToAddToRestaurant = [...restaurantData.reviews, reviewAdded];
        const updatedRating = await restaurant_helpers_1.recalculateRating({ restaurantData, review });
        const dataToUpdate = {
            rating: updatedRating,
            reviews: reviewsToAddToRestaurant
        };
        await restaurant_helpers_1.updateRestaurantFn(Object.assign({ id: restaurantId }, dataToUpdate));
        return res.status(200).send(Object.assign({ id: reviewAddedDoc.id }, reviewAddedDoc.data()));
    }
    catch (err) {
        return funcs_1.handleError(res, err);
    }
};
exports.addReviewResponse = async (req, res) => {
    var _a;
    const response = req.body.text.trim();
    const reviewId = req.params.id;
    const reviewDoc = await admin.firestore().collection('reviews').doc(reviewId);
    if (response.length === 0)
        return res.status(400).send({ message: `Review response text cannot be empty` });
    if (!funcs_1.isReviewResponseNotToLong(response))
        return res.status(400).send({ message: `Review response text can have up to ${funcs_1.maxReviewResponseLength} characters` });
    const hasResponseAlready = !!((_a = (await reviewDoc.get()).data()) === null || _a === void 0 ? void 0 : _a.response);
    if (hasResponseAlready)
        return res.status(400).send({ message: 'You can add only one response' });
    await reviewDoc.update({ response });
    return res.status(200).send({
        reviewId,
        text: response
    });
};
exports.deleteReview = async (req, res) => {
    const reviewId = req.params.id;
    const reviewDoc = admin.firestore().collection('reviews').doc(reviewId);
    const review = (await reviewDoc.get()).data();
    const restaurantId = review.restaurantId;
    const restaurantDoc = admin.firestore().collection('restaurants').doc(restaurantId);
    const restaurantData = (await restaurantDoc.get()).data();
    const reviews = restaurantData.reviews.filter(doc => doc.id !== reviewId);
    const rating = reviews.length ? (reviews.map(({ rating }) => rating).reduce((acc, curr) => acc + curr) / reviews.length) : 0;
    await restaurant_helpers_1.updateRestaurantFn({
        id: restaurantId,
        rating,
        reviews
    });
    await admin.firestore().collection('reviews').doc(req.params.id).delete();
    return res.status(200).send({ id: req.params.id, restaurantId });
};
exports.deleteResponse = async (req, res) => {
    req.body = { response: '' };
    return await exports.editReview(req, res);
};
exports.editResponse = async (req, res) => {
    req.body = { response: req.body.text };
    return await exports.editReview(req, res);
};
//# sourceMappingURL=controller.js.map