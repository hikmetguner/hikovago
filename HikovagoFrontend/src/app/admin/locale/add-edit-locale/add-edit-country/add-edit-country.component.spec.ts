import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCountryComponent } from './add-edit-country.component';

describe('AddEditCountryComponent', () => {
  let component: AddEditCountryComponent;
  let fixture: ComponentFixture<AddEditCountryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditCountryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
