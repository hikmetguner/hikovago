import { Component, OnInit } from '@angular/core';
import { ColDef, GetRowIdFunc, GetRowIdParams, GridApi, ICellRendererParams, ValueCache } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { MediaApiService } from 'src/app/api/media/media-api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { GridOptions } from 'ag-grid-community';
import { FormBuilder, FormControl, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import * as moment from 'moment';

@Component({
  selector: 'app-admin-media',
  templateUrl: './admin-media.component.html',
  styleUrls: ['./admin-media.component.css']
})
export class AdminMediaComponent implements OnInit {

  gridApi!: GridApi
  selection:any
  
  message:string = ''
  showSuccess:boolean = false
  showError:boolean = false

  modalTitle:string = 'Edit Media'
  submitButton:string = 'Update'
  selectedFiles!: []

  form = new FormGroup({
    id: new FormControl({value:'',disabled:true},Validators.required),
    name: new FormControl('',Validators.required),
    type: new FormControl('',Validators.required),
    dateUploaded: new FormControl({value:'',disabled:true}),
    data: new FormControl({value:'',disabled:true}),
  })


  rowData!: Observable<any[]>
  colDefs: ColDef[] = [
    {field: 'id', minWidth:205},
    {field: 'name'},
    {field: 'type'},
    {field: 'dateUploaded', filter: 'agDateColumnFilter',
      valueFormatter: function(params){ 
        return moment(params.value).format('DD/MM/yyyy HH:mm:ss') + ' UTC';
      },
      },
    {field: 'data',
      cellStyle: {textAlign: 'center'}, filter:false, cellRenderer: (params: ICellRendererParams) => {
      return `<img src="data:image/png;base64,${params.value}" style="width:200px; height:100px;">`
    }}
  ]
  

  defaultColDefs: ColDef = {
    flex: 1,
    minWidth: 150,
    autoHeight: true,
    sortable: true, filter: true, resizable: true, wrapText: true
  }
  constructor(private mediaApi: MediaApiService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.rowData = this.mediaApi.getMedias()
  }


  onGridReady(params:any):void{
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit()
  }

  changeSelection(){
    this.selection = this.gridApi.getSelectedRows()[0]
    console.log(this.selection);
  }

  refreshData(){
    this.rowData = this.mediaApi.getMedias()
  }
  delete(){
    this.mediaApi.deleteMedia(this.selection.id).subscribe(
      res => {
        this.showAlert(true,'Media deleted.')

        this.refreshData()
    },
      (err:HttpErrorResponse) => {
        this.showAlert(false,err.message)
      }
    );

    this.selection = undefined
  }

  modal(){
    this.form.setValue({
      id: this.selection.id,
      name: this.selection.name,
      type: this.selection.type,
      dateUploaded: this.selection.dateUploaded,
      data: this.selection.data,
    })    
  }

  onSubmit(){
    console.log(this.selection);
    
    this.mediaApi.putMedia(this.form.getRawValue()).subscribe(
      res => {
        this.showAlert(true,'Media updated.')

        this.refreshData()
      },
      (err:HttpErrorResponse) => {
        console.log(err.error);
        
        this.showAlert(false,err.message)
      }
    )
    
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

