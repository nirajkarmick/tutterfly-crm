import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OppurtunityGridComponent } from './opportunity-grid.component';

describe('OppurtunityGridComponent', () => {
  let component: OppurtunityGridComponent;
  let fixture: ComponentFixture<OppurtunityGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OppurtunityGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OppurtunityGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
