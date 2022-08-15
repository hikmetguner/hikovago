import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { JwtModule } from '@auth0/angular-jwt';
import { JwtConfig } from '@auth0/angular-jwt';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise';

import { AppComponent } from './app.component';
import { LocaleComponent } from './admin/locale/locale.component';
import { ShowLocaleComponent } from './admin/locale/show-locale/show-locale.component';
import { AddEditCountryComponent } from './admin/locale/add-edit-locale/add-edit-country/add-edit-country.component';
import { AddEditCityComponent } from './admin/locale/add-edit-locale/add-edit-city/add-edit-city.component';
import { AddEditCountyComponent } from './admin/locale/add-edit-locale/add-edit-county/add-edit-county.component';
import { AdminComponent } from './admin/admin.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { AdminHotelsComponent } from './admin/admin-hotels/admin-hotels.component';
import { RegisterComponent } from './shared/register/register.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './shared/notfound/notfound.component';
import { EmailConfirmationComponent } from './shared/email-confirmation/email-confirmation.component';
import { ErrorHandlerService } from './util/error-handler.service';
import { AdminUserComponent } from './admin/admin-user/admin-user.component';
import { AdminMediaComponent } from './admin/admin-media/admin-media.component';
import { LoginComponent } from './shared/login/login.component';
import { AuthGuard } from './security/guards/auth/auth.component';
import { ForbiddenComponent } from './shared/forbidden/forbidden.component';
import { ProfileComponent } from './home/profile/profile.component';
import { HotelsComponent } from './home/hotels/hotels.component';
import { RoomsComponent } from './home/rooms/rooms.component';
import { AdminRoomsComponent } from './admin/admin-rooms/admin-rooms.component';
import { AdminCommentsComponent } from './admin/admin-comments/admin-comments.component';
import { LandingComponent } from './home/landing/landing.component';
import { ConsumerComponent } from './security/guards/consumer/consumer.component';
import { ProducerGuard } from './security/guards/producer/producer.component';
import { AdminGuard } from './security/guards/admin/admin.component';
import { ButtonCell } from './util/renderer/button-cell';


export function tokenGetter() {
  return localStorage.getItem("token");
}

@NgModule({
  declarations: [
    AppComponent,
    LocaleComponent,
    ShowLocaleComponent,
    AddEditCountryComponent,
    AddEditCityComponent,
    AddEditCountyComponent,
    AdminComponent,
    AdminHomeComponent,
    AdminHotelsComponent,
    RegisterComponent,
    HomeComponent,
    NotFoundComponent,
    EmailConfirmationComponent,
    AdminUserComponent,
    AdminMediaComponent,
    LoginComponent,
    ConsumerComponent,
    ProducerGuard,
    ForbiddenComponent,
    ProfileComponent,
    HotelsComponent,
    RoomsComponent,
    AdminRoomsComponent,
    AdminCommentsComponent,
    LandingComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule,
    RouterModule.forRoot([
      {path: 'register', component:RegisterComponent},
      {path: 'login', component:LoginComponent},
      {path: 'forbidden', component:ForbiddenComponent},
      {path: 'emailconfirmation', component: EmailConfirmationComponent},
      {path: 'admin', component:AdminComponent, canActivate: [AuthGuard,AdminGuard],
      children: [
        {
          path: '', component:AdminHomeComponent
        },
        {
          path: 'locale', component:LocaleComponent 
        },
        {
          path: 'hotels', component:AdminHotelsComponent
        },
        {
          path: 'users', component:AdminUserComponent
        },
        {
          path: 'media', component:AdminMediaComponent
        },
        {
          path: 'rooms', component:AdminRoomsComponent
        },
        {
          path: 'comments', component: AdminCommentsComponent
        },
      ]
      },
      {path: 'home', component:HomeComponent,
      children:[
       {
         path: '', component:LandingComponent,
       },
       {
         path: 'profile', component:ProfileComponent,  canActivate: [AuthGuard]
       },
       {
         path: 'hotels', component:HotelsComponent,  canActivate: [AuthGuard,ProducerGuard]
       },
       {
         path: 'rooms', component: RoomsComponent, canActivate: [AuthGuard,ProducerGuard]
       }
      ]},
      { path: '404', component : NotFoundComponent},
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '**', redirectTo: '404', pathMatch: 'full'}
    ]),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:5001"],
      }
    })
  ],
  providers: [
    {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorHandlerService,
    multi: true
  }, AuthGuard, ProducerGuard, AdminGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
