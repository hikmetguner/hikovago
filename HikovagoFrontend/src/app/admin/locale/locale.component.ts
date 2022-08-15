import { Component, OnInit} from '@angular/core';
import { Observable} from 'rxjs';
import { LocaleApiService } from 'src/app/api/locale/locale-api.service';
import { ColDef, GetRowIdFunc, GetRowIdParams, GridApi, ColumnApi, ICellRendererParams } from 'ag-grid-community';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-locale',
  templateUrl: './locale.component.html',
  styleUrls: ['./locale.component.css'],
})
export class LocaleComponent implements OnInit {

  message:string = ''
  showSuccess:boolean = false
  showError:boolean = false

  countryGrid!: GridApi
  cityGrid!: GridApi
  countyGrid!: GridApi

  countrySelection:any
  citySelection:any
  countySelection:any

  cityMap: Map<string,string> = new Map<string,string>()
  countryMap: Map<string,string> = new Map<string,string>()

  // -- MODAL AND FORMS

  //COUNTRY
  countryModalTitle:string = 'Title'
  countryModalSubmitButton:string = 'Add'

  countryForm = new FormGroup({
    id: new FormControl({value:'',disabled:true}),
    name: new FormControl('', Validators.required)
  })

  //City
  cityModalTitle:string = 'Title'
  cityModalSubmitButton:string = 'Add'

  cityForm = new FormGroup({
    id: new FormControl({value:'',disabled:true}),
    countryId: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required)
  })

  //County
  countyModalTitle:string = 'Title'
  countyModalSubmitButton:string = 'Add'

  countyForm = new FormGroup({
    id: new FormControl({value:'',disabled:true}),
    cityId: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required)
  })


  //AG-GRID 
  countryData!: Observable<any[]>
  countryDefs: ColDef[] = [
    { field: 'id'},
    {field: 'name'},  
  ]

  cityData!: Observable<any[]>
  cityDefs: ColDef[] = [
    { field: 'id'},
    {field: 'name'},  
    {headerName: 'Country', field: 'countryId', enableRowGroup:true, cellRenderer: (params: ICellRendererParams) => {
      return this.countryMap.get(params.value)
    }},  
  ]

  countyData!: Observable<any[]>
  countyDefs: ColDef[] = [
    { field: 'id'},
    {field: 'name'},
    {headerName: 'City', field: 'cityId', enableRowGroup:true, cellRenderer: (params: ICellRendererParams) => {
      return this.cityMap.get(params.value)
    }},
  ]

  defaultColDefs: ColDef = {
    flex: 1,
    minWidth: 100,
    sortable: true, filter: true, resizable: true
  }
  constructor(private localeService : LocaleApiService) { }


  //INIT DATA AND MAPPING
  ngOnInit(): void {
    this.countryData = this.localeService.getCountries()
    this.cityData = this.localeService.getCities()
    this.countyData = this.localeService.getCounties()

    this.localeService.getCountries().subscribe(e => {
      e.forEach(element => {    
        this.countryMap.set(element.id,element.name)
      });
    })

    this.localeService.getCities().subscribe(e => {
      e.forEach(element => {    
        this.cityMap.set(element.id,element.name)
      });
    })
  }

  //GRID OPERATIONS
  onCountryReady(params:any):void{
    this.countryGrid = params.api;
  }

  onCityReady(params:any):void{
    this.cityGrid = params.api;
  }


  onCountyReady(params:any):void{
    this.countyGrid = params.api;
  }


  changeCountrySelection(){
    console.log(this.countryGrid.getSelectedRows());
    
    this.countrySelection = this.countryGrid.getSelectedRows()[0]
  }

  changeCitySelection(){
    console.log(this.cityGrid.getSelectedRows());
    this.citySelection = this.cityGrid.getSelectedRows()[0]
  }

  changeCountySelection(){
    console.log(this.countySelection);
    this.countySelection = this.countyGrid.getSelectedRows()[0]
  }

  //COUNTRY CRUD RELATED OPERATIONS
  countryModal(){    
    if(this.countrySelection == undefined){
      this.countryModalTitle = 'Add Country'
      this.countryModalSubmitButton = 'Create'
      this.countryForm.setValue({
        id: '',
        name: '',
      })
    }
    else {
      console.log(this.countrySelection);
      
      this.countryModalTitle = 'Edit Country'
      this.countryModalSubmitButton = 'Update'
      this.countryForm.setValue({
        id: this.countrySelection.id,
        name: this.countrySelection.name
      })
    }
  }

  deleteCountry(){
    console.log(this.countrySelection.id);
    
    this.localeService.deleteCountry(this.countrySelection.id).subscribe(
      res => {
        this.refreshData()
    },
      err => {
          console.log(Error);
      }
    );

    this.countrySelection = undefined
  }

  onCountrySubmit(){
    if(this.countryForm.controls['id'].value == ''){
      this.localeService.postCountry(this.countryForm.value).subscribe(
        res => {
          this.showAlert(true,'Country created.')

          this.refreshData()
      },
        (err:HttpErrorResponse) => {
          this.showAlert(false,err.message)
        }
      );
    }
    else{; 
      this.localeService.putCountry(this.countryForm.getRawValue()).subscribe(
        res => {
          this.refreshData()
      },
        err => {
            console.log(Error);
        })
    }
  }

  //CITY CRUD RELATED OPERATIONS
  cityModal(){    
    if(this.citySelection == undefined){
      this.cityModalTitle = 'Add City'
      this.cityModalSubmitButton = 'Create'
      this.cityForm.setValue({
        id: '',
        name: '',
        countryId: ''
      })
    }
    else {
      console.log(this.citySelection);
      
      this.cityModalTitle = 'Edit City'
      this.cityModalSubmitButton = 'Update'
      this.cityForm.setValue({
        id: this.citySelection.id,
        countryId: this.citySelection.countryId,
        name: this.citySelection.name
      })
    }
  }

  deleteCity(){
    console.log(this.citySelection.id);
    
    this.localeService.deleteCity(this.citySelection.id).subscribe(
      res => {
        this.refreshData()
    },
      err => {
          console.log(Error);
      }
    );

    this.citySelection = undefined
  }

  onCitySubmit(){
    console.log();
    
    if(this.cityForm.controls['id'].value == ''){
      this.localeService.postCity(this.cityForm.value).subscribe(
        res => {
          this.refreshData()
      },
        err => {
            console.log(Error);
        }
      );
    }
    else{; 
      this.localeService.putCity(this.cityForm.getRawValue()).subscribe(
        res => {
          this.refreshData()
      },
        err => {
            console.log(Error);
        })
    }
  }

  //COUNTY CRUD RELATED OPERATIONS
  countyModal(){    
    if(this.countySelection == undefined){
      this.countyModalTitle = 'Add County'
      this.countyModalSubmitButton = 'Create'
      this.countyForm.setValue({
        id: '',
        name: '',
        cityId: ''
      })
    }
    else {
      console.log(this.countySelection);
      
      this.countyModalTitle = 'Edit County'
      this.countyModalSubmitButton = 'Update'
      this.countyForm.setValue({
        id: this.countySelection.id,
        cityId: this.countySelection.cityId,
        name: this.countySelection.name
      })
    }
  }

  deleteCounty(){
    console.log(this.countySelection);
    
    this.localeService.deleteCounty(this.countySelection.id).subscribe(
      res => {
        this.refreshData()
    },
      err => {
          console.log(Error);
      }
    );
    this.countySelection = undefined
  }

  onCountySubmit(){
    console.log();
    
    if(this.countyForm.controls['id'].value == ''){
      this.localeService.postCounty(this.countyForm.value).subscribe(
        res => {
          this.refreshData()
      },
        err => {
            console.log(Error);
        }
      );
    }
    else{; 
      this.localeService.putCounty(this.countyForm.getRawValue()).subscribe(
        res => {
          this.refreshData()
      },
        err => {
            console.log(Error);
        })
    }
  }

  refreshData(){
    this.countryData = this.localeService.getCountries()
    this.cityData = this.localeService.getCities()
    this.countyData = this.localeService.getCounties()

    this.localeService.getCountries().subscribe(e => {
      e.forEach(element => {    
        this.countryMap.set(element.id,element.name)
      });
    })

    this.localeService.getCities().subscribe(e => {
      e.forEach(element => {    
        this.cityMap.set(element.id,element.name)
      });
    })
  }

  showAlert(success:boolean, message:string){
    if(success){
      this.message = message;
      this.showSuccess = true;
      setTimeout(() => this.showSuccess = false, 2000)
    }
    else{
      this.message = message;
      this.showError = true;
      setTimeout(() => this.showError = false, 4000)
    }
  }
}
