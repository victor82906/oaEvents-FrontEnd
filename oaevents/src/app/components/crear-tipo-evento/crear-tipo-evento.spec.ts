import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearTipoEvento } from './crear-tipo-evento';

describe('CrearTipoEvento', () => {
  let component: CrearTipoEvento;
  let fixture: ComponentFixture<CrearTipoEvento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearTipoEvento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearTipoEvento);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
