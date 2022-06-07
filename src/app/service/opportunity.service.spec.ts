import { TestBed, inject } from '@angular/core/testing';

import { OppurtunityService } from './opportunity.service';

describe('OppurtunityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OppurtunityService]
    });
  });

  it('should be created', inject([OppurtunityService], (service: OppurtunityService) => {
    expect(service).toBeTruthy();
  }));
});
