import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationApiService } from 'src/app/api/authentication/authentication-api.service';
import { AdminComponent } from '../admin/admin.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public isUserAuthenticated!:boolean
  public isUserAdmin!:boolean
  public isUserProducer!:boolean
  constructor(private authService: AuthenticationApiService, private router: Router) {
    this.authService.authChanged
    .subscribe(res => {
      this.isUserAuthenticated = res;
    })
   }

  ngOnInit(): void {     
    this.isUserAdmin = this.authService.isUserAdmin()
    this.isUserProducer = this.authService.isUserProducer()
    
   }

  public logout = () => {
    this.authService.logout();
    this.router.navigate(["/"]);
  }

  routeToAdmin(){
    this.router.navigate(['/admin'])
  }

}
