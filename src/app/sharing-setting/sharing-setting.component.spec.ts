import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharingSettingComponent } from './sharing-setting.component';

describe('SharingSettingComponent', () => {
  let component: SharingSettingComponent;
  let fixture: ComponentFixture<SharingSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharingSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharingSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
