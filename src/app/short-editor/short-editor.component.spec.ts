import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortEditorComponent } from './short-editor.component';

describe('ShortEditorComponent', () => {
  let component: ShortEditorComponent;
  let fixture: ComponentFixture<ShortEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShortEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
