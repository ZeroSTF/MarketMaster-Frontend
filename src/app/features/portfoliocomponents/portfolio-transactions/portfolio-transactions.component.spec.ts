import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioTransactionsComponent } from './portfolio-transactions.component';

describe('PortfolioTransactionsComponent', () => {
  let component: PortfolioTransactionsComponent;
  let fixture: ComponentFixture<PortfolioTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioTransactionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
