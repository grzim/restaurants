import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddReviewResponseComponent} from './add-review-response.component';

describe('AddReviewResponseComponent', () => {
  let component: AddReviewResponseComponent;
  let fixture: ComponentFixture<AddReviewResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddReviewResponseComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReviewResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
