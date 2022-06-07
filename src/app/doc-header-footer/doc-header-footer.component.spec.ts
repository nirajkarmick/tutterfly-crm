import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocHeaderFooterComponent } from './doc-header-footer.component';

describe('DocHeaderFooterComponent', () => {
  let component: DocHeaderFooterComponent;
  let fixture: ComponentFixture<DocHeaderFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocHeaderFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocHeaderFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
