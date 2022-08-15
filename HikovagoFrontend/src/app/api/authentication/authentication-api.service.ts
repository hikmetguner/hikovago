import { RegistrationDTO } from 'src/app/interface/user/registration-dto';
import { RegistrationResponseDTO } from 'src/app/interface/response/registration-response-dto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomEncoder } from 'src/app/util/custom-encoder';
import { LoginDto } from 'src/app/interface/user/login-dto';
import { AuthResponseDto } from 'src/app/interface/response/auth-response-dto';
import { BehaviorSubject, Subject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationApiService {

  private authChangeSub = new BehaviorSubject<boolean>(false)
  public authChanged = this.authChangeSub.asObservable();
  readonly api = "https://localhost:7218/api/accounts";

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }

  public sendAuthStateChangeNotification = (isAuthenticated: boolean) => {
    this.authChangeSub.next(isAuthenticated);
  }

  public getUsername():string {
    const token = localStorage.getItem("token");
    if(token == null) {
      return ''
    }
    let username = this.jwtHelper.decodeToken(token)['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
    console.log(username);
    
    return username;
  }

  public isUserAuthenticated = (): boolean => {
    const token = localStorage.getItem("token");    
    return (token != null) && !this.jwtHelper.isTokenExpired(token)
  }

  public isUserAdmin = (): boolean => {
    const token = localStorage.getItem("token");
    if(token == null){
      return false;
    }
    const decodedToken = this.jwtHelper.decodeToken(token!);
    const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
    console.log(role);
    
    return role === 'Administrator';
  }

  public isUserProducer = (): boolean => {
    const token = localStorage.getItem("token");
    if(token == null){
      return false;
    }
    const decodedToken = this.jwtHelper.decodeToken(token!);
    const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
    return role === 'Producer';
  }

  public registerUser = (body: RegistrationDTO) => {
    return this.http.post<RegistrationResponseDTO> (this.createCompleteRoute("Registration",this.api), body);
  }

  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  }

  public confirmEmail = (route: string, token: string, email: string) => {
    let params = new HttpParams({ encoder: new CustomEncoder() })
    params = params.append('token', token);
    params = params.append('email', email);
  
    return this.http.get(this.createCompleteRoute("EmailConfirmation", this.api), { params: params });
  }

  public loginUser = (body: LoginDto) => {
    return this.http.post<AuthResponseDto>(this.createCompleteRoute("Login",this.api), body)
  }

  public logout = () => {
    localStorage.removeItem("token");
    this.sendAuthStateChangeNotification(false);
  }
}