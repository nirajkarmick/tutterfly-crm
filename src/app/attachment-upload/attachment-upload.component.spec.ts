import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentUploadComponent } from './attachment-upload.component';

describe('AttachmentUploadComponent', () => {
  let component: AttachmentUploadComponent;
  let fixture: ComponentFixture<AttachmentUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachmentUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
