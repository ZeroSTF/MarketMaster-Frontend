import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewdetailsComponent } from './overviewdetails.component';

describe('OverviewdetailsComponent', () => {
  let component: OverviewdetailsComponent;
  let fixture: ComponentFixture<OverviewdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewdetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverviewdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
