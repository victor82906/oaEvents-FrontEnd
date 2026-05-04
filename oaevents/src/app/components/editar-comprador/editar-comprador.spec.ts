import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarComprador } from './editar-comprador';

describe('EditarComprador', () => {
  let component: EditarComprador;
  let fixture: ComponentFixture<EditarComprador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarComprador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarComprador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
