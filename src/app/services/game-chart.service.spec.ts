import { TestBed } from '@angular/core/testing';

import { GameChartService } from './game-chart.service';

describe('GameChartService', () => {
  let service: GameChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
