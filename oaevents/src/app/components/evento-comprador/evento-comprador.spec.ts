import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventoComprador } from './evento-comprador';

describe('EventoComprador', () => {
  let component: EventoComprador;
  let fixture: ComponentFixture<EventoComprador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventoComprador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventoComprador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
