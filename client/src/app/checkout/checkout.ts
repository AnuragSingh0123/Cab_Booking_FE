import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RideService } from '../ride-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {

   rideService = inject(RideService);
  router = inject(Router);

  ride = this.rideService.booking;

  constructor() {
    const data = this.ride();

    if (
      !data.pickup ||
      !data.drop ||
      !data.distance ||
      !data.duration ||
      !data.vehicle ||
      !data.fare ||
      !data.gst ||
      !data.total
    ) {
      this.router.navigate(['/']);
    }
  }

  bookRide() {
    console.log(this.ride());
  }


}
