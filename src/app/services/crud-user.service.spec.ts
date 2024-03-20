import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CrudUserService } from './crud-user.service';
import { NgbToastModule } from 'ngb-toast';

describe('CrudUserService', () => {
  let service: CrudUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgbToastModule],
    });
    service = TestBed.inject(CrudUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
