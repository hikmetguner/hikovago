import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationApiService } from 'src/app/api/authentication/authentication-api.service';
import { CommentsApiService } from 'src/app/api/comments/comments-api.service';
import { HotelsApiService } from 'src/app/api/hotels/hotels-api.service';
import { LocaleApiService } from 'src/app/api/locale/locale-api.service';
import { UserApiService } from 'src/app/api/users/user-api.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  
  //MAPS
  countryMap:Map<string,string> = new Map()
  cityMap:Map<string,string> = new Map()
  countyMap:Map<string,string> = new Map()


  user:any
  formCityMap:Map<string,string> = new Map()
  formCountyMap:Map<string,string> = new Map()
  hotels:any[] = []
  currentHotel:any
  searchForm!:FormGroup
  commentForm!:FormGroup
  constructor(private hotelApi: HotelsApiService,
     private localeApi: LocaleApiService,
     private formBuilder: FormBuilder,
     private userApi: UserApiService,
     private authApi: AuthenticationApiService,
     private commentApi: CommentsApiService) { }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      countryId: new FormControl(''),
      cityId: new FormControl({value:'',disabled:true}),
      countyId: new FormControl({value:'',disabled:true}),
      stars: new FormControl(''),
      sortBy: new FormControl(''),
      direction: new FormControl(''),
      search: new FormControl(''),
      page: new FormControl(0)
    })

    this.commentForm = this.formBuilder.group({
      userId: new FormControl('',Validators.required),
      hotelId: new FormControl('',Validators.required),
      title: new FormControl('',Validators.required),
      text: new FormControl('',Validators.required),
      rating: new FormControl('',Validators.required),
    })

this.authApi.authChanged.subscribe( e=>{
 if(!e){
  this.user = null
 }
})

    if(this.authApi.isUserAuthenticated()){
      this.userApi.getUserByEmail(this.authApi.getUsername()).subscribe(e => {
        this.user = e
      })
    }


    //COUNTRY MAP
    this.localeApi.getCountries().subscribe(e => {
      e.forEach(element => {
        this.countryMap.set(element.id,element.name)
      });
    })

    //COUNTRY MAP
    this.localeApi.getCities().subscribe(e => {
      e.forEach(element => {
        this.cityMap.set(element.id,element.name)
      });
    })

    //COUNTRY MAP
    this.localeApi.getCounties().subscribe(e => {
      e.forEach(element => {
        this.countyMap.set(element.id,element.name)
      });
    })

    this.searchSubmit()
  }

  onCountryIdChange(){  
    let val = this.searchForm.controls['countryId'].value
      console.log(val);
      if(val != '' && val != null) 
      {       
        this.formCityMap.clear()
        this.localeApi.getCitiesByCountry(val).subscribe(e =>{
          e.forEach(element => {
            this.formCityMap.set(element.id,element.name)
          })
          if(this.cityMap.size > 0){
            this.searchForm.controls['cityId'].setValue('')
            this.searchForm.controls['cityId'].enable() 
          }
          else{
            this.searchForm.controls['cityId'].setValue('')
            this.searchForm.controls['cityId'].disable()
          }      
        })              
      }
    
  }

  onCityIdChange(){
    let val = this.searchForm.controls['cityId'].value
      if(val != '' && val != null) 
      {  
        this.formCountyMap.clear()
        this.localeApi.getCountiesByCity(val).subscribe(e =>{
          e.forEach(element => {
            console.log(element);
            
            this.formCountyMap.set(element.id,element.name)
          })
          if(this.countyMap.size > 0){
            this.searchForm.controls['countyId'].setValue('')
            this.searchForm.controls['countyId'].enable() 
          }
          else{
            this.searchForm.controls['countyId'].setValue('')
            this.searchForm.controls['countyId'].disable()
          }      
        })              
      } 
  }

  goToBottom(){
    window.scrollTo(0,document.body.scrollHeight);
  }

  clearSelection(field:string){   
    if(field === 'countryId'){
      this.clearCity()
    }
    if(field === 'cityId'){
      this.clearCounty()
    }
    this.searchForm.controls[field].setValue('')
  }

  formButtonDisabled(field:string):boolean{
    return this.searchForm.controls[field].disabled
  }

  searchSubmit(){
    this.hotelApi.getHotelsFiltered(this.searchForm.getRawValue()).subscribe(e => {
      this.hotels = []
      e.forEach(element => {
        this.hotels.push(element)       
      });
    })
    console.log(this.hotels);
    
  }

  commentModal(){
    this.commentForm.controls['hotelId'].setValue(this.currentHotel.id)
    this.commentForm.controls['userId'].setValue(this.user.id)
  }

  commentSubmit(){
    console.log(this.commentForm.getRawValue());
    
    this.commentApi.postComment(this.commentForm.getRawValue()).subscribe(res => {
      console.log(res); 
    }, (err:HttpErrorResponse) =>{
      console.log(err.error);
      
    })
    this.hotelApi.getHotel(this.currentHotel.id).subscribe(e =>
      this.currentHotel = e)
    this.searchSubmit()
  }

  clearCity(){
    this.formCityMap.clear()
    this.searchForm.controls['cityId'].setValue('')
    this.searchForm.controls['cityId'].disable()
    this.clearCounty()
  }

  clearCounty(){
    this.formCountyMap.clear()
    this.searchForm.controls['countyId'].setValue('')
    this.searchForm.controls['countyId'].disable()
  }

  getStars(rating:number):string{
    switch(rating){
      case 1:
          return `★☆☆☆☆</p>`
        case 2: 
          return `★★☆☆☆`
        case 3:
          return `★★★☆☆`
        case 4:
          return `★★★★☆`
        case 5:
          return `★★★★★`
        default:
          return `☆☆☆☆☆`
    }
  }

  nextPage(){
    this.searchForm.controls['page'].setValue(this.searchForm.controls['page'].value + 1)    
    this.searchSubmit()
  }

  prevPage(){
    this.searchForm.controls['page'].setValue(this.searchForm.controls['page'].value - 1)
    this.searchSubmit()    
  }

  showHotel(id:number){
    console.log(this.hotels[id]);
    this.currentHotel = this.hotels[id]
  }

  getCapacity(capacity:string){
    switch(capacity){
      case '1A':
        return '1 Adult'
      case '2A':
        return '2 Adult'
      case '3A':
        return '3 Adult'
      case '4A':
        return '4 Adult'
      case '1A1C':
        return '1 Adult 1 Child'
      case '1A2C':
        return '1 Adult 2 Children'
      case '2A2C':
        return '2 Adult 2 Children'
      default:
        return '1 Adult'
    }
  }
}
