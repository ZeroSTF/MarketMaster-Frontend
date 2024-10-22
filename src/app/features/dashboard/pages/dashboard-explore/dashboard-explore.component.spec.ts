import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardExploreComponent } from './dashboard-explore.component';

describe('DashboardExploreComponent', () => {
  let component: DashboardExploreComponent;
  let fixture: ComponentFixture<DashboardExploreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardExploreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardExploreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
