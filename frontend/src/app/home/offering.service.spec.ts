import { TestBed, inject } from '@angular/core/testing';

import { CusipService } from './cusip.service';

describe('CusipService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CusipService]
    });
  });

  it('should be created', inject([CusipService], (service: CusipService) => {
    expect(service).toBeTruthy();
  }));
});
