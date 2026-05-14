import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarEvento } from './editar-evento';

describe('EditarEvento', () => {
  let component: EditarEvento;
  let fixture: ComponentFixture<EditarEvento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarEvento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarEvento);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
