import {Application} from "express";
import {all, create, get, getType, put, remove} from "./controller";
import {isAuthenticated} from "../auth/authenticated";
import {isAuthorized} from "../auth/authorized";

export function usersRoutes(app: Application) {
  app.post("/users",
      isAuthenticated,
     isAuthorized({hasType: ["Admin"]}),
      create
  );
  app.get("/users", [
    isAuthenticated,
   isAuthorized({hasType: ["Admin"]}),
    all,
  ]);
  app.get("/users/:id", [
    isAuthenticated,
   isAuthorized({hasType: ["Admin"], allowSameUser: true}),
    get,
  ]);
  app.get("/users/role/:id", [
    isAuthenticated,
    isAuthorized({hasType: ["Admin"], allowSameUser: true}),
    getType,
  ]);
  app.put("/users/:id", [
    isAuthenticated,
    isAuthorized({hasType: ["Admin"], allowSameUser: true}),
    put,
  ]);
  // deletes :id user
  app.delete("/users/:id", [
    isAuthenticated,
   isAuthorized({hasType: ["Admin"], allowSameUser: true}),
    remove,
  ]);

  return app;
}
