import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSandboxComponent } from './modal-sandbox.component';

describe('ModalSandboxComponent', () => {
  let component: ModalSandboxComponent;
  let fixture: ComponentFixture<ModalSandboxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalSandboxComponent]
    });
    fixture = TestBed.createComponent(ModalSandboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
