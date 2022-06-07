import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderDetailsComponent } from './leader-details.component';

describe('LeaderDetailsComponent', () => {
  let component: LeaderDetailsComponent;
  let fixture: ComponentFixture<LeaderDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaderDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
