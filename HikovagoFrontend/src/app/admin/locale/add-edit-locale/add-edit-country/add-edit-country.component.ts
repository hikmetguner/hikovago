import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-add-edit-country',
  templateUrl: './add-edit-country.component.html',
  styleUrls: ['./add-edit-country.component.css']
})
export class AddEditCountryComponent implements OnInit {

  constructor() { }

  @Input() country:any
  countryId: number = 0
  countryName: string = ""
  ngOnInit(): void {
  }

}
