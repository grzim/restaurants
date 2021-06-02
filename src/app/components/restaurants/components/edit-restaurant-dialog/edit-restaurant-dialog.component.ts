import {Component, EventEmitter, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subject} from 'rxjs';
import {filter, map, takeUntil} from 'rxjs/operators';
import {identity} from '../../../../utils/helpers';
import {maxRestaurantNameLength} from '../../../../utils/constants';

@Component({
  selector: 'rr-edit-restaurant-dialog',
  templateUrl: './edit-restaurant-dialog.component.html',
  styleUrls: ['./edit-restaurant-dialog.component.css']
})
export class EditRestaurantDialogComponent implements OnInit, OnDestroy {
  deleteRestaurant = new EventEmitter();
  submitData = new EventEmitter();
  destroy = new Subject();
  name;

  constructor(@Inject(MAT_DIALOG_DATA) public restaurant,
              public dialogRef: MatDialogRef<EditRestaurantDialogComponent>) {

    this.name = this.restaurant.name;
    this.submitData
      .pipe(takeUntil(this.destroy))
      .subscribe((name) => this.dialogRef.close({action: 'update', name, id: this.restaurant.id}));

    this.deleteRestaurant
      .pipe(takeUntil(this.destroy),
        map(() => window.confirm('Are you sure, you want to delete the restaurant?')),
        filter(identity))
      .subscribe(() => this.dialogRef.close({action: 'delete', id: this.restaurant.id}));
  }

  isNameValid(name: string): boolean {
    return name.length <= maxRestaurantNameLength && name.replace(/\s/g, '').length > 0;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy.next();
  }
}
