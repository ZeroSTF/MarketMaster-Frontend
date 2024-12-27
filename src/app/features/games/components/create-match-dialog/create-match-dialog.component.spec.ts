import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMatchDialogComponent } from './create-match-dialog.component';

describe('CreateMatchDialogComponent', () => {
  let component: CreateMatchDialogComponent;
  let fixture: ComponentFixture<CreateMatchDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMatchDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMatchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
