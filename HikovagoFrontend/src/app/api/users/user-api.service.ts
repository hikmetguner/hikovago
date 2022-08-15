import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  readonly api = "https://localhost:7218/api/Users";

  constructor(private http: HttpClient) { }

  getUser(id: number):Observable<any>{
    return this.http.get<any>(this.api + "/" + id)
  }

  getUserByEmail(email:string):Observable<any>{
    return this.http.get<any>(this.api + "/Email/" + email)
  }

  getUsers():Observable<any[]>{
    return this.http.get<any[]>(this.api)
  }

  getUsersCount():Observable<number>{
    return this.http.get<any>(this.api + "/Count")
  }

  putUser(body:any):Observable<any>{
    return this.http.put<any>(this.api + "/" + body.id, body)
  }

  deleteUser(id:string):Observable<any>{
    return this.http.delete<any>(this.api + "/" + id)
  }
}
