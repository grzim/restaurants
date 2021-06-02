import {Component, EventEmitter, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Restaurant, Review} from '../../../../utils/models';
import {AddReviewDialogComponent} from '../add-review-dialog/add-review-dialog.component';
import {takeUntil, tap} from 'rxjs/operators';

@Component({
  selector: 'rr-edit-review-dialog',
  templateUrl: './edit-review-dialog.component.html',
  styleUrls: ['./edit-review-dialog.component.css']
})
export class EditReviewDialogComponent implements OnInit, OnDestroy {
  submitData = new EventEmitter();
  destroy = new Subject();

  constructor(@Inject(MAT_DIALOG_DATA) public data: { restaurant: Restaurant, review: Review },
              public dialogRef: MatDialogRef<AddReviewDialogComponent>) {
    this.submitData.pipe(
      takeUntil(this.destroy),
    ).subscribe(review => this.dialogRef.close({...this.data.review, ...review, restaurantId: this.data.restaurant.id}));
  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.destroy.next();
  }
}
