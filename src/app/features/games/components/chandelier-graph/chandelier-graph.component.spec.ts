import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChandelierGraphComponent } from './chandelier-graph.component';

describe('ChandelierGraphComponent', () => {
  let component: ChandelierGraphComponent;
  let fixture: ComponentFixture<ChandelierGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChandelierGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChandelierGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
