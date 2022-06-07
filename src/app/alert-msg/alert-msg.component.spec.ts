import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertMsgComponent } from './alert-msg.component';

describe('AlertMsgComponent', () => {
  let component: AlertMsgComponent;
  let fixture: ComponentFixture<AlertMsgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertMsgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
