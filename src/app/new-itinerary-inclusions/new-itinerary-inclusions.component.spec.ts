import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewItineraryInclusionsComponent } from './new-itinerary-inclusions.component';

describe('NewItineraryInclusionsComponent', () => {
  let component: NewItineraryInclusionsComponent;
  let fixture: ComponentFixture<NewItineraryInclusionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewItineraryInclusionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewItineraryInclusionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
