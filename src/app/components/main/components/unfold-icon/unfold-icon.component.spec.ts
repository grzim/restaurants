import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UnfoldIconComponent} from './unfold-icon.component';

describe('UnfoldIconComponent', () => {
  let component: UnfoldIconComponent;
  let fixture: ComponentFixture<UnfoldIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnfoldIconComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnfoldIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
