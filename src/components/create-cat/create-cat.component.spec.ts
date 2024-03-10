import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCatComponent } from './create-cat.component';

describe('CreateCatComponent', () => {
  let component: CreateCatComponent;
  let fixture: ComponentFixture<CreateCatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateCatComponent]
    });
    fixture = TestBed.createComponent(CreateCatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
