import { TestBed, inject } from '@angular/core/testing';

import { ExtraService } from './form.service';

describe('ExtraService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExtraService]
    });
  });

  it('should be created', inject([ExtraService], (service: ExtraService) => {
    expect(service).toBeTruthy();
  }));
});
