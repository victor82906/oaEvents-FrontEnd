import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComprador } from './home-comprador';

describe('HomeComprador', () => {
  let component: HomeComprador;
  let fixture: ComponentFixture<HomeComprador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComprador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComprador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
