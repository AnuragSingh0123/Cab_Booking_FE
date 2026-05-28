import { Component, inject } from '@angular/core';
import { RideService } from '../ride-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vehicle-selection',
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-selection.html',
  styleUrl: './vehicle-selection.css',
})
export class VehicleSelection {


  rideService = inject(RideService);
  loading = this.rideService.mapLoading;
  router = inject(Router);

  selectedValue = '';

  ride = this.rideService.booking;

  constructor() {
    const ride = this.rideService.booking();

    if (!ride.pickup || !ride.drop) {
      this.router.navigate(['/']);
    }
  }

  checkoutDetails() {

    const distance = Number(this.ride().distance);

    let fare = 0;

    switch (this.selectedValue) {
      case 'Mini':
        fare = 50 + distance * 10;
        break;

      case 'Sedan':
        fare = 70 + distance * 14;
        break;

      case 'SUV':
        fare = 100 + distance * 18;
        break;

      case 'Premium':
        fare = 150 + distance * 25;
        break;

      default:
        return;
    }

    const gst = fare * 0.18;
    const total = fare + gst;

    this.rideService.updateRide({
      vehicle: this.selectedValue,
      fare: fare.toFixed(2),
      gst: gst.toFixed(2),
      total: total.toFixed(2)
    })

    this.router.navigate(['/checkout']);
  }
}
