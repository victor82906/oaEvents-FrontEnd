import { TestBed } from '@angular/core/testing';

import RecintoService from './recinto-service';

describe('RecintoService', () => {
  let service: RecintoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecintoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
