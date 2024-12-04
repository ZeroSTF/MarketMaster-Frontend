import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickMatchComponent } from './quick-match.component';

describe('QuickMatchComponent', () => {
  let component: QuickMatchComponent;
  let fixture: ComponentFixture<QuickMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickMatchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
