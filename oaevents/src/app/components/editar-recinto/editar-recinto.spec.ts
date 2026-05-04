import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarRecinto } from './editar-recinto';

describe('EditarRecinto', () => {
  let component: EditarRecinto;
  let fixture: ComponentFixture<EditarRecinto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarRecinto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarRecinto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
