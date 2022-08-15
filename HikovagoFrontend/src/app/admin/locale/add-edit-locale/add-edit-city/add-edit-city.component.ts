import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-edit-city',
  templateUrl: './add-edit-city.component.html',
  styleUrls: ['./add-edit-city.component.css']
})
export class AddEditCityComponent implements OnInit {

  constructor() { }

  @Input() city:any
  cityId:number = 0
  countryId: number = 0
  cityName: string = ""
  ngOnInit(): void {
  }

}
