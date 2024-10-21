import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningOverviewComponent } from './learning-overview.component';

describe('LearningOverviewComponent', () => {
  let component: LearningOverviewComponent;
  let fixture: ComponentFixture<LearningOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearningOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
