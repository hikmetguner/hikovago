import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomsApiService {

  constructor(private http: HttpClient) { }

  readonly api = "https://localhost:7218/api/Rooms";

  getRoom(id: string):Observable<any>{
    return this.http.get<any>(this.api + '/' + id)
  }

  getRooms():Observable<any[]>{
    return this.http.get<any[]>(this.api)
  }

  getRoomsByUser(id:string):Observable<any[]>{
    return this.http.get<any[]>(this.api + "/User/" + id)
  }

  postRoom(body: any){
    return this.http.post<any>(this.api, body)
  }

  putRoom(body: any){ 
    return this.http.put<any>(this.api + "/" + body.id, body)
  }

  deleteRoom(id: any){ 
    return this.http.delete<any>(this.api + "/" + id)
  }

}
