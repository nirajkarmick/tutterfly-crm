import { TestBed, inject } from '@angular/core/testing';

import { AccountsMapService } from './accounts-map.service';

describe('AccountsMapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountsMapService]
    });
  });

  it('should be created', inject([AccountsMapService], (service: AccountsMapService) => {
    expect(service).toBeTruthy();
  }));
});
