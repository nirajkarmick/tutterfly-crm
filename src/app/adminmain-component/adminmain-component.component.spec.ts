import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminmainComponentComponent } from './adminmain-component.component';

describe('AdminmainComponentComponent', () => {
  let component: AdminmainComponentComponent;
  let fixture: ComponentFixture<AdminmainComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminmainComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminmainComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
