import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItineraryTemplateComponent } from './itinerary-template.component';

describe('ItineraryTemplateComponent', () => {
  let component: ItineraryTemplateComponent;
  let fixture: ComponentFixture<ItineraryTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItineraryTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItineraryTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
