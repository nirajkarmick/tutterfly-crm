import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditReportComponent } from './add-edit-report.component';

describe('AddEditReportComponent', () => {
  let component: AddEditReportComponent;
  let fixture: ComponentFixture<AddEditReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
