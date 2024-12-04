import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamerSidebarComponent } from './gamer-sidebar.component';

describe('GamerSidebarComponent', () => {
  let component: GamerSidebarComponent;
  let fixture: ComponentFixture<GamerSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamerSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamerSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
