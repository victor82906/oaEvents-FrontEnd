import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventosEmpresa } from './eventos-empresa';

describe('EventosEmpresa', () => {
  let component: EventosEmpresa;
  let fixture: ComponentFixture<EventosEmpresa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventosEmpresa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventosEmpresa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
