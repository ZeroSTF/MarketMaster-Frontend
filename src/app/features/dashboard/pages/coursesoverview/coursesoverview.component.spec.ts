import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesoverviewComponent } from './coursesoverview.component';

describe('CoursesoverviewComponent', () => {
  let component: CoursesoverviewComponent;
  let fixture: ComponentFixture<CoursesoverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesoverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursesoverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
