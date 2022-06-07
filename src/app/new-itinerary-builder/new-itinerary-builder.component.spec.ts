import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewItineraryBuilderComponent } from './new-itinerary-builder.component';

describe('NewItineraryBuilderComponent', () => {
  let component: NewItineraryBuilderComponent;
  let fixture: ComponentFixture<NewItineraryBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewItineraryBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewItineraryBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
