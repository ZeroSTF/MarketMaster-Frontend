import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionSidebarComponent } from './option-sidebar.component';

describe('OptionSidebarComponent', () => {
  let component: OptionSidebarComponent;
  let fixture: ComponentFixture<OptionSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
