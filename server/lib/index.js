"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes_1 = require("./restaurants/routes");
const routes_2 = require("./users/routes");
const routes_3 = require("./reviews/routes");
const app = express();
app.use(cors({ origin: true }));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    next();
});
app.use(bodyParser.json());
admin.initializeApp();
const pipe = (...fns) => (x) => fns.reduce((acc, f) => f(acc), x);
pipe(routes_2.usersRoutes, routes_1.restaurantsRoutes, routes_3.reviewRoutes)(app);
exports.api = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map