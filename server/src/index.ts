import * as functions from "firebase-functions";
import * as express from "express";
import * as admin from 'firebase-admin'
import * as bodyParser from "body-parser";
import * as cors from "cors";
import {restaurantsRoutes} from "./restaurants/routes";
import {usersRoutes} from "./users/routes";
import {reviewRoutes} from "./reviews/routes";
const app = express();
app.use(cors({origin: true}));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    next();
});
app.use(bodyParser.json());
admin.initializeApp();
const pipe = (...fns: Function[]) => (x: any) => fns.reduce((acc, f) => f(acc), x);

pipe(
    usersRoutes, restaurantsRoutes, reviewRoutes
)(app);

export const api = functions.https.onRequest(app);
