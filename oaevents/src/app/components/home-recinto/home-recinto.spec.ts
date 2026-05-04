import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeRecinto } from './home-recinto';

describe('HomeRecinto', () => {
  let component: HomeRecinto;
  let fixture: ComponentFixture<HomeRecinto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeRecinto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeRecinto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
