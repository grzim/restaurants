import {Injectable} from '@angular/core';
import {ServerService} from '../server/server.service';
import {merge, Observable, Subject} from 'rxjs';
import {EditedUser, User} from '../../utils/models';
import {map, scan, shareReplay} from 'rxjs/operators';
import {AccAdd, AccEdit, AccRemove, AccSet, addToAcc, applyTransformation, editAcc, removeFromAcc, setAcc} from '../../utils/helpers';

const setUsers: AccSet<User> = setAcc;
const addUserToUsers: AccAdd<User> = addToAcc;
const removeUserFromUsers: AccRemove<User> = removeFromAcc;
const editUserInUsers: AccEdit<User> = editAcc;

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  // inputs
  add = new Subject<EditedUser>();
  edit = new Subject<Partial<User> & { userId: string }>();
  resetToInitial = new Subject();
  remove = new Subject<{id: string}>();

  // outputs
  data$: Observable<User[]>;

  constructor(server: ServerService) {

    const usersDataSources = [
      server.users$.pipe(map(setUsers)),
      server.userAdded$.pipe(map(addUserToUsers)),
      server.userDeletedId$.pipe(map(removeUserFromUsers)),
      server.userEdited$.pipe(map(editUserInUsers))
    ];

    const users$ = merge(
      ...usersDataSources,
    ).pipe(
      scan(applyTransformation, []));

    this.data$ = users$.pipe(shareReplay(1));
    this.edit.subscribe(server.editUser);
    this.remove.subscribe(server.deleteUser);
    this.add.subscribe(server.addUser);

  }
}
