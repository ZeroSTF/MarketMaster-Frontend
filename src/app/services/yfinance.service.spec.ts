import { TestBed } from '@angular/core/testing';

import { YfinanceService } from './yfinance.service';

describe('YfinanceService', () => {
  let service: YfinanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YfinanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
