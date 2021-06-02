import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LoggedUserService} from '../../../../services/logged-user/logged-user.service';
import {pluck, takeUntil, tap} from 'rxjs/operators';
import {Subject} from 'rxjs';

const getReviewForm = ({name,
                        dateOfVisit = '',
                        text = '',
                        rating= ''}) => new FormGroup({
  authorName: new FormControl(name, Validators.required),
  dateOfVisit: new FormControl(dateOfVisit, [Validators.required]),
  text: new FormControl(text),
  rating: new FormControl(rating, [
    Validators.required]),
  tempRating: new FormControl(0, [
    Validators.required]),
});

@Component({
  selector: 'rr-add-review',
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.css']
})
export class AddReviewComponent implements OnInit, OnDestroy {
  tempRating;
  @Input() review = {};
  @Output() submitReview = new EventEmitter();
  destroy = new Subject();
  reviewForm;

  constructor(private loggedUserService: LoggedUserService) {
 }

  ngOnInit(): void {
    this.loggedUserService.data$.pipe(takeUntil(this.destroy), pluck('displayName'))
      .subscribe(name =>
        this.reviewForm = getReviewForm({name, ...this.review}));
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
  }

}
