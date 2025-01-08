import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorParametersDialogComponent } from './indicator-parameters-dialog.component';

describe('IndicatorParametersDialogComponent', () => {
  let component: IndicatorParametersDialogComponent;
  let fixture: ComponentFixture<IndicatorParametersDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndicatorParametersDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndicatorParametersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
