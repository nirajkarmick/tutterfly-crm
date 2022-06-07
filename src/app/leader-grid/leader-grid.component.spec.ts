import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderGridComponent } from './leader-grid.component';

describe('LeaderGridComponent', () => {
  let component: LeaderGridComponent;
  let fixture: ComponentFixture<LeaderGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaderGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaderGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
