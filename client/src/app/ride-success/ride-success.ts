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
  router = inject(Router);
  rideService = inject(RideService);

  activeRide = signal<any>(null);
  progress = signal(100);
  rating = signal(0);
  feedback = signal('');

  private sub?: Subscription;

  ngOnInit() {
    const booking = history.state.booking;

    if (!booking) {
      this.router.navigate(['/']);
      return;
    }

    this.activeRide.set(booking);

    this.sub = interval(1000).subscribe(() => {
      this.updateProgress();
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  updateProgress() {
    const ride = this.activeRide();

    if (!ride) return;
    // if (ride.status !== 'requested') return;

    // use createdAt from DB
    const created = new Date(ride.createdAt).getTime();
    const expiresAt = created + 600000;

    const total = 700000;
    const remaining = expiresAt - Date.now();

    if (remaining <= 0) {
      this.activeRide.update(r => ({
        ...r,
        status: 'cancelled',
      }));

      this.progress.set(0);
      this.cancelRide();
      return;
    }

    this.progress.set((remaining / total) * 100);

    this.rideService.bookingProgress(ride._id)
  .subscribe((updated: any) => {
    this.activeRide.update(r => ({
      ...r,
      ...updated.booking,
      driver: updated.driver
    }));

    console.log(updated);
  });
  }

  cancelRide() {
  const ride = this.activeRide();

  this.rideService.cancelBooking(ride._id, {
    status: 'cancelled',
  }).subscribe((updated: any) => {
    this.activeRide.set(updated);
  });
}

  setRating(stars: number) {
    this.rating.set(stars);
  }

  submitFeedback() {
    this.activeRide.update(r => ({
      ...r,
      rating: this.rating(),
      feedback: this.feedback(),
      reviewedAt: Date.now()
    }));

    alert('Feedback submitted');
    this.goHome();
  }

  goHome() {
    this.router.navigate(['/']);
  }

  bookAgain() {
    this.router.navigate(['/']);
  }
}