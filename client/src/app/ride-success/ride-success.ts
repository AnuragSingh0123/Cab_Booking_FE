import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  inject
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { RideService } from '../ride-service';

@Component({
  selector: 'app-ride-success',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './ride-success.html',
  styleUrl: './ride-success.css',
})
export class RideSuccess implements OnInit, OnDestroy {
  constructor(private router: Router) {}

  rideService=inject(RideService);

  activeRide = signal<any>(null);
  progress = signal(100);

  rating = signal(0);
  feedback = signal('');

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

    this.activeRide.set(ride);

    if (!ride) {
      this.progress.set(100);
      return;
    }

    this.updateProgress();
    this.checkExpiry();
  }

  updateProgress() {
    const ride = this.activeRide();

    if (!ride?.expiresAt) return;
    if (ride.status !== 'SEARCHING_DRIVER') return;

    const total = 60000;
    const remaining = ride.expiresAt - Date.now();

    if (remaining <= 0) {
      this.progress.set(0);
      return;
    }

    this.progress.set((remaining / total) * 100);
  }

  checkExpiry() {
    const ride = this.activeRide();

    if (!ride) return;
    if (ride.status !== 'SEARCHING_DRIVER') return;

    if (Date.now() >= ride.expiresAt) {
      const updatedRide = {
        ...ride,
        status: 'CANCELLED',
        cancelReason: 'No driver accepted',
      };

      localStorage.setItem(
        'activeRide',
        JSON.stringify(updatedRide)
      );

      this.activeRide.set(updatedRide);
    }
  }

  cancelRide() {
    const ride = this.activeRide();
    if (!ride) return;

    const updatedRide = {
      ...ride,
      status: 'CANCELLED',
      cancelReason: 'Cancelled by user',
    };

    localStorage.setItem(
      'activeRide',
      JSON.stringify(updatedRide)
    );

    this.activeRide.set(updatedRide);
  }

  setRating(stars: number) {
    this.rating.set(stars);
  }

  submitFeedback() {
  const ride = this.activeRide();
  if (!ride) return;

  const updatedRide = {
    ...ride,
    rating: this.rating(),
    feedback: this.feedback(),
    reviewedAt: Date.now(),
  };

  const history = JSON.parse(
    localStorage.getItem('rideHistory') || '[]'
  );

  const index = history.findIndex(
    (r: any) => r.completedAt === ride.completedAt
  );

  if (index !== -1) {
    history[index] = updatedRide;
  }

  localStorage.setItem(
    'rideHistory',
    JSON.stringify(history)
  );

  localStorage.removeItem('activeRide');
  this.rideService.setRide('','');
  // this.rideService.setRideDetails('','');
  alert("Feedback Submitted");
  this.goHome();
}

  goHome() {
    localStorage.removeItem('activeRide');
    this.router.navigate(['/']);
  }

  bookAgain() {
    localStorage.removeItem('activeRide');
    this.router.navigate(['/']);
  }
}