/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CrudReportService } from './crud-report.service';
import { NgbToastModule } from 'ngb-toast';

describe('Service: CrudReport', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgbToastModule],
      providers: [CrudReportService]
    });
  });

  it('should ...', inject([CrudReportService], (service: CrudReportService) => {
    expect(service).toBeTruthy();
  }));
});
