import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {LoggedUserService} from '../../services/logged-user/logged-user.service';
import {map} from 'rxjs/operators';
import {isAdmin} from '../../utils/validators';
import {paths} from '../paths';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private loggedUserService: LoggedUserService, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.loggedUserService.data$.pipe(map(isAdmin)).pipe(map(isUserAdmin =>
      isUserAdmin || this.router.createUrlTree(
      [paths.login])));
  }

}
