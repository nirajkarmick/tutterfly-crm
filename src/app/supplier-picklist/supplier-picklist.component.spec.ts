import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPicklistComponent } from './supplier-picklist.component';

describe('SupplierPicklistComponent', () => {
  let component: SupplierPicklistComponent;
  let fixture: ComponentFixture<SupplierPicklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierPicklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierPicklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
