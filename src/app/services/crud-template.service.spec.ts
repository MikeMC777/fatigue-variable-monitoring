import { TestBed } from '@angular/core/testing';

import { CrudTemplateService } from './crud-template.service';

describe('CrudTemplateService', () => {
  let service: CrudTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
