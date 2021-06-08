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
exports.addRestaurant = exports.getRestaurant = exports.deleteRestaurant = exports.updateRestaurant = exports.getRestaurants = void 0;
const admin = require("firebase-admin");
const funcs_1 = require("../utils/funcs");
const restaurant_helpers_1 = require("./restaurant-helpers");
exports.getRestaurants = async (req, res) => {
    const restaurants = (await admin.firestore().collection('restaurants').get())
        .docs
        .map(doc => (Object.assign({ id: doc.id }, doc.data())));
    for (let restaurant of restaurants) {
        const reviews = [];
        for (let reviewId of restaurant.reviews) {
            // @ts-ignore
            const review = await reviewId.get();
            reviews.push(Object.assign({ id: review.id }, review.data()));
        }
        restaurant.reviews = reviews;
    }
    return res.status(200).send(restaurants);
};
exports.updateRestaurant = async (req, res) => {
    const name = req.body.name.trim();
    if (!funcs_1.isRestaurantNameNotToLong(name))
        return res.status(400).send({ message: 'Name can have up to 30 characters' });
    if (name.length === 0)
        return res.status(400).send({ message: 'Name cannot be empty' });
    const updatedRestaurant = await restaurant_helpers_1.updateRestaurantFn({ id: req.params.id, name });
    return res.status(200).send(updatedRestaurant);
};
exports.deleteRestaurant = async (req, res) => {
    await admin.firestore().collection('restaurants').doc(req.params.id).delete();
    return res.status(200).send({ id: req.params.id });
};
exports.getRestaurant = async (req, res) => {
    const snapshot = await admin.firestore().collection('restaurants').doc(req.params.id).get();
    const { id, reviews } = snapshot, rest = __rest(snapshot, ["id", "reviews"]);
    const reviewsArr = [];
    snapshot.reviews.forEach((reviewDoc) => {
        const _a = reviewDoc.get(), { id } = _a, data = __rest(_a, ["id"]);
        reviewsArr.push(Object.assign({ id }, data.data()));
    });
    const data = rest.data();
    return res.status(200).send(JSON.stringify(Object.assign({ id, reviews: reviewsArr }, data)));
};
exports.addRestaurant = async (req, res) => {
    const restaurant = req.body;
    if (!funcs_1.isRestaurantNameNotToLong(req.body.name))
        return res.status(400).send({ message: `Name can have up to ${funcs_1.maxRestaurantNameLength} characters` });
    const missingFields = funcs_1.findMissingKeys(req.body, ['name']);
    if (missingFields) {
        return res.status(400).send({ message: missingFields });
    }
    restaurant.name = restaurant.name.trim();
    if (!restaurant.reviews)
        restaurant.reviews = [];
    const addedReviewDoc = await admin.firestore().collection('restaurants').add(restaurant);
    const addedRestaurantDoc = await addedReviewDoc.get();
    return res.status(201).send(Object.assign({ id: addedRestaurantDoc.id }, addedRestaurantDoc.data()));
};
//# sourceMappingURL=controller.js.map