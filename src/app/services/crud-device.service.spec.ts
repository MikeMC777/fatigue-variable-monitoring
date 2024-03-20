import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CrudDeviceService } from './crud-device.service';
import { NgbToastModule } from 'ngb-toast';

describe('CrudDeviceService', () => {
  let service: CrudDeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgbToastModule]
    });
    service = TestBed.inject(CrudDeviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
