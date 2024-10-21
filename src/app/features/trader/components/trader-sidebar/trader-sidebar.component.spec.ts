import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraderSidebarComponent } from './trader-sidebar.component';

describe('TraderSidebarComponent', () => {
  let component: TraderSidebarComponent;
  let fixture: ComponentFixture<TraderSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TraderSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraderSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
