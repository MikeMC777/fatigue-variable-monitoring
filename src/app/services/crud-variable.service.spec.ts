import { TestBed } from '@angular/core/testing';

import { CrudVariableService } from './crud-variable.service';

describe('CrudVariableService', () => {
  let service: CrudVariableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudVariableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
