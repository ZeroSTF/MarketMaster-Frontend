import { TestBed } from '@angular/core/testing';

import { ChandelierGraphService } from './chandelier-graph.service';

describe('ChandelierGraphService', () => {
  let service: ChandelierGraphService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChandelierGraphService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
