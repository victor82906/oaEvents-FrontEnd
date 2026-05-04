import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmar } from './modal-confirmar';

describe('ModalConfirmar', () => {
  let component: ModalConfirmar;
  let fixture: ComponentFixture<ModalConfirmar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalConfirmar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalConfirmar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
