import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginPage} from './start/login/login.page';
import {StartPage} from './start/start.page';
import {SignupPage} from './start/signup/signup.page';
import {ConfirmationPage} from "./start/confirmation/confirmation.page";
import {UserprofilePage} from "./start/userprofile/userprofile.page";
import {UpdatePasswordPage} from "./start/login/update-password/update-password.page";
import {CreateServicePage} from "./start/userprofile/create-service/create-service.page";
import {AboutEventdooPage} from "./start/about-eventdoo/about-eventdoo.page";


const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'start'},
  { path: 'start', children: [
      {path: '', component: StartPage},
      {path: 'about-eventdoo', component: AboutEventdooPage},
      {
        path: 'login', children: [
          {path: '', component: LoginPage},
          {path: 'about-eventdoo', component: AboutEventdooPage},
          {path: 'resetPassword/:token', component: UpdatePasswordPage}]
      },
      {
        path: 'signup', children: [
          {path: '', component: SignupPage},
          {path: 'about-eventdoo', component: AboutEventdooPage},
          {path: 'confirmation/:token', component: ConfirmationPage}]
      },
      {
        path: 'userprofile', children: [
          {path: '', component: UserprofilePage},
          {path: 'about-eventdoo', component: AboutEventdooPage},
          {path: 'createService', component: CreateServicePage}]
      },
      {
        path: 'services', children: [
          {path: ':serviceId',
            loadChildren: './start/EventServices/event-service-detail/event-service-detail.module#EventServiceDetailPageModule'
          }]
      }]
  },
  { path: 'about-eventdoo', loadChildren: './start/about-eventdoo/about-eventdoo.module#AboutEventdooPageModule' },


];


@NgModule({
  imports: [
      RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
