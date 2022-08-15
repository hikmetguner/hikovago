import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { GridApi, ColDef, ICellRendererParams } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { AuthenticationApiService } from 'src/app/api/authentication/authentication-api.service';
import { HotelsApiService } from 'src/app/api/hotels/hotels-api.service';
import { LocaleApiService } from 'src/app/api/locale/locale-api.service';
import { MediaApiService } from 'src/app/api/media/media-api.service';
import { RoomsApiService } from 'src/app/api/rooms/rooms-api.service';
import { UserApiService } from 'src/app/api/users/user-api.service';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css']
})
export class HotelsComponent implements OnInit {

  constructor(private service: HotelsApiService,
    private localeService: LocaleApiService,
    private userService: UserApiService,
    private formBuilder: FormBuilder,
    private mediaApi: MediaApiService,
    private userApi: UserApiService,
    private roomApi: RoomsApiService,
    private authApi: AuthenticationApiService) { }


  //User
  user!:any
  //Message
  message:string = ''
  showSuccess:boolean = false
  showError:boolean = false

  //Modal
  selectedMedia:any
  modalTitle:string = 'Title'
  submitButton:string = 'Add'
  form!: FormGroup
  imageForm!:FormGroup

  gridApi!: GridApi
  selection:any
  selectedFiles: File[] = [];

  userMap: Map<string,string> = new Map<string,string>()
  countryMap: Map<string,string> = new Map<string,string>()
  cityMap: Map<string,string> = new Map<string,string>()
  countyMap: Map<string,string> = new Map<string,string>()

  formCityMap: Map<string,string> = new Map<string,string>()
  formCountyMap: Map<string,string> = new Map<string,string>()

  rowData!: Observable<any[]>
  colDefs: ColDef[] = [
    {field: 'name'},
    {headerName: 'Country', field: 'countryId',enableRowGroup: true, cellRenderer: (params: ICellRendererParams) => {
      return this.countryMap.get(params.value)
      }
    },
    {headerName: 'City', field: 'cityId', enableRowGroup: true, cellRenderer: (params: ICellRendererParams) => {
      return this.cityMap.get(params.value)
      }
    },
    {headerName: 'County', field: 'countyId', enableRowGroup: true, cellRenderer: (params: ICellRendererParams) => {
      return this.countyMap.get(params.value)
      }
    },
    {field: 'address'},
    {field: 'cellphone'},
    {field: 'description'},
    {field: 'star',enableRowGroup: true, cellRenderer: (params: ICellRendererParams) => {
      console.log(params.value);
      
      switch(params.value){
        case 1:
          return `<p>★☆☆☆☆</p>`
        case 2: 
          return `<p>★★☆☆☆</p>`
        case 3:
          return `<p>★★★☆☆</p>`
        case 4:
          return `<p>★★★★☆</p>`
        case 5:
          return `<p>★★★★★</p>`
        default:
          return `<p>☆☆☆☆☆</p>`
        }
      }},
    {field: 'views'},
    {field: 'userScore'}
  ]

  defaultColDefs: ColDef = {
    flex: 1,
    minWidth: 150,
    wrapText: true,
    sortable: true, filter: true, resizable: true
  }

  ngOnInit(): void {

    let email = this.authApi.getUsername()
    this.userApi.getUserByEmail(email).subscribe(e => {
      console.log(e.email)
      this.user = e
      this.rowData = this.service.getHotelsByUser(this.user.id)
    })
    this.form = this.formBuilder.group({
      id: new FormControl({value:'', disabled:true}),
      ownerId: new FormControl('',Validators.required),
      name: new FormControl('',Validators.required),
      countryId: new FormControl('',Validators.required),
      cityId: new FormControl({value:'', disabled:true},Validators.required),
      countyId: new FormControl({value:'', disabled:true},Validators.required),
      address: new FormControl('',Validators.required),
      cellphone: new FormControl('',[Validators.required]),
      //Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
      description: new FormControl('',Validators.required),
      star: new FormControl(0,Validators.required)
    })

    this.imageForm = this.formBuilder.group({
      images: new FormControl([],Validators.required)
    })



    this.userService.getUsers().subscribe(e => {
      e.forEach(element => {
        this.userMap.set(element.id,element.firstName + " " + element.lastName)
      })
    })

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

    this.localeService.getCounties().subscribe(e => {
      e.forEach(element => {    
        this.countyMap.set(element.id,element.name)
      });
    })

    this.onCountryIdChange()
    this.onCityIdChange()
  }

  onGridReady(params:any):void{
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit()
  }

  changeSelection(){
    this.selection = this.gridApi.getSelectedRows()[0]
  }

  //CITY CRUD RELATED OPERATIONS
  modal(){
    console.log(this.selection);
        
    if(this.selection == undefined || this.selection == null){
      this.modalTitle = 'Add City'
      this.submitButton = 'Create'
      this.form.setValue({
        id: '',
        ownerId: this.user.id,
        name: '',
        countryId: '',
        cityId: '',
        countyId: '',
        address: '',
        cellphone: '',
        description: '',
        star: 0,
      })
    }
    else {
      console.log(this.selection.stars);
      
      this.modalTitle = 'Edit City'
      this.submitButton = 'Update'
      this.form.controls["id"].setValue(this.selection.id)
      this.form.setValue({
        id: this.selection.id,
        ownerId: this.selection.ownerId,
        name: this.selection.name,
        countryId: this.selection.countryId,
        cityId: this.selection.cityId,
        countyId: this.selection.countyId,
        address: this.selection.address,
        cellphone: this.selection.cellphone,
        description: this.selection.description,
        star: this.selection.star
      })
    }
  }

  delete(){
    this.service.deleteHotel(this.selection.id).subscribe(
      res => {
        this.showAlert(true,'Hotel created.')

        this.refreshData()
      },
      (err:HttpErrorResponse) => {
        this.showAlert(false,err.message)
      }
    );
    this.selection = undefined
  }

  deleteMedia(){
    this.mediaApi.deleteMedia(this.selectedMedia).subscribe(
      res => {
        this.showAlert(true,'Image deleted.')

        this.refreshData()
    },
      (err:HttpErrorResponse) => {
        this.showAlert(false,err.message)
      }
    )
         
  }

  onSubmit(){
    console.log();
    
    if(this.form.controls['id'].value == ''){
      this.service.postHotel(this.form.value).subscribe(
        (res:any) => {
          this.mediaApi.postMediaToHotel(this.selectedFiles,res.id).subscribe(
            res => {
              this.showAlert(true,'Image uploaded.')

              this.refreshData()
            },
            (err:HttpErrorResponse) => {
              this.showAlert(false,err.message)
            }
          )
          this.showAlert(true,'Hotel created.')
          this.refreshData()
      },
        err => {
          this.showAlert(false,err.message)
        }
      );
    }
    else{; 
      this.service.putHotel(this.form.getRawValue()).subscribe(
        (res:any) => {
          this.mediaApi.postMediaToHotel(this.selectedFiles,this.selection.id).subscribe(
            res => {
              this.showAlert(true,'Image uploaded.')

              this.refreshData()
          },
            (err:HttpErrorResponse) => {
              this.showAlert(false,err.message)
            }
          )
          this.showAlert(true,'Hotel updated.')
          this.refreshData()
      },
        err => {
          this.showAlert(false,err.message)
        })
    }
  }

  onClose(){
    this.form.reset()
    this.selection = null
  }

  public refreshData(){
    this.rowData = this.service.getHotelsByUser(this.user.id)
    this.service.getHotel(this.selection.id).subscribe(e => this.selection = e)
  }

  onCountryIdChange(){
    this.form.get('countryId')?.valueChanges.subscribe(val => {
      console.log(val);
      if(val != '' && val != null) 
      {
        console.log("Value is not null");
        
        this.formCityMap.clear()
        this.localeService.getCitiesByCountry(val).subscribe(e =>{
          e.forEach(element => {
            this.formCityMap.set(element.id,element.name)
          })
          if(this.formCityMap.size > 0){
            this.form.controls['cityId'].enable() 
          }
          else{
            this.form.controls['cityId'].setValue('')
            this.form.controls['cityId'].disable()
          }      
        })              
      }
    })    
  }

  onCityIdChange(){
    this.form.get('cityId')?.valueChanges.subscribe(val => {
      console.log(val);
      if(val != '' && val != null) 
      {
        console.log("Value is not null");
        
        this.formCountyMap.clear()
        this.localeService.getCountiesByCity(val).subscribe(e =>{
          e.forEach(element => {
            console.log(element);
            
            this.formCountyMap.set(element.id,element.name)
          })
          if(this.formCountyMap.size > 0){
            this.form.controls['countyId'].enable() 
          }
          else{
            this.form.controls['countyId'].setValue('')
            this.form.controls['countyId'].disable()
          }      
        })              
      }
    })    
  }

  onFileSelect(event:any){
    this.selectedFiles = event.target.files
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
