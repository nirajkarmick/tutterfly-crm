import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OppoInclusionsComponent } from './oppo-inclusions.component';

describe('OppoInclusionsComponent', () => {
  let component: OppoInclusionsComponent;
  let fixture: ComponentFixture<OppoInclusionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OppoInclusionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OppoInclusionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
