import { inject, Injectable } from '@angular/core';
import { RouteService } from './route-service';
import { LocationService } from './location-service';
import { map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BuildRouteService {
  locationService = inject(LocationService);
  routeService = inject(RouteService);

  buildRoute(pickup: string, drop: string, callback: (data: any) => void) {
    this.locationService.searchLocation(pickup).subscribe((startRes: any) => {
      const start = {
        lat: +startRes[0].lat,
        lng: +startRes[0].lon,
      };

      this.locationService.searchLocation(drop).subscribe((endRes: any) => {
        const end = {
          lat: +endRes[0].lat,
          lng: +endRes[0].lon,
        };

        this.routeService.getRoute(start, end).subscribe((routeRes: any) => {
          const route = routeRes.routes[0];

          const result = {
            start,
            end,
            route,
            distanceKm: +(route.distance / 1000).toFixed(2),
            durationMin: +(route.duration / 60).toFixed(0),
          };

          callback(result);
        });
      });
    });
  }
}
