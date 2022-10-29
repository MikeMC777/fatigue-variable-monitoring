import { TestBed } from '@angular/core/testing';

import { CrudFileReadingService } from './crud-file-reading.service';

describe('CrudFileReadingService', () => {
  let service: CrudFileReadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudFileReadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
