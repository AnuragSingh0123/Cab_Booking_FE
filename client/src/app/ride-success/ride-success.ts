import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  signal
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-ride-success',
  imports: [RouterModule,CommonModule],
  templateUrl: './ride-success.html',
  styleUrl: './ride-success.css',
})
export class RideSuccess implements OnInit, OnDestroy {
  activeRide = signal<any>(null);
  countdown = signal('01:00');

  progress = signal(100);

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

    this.updateTimer();
    this.checkExpiry();
  }

  updateTimer() {
  const ride = this.activeRide();

  if (!ride?.expiresAt) return;

  const total = 60000; // 60 sec
  const remaining = ride.expiresAt - Date.now();

  if (remaining <= 0) {
    this.countdown.set('00:00');
    this.progress.set(0);
    return;
  }

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  this.countdown.set(
    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  );

  this.progress.set((remaining / total) * 100);
}

  checkExpiry() {
    const ride = this.activeRide();

    if (!ride) return;

    if (
      Date.now() >= ride.expiresAt &&
      ride.status === 'SEARCHING_DRIVER'
    ) {
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
}