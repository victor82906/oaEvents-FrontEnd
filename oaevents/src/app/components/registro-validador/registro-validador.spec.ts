import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroValidador } from './registro-validador';

describe('RegistroValidador', () => {
  let component: RegistroValidador;
  let fixture: ComponentFixture<RegistroValidador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroValidador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroValidador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
