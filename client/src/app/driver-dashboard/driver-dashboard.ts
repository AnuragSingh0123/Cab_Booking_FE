import {
  Component,
  OnInit,
  OnDestroy,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-driver-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './driver-dashboard.html',
  styleUrl: './driver-dashboard.css',
})
export class DriverDashboard implements OnInit, OnDestroy {

  driver = signal({
    id: 'd1',
    name: 'Ramesh Kumar',
    email: 'ramesh@email.com',
    vehicle: 'Sedan',
    vehicleNo: 'KA01AB1234',
    rating: 4.8,
    online: true,
  });

  activeRide = signal<any>(null);
  availableRide = signal<any>(null);

  stats = signal({
    trips: 12,
    earnings: 2450,
    distance: 134,
    hours: 8.5,
  });

  private sub?: Subscription;

  ngOnInit() {
    this.refresh();

    this.sub = interval(1000).subscribe(() => {
      this.refresh();
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  refresh() {
    const ride = JSON.parse(
      localStorage.getItem('activeRide') || 'null'
    );

    this.activeRide.set(null);
    this.availableRide.set(null);

    if (!ride) return;

    const driver = this.driver();

    if (
      ride.status === 'SEARCHING_DRIVER' &&
      ride.expiresAt > Date.now() &&
      driver.online
    ) {
      this.availableRide.set(ride);
    }

    if (
      ride.driverId === driver.id &&
      ['ACCEPTED', 'STARTED'].includes(ride.status)
    ) {
      this.activeRide.set(ride);
    }
  }

  toggleStatus() {
    this.driver.update(driver => ({
      ...driver,
      online: !driver.online
    }));

    this.refresh();
  }

  acceptRide() {
    const ride = this.availableRide();
    const driver = this.driver();

    if (!ride) return;

    const updatedRide = {
      ...ride,
      status: 'ACCEPTED',
      driverId: driver.id,
      driver: {
        name: driver.name,
        vehicle: driver.vehicle,
        vehicleNo: driver.vehicleNo,
        rating: driver.rating,
      }
    };

    localStorage.setItem(
      'activeRide',
      JSON.stringify(updatedRide)
    );

    this.refresh();
  }

  rejectRide() {
    this.availableRide.set(null);
  }

  startRide() {
    const ride = this.activeRide();

    if (!ride) return;

    const updatedRide = {
      ...ride,
      status: 'STARTED'
    };

    localStorage.setItem(
      'activeRide',
      JSON.stringify(updatedRide)
    );

    this.refresh();
  }

  completeRide() {
    const ride = this.activeRide();
    if (!ride) return;

    const completedRide = {
      ...ride,
      status: 'COMPLETED'
    };

    const history = JSON.parse(
      localStorage.getItem('rideHistory') || '[]'
    );

    history.push(completedRide);

    localStorage.setItem(
      'rideHistory',
      JSON.stringify(history)
    );

    localStorage.removeItem('activeRide');

    this.refresh();
  }
}