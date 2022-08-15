import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GridApi } from 'ag-grid-community';
import { AuthenticationApiService } from 'src/app/api/authentication/authentication-api.service';
import { CommentsApiService } from 'src/app/api/comments/comments-api.service';
import { HotelsApiService } from 'src/app/api/hotels/hotels-api.service';
import { MediaApiService } from 'src/app/api/media/media-api.service';
import { UserApiService } from 'src/app/api/users/user-api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private authApi: AuthenticationApiService, private userApi: UserApiService, private formBuilder: FormBuilder, private mediaApi: MediaApiService, private commentApi: CommentsApiService, private hotelApi: HotelsApiService) {}

  selectedFiles:any
  message:string = ''
  showSuccess:boolean = false
  showError:boolean = false
  comments: any[] = []

  hotelMap: Map<string,string> = new Map()
  form!:FormGroup
  email!:string
  user!:any
  dataType!:string
  ngOnInit(): void {
    this.email = this.authApi.getUsername()
    this.userApi.getUserByEmail(this.email).subscribe(e => {
      this.user = e
      let type = this.user.media.type as string
      this.dataType = type.replace('.','')
      this.form.setValue({
        email: this.user.email,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
      })
      this.commentApi.getCommentsByUser(e.id).subscribe(cs => {
        cs.forEach(comment => {
          this.comments.push(comment)
          console.log(comment);
          
        });
      })         
    })

    this.hotelApi.getHotels().subscribe(e => {
      e.forEach(element =>{
        this.hotelMap.set(element.id,element.name)
      })
    })

    this.form = this.formBuilder.group({
      email: new FormControl({value:'', disabled:true}),
      firstName: new FormControl('',Validators.required),
      lastName: new FormControl('',Validators.required),
    })
  }

  onFileSelect(event:any){
    this.selectedFiles = event.target.files[0]
    this.form.markAsDirty()
  }

  onSubmit(){
    let form = this.form.getRawValue()
    this.user.firstName = form.firstName
    this.user.lastName = form.lastName
    if(this.selectedFiles != null){
      this.mediaApi.postMediaToUser(this.selectedFiles,this.user.id).subscribe(res => {
        this.showAlert(true,'Image uploaded.')
    },
      err => {
        this.showAlert(false, err.message)
      })     
    }
    
    this.userApi.putUser(this.user).subscribe(
      (res:any) => {
        this.showAlert(true,'User updated.')
        this.form.markAsPristine()
        this.userApi.getUserByEmail(this.email).subscribe( e=> 
          this.user = e
        )
    },
      (err:HttpErrorResponse) => {
        this.showAlert(false,err.message)
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
}
