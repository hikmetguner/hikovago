import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RegistrationDTO } from 'src/app/interface/user/registration-dto';
import { RegistrationResponseDTO } from 'src/app/interface/response/registration-response-dto';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationApiService } from 'src/app/api/authentication/authentication-api.service';
import { PasswordConfirmationValidatorService } from 'src/app/util/custom-validators/password-confirmation-validator.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  public errorMessage: string = '';
  public showError!: boolean;

  constructor(private authService: AuthenticationApiService, private passConfValidator: PasswordConfirmationValidatorService, private router: Router) {
    
   }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      roles: new FormControl('', Validators.required),
      firstName: new FormControl('',Validators.required,),
      lastName: new FormControl('',Validators.required,),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirm: new FormControl('', [Validators.required]),
    });
    this.registerForm.get('confirm')?.setValidators([Validators.required,
      this.passConfValidator.validateConfirmPassword(this.registerForm.get('password')!)]);
  }

  public validateControl = (controlName: string) => {
    return this.registerForm.get(controlName)?.invalid && this.registerForm.get(controlName)?.touched
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.registerForm.get(controlName)?.hasError(errorName)
  }

  public registerUser = (registerFormValue: any) => {
    this.showError = false;
    const formValues = { ...registerFormValue };
    let rolesArr: string[] = []
    rolesArr.push(formValues.roles)
    const user: RegistrationDTO = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      password: formValues.password,
      confirmPassword: formValues.confirm,
      roles: rolesArr,
      clientURI: "http://localhost:4200/emailconfirmation"
    };

    this.authService.registerUser(user)
    .subscribe({
      next: (_) => this.router.navigate(["/login"]),
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.message;
        this.showError = true;
        setTimeout(() => this.showError = false, 6000)
        
      }
      
    })
  }
}