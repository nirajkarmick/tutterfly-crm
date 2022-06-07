import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OppoStagesComponent } from './oppo-stages.component';

describe('OppoStagesComponent', () => {
  let component: OppoStagesComponent;
  let fixture: ComponentFixture<OppoStagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OppoStagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OppoStagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
