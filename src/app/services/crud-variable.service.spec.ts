import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CrudVariableService } from './crud-variable.service';
import { NgbToastModule } from 'ngb-toast';

describe('CrudVariableService', () => {
  let service: CrudVariableService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgbToastModule],
    });
    service = TestBed.inject(CrudVariableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
