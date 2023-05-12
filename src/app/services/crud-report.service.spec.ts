/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CrudReportService } from './crud-report.service';

describe('Service: CrudReport', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CrudReportService]
    });
  });

  it('should ...', inject([CrudReportService], (service: CrudReportService) => {
    expect(service).toBeTruthy();
  }));
});
