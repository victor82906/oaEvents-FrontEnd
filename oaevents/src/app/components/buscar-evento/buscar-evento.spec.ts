import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarEvento } from './buscar-evento';

describe('BuscarEvento', () => {
  let component: BuscarEvento;
  let fixture: ComponentFixture<BuscarEvento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscarEvento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscarEvento);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
