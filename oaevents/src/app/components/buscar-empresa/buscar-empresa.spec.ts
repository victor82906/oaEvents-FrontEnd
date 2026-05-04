import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarEmpresa } from './buscar-empresa';

describe('BuscarEmpresa', () => {
  let component: BuscarEmpresa;
  let fixture: ComponentFixture<BuscarEmpresa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscarEmpresa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscarEmpresa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
