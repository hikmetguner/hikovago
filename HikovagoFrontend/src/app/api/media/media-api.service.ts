import { HttpClient } from '@angular/common/http';
import { getDebugNode, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaApiService {

  readonly api = "https://localhost:7218/api/Medias";

  constructor(private http: HttpClient) { }

  getMedias():Observable<any[]>{
    return this.http.get<any[]>(this.api);
  }

  postMediaToHotel(images:File[], hotelId: string):Observable<any>{
    let fd = new FormData()
    for(let i = 0; i < images.length; i++){
      fd.append('files',images[i],images[i].name)
    }
    return this.http.post<any>(this.api + "/Hotel/" + hotelId, fd)
  }

  postMediaToRoom(images:File[], roomId: string):Observable<any>{
    let fd = new FormData()
    for(let i = 0; i < images.length; i++){
      fd.append('files',images[i],images[i].name)
    }
    return this.http.post<any>(this.api + "/Room/" + roomId, fd)
  }

  postMediaToUser(image:File, roomId: string):Observable<any>{
    let fd = new FormData()
    fd.append('files',image,image.name)
    return this.http.post<any>(this.api + "/User/" + roomId, fd)
  }

  deleteMedia(id:string):Observable<any>{
    return this.http.delete<any>(this.api + "/" + id)
  }

  putMedia(body:any):Observable<any>{
    return this.http.put<any>(this.api + "/" + body.id,body)
  }

}
