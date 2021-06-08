import {Request, Response} from "express";
import * as admin from 'firebase-admin';
import {
    findMissingKeys,
    isRestaurantNameNotToLong,
    maxRestaurantNameLength
} from "../utils/funcs";
import {updateRestaurantFn} from "./restaurant-helpers";
import {Restaurant} from "../models";

export const getRestaurants = async (req: Request, res: Response) => {
    const restaurants = (await admin.firestore().collection('restaurants').get())
        .docs
        .map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Restaurant[];

    for(let restaurant of restaurants) {
        const reviews = [];
        for(let reviewId of restaurant.reviews) {
            // @ts-ignore
            const review = await reviewId.get();
            reviews.push({
                id: review.id,
                ...review.data()
            })
        }
        restaurant.reviews = reviews;
    }

    return res.status(200).send(restaurants);

};

export const updateRestaurant = async (req: Request, res: Response) => {
    const name = req.body.name.trim() as string;
    if(!isRestaurantNameNotToLong(name)) return res.status(400).send({message: 'Name can have up to 30 characters'});
    if(name.length === 0) return res.status(400).send({message: 'Name cannot be empty'});
    const updatedRestaurant = await updateRestaurantFn({id: req.params.id, name});
    return res.status(200).send(updatedRestaurant);
};

export const deleteRestaurant = async (req: Request, res: Response) => {
    await admin.firestore().collection('restaurants').doc(req.params.id).delete();
    return res.status(200).send({id: req.params.id});
}

export const getRestaurant = async (req: Request, res: Response) => {
    const snapshot = await admin.firestore().collection('restaurants').doc(req.params.id).get() as any;
    const {id, reviews, ...rest} = snapshot;
    const reviewsArr: any[] = [];
    snapshot.reviews.forEach((reviewDoc: any) => {
        const {id, ...data} = reviewDoc.get();
        reviewsArr.push({id, ...data.data()})
    });
    const data = rest.data();
    return res.status(200).send(JSON.stringify({id, reviews: reviewsArr, ...data}));
};

export const addRestaurant = async (req: Request, res: Response) => {
    const restaurant = req.body;
    if(!isRestaurantNameNotToLong(req.body.name))
        return res.status(400).send({message: `Name can have up to ${maxRestaurantNameLength} characters`});
    const missingFields = findMissingKeys(req.body, ['name']);
    if (missingFields) {
        return res.status(400).send({message: missingFields});
    }
    restaurant.name = restaurant.name.trim();
    if(!restaurant.reviews) restaurant.reviews = [];
    const addedReviewDoc = await admin.firestore().collection('restaurants').add(restaurant);
    const addedRestaurantDoc = await addedReviewDoc.get();
    return res.status(201).send({
        id: addedRestaurantDoc.id,
        ...addedRestaurantDoc.data()
    });
};
