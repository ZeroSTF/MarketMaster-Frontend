import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioPerformanceComponent } from './portfolio-performance.component';

describe('PortfolioPerformanceComponent', () => {
  let component: PortfolioPerformanceComponent;
  let fixture: ComponentFixture<PortfolioPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioPerformanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
