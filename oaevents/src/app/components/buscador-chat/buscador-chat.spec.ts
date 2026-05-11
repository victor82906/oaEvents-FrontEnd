import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorChat } from './buscador-chat';

describe('BuscadorChat', () => {
  let component: BuscadorChat;
  let fixture: ComponentFixture<BuscadorChat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscadorChat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscadorChat);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
