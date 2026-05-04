import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroComprador } from './registro-comprador';

describe('RegistroComprador', () => {
  let component: RegistroComprador;
  let fixture: ComponentFixture<RegistroComprador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroComprador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroComprador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
