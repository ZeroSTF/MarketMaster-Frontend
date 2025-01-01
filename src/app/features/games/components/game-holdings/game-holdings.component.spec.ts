import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameHoldingsComponent } from './game-holdings.component';

describe('GameHoldingsComponent', () => {
  let component: GameHoldingsComponent;
  let fixture: ComponentFixture<GameHoldingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameHoldingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameHoldingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
