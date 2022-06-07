import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OppoExperienceComponent } from './oppo-experience.component';

describe('OppoExperienceComponent', () => {
  let component: OppoExperienceComponent;
  let fixture: ComponentFixture<OppoExperienceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OppoExperienceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OppoExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
