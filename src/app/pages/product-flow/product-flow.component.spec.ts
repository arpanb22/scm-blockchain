import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFlowComponent } from './product-flow.component';

describe('ProductFlowComponent', () => {
  let component: ProductFlowComponent;
  let fixture: ComponentFixture<ProductFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductFlowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
