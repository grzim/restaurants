"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.remove = exports.put = exports.get = exports.getType = exports.all = void 0;
const admin = require("firebase-admin");
const funcs_1 = require("../utils/funcs");
async function all(req, res) {
    try {
        const listUsers = await admin.auth().listUsers();
        const users = listUsers.users.map(mapUser);
        return res.status(200).send(users);
    }
    catch (err) {
        return funcs_1.handleError(res, err);
    }
}
exports.all = all;
async function getType(req, res) {
    var _a;
    try {
        const { id } = req.params;
        const user = await admin.auth().getUser(id);
        return res.status(200).send((_a = user.customClaims) === null || _a === void 0 ? void 0 : _a.type);
    }
    catch (err) {
        return funcs_1.handleError(res, err);
    }
}
exports.getType = getType;
function mapUser(user) {
    const customClaims = (user.customClaims || { type: "Regular" });
    return {
        id: user.uid,
        email: user.email || "",
        displayName: user.displayName || "",
        type: customClaims.type,
        lastSignInTime: user.metadata.lastSignInTime,
        creationTime: user.metadata.creationTime,
    };
}
async function get(req, res) {
    try {
        const { id } = req.params;
        const user = await admin.auth().getUser(id);
        return res.status(200).send(mapUser(user));
    }
    catch (err) {
        return funcs_1.handleError(res, err);
    }
}
exports.get = get;
async function put(req, res) {
    var _a;
    try {
        const { id } = req.params;
        const { displayName, password, email, type, selfId } = req.body;
        if ([displayName, password, email, type].filter(x => x).length === 0)
            return res.status(400).send({ message: 'Empty request is forbidden' });
        await admin.auth().updateUser(id, { displayName, password, email });
        if (type) {
            // only for admin
            const initiator = await admin.auth().getUser(selfId);
            if (((_a = initiator.customClaims) === null || _a === void 0 ? void 0 : _a.type) === 'Admin')
                await admin.auth().setCustomUserClaims(id, {
                    type
                });
        }
        const user = await admin.auth().getUser(id);
        return res.status(200).send(mapUser(user));
    }
    catch (err) {
        return funcs_1.handleError(res, err);
    }
}
exports.put = put;
async function remove(req, res) {
    try {
        const { id } = req.params;
        await admin.auth().deleteUser(id);
        return res.status(200).send({ id });
    }
    catch (err) {
        return funcs_1.handleError(res, err);
    }
}
exports.remove = remove;
async function create(req, res) {
    try {
        const { displayName, password, email, type = 'Regular' } = req.body;
        const missingFields = funcs_1.findMissingKeys(req.body, ['displayName', 'password', 'email']);
        if (missingFields) {
            return res.status(400).send({ message: missingFields });
        }
        const user = await admin.auth().createUser({
            displayName,
            password,
            email,
        });
        await admin.auth().setCustomUserClaims(user.uid, { type });
        return res.status(201).send(Object.assign({ id: user.uid, type }, user));
    }
    catch (err) {
        return funcs_1.handleError(res, err);
    }
}
exports.create = create;
//# sourceMappingURL=controller.js.map