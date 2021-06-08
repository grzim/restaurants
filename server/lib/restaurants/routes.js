"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurantsRoutes = void 0;
const controller_1 = require("./controller");
const funcs_1 = require("../utils/funcs");
const authenticated_1 = require("../auth/authenticated");
const authorized_1 = require("../auth/authorized");
function restaurantsRoutes(app) {
    app.get("/restaurants", authenticated_1.isAuthenticated, controller_1.getRestaurants);
    app.post("/restaurants", authenticated_1.isAuthenticated, authorized_1.isAuthorized({ hasType: ["Admin", "Owner"] }), controller_1.addRestaurant);
    app.put("/restaurants/:id", [
        authenticated_1.isAuthenticated,
        authorized_1.isAuthorized({ hasType: ["Admin", "Owner"] }),
        funcs_1.withErrorHandler(controller_1.updateRestaurant),
    ]);
    app.delete("/restaurants/:id", [
        authenticated_1.isAuthenticated,
        authorized_1.isAuthorized({ hasType: ["Admin", "Owner"] }),
        funcs_1.withErrorHandler(controller_1.deleteRestaurant),
    ]);
    app.get("/restaurant/:id", [
        authenticated_1.isAuthenticated,
        funcs_1.withErrorHandler(controller_1.getRestaurant),
    ]);
    return app;
}
exports.restaurantsRoutes = restaurantsRoutes;
//# sourceMappingURL=routes.js.map