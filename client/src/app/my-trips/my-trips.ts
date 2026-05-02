import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RideService } from '../ride-service';

@Component({
  selector: 'app-my-trips',
  imports: [CommonModule],
  templateUrl: './my-trips.html',
  styleUrl: './my-trips.css',
})
export class MyTrips {
  rideService = inject(RideService);

  user = signal<any>(null);
  userRides = signal<any[]>([]);
  loading = signal(true);

  ngOnInit() {
    const userData = localStorage.getItem('user');

    if (userData) {
      this.user.set(JSON.parse(userData));
    }

    this.rideService.getMyBookings().subscribe({
      next: (res: any) => {
        this.userRides.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.loading.set(false);
      }
    });
  }
}