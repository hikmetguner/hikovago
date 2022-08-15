import { HttpErrorResponse } from '@angular/common/http';
import { AuthResponseDto } from 'src/app/interface/response/auth-response-dto';
import { LoginDto } from 'src/app/interface/user/login-dto';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationApiService } from 'src/app/api/authentication/authentication-api.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private returnUrl!: string;
  loginForm!: FormGroup;
  errorMessage: string = '';
  showError!: boolean;

  constructor(private authService: AuthenticationApiService, private router: Router, private route: ActivatedRoute) { }
  
  ngOnInit(): void {
    if(this.authService.isUserAuthenticated()){
      this.router.navigate(['/home'])
    }
    this.loginForm = new FormGroup({
      username: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required])
    })
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  validateControl = (controlName: string) => {
    return this.loginForm.get(controlName)?.invalid && this.loginForm.get(controlName)?.touched
  }

  hasError = (controlName: string, errorName: string) => {
    return this.loginForm.get(controlName)?.hasError(errorName)
  }
  
  loginUser = (loginFormValue: any) => {
    this.showError = false;
    const login = {... loginFormValue };

    const userDTO: LoginDto = {
      email: login.username,
      password: login.password
    }

    this.authService.loginUser(userDTO)
    .subscribe({
      next: (res:AuthResponseDto) => {
       localStorage.setItem("token", res.token);
       console.log(res.isAuthSuccessful);
       
       this.authService.sendAuthStateChangeNotification(res.isAuthSuccessful);      
       this.router.navigate([this.returnUrl]);
    },
    error: (err: any) => {
      console.log(err);
      
      this.errorMessage = err.message;
      this.showError = true;
    }})
  }
}