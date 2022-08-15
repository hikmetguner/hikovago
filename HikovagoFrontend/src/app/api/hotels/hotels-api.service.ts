import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HotelsApiService {

  readonly api = "https://localhost:7218/api/Hotels";

  constructor(private http: HttpClient) { }

  getHotel(id: string):Observable<any>{
    return this.http.get<any>(this.api + '/' + id)
  }

  getHotels():Observable<any[]>{
    return this.http.get<any[]>(this.api)
  }

  getHotelsByUser(userId:string):Observable<any[]>{
    return this.http.get<any[]>(this.api + "/User/" + userId)
  }

  getHotelsCount():Observable<number>{
    return this.http.get<any>(this.api + "/Count")
  }

  getHotelsFiltered(form:any):Observable<any[]>{
    let params = new HttpParams()
    params = params.append("countryId",form.countryId)
    .append("cityId",form.cityId)
    .append("countyId",form.countyId)
    .append("stars",form.stars)
    .append("sortBy",form.sortBy)
    .append("direction",form.direction)
    .append("search",form.search)
    .append("page",form.page)
    return this.http.get<any>(this.api + "/Filter",{params})
  }
  postHotel(body: any){
    return this.http.post<any>(this.api, body)
  }

  putHotel(body: any){ 
    return this.http.put<any>(this.api + "/" + body.id, body)
  }

  deleteHotel(id: any){ 
    return this.http.delete<any>(this.api + "/" + id)
  }
}
