import {RestaurantsComponent} from '../components/restaurants/restaurants.component';
import {UsersEditComponent} from '../components/users-edit/users-edit.component';
import {LoginComponent} from '../components/login/login.component';
import {RegisterComponent} from '../components/register/register.component';
import {NamedRoute} from '../utils/helper-types';
import {SelfEditComponent} from '../components/self-edit/self-edit.component';
import {AuthGuard} from './guards/auth.guard';
import {NotAuthGuard} from './guards/not-auth.guard';
import {AdminGuard} from './guards/admin.guard';
import {not} from '../utils/helpers';
import {isAdmin} from '../utils/validators';
import {paths} from './paths';

export const authenticatedRoutes: NamedRoute[] = [
  {path: paths.selfEdit, component: SelfEditComponent, name: 'Edit profile', canActivate: [AuthGuard]},
  {
    path: paths.users, component: UsersEditComponent, name: 'Edit users',
    canActivate: [AuthGuard, AdminGuard], excludeFromMenuPredicate: not(isAdmin)
  },
  {
    path: paths.restaurants,
    component: RestaurantsComponent,
    // excludeFromMenuPredicate: isOwner,
    name: 'Show restaurants',
    canActivate: [AuthGuard]
  },
];

export const notAuthenticatedRoutes: NamedRoute[] = [
  {path: paths.login, component: LoginComponent, name: 'Login', canActivate: [NotAuthGuard]},
  {path: paths.register, component: RegisterComponent, name: 'Register', canActivate: [NotAuthGuard]},
];

export const routesDefinitions: NamedRoute[] = [...authenticatedRoutes, ...notAuthenticatedRoutes];
