import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducerGuard } from './producer.component';

describe('ProducerComponent', () => {
  let component: ProducerGuard;
  let fixture: ComponentFixture<ProducerGuard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProducerGuard ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProducerGuard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
