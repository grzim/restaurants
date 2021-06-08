import {Request, Response} from "express";
import * as admin from "firebase-admin";
import {findMissingKeys, handleError} from "../utils/funcs";

export async function all(req: Request, res: Response) {
  try {
    const listUsers = await admin.auth().listUsers();
    const users = listUsers.users.map(mapUser);
    return res.status(200).send(users);
  } catch (err) {
    return handleError(res, err);
  }
}
export async function getType(req: Request, res: Response) {
  try {
    const {id} = req.params;
    const user = await admin.auth().getUser(id);
    return res.status(200).send(user.customClaims?.type);
  } catch (err) {
    return handleError(res, err);
  }
}

function mapUser(user: admin.auth.UserRecord) {
  const customClaims = (user.customClaims || {type: "Regular"}) as { type?: string };
 return {
    id: user.uid,
    email: user.email || "",
    displayName: user.displayName || "",
    type: customClaims.type,
    lastSignInTime: user.metadata.lastSignInTime,
    creationTime: user.metadata.creationTime,
  };
}

export async function get(req: Request, res: Response) {
  try {
    const {id} = req.params;
    const user = await admin.auth().getUser(id);
    return res.status(200).send(mapUser(user));
  } catch (err) {
    return handleError(res, err);
  }
}

export async function put(req: Request, res: Response) {
  try {
    const {id} = req.params;
    const {displayName, password, email, type, selfId} = req.body;
    if([displayName, password, email, type].filter(x => x).length === 0)
      return res.status(400).send({message: 'Empty request is forbidden'});
    await admin.auth().updateUser(id, {displayName, password, email});

    if(type) {
      // only for admin
      const initiator = await admin.auth().getUser(selfId);
     if(initiator.customClaims?.type === 'Admin')
        await admin.auth().setCustomUserClaims(id, {
          type
        })
    }
    const user = await admin.auth().getUser(id);
    return res.status(200).send(mapUser(user));
  } catch (err) {
    return handleError(res, err);
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const {id} = req.params;
    await admin.auth().deleteUser(id);
    return res.status(200).send({id});
  } catch (err) {
    return handleError(res, err);
  }
}

export async function create(req: Request, res: Response) {
  try {
    const {displayName, password, email, type = 'Regular'} = req.body;
    const missingFields = findMissingKeys(req.body, ['displayName', 'password', 'email'])
    if (missingFields) {
      return res.status(400).send({message: missingFields});
    }

    const user = await admin.auth().createUser({
      displayName,
      password,
      email,
    });
    await admin.auth().setCustomUserClaims(user.uid, {type});

    return res.status(201).send({id: user.uid, type, ...user});
  } catch (err) {
    return handleError(res, err);
  }
}

