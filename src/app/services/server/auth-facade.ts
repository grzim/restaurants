import {editSelfMap, parseUser, partitionOnError, withAuthUserId} from './server-service-utils';

import {combineLatest, ReplaySubject} from 'rxjs';
import {filter, map, mergeMap, shareReplay, tap} from 'rxjs/operators';
import {editSelfUrl} from '../../utils/constants';
import {User} from '../../utils/models';

export const authFacade = ({
       auth, server, logOut, editSelf, register, authenticate, deleteSelf
}) => {

  const [put, remove] = server;

  const userAuth = new ReplaySubject<User>(1);
  auth.onAuthStateChanged(userAuth);
  const userAuth$ = userAuth.pipe(
    mergeMap(parseUser),
    shareReplay(1));

  const [logoutSuccess$, logoutError$] = partitionOnError({
    source$: logOut, projectFn: () => auth.signOut()
  });

  const [editSelfSuccess$, editSelfError$] =
    put({
      source$: combineLatest(editSelf, userAuth$).pipe(
        filter(([_, user]) => user),
        map(withAuthUserId)),
      url: editSelfUrl,
      urlMap: editSelfMap
    });
  const [registrationSuccess$, registrationError$] = partitionOnError({
    source$: register, projectFn: ({email, password}) => auth
      .createUserWithEmailAndPassword(email, password)
      .then((data) => (auth.currentUser.sendEmailVerification(), data))
  });

  const [authSuccess$, authError$] = partitionOnError({
    source$: authenticate, projectFn: ({email, password}) => auth.signInWithEmailAndPassword(email, password)
  });
  const [deleteSelfSuccess$, deleteSelfError$] = remove({
    source$: deleteSelf,
    url: editSelfUrl,
    urlMap: editSelfMap
  });


  return {
    userAuth$, logoutSuccess$, logoutError$,
    editSelfSuccess$, editSelfError$,
    registrationSuccess$, registrationError$,
    authSuccess$, authError$,
    deleteSelfSuccess$, deleteSelfError$
  };
};
