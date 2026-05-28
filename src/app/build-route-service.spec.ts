import { TestBed } from '@angular/core/testing';

import { BuildRouteService } from './build-route-service';

describe('BuildRouteService', () => {
  let service: BuildRouteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuildRouteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
