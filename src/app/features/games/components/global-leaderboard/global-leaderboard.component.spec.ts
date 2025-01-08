import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalLeaderboardComponent } from './global-leaderboard.component';

describe('GlobalLeaderboardComponent', () => {
  let component: GlobalLeaderboardComponent;
  let fixture: ComponentFixture<GlobalLeaderboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalLeaderboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalLeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
