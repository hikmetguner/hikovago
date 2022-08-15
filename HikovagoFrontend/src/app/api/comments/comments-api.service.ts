import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentsApiService {

  constructor(private http: HttpClient) { }

  readonly api = "https://localhost:7218/api/Comments";

  getComment(id: string):Observable<any>{
    return this.http.get<any>(this.api + '/' + id)
  }

  getComments():Observable<any[]>{
    return this.http.get<any[]>(this.api)
  }

  getCommentsByHotel(hotelId: string):Observable<any[]>{
    return this.http.get<any[]>(this.api + "/Hotel/" + hotelId)
  }

  getCommentsByUser(userId: string):Observable<any[]>{
    return this.http.get<any[]>(this.api + "/User/" + userId)
  }

  postComment(body: any){
    return this.http.post<any>(this.api, body)
  }

  putComment(body: any){ 
    return this.http.put<any>(this.api + "/" + body.id, body)
  }

  deleteComment(id: any){ 
    return this.http.delete<any>(this.api + "/" + id)
  }
}
