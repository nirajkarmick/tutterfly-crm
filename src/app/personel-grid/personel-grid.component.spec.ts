import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonelGridComponent } from './personel-grid.component';

describe('PersonelGridComponent', () => {
  let component: PersonelGridComponent;
  let fixture: ComponentFixture<PersonelGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonelGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonelGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
