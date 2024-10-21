import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesSidebarComponent } from './courses-sidebar.component';

describe('CoursesSidebarComponent', () => {
  let component: CoursesSidebarComponent;
  let fixture: ComponentFixture<CoursesSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursesSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
