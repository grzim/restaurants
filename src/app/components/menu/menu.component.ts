import {Component, OnInit} from '@angular/core';
import {LoggedUserService} from '../../services/logged-user/logged-user.service';
import {authenticatedRoutes} from '../../app-routing/routes-definitions';
import {map} from 'rxjs/operators';
import {NamedRoute} from '../../utils/helper-types';
import {identity, not} from '../../utils/helpers';
import {noop, Observable} from 'rxjs';

const toRoutes = user => authenticatedRoutes.filter(
  ({excludeFromMenuPredicate}) =>
    not((excludeFromMenuPredicate) || not(identity))(user));

@Component({
  selector: 'rr-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  showFiller;
  routerLinks$: Observable<NamedRoute[] | void>;

  constructor(loggedUserService: LoggedUserService) {
    this.routerLinks$ = loggedUserService.data$.pipe(
      map(user => (user ? toRoutes : noop)(user))
    );
  }

  ngOnInit(): void {
  }

}
