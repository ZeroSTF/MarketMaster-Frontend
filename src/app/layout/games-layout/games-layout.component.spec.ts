import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesLayoutComponent } from './games-layout.component';

describe('GamesLayoutComponent', () => {
  let component: GamesLayoutComponent;
  let fixture: ComponentFixture<GamesLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamesLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamesLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
