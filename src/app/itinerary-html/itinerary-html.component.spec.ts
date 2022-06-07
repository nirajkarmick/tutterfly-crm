import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItineraryHtmlComponent } from './itinerary-html.component';

describe('ItineraryHtmlComponent', () => {
  let component: ItineraryHtmlComponent;
  let fixture: ComponentFixture<ItineraryHtmlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItineraryHtmlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItineraryHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
