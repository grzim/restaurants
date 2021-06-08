import {Request, Response} from "express";
import {Review} from "../models";

export const findMissingKeys = (obj: object, keys: string[]) => {
    const objKeys = Object.keys(obj);
    const missingKeys = keys
        .filter(key => !!(key.replace(/\s/g, '')))
        .filter(key => !objKeys.includes(key));
    return missingKeys.length ? "Missing keys: " + missingKeys.join(", ") : null;
}

export function handleError(res: Response, err: any) {
    return res.status(500).send({message: `${err.code} - ${err.message}`});
}

export function withErrorHandler(fn: Function) {
    return function(req: Request, res: Response) {
        try {
            return fn(req, res);
        }
        catch (err) {
            return handleError(res, err);
        }
    }
}
export const filterUndefinedFields = (obj: object) => {
    const entries = Object.entries(obj);
    const withoutUnd = entries.filter(([key, value]) => value !== undefined);
    return withoutUnd.reduce((acc, curr) => ({
        ...acc,
        [curr[0]]: curr[1]
    }),{});
}
export const maxRestaurantNameLength = 30;
export const maxReviewTextLength = 100;
export const maxReviewResponseLength = 100;
export const isRestaurantNameNotToLong = (name: string) => name?.length || 0 <= maxRestaurantNameLength;
export const isReviewTextNotToLong = (review: Review) => review?.text?.length || 0 <= maxReviewTextLength;
export const isReviewResponseNotToLong = (response: string) => response.length || 0 <= maxReviewResponseLength;
