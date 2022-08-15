import { TestBed } from '@angular/core/testing';

import { HotelsApiService } from './hotels-api.service';

describe('HotelsApiService', () => {
  let service: HotelsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HotelsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
