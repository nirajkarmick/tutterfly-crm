import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierTemplateComponent } from './supplier-template.component';

describe('SupplierTemplateComponent', () => {
  let component: SupplierTemplateComponent;
  let fixture: ComponentFixture<SupplierTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
