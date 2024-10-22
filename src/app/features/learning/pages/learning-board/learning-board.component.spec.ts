import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningBoardComponent } from './learning-board.component';

describe('LearningBoardComponent', () => {
  let component: LearningBoardComponent;
  let fixture: ComponentFixture<LearningBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearningBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
