import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CrudFileReadingService } from './crud-file-reading.service';
import { NgbToastModule } from 'ngb-toast';

describe('CrudFileReadingService', () => {
  let service: CrudFileReadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgbToastModule]
    });
    service = TestBed.inject(CrudFileReadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
