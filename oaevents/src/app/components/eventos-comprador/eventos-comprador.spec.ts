import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventosComprador } from './eventos-comprador';

describe('EventosComprador', () => {
  let component: EventosComprador;
  let fixture: ComponentFixture<EventosComprador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventosComprador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventosComprador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
