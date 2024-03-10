import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SandboxesComponent } from './sandboxes.component';

describe('SandboxesComponent', () => {
  let component: SandboxesComponent;
  let fixture: ComponentFixture<SandboxesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SandboxesComponent]
    });
    fixture = TestBed.createComponent(SandboxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
