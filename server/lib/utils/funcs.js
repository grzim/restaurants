"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReviewResponseNotToLong = exports.isReviewTextNotToLong = exports.isRestaurantNameNotToLong = exports.maxReviewResponseLength = exports.maxReviewTextLength = exports.maxRestaurantNameLength = exports.filterUndefinedFields = exports.withErrorHandler = exports.handleError = exports.findMissingKeys = void 0;
exports.findMissingKeys = (obj, keys) => {
    const objKeys = Object.keys(obj);
    const missingKeys = keys
        .filter(key => !!(key.replace(/\s/g, '')))
        .filter(key => !objKeys.includes(key));
    return missingKeys.length ? "Missing keys: " + missingKeys.join(", ") : null;
};
function handleError(res, err) {
    return res.status(500).send({ message: `${err.code} - ${err.message}` });
}
exports.handleError = handleError;
function withErrorHandler(fn) {
    return function (req, res) {
        try {
            return fn(req, res);
        }
        catch (err) {
            return handleError(res, err);
        }
    };
}
exports.withErrorHandler = withErrorHandler;
exports.filterUndefinedFields = (obj) => {
    const entries = Object.entries(obj);
    const withoutUnd = entries.filter(([key, value]) => value !== undefined);
    return withoutUnd.reduce((acc, curr) => (Object.assign(Object.assign({}, acc), { [curr[0]]: curr[1] })), {});
};
exports.maxRestaurantNameLength = 30;
exports.maxReviewTextLength = 100;
exports.maxReviewResponseLength = 100;
exports.isRestaurantNameNotToLong = (name) => (name === null || name === void 0 ? void 0 : name.length) || 0 <= exports.maxRestaurantNameLength;
exports.isReviewTextNotToLong = (review) => { var _a; return ((_a = review === null || review === void 0 ? void 0 : review.text) === null || _a === void 0 ? void 0 : _a.length) || 0 <= exports.maxReviewTextLength; };
exports.isReviewResponseNotToLong = (response) => response.length || 0 <= exports.maxReviewResponseLength;
//# sourceMappingURL=funcs.js.map