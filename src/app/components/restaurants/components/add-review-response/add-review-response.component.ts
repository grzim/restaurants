import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Review} from '../../../../utils/models';

@Component({
  selector: 'rr-add-review-response',
  templateUrl: './add-review-response.component.html',
  styleUrls: ['./add-review-response.component.css']
})
export class AddReviewResponseComponent implements OnInit {
  responseElement;
  @Output() submitResponse = new EventEmitter();
  @Input() review: Review;

  constructor() {
  }

  ngOnInit(): void {
  }

  isValid(value): boolean {
    return !value.replace(/\s/g, '');
  }
}
