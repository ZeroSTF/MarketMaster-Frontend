import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioWatchlistComponent } from './portfolio-watchlist.component';

describe('PortfolioWatchlistComponent', () => {
  let component: PortfolioWatchlistComponent;
  let fixture: ComponentFixture<PortfolioWatchlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioWatchlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioWatchlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
