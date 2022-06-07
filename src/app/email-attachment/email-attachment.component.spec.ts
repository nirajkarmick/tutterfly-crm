import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailAttachmentComponent } from './email-attachment.component';

describe('EmailAttachmentComponent', () => {
  let component: EmailAttachmentComponent;
  let fixture: ComponentFixture<EmailAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailAttachmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
