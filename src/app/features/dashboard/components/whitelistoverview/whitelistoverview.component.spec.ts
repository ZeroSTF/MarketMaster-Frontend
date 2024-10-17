import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhitelistoverviewComponent } from './whitelistoverview.component';

describe('WhitelistoverviewComponent', () => {
  let component: WhitelistoverviewComponent;
  let fixture: ComponentFixture<WhitelistoverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhitelistoverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhitelistoverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
