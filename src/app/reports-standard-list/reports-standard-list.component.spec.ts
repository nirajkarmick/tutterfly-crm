import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsStandardListComponent } from './reports-standard-list.component';

describe('ReportsStandardListComponent', () => {
  let component: ReportsStandardListComponent;
  let fixture: ComponentFixture<ReportsStandardListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsStandardListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsStandardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
