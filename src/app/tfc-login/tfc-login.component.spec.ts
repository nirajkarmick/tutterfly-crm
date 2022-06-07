import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TfcLoginComponent } from './tfc-login.component';

describe('TfcLoginComponent', () => {
  let component: TfcLoginComponent;
  let fixture: ComponentFixture<TfcLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TfcLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TfcLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
