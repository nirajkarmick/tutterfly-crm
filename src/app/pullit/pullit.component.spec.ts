import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PullitComponent } from './pullit.component';

describe('PullitComponent', () => {
  let component: PullitComponent;
  let fixture: ComponentFixture<PullitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PullitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PullitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
