import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OppoDestinationComponent } from './oppo-destination.component';

describe('OppoDestinationComponent', () => {
  let component: OppoDestinationComponent;
  let fixture: ComponentFixture<OppoDestinationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OppoDestinationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OppoDestinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
