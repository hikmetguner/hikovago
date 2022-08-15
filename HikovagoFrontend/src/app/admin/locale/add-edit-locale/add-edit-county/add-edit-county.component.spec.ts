import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCountyComponent } from './add-edit-county.component';

describe('AddEditCountyComponent', () => {
  let component: AddEditCountyComponent;
  let fixture: ComponentFixture<AddEditCountyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditCountyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditCountyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
