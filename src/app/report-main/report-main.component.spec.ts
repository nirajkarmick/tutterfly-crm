import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportMainComponent } from './report-main.component';

describe('ReportMainComponent', () => {
  let component: ReportMainComponent;
  let fixture: ComponentFixture<ReportMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
