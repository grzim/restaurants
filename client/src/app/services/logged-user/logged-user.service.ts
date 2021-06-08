import {Injectable} from '@angular/core';
import {Credentials, User, UserWithPassword} from '../../utils/models';
import {combineLatest, merge, Observable, Subject} from 'rxjs';
import {ServerService} from '../server/server.service';
import {map, mapTo, shareReplay, startWith, withLatestFrom} from 'rxjs/operators';
import {takeLatest} from '../../utils/helpers';

const applyEditedUserData = ([oldData, newData]) => ({
  ...oldData,
  ...newData
});

@Injectable({
  providedIn: 'root'
})
export class LoggedUserService {

  edit = new Subject<Partial<User>>();
  authenticate = new Subject<Credentials>();
  register = new Subject<UserWithPassword>();
  submitChanges = new Subject<User>();
  remove = new Subject();
  logOut = new Subject();

  isNotConfirmed$;
  isAuthenticated$;
  data$: Observable<User>;

  constructor(server: ServerService) {
    const editedUserData$ = server.selfData$.pipe(
      withLatestFrom(this.submitChanges),
      map(takeLatest),
      startWith({} as User));

    this.data$ = combineLatest([
      server.authenticatedUserData$,
      editedUserData$
    ]).pipe(
      map(applyEditedUserData),
      shareReplay(1));

    this.isAuthenticated$ = merge(
      server.userLoggedIn$.pipe(mapTo(true)),
      server.userLoggedOut$.pipe(mapTo(false)))
      .pipe(shareReplay(1));

    this.logOut.subscribe(server.logOut);
    this.submitChanges.subscribe(server.editSelf);
    this.authenticate.subscribe(server.authenticate);
    this.register.subscribe(server.register);
    this.remove.subscribe(server.deleteSelf);
  }
}
