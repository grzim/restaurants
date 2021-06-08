import {Component, EventEmitter, OnInit} from '@angular/core';
import {LoggedUserService} from '../../services/logged-user/logged-user.service';
import {Router} from '@angular/router';
import {replicate} from '../../utils/replications';

@Component({
  selector: 'rr-log-out',
  templateUrl: './log-out.component.html',
  styleUrls: ['./log-out.component.css']
})
export class LogOutComponent implements OnInit {

  logOut = new EventEmitter();

  constructor(loggedUserService: LoggedUserService, router: Router) {
    replicate(
      this.logOut, loggedUserService.logOut
    );
  }

  ngOnInit(): void {
  }

}
