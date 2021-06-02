import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SelfEditComponent} from './self-edit.component';

describe('SelfEditComponent', () => {
  let component: SelfEditComponent;
  let fixture: ComponentFixture<SelfEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelfEditComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
