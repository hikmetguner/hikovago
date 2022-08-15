import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef, GridApi, ICellRendererParams } from 'ag-grid-community';
import { Observable, startWith } from 'rxjs';
import { CommentsApiService } from 'src/app/api/comments/comments-api.service';
import { HotelsApiService } from 'src/app/api/hotels/hotels-api.service';
import { UserApiService } from 'src/app/api/users/user-api.service';

@Component({
  selector: 'app-admin-comments',
  templateUrl: './admin-comments.component.html',
  styleUrls: ['./admin-comments.component.css']
})
export class AdminCommentsComponent implements OnInit {

  constructor(private service: CommentsApiService, private hotelApi: HotelsApiService,  private formBuilder: FormBuilder, private userApi: UserApiService) { }

  selectedMedia:any
  message:string = ''
  showSuccess:boolean = false
  showError:boolean = false

  //Modal
  modalTitle:string = 'Title'
  submitButton:string = 'Add'
  form!: FormGroup

  gridApi!: GridApi
  selection:any

  hotelMap: Map<string,string> = new Map<string,string>()
  userMap: Map<string,string> = new Map<string,string>()

  rowData!: Observable<any[]>
  colDefs: ColDef[] = [
    { field: 'id', minWidth:200},
    {headerName: 'User', field: 'userId',enableRowGroup: true, cellRenderer: (params: ICellRendererParams) => {
      return this.userMap.get(params.value)
      }
    },
    {headerName: 'Hotel', field: 'hotelId',enableRowGroup: true, cellRenderer: (params: ICellRendererParams) => {
      return this.hotelMap.get(params.value)
      }
    },
    {field: 'title'},
    {field: 'text'},
    {headerName: 'Rating', field: 'rating',enableRowGroup: true, cellRenderer: (params: ICellRendererParams) => {
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
          return params.value
        }
      }
    },
  ]

  defaultColDefs: ColDef = {
    flex: 1,
    minWidth: 150,
    wrapText: true,
    sortable: true, filter: true, resizable: true
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: new FormControl({value:'', disabled:true}),
      userId: new FormControl('',Validators.required),
      hotelId: new FormControl('',Validators.required),
      title: new FormControl('',Validators.required),
      text: new FormControl('',Validators.required),
      rating: new FormControl('',Validators.required),
    })

    this.rowData = this.service.getComments()

    this.hotelApi.getHotels().subscribe(e => {
      e.forEach(element => {
        this.hotelMap.set(element.id,element.name)
      })
    })

    this.userApi.getUsers().subscribe(e => {
      e.forEach(element => {
        this.userMap.set(element.id,element.firstName + " " + element.lastName)
      })
    })
  }

  onGridReady(params:any):void{
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit()
  }

  changeSelection(){
    this.selection = this.gridApi.getSelectedRows()[0]
  }

  //COMMENT CRUD RELATED OPERATIONS
  modal(){
    console.log(this.selection);
        
    if(this.selection == undefined || this.selection == null){
      this.modalTitle = 'Add Comment'
      this.submitButton = 'Create'
      this.form.setValue({
        id: '',
        userId: '',
        hotelId: '',
        title: '',
        text: '',
        rating: ''
      })
    }
    else {     
      this.modalTitle = 'Edit Comment'
      this.submitButton = 'Update'
      this.form.controls["id"].setValue(this.selection.id)
      this.form.setValue({
        id: this.selection.id,
        userId: this.selection.userId,
        hotelId: this.selection.hotelId,
        title: this.selection.title,
        text: this.selection.text,
        rating: this.selection.rating
      })
    }
  }

  delete(){
    this.service.deleteComment(this.selection.id).subscribe(
      res => {
        this.showAlert(true,'Comment deleted.')

        this.refreshData()
      },
      (err:HttpErrorResponse) => {
        this.showAlert(false,err.message)
      }
    );
    this.selection = undefined
  }

  onSubmit(){
    console.log();
    
    if(this.form.controls['id'].value == ''){
      this.service.postComment(this.form.value).subscribe(
        (res:any) => {
        this.showAlert(true,'Comment created.')
        this.refreshData()
      },
      (err:HttpErrorResponse) => {
        this.showAlert(false,err.message)
      });
    }
    else{; 
      this.service.putComment(this.form.getRawValue()).subscribe(
        (res:any) => {
        this.showAlert(true,'Comment updated.')
        this.refreshData()
      },
      (err:HttpErrorResponse) => {
        this.showAlert(false,err.message)
      });
    }
  }

  onClose(){
    this.form.reset()
  }

  public refreshData(){
    this.rowData = this.service.getComments()
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
