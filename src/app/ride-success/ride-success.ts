import { CommonModule } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { interval, Subscription } from 'rxjs';

import { PopupService } from '../popup-service';
import { RideService } from '../ride-service';
import { RouteService } from '../route-service';

@Component({
  selector: 'app-ride-success',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './ride-success.html',
  styleUrl: './ride-success.css',
})
export class RideSuccess implements OnInit, OnDestroy {
  private router = inject(Router);
  private rideService = inject(RideService);
  private notify = inject(PopupService);
  private routeService = inject(RouteService);
  private route = inject(ActivatedRoute);

  activeRide = signal<any>(null);
  progress = signal(100);
  rating = signal(0);
  liveETA = signal<number | null>(null);
  liveED = signal<number | null>(null);
  generatingETA = signal(false);
  ETA = signal<number | null>(null);
  ED = signal<number | null>(null);

  etaInterval: any;

  feedbackText = '';

  private sub?: Subscription;

  ngOnInit() {

    const bookingId =
      this.route.snapshot.paramMap.get('id');

    if (!bookingId) {
      this.goHome();
      return;
    }

    this.rideService
      .bookingProgress(bookingId)
      .subscribe({

        next: (res: any) => {

          this.activeRide.set({
            ...res.booking,
            driver: res.driver,
          });

          this.sub = interval(1000).subscribe(() => {
            this.updateRide();
          });

        },

        error: () => {
          this.goHome();
        }

      });

  }

  ngOnDestroy() {
    this.sub?.unsubscribe();

    if (this.etaInterval) {
      clearInterval(this.etaInterval);
    }

  }

  updateRide() {
    const ride = this.activeRide();

    if (!ride) return;

    const createdTime = new Date(ride.createdAt).getTime();
    const expiryTime = createdTime + 3 * 60 * 1000;

    const remaining = expiryTime - Date.now();

    if (ride.status === "requested") {
      if (remaining <= 0) {
        this.progress.set(0);
        this.cancelRide();
        return;
      }
    }

    const totalDuration = 3 * 60 * 1000;

    this.progress.set((remaining / totalDuration) * 100);

    this.rideService.bookingProgress(ride._id).subscribe({
      next: (res: any) => {
        this.activeRide.update(current => ({
          ...current,
          ...res.booking,
          driver: res.driver,
        }));

        if (this.generatingETA() === false && this.ETA() === null && this.ED() === null) {
          this.generateETA();
        }
      },
    });
  }

  generateETA() {
    if (this.generatingETA()) return;

    this.generatingETA.set(true);

    const ride = this.activeRide();

    if (!ride) {
      this.generatingETA.set(false);
      return;
    }

    const driverCoordinates = ride?.driver?.driverCoordinates;
    const pickUpCoordinates = ride?.pickUpCoordinates;

    if (!driverCoordinates || !pickUpCoordinates) {
      this.generatingETA.set(false);
      return;
    }


    const start = {
      lat: +driverCoordinates[0],
      lng: +driverCoordinates[1],
    };

    const end = {
      lat: +pickUpCoordinates[0],
      lng: +pickUpCoordinates[1],
    };

    this.routeService.getRoute(start, end).subscribe({
      next: (res: any) => {
        const route = res.routes?.[0];

        if (!route) {
          this.generatingETA.set(false);
          return;
        }

        const distanceKm = Number((route.distance / 1000).toFixed(2));
        const durationMin = Number((route.duration / 60).toFixed(0));

        this.ETA.set(durationMin);
        this.ED.set(distanceKm);
        this.liveETA.set(durationMin);
        this.liveED.set(distanceKm);

        this.startETA();

        this.generatingETA.set(false);
      },

      error: (err) => {
        console.log("ETA error:", err);
        this.generatingETA.set(false);
      },
    });
  }

  startETA() {

    if (this.etaInterval) {
      clearInterval(this.etaInterval);
    }

    this.etaInterval = setInterval(() => {

      const currentETA = this.liveETA();
      const currentED = this.liveED();

      if (currentETA === null || currentED === null) {
        return;
      }

      if (currentETA <= (1 / 12)) {

        this.liveETA.set(0);
        this.liveED.set(0);

        clearInterval(this.etaInterval);

        return;
      }

      const etaDecreasePerTick = 1 / 12;

      this.liveETA.set(
        currentETA - etaDecreasePerTick
      );

      const decreasePerMinute =
        (this.ED() || 0) / (this.ETA() || 1);

      const decreasePer5Sec =
        decreasePerMinute / 12;

      const newDistance = Math.max(
        0,
        currentED - decreasePer5Sec
      );

      this.liveED.set(newDistance);

    }, 5000);

  }


  cancelRide() {
    const rideId = this.activeRide()?._id;

    if (!rideId) return;

    this.rideService
      .cancelBooking(rideId, { status: 'cancelled' })
      .subscribe((updated: any) => {
        this.activeRide.set(updated);
      });
  }

  setRating(stars: number) {
    this.rating.set(stars);
  }

  submitFeedback() {
    const ride = this.activeRide();

    if (!ride) return;

    const payload = {
      bookingId: ride._id,
      driverId: ride.driverId,
      rating: this.rating(),
      feedback: this.feedbackText,
    };

    this.rideService.submitFeedback(payload).subscribe({
      next: () => {
        this.notify.show('Feedback Submitted');
        this.resetBooking();
        this.goHome();
      },
      error: () => {
        console.log('Error occurred');
      },
    });
  }

  resetBooking() {
    this.rideService.booking.set({
      pickup: '',
      drop: '',
      distance: 0,
      duration: 0,
      fare: 0,
      gst: 0,
      total: 0,
      vehicle: '',
    });
  }

  goHome() {
    this.resetBooking();
    this.router.navigate(['/']);
  }
}