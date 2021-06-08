import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {LoggedUserService} from '../../services/logged-user/logged-user.service';
import {map} from 'rxjs/operators';
import {paths} from '../paths';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private loggedUserService: LoggedUserService, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.loggedUserService.isAuthenticated$.pipe(map(isAuth =>
      isAuth || this.router.createUrlTree(
      [paths.login, {message: 'you do not have the permission to enter'}])));
  }

}
