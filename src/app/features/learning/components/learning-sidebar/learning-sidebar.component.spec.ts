import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningSidebarComponent } from './learning-sidebar.component';

describe('LearningSidebarComponent', () => {
  let component: LearningSidebarComponent;
  let fixture: ComponentFixture<LearningSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearningSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
