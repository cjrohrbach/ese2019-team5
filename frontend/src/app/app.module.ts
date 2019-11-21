import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';
import {LoginPage} from './start/login/login.page';
import {StartPage} from './start/start.page';
import {SignupPage} from './start/signup/signup.page';
import {ConfirmationPage} from "./start/confirmation/confirmation.page";
import {UserprofilePage} from "./start/userprofile/userprofile.page";
import {UpdatePasswordPage} from "./start/login/update-password/update-password.page";
import {CreateServicePage} from "./start/userprofile/create-service/create-service.page";
import {EventServicesPage} from './start/EventServices/event-services.page';
import {Camera} from '@ionic-native/camera/ngx';
import {EventServiceCardComponent} from "./start/EventServices/event-service-card/event-service-card.component";
import {InfoFooterComponent} from "./info-footer/info-footer.component";
import {AboutEventdooPage} from "./start/about-eventdoo/about-eventdoo.page";

/* import {File} from '@ionic-native/File/ngx';
import {WebView} from '@ionic-native/ionic-webview/ngx';
import {FilePath} from '@ionic-native/file-path/ngx';
import {IonicStorageModule} from '@ionic/storage'; */


@NgModule({
  declarations: [AppComponent,
    StartPage, SignupPage, ConfirmationPage,
    LoginPage, UpdatePasswordPage,
    UserprofilePage, CreateServicePage, EventServicesPage, AboutEventdooPage, EventServiceCardComponent, InfoFooterComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule, ReactiveFormsModule, HttpClientModule/*, IonicStorageModule.forRoot()*/],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    Camera/*, /*File, FilePath, WebView*/],
  exports: [
    EventServiceCardComponent,
    InfoFooterComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
