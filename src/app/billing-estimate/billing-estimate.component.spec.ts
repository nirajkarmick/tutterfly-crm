import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingEstimateComponent } from './billing-estimate.component';

describe('BillingEstimateComponent', () => {
  let component: BillingEstimateComponent;
  let fixture: ComponentFixture<BillingEstimateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingEstimateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingEstimateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
