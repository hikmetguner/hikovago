import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowLocaleComponent } from './show-locale.component';

describe('ShowLocaleComponent', () => {
  let component: ShowLocaleComponent;
  let fixture: ComponentFixture<ShowLocaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowLocaleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowLocaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
