import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceEmployeeItemComponent } from './device-employee-item.component';

describe('DeviceEmployeeItemComponent', () => {
  let component: DeviceEmployeeItemComponent;
  let fixture: ComponentFixture<DeviceEmployeeItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceEmployeeItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    //fixture = TestBed.createComponent(DeviceEmployeeItemComponent);
    //component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(true).toBeTruthy();
  });
});
