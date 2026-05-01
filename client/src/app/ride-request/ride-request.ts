import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RideService } from '../ride-service';
import { CommonModule } from '@angular/common';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { LocationService } from '../location-service';

@Component({
  selector: 'app-ride-request',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './ride-request.html',
  styleUrl: './ride-request.css',
})
export class RideRequest {

  pickup: string = '';
  drop: string = '';

  route = inject(Router);
  rideService = inject(RideService);
  locationService = inject(LocationService);

  loading$ = this.rideService.loading$;
  rideDetails$ = this.rideService.rideDetails$;
  msg$ = this.rideService.msg$;

  pickupSuggestions: any[] = [];
  dropSuggestions: any[] = [];

  pickupSubject = new Subject<string>();
  dropSubject = new Subject<string>();

  ngOnInit() {

    this.pickupSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value || value.trim().length < 3) {
          this.pickupSuggestions = [];
          return of([]);
        }
        return this.locationService.searchLocation(value);
      })
    ).subscribe((res: any) => {
      this.pickupSuggestions = res || [];
    });

    this.dropSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value || value.trim().length < 3) {
          this.dropSuggestions = [];
          return of([]);
        }
        return this.locationService.searchLocation(value);
      })
    ).subscribe((res: any) => {
      this.dropSuggestions = res || [];
    });
  }

  onPickupChange(value: string) {
    if (!value || value.trim().length < 3) {
      this.pickupSuggestions = [];
    }
    this.pickupSubject.next(value);
  }

  onDropChange(value: string) {
    if (!value || value.trim().length < 3) {
      this.dropSuggestions = [];
    }
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

  msgTimeout:any;

rideRequest() {
  const user = JSON.parse(
    localStorage.getItem('user') || 'null'
  );

  const loginStatus = user?.isLoggedIn;

  if (!this.pickup.trim() || !this.drop.trim()) {
    this.rideService.setMsg(
      'Please enter pickup and drop location'
    );

    clearTimeout(this.msgTimeout);

    this.msgTimeout = setTimeout(() => {
      this.rideService.setMsg('');
    }, 3000);

    return;
  }

  // save ride draft
  this.rideService.updateRide({
    pickup: this.pickup,
    drop: this.drop
  });

  // not logged in
  if (!loginStatus) {
    this.route.navigate(['/login']);
    return;
  }

  // logged in
  this.route.navigate(['/vehicle']);
}



  // bookRide() {
  //   this.rideService.bookRide(this.rideCheckoutDetails);
  //   this.route.navigate(['ride-booked']);
  // }
}