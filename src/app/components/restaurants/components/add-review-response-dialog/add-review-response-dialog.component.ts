import {Component, EventEmitter, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'rr-add-review-response-dialog',
  templateUrl: './add-review-response-dialog.component.html',
  styleUrls: ['./add-review-response-dialog.component.css']
})
export class AddReviewResponseDialogComponent implements OnInit, OnDestroy {

  submitData = new EventEmitter();
  destroy = new Subject();

  constructor(@Inject(MAT_DIALOG_DATA) public reviewId,
              public dialogRef: MatDialogRef<AddReviewResponseDialogComponent>) {

    this.submitData
      .pipe(takeUntil(this.destroy))
      .subscribe((data) => this.dialogRef.close({text: data, reviewId}));
  }


  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy.next();
  }

}
