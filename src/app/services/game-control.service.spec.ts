import { TestBed } from '@angular/core/testing';

import { GameControlService } from './game-control.service';

describe('GameControlService', () => {
  let service: GameControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
