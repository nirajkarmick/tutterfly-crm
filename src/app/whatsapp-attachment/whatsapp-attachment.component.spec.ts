import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappAttachmentComponent } from './whatsapp-attachment.component';

describe('WhatsappAttachmentComponent', () => {
  let component: WhatsappAttachmentComponent;
  let fixture: ComponentFixture<WhatsappAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhatsappAttachmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatsappAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
