import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadCaptureComponent } from './lead-capture.component';

describe('LeadCaptureComponent', () => {
  let component: LeadCaptureComponent;
  let fixture: ComponentFixture<LeadCaptureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadCaptureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
