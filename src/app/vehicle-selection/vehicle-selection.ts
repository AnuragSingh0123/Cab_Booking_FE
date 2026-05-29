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
  router = inject(Router);

  loading = this.rideService.mapLoading;
  ride = this.rideService.booking;

  selectedValue = '';

  vehicles = [
    {
      name: 'Mini',
      image: 'mini.png',
      seats: 4,
      desc: 'Affordable',
      baseFare: 50,
      perKm: 10
    },
    {
      name: 'Sedan',
      image: 'sedan.png',
      seats: 4,
      desc: 'Comfort',
      baseFare: 70,
      perKm: 14
    },
    {
      name: 'SUV',
      image: 'suv.png',
      seats: 6,
      desc: 'Spacious',
      baseFare: 100,
      perKm: 18
    },
    {
      name: 'Premium',
      image: 'premium.png',
      seats: 4,
      desc: 'Luxury',
      baseFare: 150,
      perKm: 25
    }
  ];

  constructor() {
    const ride = this.rideService.booking();

    if (!ride.pickup || !ride.drop) {
      this.router.navigate(['/']);
    }
  }

  calculateFare(vehicle: any) {
    const distance = Number(this.ride().distance);

    return vehicle.baseFare + (distance * vehicle.perKm);
  }

  checkoutDetails() {

    const selectedVehicle = this.vehicles.find(
      vehicle => vehicle.name === this.selectedValue
    );

    if (!selectedVehicle) return;

    const fare = this.calculateFare(selectedVehicle);

    const gst = fare * 0.18;
    const total = fare + gst;

    this.rideService.updateRide({
      vehicle: selectedVehicle.name,
      fare: fare.toFixed(2),
      gst: gst.toFixed(2),
      total: total.toFixed(2)
    });

    this.router.navigate(['/checkout']);
  }
}