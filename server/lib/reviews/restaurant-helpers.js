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
// @ts-ignore
exports.updateRestaurantFn = async (_a) => {
    var { id } = _a, data = __rest(_a, ["id"]);
    const updatedRestaurantDoc = admin.firestore().collection('restaurants').doc(id);
    await updatedRestaurantDoc.update(data);
    const updatedRestaurantData = await updatedRestaurantDoc.get();
    return Object.assign({ id: updatedRestaurantData.id }, updatedRestaurantData.data());
};
// @ts-ignore
exports.recalculateRating = async ({ restaurantData, review }) => {
    // @ts-ignore
    const reviewsIds = (await Promise.all(restaurantData.reviews.map(reviewDoc => (reviewDoc.get())))).map(({ id }) => id);
    // @ts-ignore
    const allReviews = await admin.firestore().collection('reviews').get();
    const reviewsRatingsSoFar = allReviews
        .docs
        .map(doc => (Object.assign({ id: doc.id }, doc.data())))
        // @ts-ignore
        .filter(doc => reviewsIds.includes(doc.id))
        // @ts-ignore
        .map(({ rating }) => rating);
    const allRatings = review ? [...reviewsRatingsSoFar, review.rating] : reviewsRatingsSoFar;
    return allRatings
        .reduce((acc, curr) => acc + curr, 0) / allRatings.length;
};
//# sourceMappingURL=restaurant-helpers.js.map