import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddReviewResponseDialogComponent} from './add-review-response-dialog.component';

describe('AddReviewResponseDialogComponent', () => {
  let component: AddReviewResponseDialogComponent;
  let fixture: ComponentFixture<AddReviewResponseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddReviewResponseDialogComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReviewResponseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
