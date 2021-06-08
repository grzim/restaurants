import {Application} from "express";
import {
    addReview,
    addReviewResponse, deleteResponse,
    deleteReview, editResponse, editReview
} from "./controller";
import {isAuthenticated} from "../auth/authenticated";
import {isAuthorized} from "../auth/authorized";

export function reviewRoutes(app: Application) {
    app.post("/restaurants/:id/reviews",
        isAuthenticated,
        addReview
    );
    app.put("/reviews/:id/response",
        isAuthenticated,
        isAuthorized({hasType: ["Admin","Owner"]}),
        editResponse
    );
    app.put("/reviews/:id",
       isAuthenticated,
       isAuthorized({hasType: ["Admin"]}),
        editReview
    );
    app.delete("/reviews/:id/response",
        isAuthenticated,
        isAuthorized({hasType: ["Admin"]}),
        deleteResponse
    );
    app.delete("/reviews/:id",
        isAuthenticated,
        isAuthorized({hasType: ["Admin"]}),
        deleteReview
    );
    app.post("/reviews/:id/response",
        isAuthenticated,
        isAuthorized({hasType: ["Admin","Owner"]}),
        addReviewResponse
    );

    return app;
}
