import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule, Routes} from '@angular/router';
import {SmartAuthService} from './smart-auth.service';
import { EpicAuthComponent } from './epic-auth/epic-auth.component';
import {MaterialModule} from './material.module';

const appRoutes: Routes = [
  {path: 'landing', component: LandingComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    EpicAuthComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: true}
    ),
    MaterialModule
  ],
  providers: [SmartAuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
