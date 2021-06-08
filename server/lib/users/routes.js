"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRoutes = void 0;
const controller_1 = require("./controller");
const authenticated_1 = require("../auth/authenticated");
const authorized_1 = require("../auth/authorized");
function usersRoutes(app) {
    app.post("/users", authenticated_1.isAuthenticated, authorized_1.isAuthorized({ hasType: ["Admin"] }), controller_1.create);
    app.get("/users", [
        authenticated_1.isAuthenticated,
        authorized_1.isAuthorized({ hasType: ["Admin"] }),
        controller_1.all,
    ]);
    app.get("/users/:id", [
        authenticated_1.isAuthenticated,
        authorized_1.isAuthorized({ hasType: ["Admin"], allowSameUser: true }),
        controller_1.get,
    ]);
    app.get("/users/role/:id", [
        authenticated_1.isAuthenticated,
        authorized_1.isAuthorized({ hasType: ["Admin"], allowSameUser: true }),
        controller_1.getType,
    ]);
    app.put("/users/:id", [
        authenticated_1.isAuthenticated,
        authorized_1.isAuthorized({ hasType: ["Admin"], allowSameUser: true }),
        controller_1.put,
    ]);
    // deletes :id user
    app.delete("/users/:id", [
        authenticated_1.isAuthenticated,
        authorized_1.isAuthorized({ hasType: ["Admin"], allowSameUser: true }),
        controller_1.remove,
    ]);
    return app;
}
exports.usersRoutes = usersRoutes;
//# sourceMappingURL=routes.js.map