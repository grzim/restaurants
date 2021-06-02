import {Component, OnDestroy, OnInit} from '@angular/core';
import {distinctUntilChanged, map, takeUntil, tap} from 'rxjs/operators';
import {notAuthenticatedRoutes} from '../../app-routing/routes-definitions';
import {LoggedUserService} from '../../services/logged-user/logged-user.service';
import {Observable, Subject} from 'rxjs';
import {Router} from '@angular/router';
import {ServerService} from '../../services/server/server.service';
import {paths} from '../../app-routing/paths';
import {RestaurantsService} from '../../services/restaurants/restaurants.service';
import {UsersService} from '../../services/users/users.service';

@Component({
  selector: 'rr-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {
  showFiller;
  moved;
  user$;
  destroy = new Subject();
  isOpen;
  isAuthenticating$;
  isUserLogged$: Observable<boolean>;
  notAuthenticatedLinks;
  isFetching$;

  constructor(loggedUserService: LoggedUserService,
              router: Router,
              userService: UsersService,
              restaurantsService: RestaurantsService, serverService: ServerService) {
    this.isAuthenticating$ = serverService.isAuthenticating$;
    loggedUserService.isAuthenticated$.pipe(map(Boolean), distinctUntilChanged(), takeUntil(this.destroy))
      .subscribe(() => this.moved = false);
    this.isUserLogged$ = loggedUserService.isAuthenticated$.pipe(distinctUntilChanged());
    loggedUserService.isAuthenticated$.pipe(
      takeUntil(this.destroy),
      map(isAuth => isAuth ? [paths.restaurants] : [paths.login])
    ).subscribe(route => router.navigate(route));

    this.isFetching$ = serverService.isFetching$;
    this.user$ = loggedUserService.data$;
    this.notAuthenticatedLinks = notAuthenticatedRoutes;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy.next();
  }

}
