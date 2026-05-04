import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarValidador } from './editar-validador';

describe('EditarValidador', () => {
  let component: EditarValidador;
  let fixture: ComponentFixture<EditarValidador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarValidador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarValidador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
