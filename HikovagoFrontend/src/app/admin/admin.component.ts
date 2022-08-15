import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationApiService } from '../api/authentication/authentication-api.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private authService: AuthenticationApiService, private router: Router) { }

  ngOnInit(): void {
  }

  public logout = () => {
    this.authService.logout();
    this.router.navigate(["/"]);
  }

}
