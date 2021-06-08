import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {MatDialogRef} from '@angular/material/dialog';
import {takeUntil} from 'rxjs/operators';
import {maxRestaurantNameLength} from '../../../../utils/constants';

@Component({
  selector: 'rr-add-restaurant-dialog',
  templateUrl: './add-restaurant-dialog.component.html',
  styleUrls: ['./add-restaurant-dialog.component.css']
})
export class AddRestaurantDialogComponent implements OnInit, OnDestroy {

  submitData = new EventEmitter();
  destroy = new Subject();
  name;

  constructor(public dialogRef: MatDialogRef<AddRestaurantDialogComponent>) {

    this.submitData
      .pipe(takeUntil(this.destroy))
      .subscribe((data) => this.dialogRef.close(data));
  }

  ngOnInit(): void {
  }

  isNameValid(name: string): boolean {
    return name && (name.length <= maxRestaurantNameLength && name.replace(/\s/g, '').length > 0);
  }

  ngOnDestroy(): void {
    this.destroy.next();
  }

}
