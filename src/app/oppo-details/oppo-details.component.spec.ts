import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OppoDetailsComponent } from './oppo-details.component';

describe('OppoDetailsComponent', () => {
  let component: OppoDetailsComponent;
  let fixture: ComponentFixture<OppoDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OppoDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OppoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
