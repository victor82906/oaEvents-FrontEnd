import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarEventos } from './gestionar-eventos';

describe('GestionarEventos', () => {
  let component: GestionarEventos;
  let fixture: ComponentFixture<GestionarEventos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarEventos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarEventos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
