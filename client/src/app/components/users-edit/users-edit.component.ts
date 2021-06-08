import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {UsersService} from '../../services/users/users.service';
import {concatMap, filter, map, scan, share, startWith, takeUntil, withLatestFrom} from 'rxjs/operators';
import {identity} from '../../utils/helpers';
import {MatDialog} from '@angular/material/dialog';
import {partition, Subject} from 'rxjs';
import {UserEditDialogComponent} from './components/user-edit-dialog/user-edit-dialog.component';
import {LoggedUserService} from '../../services/logged-user/logged-user.service';
import {replicate, replicatePairs} from '../../utils/replications';

const getUsersMap = users => new Map(Object.keys(users).map(key => [key, false]));

@Component({
  selector: 'rr-users-edit',
  templateUrl: './users-edit.component.html',
  styleUrls: ['./users-edit.component.css', '../../common-styles/table.css']
})
export class UsersEditComponent implements OnInit, OnDestroy {
  submitUser = new EventEmitter();
  editUser = new EventEmitter();
  toggleUserEdit = new EventEmitter();
  openUserEditModal = new EventEmitter();
  userEditionState$;
  users$;
  destroy = new Subject();
  displayedColumns = ['name', 'email', 'type'];

  constructor(usersService: UsersService, loggedUserService: LoggedUserService, public dialog: MatDialog) {
    this.users$ = usersService.data$.pipe(withLatestFrom(loggedUserService.data$),
      map(([usersData, {id}]) => usersData.filter(user => user.id !== id)));

    this.userEditionState$ = this.users$.pipe(
      concatMap((users) => this.toggleUserEdit.pipe(
        scan((toggleUserEdit, user) =>
            toggleUserEdit.set(user, !toggleUserEdit.get(user))
          , getUsersMap(users)),
        startWith(new Map()))));

    const [deleteUser$, editUser$] = partition(
      this.openUserEditModal
        .pipe(
          takeUntil(this.destroy),
          concatMap(
            (data) => this.dialog.open(UserEditDialogComponent, {
              data
            }).afterClosed()
          ),
          filter(identity),
          share()),
      ({action}) => action === 'delete'
    );

    replicatePairs([
      [deleteUser$, usersService.remove],
      [editUser$, usersService.edit]
    ]);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy.next();
  }

}
