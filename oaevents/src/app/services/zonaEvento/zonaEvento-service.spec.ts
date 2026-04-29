import { TestBed } from '@angular/core/testing';

import { ZonaEventoService } from './zonaEvento-service';

describe('ZonaEventoService', () => {
  let service: ZonaEventoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZonaEventoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
