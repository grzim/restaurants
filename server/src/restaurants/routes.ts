import {Application} from "express";
import {
    addRestaurant,
    deleteRestaurant,
    getRestaurant,
    getRestaurants,
    updateRestaurant
} from "./controller";
import {withErrorHandler} from "../utils/funcs";
import {isAuthenticated} from "../auth/authenticated";
import {isAuthorized} from "../auth/authorized";

export function restaurantsRoutes(app: Application) {
    app.get("/restaurants",
       isAuthenticated,
        getRestaurants
    );
    app.post("/restaurants",
       isAuthenticated,
        isAuthorized({hasType: ["Admin", "Owner"]}),
        addRestaurant
    );
    app.put("/restaurants/:id", [
        isAuthenticated,
        isAuthorized({hasType: ["Admin", "Owner"]}),
        withErrorHandler(updateRestaurant),
    ]);
    app.delete("/restaurants/:id", [
        isAuthenticated,
        isAuthorized({hasType: ["Admin", "Owner"]}),
        withErrorHandler(deleteRestaurant),
    ]);
    app.get("/restaurant/:id", [
        isAuthenticated,
        withErrorHandler(getRestaurant),
    ]);

    return app;
}
