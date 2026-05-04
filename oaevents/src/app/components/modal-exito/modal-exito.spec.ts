import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalExito } from './modal-exito';

describe('ModalExito', () => {
  let component: ModalExito;
  let fixture: ComponentFixture<ModalExito>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalExito]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalExito);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
