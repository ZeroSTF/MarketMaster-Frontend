import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourGamesComponent } from './your-games.component';

describe('YourGamesComponent', () => {
  let component: YourGamesComponent;
  let fixture: ComponentFixture<YourGamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YourGamesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
