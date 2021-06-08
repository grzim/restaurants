import {Component, OnInit} from '@angular/core';
import {LoggedUserService} from '../../services/logged-user/logged-user.service';

@Component({
  selector: 'rr-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  emptyUser;
  showInfoToCheckEmail$;
  submitData;

  constructor(loggedUserService: LoggedUserService) {
    this.submitData = loggedUserService.register;
  }

  ngOnInit(): void {
  }

}
