"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRoutes = void 0;
const controller_1 = require("./controller");
const authenticated_1 = require("../auth/authenticated");
const authorized_1 = require("../auth/authorized");
function reviewRoutes(app) {
    app.post("/restaurants/:id/reviews", authenticated_1.isAuthenticated, controller_1.addReview);
    app.put("/reviews/:id/response", authenticated_1.isAuthenticated, authorized_1.isAuthorized({ hasType: ["Admin", "Owner"] }), controller_1.editResponse);
    app.put("/reviews/:id", authenticated_1.isAuthenticated, authorized_1.isAuthorized({ hasType: ["Admin"] }), controller_1.editReview);
    app.delete("/reviews/:id/response", authenticated_1.isAuthenticated, authorized_1.isAuthorized({ hasType: ["Admin"] }), controller_1.deleteResponse);
    app.delete("/reviews/:id", authenticated_1.isAuthenticated, authorized_1.isAuthorized({ hasType: ["Admin"] }), controller_1.deleteReview);
    app.post("/reviews/:id/response", authenticated_1.isAuthenticated, authorized_1.isAuthorized({ hasType: ["Admin", "Owner"] }), controller_1.addReviewResponse);
    return app;
}
exports.reviewRoutes = reviewRoutes;
//# sourceMappingURL=routes.js.map