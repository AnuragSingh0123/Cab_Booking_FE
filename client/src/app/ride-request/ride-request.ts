import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Subject, debounceTime, switchMap, of } from 'rxjs';

import { RideService } from '../ride-service';
import { LocationService } from '../location-service';
import { BuildRouteService } from '../build-route-service';
import { AuthService } from '../auth-service';
import { MapRenderService } from '../map-render-service';
import { PopupService } from '../popup-service';

@Component({
  selector: 'app-ride-request',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './ride-request.html',
  styleUrl: './ride-request.css',
})
export class RideRequest {

  router = inject(Router);
  rideService = inject(RideService);
  locationService = inject(LocationService);
  buildRouteService=inject(BuildRouteService);
  authService=inject(AuthService);
  mapRender=inject(MapRenderService);
  notify=inject(PopupService);

  pickup = '';
  drop = '';

  pickupSuggestions: any[] = [];
  dropSuggestions: any[] = [];

  message=this.rideService.msg;

  pickupSubject = new Subject<string>();
  dropSubject = new Subject<string>();


  constructor() {
    effect(() => {
      const user = this.authService.user();

      if (user && user.role === 'driver') {
        this.router.navigate(['/driver-dashboard']);
      }
    });
  }

  ngOnInit() {
    this.pickupSubject.pipe(
  debounceTime(300),
  switchMap(value => {

    if (value.trim().length < 3) {
      return of([]);
    }

    return this.locationService.searchLocation(value);
  })
)
.subscribe({
  next: (res: any) => {
    this.pickupSuggestions = res || [];
  },
  error: () => {
    this.notify.show('Failed to search pickup location');
    this.pickupSuggestions = [];
  }
});


    this.dropSubject.pipe(
  debounceTime(300),
  switchMap(value => {
    if (value.trim().length < 3) {
      return of([]);
    }
    return this.locationService.searchLocation(value);
  })

)
.subscribe({
  next: (res: any) => {
    this.dropSuggestions = res || [];
  },

  error: () => {
    this.notify.show('Failed to search drop location');
    this.dropSuggestions = [];
  }
});
  }

  onPickupChange(value: string) {
    this.pickupSubject.next(value);
  }

  onDropChange(value: string) {
    this.dropSubject.next(value);
  }

  selectPickup(place: any) {
    this.pickup = place.display_name;
    this.pickupSuggestions = [];
  }

  selectDrop(place: any) {
    this.drop = place.display_name;
    this.dropSuggestions = [];
  }

  rideRequest() {

  this.rideService.mapLoading.set(true);

  this.buildRouteService.buildRoute(

    this.pickup,
    this.drop,

    (data: any) => {

      if (data.distanceKm > 60) {

        this.rideService.msg.set(
          "Sorry, we can’t process rides over 60 km"
        );

        this.rideService.mapLoading.set(false);

        return;
      }

      this.rideService.updateRide({

        pickup: this.pickup,
        drop: this.drop,

        pickUpCoordinates: [
          data.start.lat,
          data.start.lng
        ],

        dropCoordinates: [
          data.end.lat,
          data.end.lng
        ],

        distance: data.distanceKm,
        duration: data.durationMin
      });

      const latlngs =
        data.route.geometry.coordinates.map(
          (c: any) => [c[1], c[0]]
        );

      this.mapRender.drawRoute(
        latlngs,
        data.start,
        data.end
      );

      this.rideService.mapLoading.set(false);

      this.router.navigate(['vehicle']);
    }
  );
}
  
}