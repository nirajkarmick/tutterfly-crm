import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewItineraryDetailsComponent } from './new-itinerary-details.component';

describe('NewItineraryDetailsComponent', () => {
  let component: NewItineraryDetailsComponent;
  let fixture: ComponentFixture<NewItineraryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewItineraryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewItineraryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
