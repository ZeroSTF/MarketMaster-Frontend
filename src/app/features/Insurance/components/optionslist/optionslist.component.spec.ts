import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionslistComponent } from './optionslist.component';

describe('OptionslistComponent', () => {
  let component: OptionslistComponent;
  let fixture: ComponentFixture<OptionslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionslistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
