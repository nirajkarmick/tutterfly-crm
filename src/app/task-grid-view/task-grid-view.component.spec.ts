import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskGridViewComponent } from './task-grid-view.component';

describe('TaskGridViewComponent', () => {
  let component: TaskGridViewComponent;
  let fixture: ComponentFixture<TaskGridViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskGridViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
