import {
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';

import { DriverService } from '../driver-service';

@Component({
  selector: 'app-driver-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './driver-dashboard.html',
  styleUrl: './driver-dashboard.css',
})
export class DriverDashboard implements OnInit, OnDestroy {
  private driverService = inject(DriverService);

  reviews = signal<any[]>([]);
  activeRide = signal<any | null>(null);
  availableRide = signal<any | null>(null);

  getAverageRating(): number {
    const list = this.reviews();

    if (!list.length) return 0;

    const total = list.reduce((sum, r) => sum + r.rating, 0);
    return total / list.length;
  }

  driver = signal({
    id: '',
    name: '',
    email: '',
    vehicle: '',
    vehicleNo: '',
    rating: 0,
    online: true,
  });

  stats = signal({
    trips: 0,
    earnings: 0,
    distance: 0,
    hours: 0,
  });

  private sub?: Subscription;

  ngOnInit() {
    this.loadUser();
    this.refresh();

    this.sub = interval(500).subscribe(() => {
      this.refresh();
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  loadUser() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    this.driver.update(driver => ({
      ...driver,
      id: user.id || '',
      name: user.name || '',
      email: user.email || '',
    }));
  }

  refresh() {
    this.driverService.getDriverDashboard().subscribe({
      next: (data: any) => {
        this.reviews.set(data.reviews ?? []);

        this.activeRide.set(data.activeRide ?? null);

        if (availableRide && this.driver().vehicle && availableRide.vehicle && this.driver().vehicle.toLowerCase() === availableRide.vehicle.toLowerCase()
        ) {
          this.availableRide.set(availableRide);
        } 
        else {
          this.availableRide.set(null);
        }

        this.activeRide.set(data?.activeRide ?? null);

        this.driver.update(d => ({
          ...d,
          vehicle: data?.driver?.vehicleType ?? '',
          vehicleNo: data?.driver?.vehicleNumber ?? '',
          rating: data?.driver?.rating ?? 0,
          online: data?.driver?.online ?? true
        }));

        this.stats.set({
          trips: data.stats?.trips ?? 0,
          earnings: data.stats?.earnings ?? 0,
          distance: data.stats?.distance ?? 0,
          hours: data.stats?.hours ?? 0,
        });
      },

      error: err => {
        console.log('Dashboard Error', err);
      },
    });
  }

  setAvailableRide(ride: any) {
    const driverVehicle = this.driver().vehicle?.toLowerCase();
    const rideVehicle = ride?.vehicle?.toLowerCase();

    const matched =
      ride &&
      driverVehicle &&
      rideVehicle &&
      driverVehicle === rideVehicle;

    this.availableRide.set(matched ? ride : null);
  }

  getAverageRating(): number {
    const list = this.reviews();

    if (!list.length) return 0;

    const total = list.reduce((sum, review) => {
      return sum + review.rating;
    }, 0);

    return total / list.length;
  }

  toggleStatus() {
    this.driverService.toggleDriverStatus().subscribe({
      next: () => this.refresh(),
    });
  }

  acceptRide() {
    this.updateRideStatus(
      this.availableRide()?._id,
      (id) => this.driverService.acceptRide(id)
    );
  }

  startRide() {
    this.updateRideStatus(
      this.activeRide()?._id,
      (id) => this.driverService.startRide(id)
    );
  }

  completeRide() {
    this.updateRideStatus(
      this.activeRide()?._id,
      (id) => this.driverService.completeRide(id)
    );
  }

  rejectRide() {
    this.availableRide.set(null);
  }

  updateRideStatus(
  rideId: string,
  action: (id: string) => any
) {
  if (!rideId) return;

  action(rideId).subscribe({
    error: (err: any) => console.log(err),
  });
}

}