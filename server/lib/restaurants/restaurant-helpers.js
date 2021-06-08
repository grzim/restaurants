"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recalculateRating = exports.updateRestaurantFn = void 0;
const admin = require("firebase-admin");
exports.updateRestaurantFn = async (_a) => {
    var { id } = _a, data = __rest(_a, ["id"]);
    const updatedRestaurantDoc = admin.firestore().collection('restaurants').doc(id);
    await updatedRestaurantDoc.update(data);
    const updatedRestaurantData = await updatedRestaurantDoc.get();
    return Object.assign({ id: updatedRestaurantData.id }, updatedRestaurantData.data());
};
exports.recalculateRating = async ({ restaurantData, review, exclude = false }) => {
    // @ts-ignore
    const reviewsIds = (await Promise.all(restaurantData.reviews.map(reviewDoc => (reviewDoc.get())))).map(({ id }) => id);
    const allReviews = await admin.firestore().collection('reviews').get();
    const reviewsRatingsSoFar = allReviews
        .docs
        .map(doc => (Object.assign({ id: doc.id }, doc.data())))
        .filter(doc => reviewsIds.includes(doc.id))
        // @ts-ignore
        .map(({ rating }) => rating);
    const allRatings = exclude ?
        reviewsRatingsSoFar.filter(r => r.id !== review.id) :
        [...reviewsRatingsSoFar, review.rating];
    return allRatings.length > 0 ?
        allRatings
            .reduce((acc, curr) => acc + curr, 0) / allRatings.length : 0;
};
//# sourceMappingURL=restaurant-helpers.js.map