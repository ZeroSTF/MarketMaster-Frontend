import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchlistoverviewComponent } from '../whitelistoverview/watchListoverview.component';

describe('WatchlistoverviewComponent', () => {
  let component: WatchlistoverviewComponent;
  let fixture: ComponentFixture<WatchlistoverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatchlistoverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WatchlistoverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
