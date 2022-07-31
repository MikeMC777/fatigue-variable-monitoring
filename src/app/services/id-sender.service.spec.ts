/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { IdSenderService } from './id-sender.service';

describe('Service: IdSender', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IdSenderService]
    });
  });

  it('should ...', inject([IdSenderService], (service: IdSenderService) => {
    expect(service).toBeTruthy();
  }));
});
