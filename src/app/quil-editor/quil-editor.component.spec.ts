import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuilEditorComponent } from './quil-editor.component';

describe('QuilEditorComponent', () => {
  let component: QuilEditorComponent;
  let fixture: ComponentFixture<QuilEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuilEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuilEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
