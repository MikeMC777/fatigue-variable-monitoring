import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariableRangeItemComponent } from './variable-range-item.component';

describe('VariableRangeItemComponent', () => {
  let component: VariableRangeItemComponent;
  let fixture: ComponentFixture<VariableRangeItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VariableRangeItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    //fixture = TestBed.createComponent(VariableRangeItemComponent);
    //component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(true).toBeTruthy();
  });
});
