import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideRequest } from './ride-request';

describe('RideRequest', () => {
  let component: RideRequest;
  let fixture: ComponentFixture<RideRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RideRequest],
    }).compileComponents();

    fixture = TestBed.createComponent(RideRequest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
