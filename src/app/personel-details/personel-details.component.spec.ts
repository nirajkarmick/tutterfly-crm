import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonelDetailsComponent } from './personel-details.component';

describe('PersonelDetailsComponent', () => {
  let component: PersonelDetailsComponent;
  let fixture: ComponentFixture<PersonelDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonelDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonelDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
