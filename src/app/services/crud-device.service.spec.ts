import { TestBed } from '@angular/core/testing';

import { CrudDeviceService } from './crud-device.service';

describe('CrudDeviceService', () => {
  let service: CrudDeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudDeviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
