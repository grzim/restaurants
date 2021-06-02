import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReviewDialogComponent } from './edit-review-dialog.component';

describe('EditReviewDialogComponent', () => {
  let component: EditReviewDialogComponent;
  let fixture: ComponentFixture<EditReviewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditReviewDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditReviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
