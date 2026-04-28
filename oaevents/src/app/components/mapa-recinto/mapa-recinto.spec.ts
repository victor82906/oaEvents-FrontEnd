import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaRecinto } from './mapa-recinto';

describe('MapaRecinto', () => {
  let component: MapaRecinto;
  let fixture: ComponentFixture<MapaRecinto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapaRecinto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapaRecinto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
