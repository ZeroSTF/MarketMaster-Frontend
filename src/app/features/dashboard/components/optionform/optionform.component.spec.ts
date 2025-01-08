import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionformComponent } from './optionform.component';

describe('OptionformComponent', () => {
  let component: OptionformComponent;
  let fixture: ComponentFixture<OptionformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
