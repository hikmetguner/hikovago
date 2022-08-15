import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { GridApi, ColDef, ICellRendererParams } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { AuthenticationApiService } from 'src/app/api/authentication/authentication-api.service';
import { HotelsApiService } from 'src/app/api/hotels/hotels-api.service';
import { MediaApiService } from 'src/app/api/media/media-api.service';
import { RoomsApiService } from 'src/app/api/rooms/rooms-api.service';
import { UserApiService } from 'src/app/api/users/user-api.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  constructor(private service: RoomsApiService,
    private hotelApi: HotelsApiService,
    private formBuilder: FormBuilder,
    private mediaApi: MediaApiService,
    private authApi: AuthenticationApiService,
    private userApi: UserApiService) { }

  user!:any
  selectedMedia:any
  message:string = ''
  showSuccess:boolean = false
  showError:boolean = false

  //Modal
  modalTitle:string = 'Title'
  submitButton:string = 'Add'
  form!: FormGroup
  imageForm!:FormGroup

  gridApi!: GridApi
  selection:any
  selectedFiles: File[] = [];

  capacityMap: Map<string,string> = new Map<string,string>()
  hotelMap: Map<string,string> = new Map<string,string>()

  rowData!: Observable<any[]>
  colDefs: ColDef[] = [
    { field: 'id', minWidth:200},
    {headerName: 'Hotel', field: 'hotelId',enableRowGroup: true, cellRenderer: (params: ICellRendererParams) => {
      return this.hotelMap.get(params.value)
      }
    },
    {field: 'name'},
    {headerName: 'Capacity', field: 'capacity',enableRowGroup: true, cellRenderer: (params: ICellRendererParams) => {
      return this.capacityMap.get(params.value)
      }
    },
    {field: 'price', filter: 'agNumberColumnFilter'}
  ]

  defaultColDefs: ColDef = {
    flex: 1,
    minWidth: 150,
    wrapText: true,
    sortable: true, filter: true, resizable: true
  }

  ngOnInit(): void {
    this.capacityMap.set('1a','1 Adult')
    this.capacityMap.set('2a','2 Adults')
    this.capacityMap.set('3a','3 Adults')
    this.capacityMap.set('4a','4 Adults')
    this.capacityMap.set('1a1c','1 Adult, 1 Child')
    this.capacityMap.set('1a2c','1 Adult, 2 Children')
    this.capacityMap.set('2a2c','2 Adults, 2 Children')

    let email = this.authApi.getUsername()
    this.userApi.getUserByEmail(email).subscribe(e => {
      console.log(e.email)
      this.user = e
      this.hotelApi.getHotelsByUser(e.id).subscribe(e => {
        e.forEach(element => {
          this.hotelMap.set(element.id,element.name)
        })
      })
      this.rowData = this.service.getRoomsByUser(e.id)
    })

    this.form = this.formBuilder.group({
      id: new FormControl({value:'', disabled:true}),
      hotelId: new FormControl('',Validators.required),
      name: new FormControl('',Validators.required),
      capacity: new FormControl('',Validators.required),
      price: new FormControl('',[Validators.required]),
    })

    this.imageForm = this.formBuilder.group({
      images: new FormControl([],Validators.required)
    })
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
        hotelId: '',
        name: '',
        capacity: '',
        price: ''
      })
    }
    else {
      console.log("Edit");
      
      this.modalTitle = 'Edit City'
      this.submitButton = 'Update'
      this.form.controls["id"].setValue(this.selection.id)
      this.form.setValue({
        id: this.selection.id,
        hotelId: this.selection.hotelId,
        name: this.selection.name,
        capacity: this.selection.capacity,
        price: this.selection.price
      })
    }
  }

  delete(){
    this.service.deleteRoom(this.selection.id).subscribe(
      res => {
        this.showAlert(true,'Room deleted.')
        this.refreshData()
    },
      err => {
        this.showAlert(false, err.message)
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
      this.service.postRoom(this.form.value).subscribe(
        (res:any) => {
          console.log(res);
          this.mediaApi.postMediaToRoom(this.selectedFiles,res.id).subscribe(
            res => {
              this.showAlert(true,'Image uploaded.')

              this.refreshData()
          },
            (err:HttpErrorResponse) => {
              this.showAlert(false,err.message)
            }
          )
          this.showAlert(true,'Room created.')
          this.refreshData()
      },
        err => {
          this.showAlert(false, err.message)
        }
      );
    }
    else{; 
      this.service.putRoom(this.form.getRawValue()).subscribe(
        (res:any) => {
          console.log(res);
          this.mediaApi.postMediaToRoom(this.selectedFiles,this.selection.id).subscribe(
            res => {
              this.showAlert(true,'Image uploaded.')

              this.refreshData()
          },
            (err:HttpErrorResponse) => {
              this.showAlert(false,err.message)
            }
          )
          this.showAlert(true,'Room updated.')
          this.refreshData()
      },
        err => {
          this.showAlert(false,err.message)
        })
    }
  }

  onClose(){
    this.form.reset()
  }

  public refreshData(){
    this.rowData = this.service.getRooms()
    this.service.getRoom(this.selection.id).subscribe(e => this.selection = e)
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
