import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CrudTemplateService } from './crud-template.service';
import { NgbToastModule } from 'ngb-toast';

describe('CrudTemplateService', () => {
  let service: CrudTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgbToastModule]
    });
    service = TestBed.inject(CrudTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
