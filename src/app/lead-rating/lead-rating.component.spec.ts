import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadRatingComponent } from './lead-rating.component';

describe('LeadRatingComponent', () => {
  let component: LeadRatingComponent;
  let fixture: ComponentFixture<LeadRatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadRatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
