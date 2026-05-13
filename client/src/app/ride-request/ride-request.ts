import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Subject, debounceTime, switchMap, of } from 'rxjs';

import { RideService } from '../ride-service';
import { LocationService } from '../location-service';

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

  pickup = '';
  drop = '';

  pickupSuggestions: any[] = [];
  dropSuggestions: any[] = [];

  msg = signal('');

  pickupSubject = new Subject<string>();
  dropSubject = new Subject<string>();

  ngOnInit() {

    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (user?.role === 'driver') {
      this.router.navigate(['/driver-dashboard']);
      return;
    }

    // Pickup Search
    this.pickupSubject.pipe(
      debounceTime(300),
      switchMap(value => {

        if (value.trim().length < 3) {
          return of([]);
        }

        return this.locationService.searchLocation(value);
      })
    )
    .subscribe((res: any) => {
      this.pickupSuggestions = res || [];
    });

    // Drop Search
    this.dropSubject.pipe(
      debounceTime(300),
      switchMap(value => {

        if (value.trim().length < 3) {
          return of([]);
        }

        return this.locationService.searchLocation(value);
      })
    )
    .subscribe((res: any) => {
      this.dropSuggestions = res || [];
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

  showMessage(text: string) {

    this.msg.set(text);

    setTimeout(() => {
      this.msg.set('');
    }, 3000);
  }

  rideRequest() {

    if (!this.pickup.trim() || !this.drop.trim()) {
      this.showMessage('Enter pickup and drop location');
      return;
    }

    this.rideService.updateRide({
      pickup: this.pickup,
      drop: this.drop
    });

    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate(['/vehicle']);
  }
}