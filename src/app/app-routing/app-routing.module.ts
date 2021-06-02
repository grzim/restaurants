import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {routesDefinitions} from './routes-definitions';

@NgModule({
  imports: [RouterModule.forRoot(routesDefinitions)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
