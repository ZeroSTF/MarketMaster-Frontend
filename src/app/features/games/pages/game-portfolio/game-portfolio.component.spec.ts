import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamePortfolioComponent } from './game-portfolio.component';

describe('GamePortfolioComponent', () => {
  let component: GamePortfolioComponent;
  let fixture: ComponentFixture<GamePortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamePortfolioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamePortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
