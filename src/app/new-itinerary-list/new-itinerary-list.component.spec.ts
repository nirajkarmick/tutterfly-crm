import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewItineraryListComponent } from './new-itinerary-list.component';

describe('NewItineraryListComponent', () => {
  let component: NewItineraryListComponent;
  let fixture: ComponentFixture<NewItineraryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewItineraryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewItineraryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
