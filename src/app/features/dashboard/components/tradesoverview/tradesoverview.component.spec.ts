import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradesoverviewComponent } from './tradesoverview.component';

describe('TradesoverviewComponent', () => {
  let component: TradesoverviewComponent;
  let fixture: ComponentFixture<TradesoverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradesoverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradesoverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
