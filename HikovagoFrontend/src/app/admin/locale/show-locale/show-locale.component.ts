import { Component, Input, OnInit} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { max, Observable } from 'rxjs';
import { LocaleApiService } from 'src/app/api/locale/locale-api.service';
import { Paging } from 'src/app/util/paging';


@Component({
  selector: 'app-show-locale',
  templateUrl: './show-locale.component.html',
  styleUrls: ['./show-locale.component.css']
})
export class ShowLocaleComponent implements OnInit {

  countryP = new CountryPaging(this.service)
  cityP = new CityPaging(this.service)
  countyP = new CountyPaging(this.service)
  countriesMap:Map<number,string> = new Map()
  citiesMap:Map<number,string> = new Map()

  constructor(private service: LocaleApiService) { }

  country:any
  city:any
  county:any
  countryPage: number = 1
  countryPageSize: number = 3
  countryAsc: boolean = true
  countrySortBy: string = "id"
  countrySearch: string = ""
  countryMax: number = 0

  fillMapping(): void {
    this.service.getCountries().subscribe(data => {
      for(let i = 0; i < data.length; i++){
        this.countriesMap.set(data[i].countryId,data[i].countryName)
      }
    })

    this.service.getCities().subscribe(data => {
      for(let i = 0; i < data.length; i++){
        this.citiesMap.set(data[i].cityId,data[i].cityName)
      }
    })
  }

 
  ngOnInit(): void {
    this.countryP.init()
    this.cityP.init()
    this.countyP.init()
    this.fillMapping()
  }

  countryAdd(){
    this.country = {
      countryId:0,
      countryName:""
    }
  }
}


class CityPaging extends Paging{

  cityPaged:Observable<any[]>;

  constructor(private service: LocaleApiService){
    super()
    service.getCitiesCount().subscribe((e:number) => this.entryCount = e)
    this.cityPaged = new Observable<any[]>
  }
  
  override conductSearch(){    
    this.cityPaged = this.service.getCitiesPaged(
      this.page,
      this.pageSize,
      this.asc,
      this.sortBy,
      this.search
    )
    this.currentPageSize = this.pageSize
  } 
}

class CountyPaging extends Paging{
  countyPaged:Observable<any[]>
  constructor(private service: LocaleApiService){
    super()
    service.getCountiesCount().subscribe((e:number)=> this.entryCount = e)
    this.countyPaged = new Observable<any[]>
  }
  override conductSearch(){
    this.countyPaged = this.service.getCountiesPaged(
      this.page,
      this.pageSize,
      this.asc,
      this.sortBy,
      this.search
    )
    this.currentPageSize = this.pageSize
  } 
}


class CountryPaging extends Paging{
  countryPaged:Observable<any[]>
  constructor(private service: LocaleApiService){
    super()
    service.getCountriesCount().subscribe((e:number)=>this.entryCount = e)
    this.countryPaged = new Observable<any[]>
  }
  override conductSearch(){
    this.countryPaged = this.service.getCountriesPaged(
      this.page,
      this.pageSize,
      this.asc,
      this.sortBy,
      this.search
    )
    this.currentPageSize = this.pageSize
  } 
}
