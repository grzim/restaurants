import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {LoggedUserService} from '../../services/logged-user/logged-user.service';
import {replicate} from '../../utils/replications';

export const strongPasswordPattern = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$';

@Component({
  selector: 'rr-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  destroy = new Subject();
  authenticate = new EventEmitter();
  submitForm$ = new EventEmitter();

  constructor(loggedUserService: LoggedUserService, router: Router) {
    replicate(
      this.authenticate, loggedUserService.authenticate
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
  }

}
