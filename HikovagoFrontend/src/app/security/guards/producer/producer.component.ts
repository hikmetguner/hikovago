import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationApiService } from 'src/app/api/authentication/authentication-api.service';

@Component({
  selector: 'app-producer',
  templateUrl: './producer.component.html',
  styleUrls: ['./producer.component.css']
})
export class ProducerGuard implements CanActivate {

  constructor(private authService: AuthenticationApiService, private router: Router) {}
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(this.authService.isUserProducer())
      return true;
      
    this.router.navigate(['/forbidden'], { queryParams: { returnUrl: state.url }});
    return false;
  }

}
