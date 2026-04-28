import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RideService } from '../ride-service';
import { CommonModule } from '@angular/common';
import { take, Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
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
  selectedValue: string = '';

  route = inject(Router);
  rideService = inject(RideService);
  locationService = inject(LocationService);

  rideCheckoutDetails: any = null;

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

    // this.rideService.setRideDetails('40','10');
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

    const loginData = localStorage.getItem("user");
    let isLoggedIn = false;

    if (loginData) {
      try {
        const parsedData = JSON.parse(loginData);
        isLoggedIn = !!parsedData.isLoggedIn;
      } catch (e) {
        console.error("Error parsing login data", e);
      }
    }

    if (!isLoggedIn) {
      this.route.navigate(["login"]);
      return;
    }

    if(!this.pickup.trim() || !this.drop.trim()) {
      this.rideService.setMsg('Please enter pickup and drop location');

      clearTimeout(this.msgTimeout);

      this.msgTimeout = setTimeout(()=>{
        this.rideService.setMsg('');
      },3000)
      return;
    }

    this.rideService.setMsg('');
    this.rideService.setRide(this.pickup, this.drop);
  }


  checkoutDetails() {

  if (!this.selectedValue) return;

  this.rideService.rideDetails$
    .pipe(take(1))
    .subscribe(details => {

      if (!details) return;

      const distance = Number(details.distance);

      let fare = 0;

      switch (this.selectedValue) {
        case 'mini':
          fare = 50 + distance * 10;
          break;

        case 'sedan':
          fare = 70 + distance * 14;
          break;

        case 'suv':
          fare = 100 + distance * 18;
          break;

        case 'premium':
          fare = 150 + distance * 25;
          break;

        default:
          return;
      }

      const gst = fare * 0.18;

      this.rideCheckoutDetails = {
        pickup: this.pickup,
        drop: this.drop,
        distance: details.distance,
        vehicle: this.selectedValue,
        fare: Number(fare.toFixed(2)),
        gst: Number(gst.toFixed(2))
      };

      console.log('Checkout Details:', this.rideCheckoutDetails);
    });
}

  bookRide() {
    this.rideService.bookRide(this.rideCheckoutDetails);
    this.route.navigate(['ride-booked']);
  }
}