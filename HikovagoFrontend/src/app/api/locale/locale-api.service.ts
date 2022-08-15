import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocaleApiService {

  readonly api = "https://localhost:7218/api/";

  constructor(private http: HttpClient) { }

  // -- COUNTRY

  getCountry(id: number):Observable<any>{
    return this.http.get<any>(this.api + "Countries/" + id)
  }

  getCountries():Observable<any[]>{
    return this.http.get<any>(this.api + "Countries")
  }

  getCountriesCount():Observable<number>{
    return this.http.get<any>(this.api + "Countries/Count")
  }

  getCountriesPaged(page: number, pageSize: number, asc: boolean, sortBy: string, search: string):Observable<any[]>{
    let params = new HttpParams()
    params = params.append("page",page).append("pageSize",pageSize).append("asc",asc).append("sortBy",sortBy).append("search",search)
    return this.http.get<any>(this.api + "Countries/Page",{params})
  }

  postCountry(body: any){
    return this.http.post<any>(this.api + "Countries", body)
  }

  putCountry(body: any){ 
    return this.http.put<any>(this.api + "Countries/" + body.id, body)
  }

  deleteCountry(id: any){ 
    return this.http.delete<any>(this.api + "Countries/" + id)
  }

  // -- CITY

  getCity(id:number):Observable<any>{
    return this.http.get<any>(this.api + "Cities/" + id)
  }

  getCities():Observable<any[]>{
    return this.http.get<any>(this.api + "Cities")
  }

  getCitiesCount():Observable<number>{
    return this.http.get<any>(this.api + "Cities/Count")
  }

  getCitiesPaged(page: number, pageSize: number, asc: boolean, sortBy: string, search: string):Observable<any[]>
  {
    let params = new HttpParams()
    params = params.append("page",page).append("pageSize",pageSize).append("asc",asc).append("sortBy",sortBy).append("search",search)

    return this.http.get<any>(this.api + "Cities/Page",{params})
  }

  getCitiesByCountry(countryId: string): Observable<any[]>{

    return this.http.get<any[]>(this.api + "Cities/By/" + countryId)
  }

  postCity(body: any){
    return this.http.post<any>(this.api + "Cities", body)
  }

  putCity(body: any){ 
    return this.http.put<any>(this.api + "Cities/" + body.id, body)
  }

  deleteCity(id: any){ 
    return this.http.delete<any>(this.api + "Cities/" + id)
  }

  // -- COUNTY 

  getCounties():Observable<any[]>
  {
    return this.http.get<any>(this.api + "Counties")
  }

  getCountiesCount():Observable<number>{
    return this.http.get<any>(this.api + "Counties/Count")
  }

  getCountiesPaged(page: number, pageSize: number, asc: boolean, sortBy: string, search: string):Observable<any[]>
  {
    let params = new HttpParams()
    params = params.append("page",page).append("pageSize",pageSize).append("asc",asc).append("sortBy",sortBy).append("search",search)
    return this.http.get<any>(this.api + "Counties/Page",{params})
  }

  postCounty(body: any){
    return this.http.post<any>(this.api + "Counties", body)
  }

  putCounty(body: any){ 
    return this.http.put<any>(this.api + "Counties/" + body.id, body)
  }

  deleteCounty(id: any){ 
    return this.http.delete<any>(this.api + "Counties/" + id)
  }

  getCountiesByCity(cityId: string): Observable<any[]>{

    return this.http.get<any>(this.api + "Counties/By/" + cityId)
  }
}