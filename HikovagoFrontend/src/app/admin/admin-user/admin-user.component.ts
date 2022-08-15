import { Component, OnInit} from '@angular/core';
import { Observable} from 'rxjs';
import { LocaleApiService } from 'src/app/api/locale/locale-api.service';
import { ColDef, GetRowIdFunc, GetRowIdParams, GridApi, ICellRendererParams } from 'ag-grid-community';
import { UserApiService } from 'src/app/api/users/user-api.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MediaApiService } from 'src/app/api/media/media-api.service';


@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.css']
})
export class AdminUserComponent implements OnInit {

  message:string = ''
  showSuccess:boolean = false
  showError:boolean = false

  form!: FormGroup

  //Modal
  modalTitle:string = 'Title'
  submitButton:string = 'Add'

  gridApi!: GridApi
  selection:any
  selectedFiles!: File;

  capacityMap: Map<string,string> = new Map<string,string>()
  hotelMap: Map<string,string> = new Map<string,string>()

  rowData!: Observable<any[]>
  colDefs: ColDef[] = [
    {field: 'id'},
    {field: 'firstName'},
    {field: 'lastName'},
    {field: 'media',
    cellStyle: {textAlign: 'center'}, cellRenderer: (params: ICellRendererParams) => {
      if(params.value.data == null) return 'no image'
    return `<img src="data:image/jpeg;base64,${params.value.data}" style="width:60px; height:60px;">`
    }},
    {field: 'email'},
    {field: 'emailConfirmed' ,enableRowGroup: true},
    {field: 'lockoutEnabled' ,enableRowGroup: true},
    {field: 'lockoutEnd'},
    {field: 'accessFailedCount'}  
  ]

  defaultColDefs: ColDef = {
    flex: 1,
    minWidth: 50,
    sortable: true, filter: true, resizable: true
  }

  constructor(private service: UserApiService, private mediaApi:MediaApiService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.rowData = this.service.getUsers()

    this.form = this.formBuilder.group({
      id: new FormControl({value:'', disabled:true}),
      email: new FormControl({value:'', disabled:true}),
      emailConfirmed: new FormControl('', Validators.required),
      firstName: new FormControl('',Validators.required),
      lastName: new FormControl('',Validators.required),
      lockoutEnabled: new FormControl('',Validators.required),
      mediaId: new FormControl({value:'',disabled:true}),
    })

  }

  onGridReady(params:any):void{
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit()
  }

  changeSelection(){
    this.selection = this.gridApi.getSelectedRows()[0]
    console.log(this.selection);
    
  }

  //CITY CRUD RELATED OPERATIONS
  modal(){   
    this.modalTitle = 'Edit User'
    this.submitButton = 'Update'
    this.form.controls["id"].setValue(this.selection.id)
    this.form.setValue({
      id: this.selection.id,
      email: this.selection.email,
      emailConfirmed: this.selection.emailConfirmed,
      firstName: this.selection.firstName,
      lastName: this.selection.lastName,
      lockoutEnabled: this.selection.lockoutEnabled,
      mediaId: this.selection.mediaId,
    })
  }

  delete(){
    this.service.deleteUser(this.selection.id).subscribe(
      res => {
        this.showAlert(true,'User deleted.')
        this.refreshData()
    },
      err => {
        this.showAlert(false, err.message)
      }
    );
    this.selection = undefined
  }
  onSubmit(){     
    let data = this.selection
    let form = this.form.getRawValue()

    data.emailConfirmed = form.emailConfirmed as boolean
    data.firstName = form.firstName
    data.lastName = form.lastName
    data.lockoutEnabled = form.lockoutEnabled as boolean
    if(this.selectedFiles != null){
      this.mediaApi.postMediaToUser(this.selectedFiles,data.id).subscribe(res => {
        this.showAlert(true,'Image uploaded.')
        this.refreshData()
    },
      err => {
        this.showAlert(false, err.message)
      })     
    }
    data.media = form.media

    console.log(data);
    

    this.service.putUser(data).subscribe(
      (res:any) => {
        console.log(res);
        this.showAlert(true,'User updated.')
        this.refreshData()
    },
      (err:HttpErrorResponse) => {
        this.showAlert(false,err.message)
    })
  }

  onClose(){
    this.form.reset()
  }

  public refreshData(){
    this.rowData = this.service.getUsers()
    this.service.getUser(this.selection.id).subscribe(e => this.selection = e)
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

  onFileSelect(event:any){
    this.selectedFiles = event.target.files[0]
  }

}
