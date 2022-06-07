import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesStagesComponent } from './sales-stages.component';

describe('SalesStagesComponent', () => {
  let component: SalesStagesComponent;
  let fixture: ComponentFixture<SalesStagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesStagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesStagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
