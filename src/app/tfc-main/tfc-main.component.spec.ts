import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TfcMainComponent } from './tfc-main.component';

describe('TfcMainComponent', () => {
  let component: TfcMainComponent;
  let fixture: ComponentFixture<TfcMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TfcMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TfcMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
