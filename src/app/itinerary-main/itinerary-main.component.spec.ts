import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItineraryMainComponent } from './itinerary-main.component';

describe('ItineraryMainComponent', () => {
  let component: ItineraryMainComponent;
  let fixture: ComponentFixture<ItineraryMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItineraryMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItineraryMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
