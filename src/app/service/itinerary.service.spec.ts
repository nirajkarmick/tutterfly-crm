import { TestBed, inject } from '@angular/core/testing';

import { ItineraryService } from './form.service';

describe('ItineraryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItineraryService]
    });
  });

  it('should be created', inject([ItineraryService], (service: ItineraryService) => {
    expect(service).toBeTruthy();
  }));
});
