import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountMergeComponent } from './account-merge.component';

describe('AccountMergeComponent', () => {
  let component: AccountMergeComponent;
  let fixture: ComponentFixture<AccountMergeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountMergeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountMergeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
