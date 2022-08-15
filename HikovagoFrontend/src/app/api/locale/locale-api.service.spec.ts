import { TestBed } from '@angular/core/testing';

import { LocaleApiService } from './locale-api.service';

describe('LocaleApiService', () => {
  let service: LocaleApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocaleApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
