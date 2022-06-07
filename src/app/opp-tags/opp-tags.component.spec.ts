import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OppTagsComponent } from './opp-tags.component';

describe('OppTagsComponent', () => {
  let component: OppTagsComponent;
  let fixture: ComponentFixture<OppTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OppTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OppTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
