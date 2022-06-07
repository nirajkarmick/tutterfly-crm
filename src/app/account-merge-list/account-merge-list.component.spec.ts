import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountMergeListComponent } from './account-merge-list.component';

describe('AccountMergeListComponent', () => {
  let component: AccountMergeListComponent;
  let fixture: ComponentFixture<AccountMergeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountMergeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountMergeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
