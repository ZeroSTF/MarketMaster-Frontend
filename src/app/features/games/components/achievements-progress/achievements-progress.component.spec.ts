import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchievementsProgressComponent } from './achievements-progress.component';

describe('AchievementsProgressComponent', () => {
  let component: AchievementsProgressComponent;
  let fixture: ComponentFixture<AchievementsProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AchievementsProgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AchievementsProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
