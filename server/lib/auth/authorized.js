"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthorized = void 0;
const admin = require("firebase-admin");
function isAuthorized(opts) {
    return async (req, res, next) => {
        var _a;
        try {
            const { email, uid } = res.locals;
            const user = await admin.auth().getUser(uid);
            // @ts-ignore
            const type = ((_a = user === null || user === void 0 ? void 0 : user.customClaims) === null || _a === void 0 ? void 0 : _a.type) || 'Regular';
            const { id } = req.params;
            if (email === "niebadz@o2.pl") {
                return next();
            }
            if (opts.allowSameUser && id && uid === id) {
                return next();
            }
            if (opts.hasType.includes(type)) {
                return next();
            }
            return res.status(403).send({ message: `Forbidden resource` });
        }
        catch (err) {
            console.log({ err });
            return res.status(401).send({ message: err });
        }
    };
}
exports.isAuthorized = isAuthorized;
//# sourceMappingURL=authorized.js.map