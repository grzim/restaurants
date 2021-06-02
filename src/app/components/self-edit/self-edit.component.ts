import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {LoggedUserService} from '../../services/logged-user/logged-user.service';
import {filter, map, switchMap, takeUntil, tap} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {identity} from '../../utils/helpers';
import {replicatePairs} from '../../utils/replications';

@Component({
  selector: 'rr-self-edit',
  templateUrl: './self-edit.component.html',
  styleUrls: ['./self-edit.component.css']
})
export class SelfEditComponent implements OnInit, OnDestroy {
  user$;
  submitData = new EventEmitter();
  editData = new EventEmitter();
  openConfirmationDialog = new EventEmitter();
  destroy = new Subject();

  constructor(loggedUserService: LoggedUserService) {
    this.user$ = loggedUserService.data$;
    const userToDelete$ = this.openConfirmationDialog.pipe(
      map(() => window.confirm('Are you sure, you want to delete the account?')),
      filter(identity),
      switchMap(() => this.user$),
      takeUntil(this.destroy)
    );
    replicatePairs([
      [userToDelete$, loggedUserService.remove],
      [this.submitData, loggedUserService.submitChanges],
      [this.editData, loggedUserService.edit],
    ]);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy.next();
  }
}
