import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FoldIconComponent} from './fold-icon.component';

describe('FoldIconComponent', () => {
  let component: FoldIconComponent;
  let fixture: ComponentFixture<FoldIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FoldIconComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FoldIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
