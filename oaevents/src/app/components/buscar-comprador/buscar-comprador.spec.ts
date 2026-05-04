import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarComprador } from './buscar-comprador';

describe('BuscarComprador', () => {
  let component: BuscarComprador;
  let fixture: ComponentFixture<BuscarComprador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscarComprador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscarComprador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
