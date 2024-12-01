import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameGamesComponent } from './game-games.component';

describe('GameGamesComponent', () => {
  let component: GameGamesComponent;
  let fixture: ComponentFixture<GameGamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameGamesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
