import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-driver-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './driver-dashboard.html',
  styleUrl: './driver-dashboard.css',
})
export class DriverDashboard {
  driver = {
    id: 'd1',
    name: 'Ramesh Kumar',
    email: 'ramesh@email.com',
    vehicle: 'Sedan',
    vehicleNo: 'KA01AB1234',
    rating: 4.8,
    online: true,
  };

  activeRide: any = null;
  availableRide: any = null;

  stats = {
    trips: 12,
    earnings: 2450,
    distance: 134,
    hours: 8.5,
  };

  ngOnInit() {
    this.loadRide();
  }

  loadRide() {
    const ride = JSON.parse(
      localStorage.getItem('activeRide') || 'null'
    );

    this.activeRide = null;
    this.availableRide = null;

    if (!ride) return;

    if (
      ride.status === 'SEARCHING_DRIVER' &&
      ride.expiresAt > Date.now() &&
      this.driver.online
    ) {
      this.availableRide = ride;
    }

    if (
      ride.driverId === this.driver.id &&
      ['ACCEPTED', 'STARTED'].includes(ride.status)
    ) {
      this.activeRide = ride;
    }
  }

  toggleStatus() {
    this.driver.online = !this.driver.online;
    this.loadRide();
  }

  acceptRide() {
    if (!this.availableRide) return;

    this.availableRide.status = 'ACCEPTED';
    this.availableRide.driverId = this.driver.id;
    this.availableRide.driver = {
      name: this.driver.name,
      vehicle: this.driver.vehicle,
      vehicleNo: this.driver.vehicleNo,
      rating: this.driver.rating,
    };

    localStorage.setItem(
      'activeRide',
      JSON.stringify(this.availableRide)
    );

    this.loadRide();
  }

  rejectRide() {
    this.availableRide = null;
  }

  startRide() {
    if (!this.activeRide) return;

    this.activeRide.status = 'STARTED';

    localStorage.setItem(
      'activeRide',
      JSON.stringify(this.activeRide)
    );

    this.loadRide();
  }

  completeRide() {
    if (!this.activeRide) return;

    this.activeRide.status = 'COMPLETED';

    const history = JSON.parse(
      localStorage.getItem('rideHistory') || '[]'
    );

    history.push(this.activeRide);

    localStorage.setItem(
      'rideHistory',
      JSON.stringify(history)
    );

    localStorage.removeItem('activeRide');

    this.loadRide();
  }
}