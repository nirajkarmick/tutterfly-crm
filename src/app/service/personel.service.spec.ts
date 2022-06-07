import { TestBed, inject } from '@angular/core/testing';

import { PersonelService } from './personel.service';

describe('PersonelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PersonelService]
    });
  });

  it('should be created', inject([PersonelService], (service: PersonelService) => {
    expect(service).toBeTruthy();
  }));
});
