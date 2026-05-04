import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarValidador } from './buscar-validador';

describe('BuscarValidador', () => {
  let component: BuscarValidador;
  let fixture: ComponentFixture<BuscarValidador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscarValidador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscarValidador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
