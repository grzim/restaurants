import {Component, EventEmitter, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Restaurant} from '../../../../utils/models';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'rr-add-review-dialog',
  templateUrl: './add-review-dialog.component.html',
  styleUrls: ['./add-review-dialog.component.css']
})
export class AddReviewDialogComponent implements OnInit, OnDestroy {
  submitData = new EventEmitter();
  destroy = new Subject();

  constructor(@Inject(MAT_DIALOG_DATA) public restaurant: Restaurant,
              public dialogRef: MatDialogRef<AddReviewDialogComponent>) {
    this.submitData.pipe(
      takeUntil(this.destroy)
    ).subscribe(data => this.dialogRef.close({...data, restaurantId: this.restaurant.id}));
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy.next();
  }
}
