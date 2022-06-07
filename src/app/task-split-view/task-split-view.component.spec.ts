import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskSplitViewComponent } from './task-split-view.component';

describe('TaskSplitViewComponent', () => {
  let component: TaskSplitViewComponent;
  let fixture: ComponentFixture<TaskSplitViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskSplitViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskSplitViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
