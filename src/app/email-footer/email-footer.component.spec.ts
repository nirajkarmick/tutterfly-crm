import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailFooterComponent } from './email-footer.component';

describe('EmailFooterComponent', () => {
  let component: EmailFooterComponent;
  let fixture: ComponentFixture<EmailFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
