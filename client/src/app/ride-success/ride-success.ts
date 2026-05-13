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
import { FormsModule } from '@angular/forms';
import { PopupService } from '../popup-service';

@Component({
  selector: 'app-ride-success',
  standalone: true,
  imports: [RouterModule, CommonModule,FormsModule],
  templateUrl: './ride-success.html',
  styleUrl: './ride-success.css',
})
export class RideSuccess implements OnInit, OnDestroy {
  router = inject(Router);
  rideService = inject(RideService);
  notify=inject(PopupService);

  activeRide = signal<any>(null);
  progress = signal(100);
  rating = signal(0);
  feedbackText = '';

  private sub?: Subscription;

  ngOnInit() {
    const booking = history.state.booking;

    if (!booking) {
      this.router.navigate(['/']);
      return;
    }

    this.activeRide.set(booking);

    this.sub = interval(500).subscribe(() => {
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
    const ride = this.activeRide();
    console.log('Driver ID:', this.activeRide()?.driverId);
    console.log('Rating:', this.rating());
    console.log('Feedback:', this.feedbackText);

    const data = {
      bookingId: ride._id,
      driverId: this.activeRide()?.driverId,
      rating: this.rating(),
      feedback: this.feedbackText
    }

    this.rideService.submitFeedback(data).subscribe(
      {
        next: (res)=>console.log(res),
        error: ()=> console.log("Error occured")
      }
    )

    this.notify.show("Feedback Submitted");
    this.rideService.booking.set({
  pickup: '',
  drop: '',
  distance: 0,
  duration: 0,
  fare: 0,
  gst: 0,
  total: 0,
  vehicle: ''
});
    this.goHome();
  }

  goHome() {
    this.router.navigate(['/']);
  }

  bookAgain() {
    this.router.navigate(['/']);
  }
}