import { Component, OnInit } from '@angular/core';
import { AuthenticationApiService } from './api/authentication/authentication-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'HikovagoFrontend';

  constructor(private authService: AuthenticationApiService) {}

  ngOnInit(): void {
    if(this.authService.isUserAuthenticated())
      this.authService.sendAuthStateChangeNotification(true);
  }
}
