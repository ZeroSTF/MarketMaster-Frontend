import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingToolbarComponent } from './chart-toolbar.component';

describe('TradingToolbarComponent', () => {
  let component: TradingToolbarComponent;
  let fixture: ComponentFixture<TradingToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradingToolbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradingToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
