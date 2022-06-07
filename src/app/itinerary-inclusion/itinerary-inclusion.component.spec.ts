import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItineraryInclusionComponent } from './itinerary-inclusion.component';

describe('ItineraryInclusionComponent', () => {
  let component: ItineraryInclusionComponent;
  let fixture: ComponentFixture<ItineraryInclusionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItineraryInclusionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItineraryInclusionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
