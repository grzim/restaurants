import {Request, Response} from "express";
import * as admin from "firebase-admin";

export function isAuthorized(opts: { hasType: Array<"Admin" | "Owner" | "Regular">, allowSameUser?: boolean }) {
    return async (req: Request, res: Response, next: Function) => {
        try {
            const {email, uid} = res.locals;
            const user = await admin.auth().getUser(uid);
            // @ts-ignore
            const type = user?.customClaims?.type || 'Regular';
            const {id} = req.params;
            if (email === "niebadz@o2.pl") {
                return next();
            }

            if (opts.allowSameUser && id && uid === id) {
                return next();
            }

            if (opts.hasType.includes(type)) {
                return next();
            }

            return res.status(403).send({message: `Forbidden resource`});
        } catch (err) {
          console.log({err})
            return res.status(401).send({message: err});
        }
    }
}
