import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadStaComponent } from './lead-sta.component';

describe('LeadStaComponent', () => {
  let component: LeadStaComponent;
  let fixture: ComponentFixture<LeadStaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadStaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadStaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
