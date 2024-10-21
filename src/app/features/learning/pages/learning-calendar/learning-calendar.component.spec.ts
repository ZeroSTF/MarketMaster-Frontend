import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningCalendarComponent } from './learning-calendar.component';

describe('LearningCalendarComponent', () => {
  let component: LearningCalendarComponent;
  let fixture: ComponentFixture<LearningCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearningCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
