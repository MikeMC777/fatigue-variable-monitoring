import { TestBed } from '@angular/core/testing';

import { CrudEmployeeService } from './crud-employee.service';

describe('CrudEmployeeService', () => {
  let service: CrudEmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudEmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
