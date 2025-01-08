import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameResultsDialogComponent } from './game-results-dialog.component';

describe('GameResultsDialogComponent', () => {
  let component: GameResultsDialogComponent;
  let fixture: ComponentFixture<GameResultsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameResultsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameResultsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
