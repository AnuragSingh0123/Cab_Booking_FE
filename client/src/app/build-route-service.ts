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

  buildRoute(pickup: string, drop: string) {

    return this.locationService.searchLocation(pickup).pipe(

      switchMap((startRes: any) => {

        const start = {
          lat: +startRes[0].lat,
          lng: +startRes[0].lon
        };

        return this.locationService.searchLocation(drop).pipe(

          switchMap((endRes: any) => {

            const end = {
              lat: +endRes[0].lat,
              lng: +endRes[0].lon
            };

            return this.routeService.getRoute(start, end).pipe(

              map((routeRes: any) => {

                const route = routeRes.routes[0];

                return {
                  start,
                  end,
                  route,
                  distanceKm: +(route.distance / 1000).toFixed(2),
                  durationMin: +(route.duration / 60).toFixed(0)
                };
              })
            );
          })
        );
      })
    );
  }
}
