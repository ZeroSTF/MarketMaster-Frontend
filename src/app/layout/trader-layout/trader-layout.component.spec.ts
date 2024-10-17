import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraderLayoutComponent } from './trader-layout.component';

describe('TraderLayoutComponent', () => {
  let component: TraderLayoutComponent;
  let fixture: ComponentFixture<TraderLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TraderLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraderLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
