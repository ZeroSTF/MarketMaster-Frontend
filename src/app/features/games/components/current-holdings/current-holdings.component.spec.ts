import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentHoldingsComponent } from './current-holdings.component';

describe('CurrentHoldingsComponent', () => {
  let component: CurrentHoldingsComponent;
  let fixture: ComponentFixture<CurrentHoldingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentHoldingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentHoldingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
