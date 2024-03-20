import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CrudEmployeeService } from './crud-employee.service';
import { NgbToastModule } from 'ngb-toast';

describe('CrudEmployeeService', () => {
  let service: CrudEmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgbToastModule],
    });
    service = TestBed.inject(CrudEmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
