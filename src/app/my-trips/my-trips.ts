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
  userRides = signal<any[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.rideService.getMyTrips().subscribe({
      next: (res: any) => {
        this.userRides.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.loading.set(false);
      },
    });
  }
}
