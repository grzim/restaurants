import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatDividerModule} from '@angular/material/divider';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatChipsModule} from '@angular/material/chips';
import {MatBadgeModule} from '@angular/material/badge';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSortModule} from '@angular/material/sort';
import {MatDialogModule} from '@angular/material/dialog';
import {MatNativeDateModule} from '@angular/material/core';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {AppComponent} from './app.component';
import {LoginComponent} from './components/login/login.component';
import {RestaurantsComponent} from './components/restaurants/restaurants.component';
import {MainComponent} from './components/main/main.component';
import {AppRoutingModule} from './app-routing/app-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RegisterComponent} from './components/register/register.component';
import {StarsComponent} from './components/restaurants/components/stars/stars.component';
import {MenuComponent} from './components/menu/menu.component';
import {SelfEditComponent} from './components/self-edit/self-edit.component';
import {UsersEditComponent} from './components/users-edit/users-edit.component';
import {UserFormComponent} from './components/user-form/user-form.component';
import {ReviewComponent} from './components/restaurants/components/review/review.component';
import {LogOutComponent} from './components/log-out/log-out.component';
import {AddReviewComponent} from './components/restaurants/components/add-review/add-review.component';
import {AddReviewResponseComponent} from './components/restaurants/components/add-review-response/add-review-response.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CdkTableModule} from '@angular/cdk/table';
import {FoldIconComponent} from './components/main/components/fold-icon/fold-icon.component';
import {UnfoldIconComponent} from './components/main/components/unfold-icon/unfold-icon.component';
import {UserEditDialogComponent} from './components/users-edit/components/user-edit-dialog/user-edit-dialog.component';
import {AddReviewDialogComponent} from './components/restaurants/components/add-review-dialog/add-review-dialog.component';
import {AddReviewResponseDialogComponent} from './components/restaurants/components/add-review-response-dialog/add-review-response-dialog.component';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {environment} from '../environments/environment';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireModule} from '@angular/fire';
import {AuthTokenHttpInterceptorProvider} from './interceptors/auth-token.interceptor';
import {FilterByPipe} from './pipes/filter-by.pipe';
import {EditRestaurantDialogComponent} from './components/restaurants/components/edit-restaurant-dialog/edit-restaurant-dialog.component';
import {AddRestaurantDialogComponent} from './components/restaurants/components/add-restaurant-dialog/add-restaurant-dialog.component';
import { EditReviewDialogComponent } from './components/restaurants/components/edit-review-dialog/edit-review-dialog.component';
import { WithMinimumRatingPipe } from './pipes/with-minimum-rating.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RestaurantsComponent,
    MainComponent,
    RegisterComponent,
    StarsComponent,
    MenuComponent,
    SelfEditComponent,
    UsersEditComponent,
    UserFormComponent,
    ReviewComponent,
    LogOutComponent,
    AddReviewComponent,
    AddReviewResponseComponent,
    FoldIconComponent,
    UnfoldIconComponent,
    UserEditDialogComponent,
    AddReviewDialogComponent,
    AddReviewResponseDialogComponent,
    FilterByPipe,
    EditRestaurantDialogComponent,
    AddRestaurantDialogComponent,
    EditReviewDialogComponent,
    WithMinimumRatingPipe,
  ],
  imports: [
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    MatInputModule,
    MatPaginatorModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatSelectModule,
    MatBadgeModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatSortModule,
    MatDividerModule,
    MatTableModule,
    MatChipsModule,
    MatIconModule,
    MatCardModule,
    MatDatepickerModule,
    MatSidenavModule,
    MatButtonModule,
    MatDialogModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, CdkTableModule, FormsModule
  ],
  providers: [
    AuthTokenHttpInterceptorProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
