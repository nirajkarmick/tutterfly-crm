import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewItineraryHotelComponent } from './new-itinerary-hotel.component';

describe('NewItineraryHotelComponent', () => {
  let component: NewItineraryHotelComponent;
  let fixture: ComponentFixture<NewItineraryHotelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewItineraryHotelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewItineraryHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
