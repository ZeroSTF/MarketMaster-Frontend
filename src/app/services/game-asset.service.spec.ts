import { TestBed } from '@angular/core/testing';

import { GameAssetService } from './game-asset.service';

describe('GameAssetService', () => {
  let service: GameAssetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameAssetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
