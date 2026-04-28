import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { interval } from 'rxjs';

@Component({
  selector: 'app-ride-success',
  imports: [RouterModule],
  templateUrl: './ride-success.html',
  styleUrl: './ride-success.css',
})
export class RideSuccess {
  activeRide: any;
  countdown = "01:00";

  ngOnInit() {
    this.loadRide();

    interval(1000).subscribe(() => {
      this.loadRide();
      this.updateTimer();
      this.checkExpiry();
    });
  }

  loadRide() {
    this.activeRide = JSON.parse(
      localStorage.getItem("activeRide") || "null"
    );
  }

  updateTimer() {
    if (!this.activeRide) return;

    const remaining =
      this.activeRide.expiresAt - Date.now();

    if (remaining <= 0) {
      this.countdown = "00:00";
      return;
    }

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    this.countdown =
      `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  checkExpiry() {
    if (!this.activeRide) return;

    if (
      Date.now() >= this.activeRide.expiresAt &&
      this.activeRide.status === "SEARCHING_DRIVER"
    ) {
      this.activeRide.status = "CANCELLED";
      this.activeRide.cancelReason = "No driver accepted";

      localStorage.setItem(
        "activeRide",
        JSON.stringify(this.activeRide)
      );
    }
  }

  cancelRide() {
    if (!this.activeRide) return;

    this.activeRide.status = "CANCELLED";
    this.activeRide.cancelReason = "Cancelled by user";

    localStorage.setItem(
      "activeRide",
      JSON.stringify(this.activeRide)
    );
  }
}