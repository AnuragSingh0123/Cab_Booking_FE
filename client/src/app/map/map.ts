import { HttpClient } from '@angular/common/http';
import { Component, effect, inject, signal } from '@angular/core';
import * as L from 'leaflet';
import { RideService } from '../ride-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Map {

  private rideService = inject(RideService);
  private http = inject(HttpClient);

  loading = this.rideService.mapLoading;

  router=inject(Router);

  map: any;

  routeLine: any;
  pickupMarker: any;
  dropMarker: any;

  pickup: string = '';
  drop: string = '';

  apiKey = 'pk.2291756e6d48580b693a0848389717a5';

  constructor() {
  let lastPickup = '';
  let lastDrop = '';

  effect(() => {
    const ride = this.rideService.booking();

    if (!this.map) return;
    if (!ride.pickup || !ride.drop) return;

    if (
      ride.pickup === lastPickup &&
      ride.drop === lastDrop
    ) {
      return;
    }

    lastPickup = ride.pickup;
    lastDrop = ride.drop;

    this.getRouteFromNames(
      ride.pickup,
      ride.drop
    );
  });
}

  ngAfterViewInit() {
    this.map = L.map('map').setView([13.0475, 77.6200], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
      .addTo(this.map);

    const ride = this.rideService.booking();

  if (ride.pickup && ride.drop) {
    this.getRouteFromNames(
      ride.pickup,
      ride.drop
    );
  }
  }

  //Convert place → coordinates
  getCoordinates(place: string) {
    const url = `https://us1.locationiq.com/v1/search?key=${this.apiKey}&q=${place}&format=json`;
    return this.http.get(url);
  }

  //Get route
  getRoute(start: any, end: any) {
    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${start.lng},${start.lat};${end.lng},${end.lat}` +
      `?overview=full&geometries=geojson`;

    this.http.get(url).subscribe({
      next:(res: any) => {
      const route = res.routes[0];

      const distanceKm = (route.distance / 1000).toFixed(2);
      const durationMin = (route.duration / 60).toFixed(0);

      this.rideService.updateRide({
        distance: distanceKm,
        duration: durationMin
      });
      this.rideService.setRideDetails(distanceKm,durationMin);

      console.log('Distance:', distanceKm, 'km');
      console.log('Time:', durationMin, 'minutes');

      const coords = route.geometry.coordinates;

      // [lng, lat] → [lat, lng]
      const latlngs = coords.map((c: any) => [c[1], c[0]]);

      this.drawRoute(latlngs, start, end);
    },
    error: (err) => {
      console.log("Route Api Failed", err);
      this.rideService.setLoading(false);
      this.rideService.setMsg("Router API Failed");
    }
    });
  }

  // Draw route
  drawRoute(latlngs: any, start: any, end: any) {
  // remove old route
  if (this.routeLine) {
    this.map.removeLayer(this.routeLine);
  }

  if (this.pickupMarker) {
    this.map.removeLayer(this.pickupMarker);
  }

  if (this.dropMarker) {
    this.map.removeLayer(this.dropMarker);
  }

  // save new route
  this.routeLine = L.polyline(latlngs, {
    color: 'blue',
    weight: 4,
  }).addTo(this.map);

  const locationIcon = L.icon({
    iconUrl: 'location-pin.png',
    iconSize: [22, 22],
    iconAnchor: [11, 22],
    popupAnchor: [0, -22],
  });

  // save markers
  this.pickupMarker = L.marker(
    [start.lat, start.lng],
    { icon: locationIcon }
  )
    .addTo(this.map)
    .bindPopup('Pickup');

  this.dropMarker = L.marker(
    [end.lat, end.lng],
    { icon: locationIcon }
  )
    .addTo(this.map)
    .bindPopup('Drop');

  this.map.fitBounds(this.routeLine.getBounds());
  this.rideService.mapLoading.set(false);
  this.router.navigate(["vehicle"]);
  this.rideService.setLoading(false);
}

  //Convert names → route
  getRouteFromNames(pickup: string, drop: string) {
    this.rideService.mapLoading.set(true);
  this.rideService.setLoading(true);

  this.getCoordinates(pickup).subscribe((startRes: any) => {
    const start = {
      lat: +startRes[0].lat,
      lng: +startRes[0].lon
    };

    this.getCoordinates(drop).subscribe((endRes: any) => {
      const end = {
        lat: +endRes[0].lat,
        lng: +endRes[0].lon
      };

      this.getRoute(start, end);
    });
  });
}
}