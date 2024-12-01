import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetSelectorComponent } from './asset-selector.component';

describe('AssetSelectorComponent', () => {
  let component: AssetSelectorComponent;
  let fixture: ComponentFixture<AssetSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
