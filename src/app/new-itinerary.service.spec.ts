import { TestBed, inject } from '@angular/core/testing';

import { NewItineraryService } from './new-itinerary.service';

describe('NewItineraryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewItineraryService]
    });
  });

  it('should be created', inject([NewItineraryService], (service: NewItineraryService) => {
    expect(service).toBeTruthy();
  }));
});
