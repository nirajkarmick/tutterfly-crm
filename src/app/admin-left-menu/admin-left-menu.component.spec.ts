import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLeftMenuComponent } from './admin-left-menu.component';

describe('AdminLeftMenuComponent', () => {
  let component: AdminLeftMenuComponent;
  let fixture: ComponentFixture<AdminLeftMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminLeftMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLeftMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
