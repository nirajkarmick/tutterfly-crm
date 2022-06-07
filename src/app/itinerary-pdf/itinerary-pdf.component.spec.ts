import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItineraryPdfComponent } from './itinerary-pdf.component';

describe('ItineraryPdfComponent', () => {
  let component: ItineraryPdfComponent;
  let fixture: ComponentFixture<ItineraryPdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItineraryPdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItineraryPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
