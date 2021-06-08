import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LoggedUserService} from '../../../../services/logged-user/logged-user.service';
import {isAdmin, isOwner} from '../../../../utils/validators';
import {filter, map} from 'rxjs/operators';
import {identity} from '../../../../utils/helpers';
import {Review} from '../../../../utils/models';

@Component({
  selector: 'rr-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
  @Input() review;
  @Input() hideResponse = false;
  @Output() respond = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() edit = new EventEmitter<Review>();
  canRespond$;
  isAdmin$;

  constructor(private loggedUserService: LoggedUserService) {
    this.canRespond$ = this.loggedUserService.data$.pipe(
      filter(identity),
      map(isOwner)
    );
    this.isAdmin$ = this.loggedUserService.data$.pipe(map(isAdmin));
  }

  ngOnInit(): void {
  }

}
