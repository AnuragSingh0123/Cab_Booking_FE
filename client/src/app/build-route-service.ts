import { inject, Injectable } from '@angular/core';
import { RouteService } from './route-service';
import { MapRenderService } from './map-render-service';
import { Router } from '@angular/router';
import { RideService } from './ride-service';
import { LocationService } from './location-service';

@Injectable({
  providedIn: 'root',
})
export class BuildRouteService {

  rideService = inject(RideService);
  routeService = inject(RouteService);
  mapRender = inject(MapRenderService);
  router = inject(Router);
  locationService = inject(LocationService);

  buildRoute(pickup: string, drop: string) {
    this.rideService.mapLoading.set(true);


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

        this.routeService.getRoute(start, end).subscribe((res: any) => {
          const route = res.routes[0];

          const pickUpCoordinates = [start.lat, start.lng];
          const dropCoordinates = [end.lat, end.lng];
          const distanceKm = (route.distance / 1000).toFixed(2);
          const durationMin = (route.duration / 60).toFixed(0);


          if (Number(distanceKm) > 60) {
            this.rideService.msg.set("Sorry, we can’t process rides over 60 km");
            this.rideService.mapLoading.set(false);
            setTimeout(() => {
              this.rideService.msg.set('');
            }, 3000);
            return;
          }

          this.rideService.updateRide({
            pickUpCoordinates: pickUpCoordinates,
            dropCoordinates: dropCoordinates,
            distance: distanceKm,
            duration: durationMin,
          });


          const latlngs = route.geometry.coordinates.map(
            (c: any) => [c[1], c[0]]
          );

          this.mapRender.drawRoute(latlngs, start, end);

          this.rideService.mapLoading.set(false);
          this.router.navigate(['vehicle']);
        });
      });
    });
  }

}
