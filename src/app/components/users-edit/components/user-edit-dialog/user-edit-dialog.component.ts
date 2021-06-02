import {Component, EventEmitter, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {User} from '../../../../utils/models';
import {takeUntil, tap} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'rr-user-edit-dialog',
  templateUrl: './user-edit-dialog.component.html',
  styleUrls: ['./user-edit-dialog.component.css']
})
export class UserEditDialogComponent implements OnInit, OnDestroy {
  submitData = new EventEmitter();
  deleteUser = new EventEmitter();
  destroy = new Subject();

  constructor(@Inject(MAT_DIALOG_DATA) public user: User,
              public dialogRef: MatDialogRef<UserEditDialogComponent>) {

    this.deleteUser.pipe(
      takeUntil(this.destroy)
    ).subscribe(data => this.dialogRef.close({action: 'delete', userId: this.user.id}));

    this.submitData.pipe(
      takeUntil(this.destroy)
    ).subscribe(data => this.dialogRef.close({action: 'edit', userId: this.user.id, ...data}));
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy.next();
  }

}
