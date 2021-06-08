import {map, tap, withLatestFrom} from 'rxjs/operators';
import {userMap} from './server-service-utils';
import {User} from '../../utils/models';
import {editUserUrl, usersUrl} from '../../utils/constants';

export const usersFacade = ({
                 deleteUser, userAuth$, editUser, server, getUsers, addUser
}) => {
  const [put, get, post, remove] = server;
  const [userEditSuccess$, userEditError$] = put({
    source$: editUser
      .pipe(
        withLatestFrom(userAuth$),
        map((([user, {id}]: [User, User]) => ({
          ...user,
          selfId: id
        })))), url: editUserUrl, urlMap: userMap});

  const [usersSuccess$, usersError$] = get({source$: getUsers, url: usersUrl});
  const [addUserSuccess$, addUserError$] = post({
    source$: addUser,
    url: usersUrl
  });

  const [deleteUserSuccess$, deleteUserError$] = remove({
    source$: deleteUser,
    url: editUserUrl,
    urlMap: userMap
  });
  return {
    userEditSuccess$, userEditError$, usersSuccess$, usersError$, addUserSuccess$, addUserError$, deleteUserSuccess$, deleteUserError$
  };
};
