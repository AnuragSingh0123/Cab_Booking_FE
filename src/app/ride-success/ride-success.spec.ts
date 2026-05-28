import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideSuccess } from './ride-success';

describe('RideSuccess', () => {
  let component: RideSuccess;
  let fixture: ComponentFixture<RideSuccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RideSuccess],
    }).compileComponents();

    fixture = TestBed.createComponent(RideSuccess);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
