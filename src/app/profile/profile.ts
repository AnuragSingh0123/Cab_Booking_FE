import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { RideService } from '../ride-service';
import { FormsModule } from '@angular/forms';
import { debounceTime, of, Subject, switchMap } from 'rxjs';
import { LocationService } from '../location-service';
import { DriverService } from '../driver-service';
import { AuthService } from '../auth-service';
import { PopupService } from '../popup-service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  user = signal<any>(null);

  rideDetails = signal({
    totalRides: 0,
    distanceTravelled: 0,
    totalSpent: 0,
    driverLocation: null,
  });

  rideService = inject(RideService);
  authService = inject(AuthService);
  router = inject(Router);
  notify = inject(PopupService);

  pickup: string = '';
  pickupSuggestions: any[] = [];
  pickupSubject = new Subject<string>();
  locationService = inject(LocationService);
  driverService = inject(DriverService);

  constructor() {
    effect(() => {
      const currentUser = this.authService.user();
      if (currentUser) {
        this.user.set(currentUser);
      }
    });
  }

  get memberSince() {
    const date = this.user()?.createdAt;
    if (!date) return '';

    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  }

  ngOnInit() {
    this.rideService.getProfile().subscribe({
      next: (res: any) => {
        this.rideDetails.set(res);
      },
      error: (err) => console.error('Failed to load profile metrics', err),
    });

    this.pickupSubject
      .pipe(
        debounceTime(300),
        switchMap((value) => {
          if (!value || value.trim().length < 3) {
            this.pickupSuggestions = [];
            return of([]);
          }
          return this.locationService.searchLocation(value);
        }),
      )
      .subscribe((res: any) => {
        this.pickupSuggestions = res || [];
      });
  }

  onPickupChange(value: string) {
    if (!value || value.trim().length < 3) {
      this.pickupSuggestions = [];
    }
    this.pickupSubject.next(value);
  }

  driverCoordinates: Number[] = [];

  async selectPickup(place: any) {
    this.driverCoordinates.push(place.lat, place.lon);
    this.pickup = place.display_name;
    this.pickupSuggestions = [];
  }

  editLocation = false;

  updateLocation() {
    this.editLocation = true;

    if (this.pickup) {
      this.driverService
        .addDirverLocation(this.pickup, this.driverCoordinates)
        .subscribe((res: any) => {
          const currentData = this.rideDetails();
          currentData.driverLocation = res.driverLocation;
          this.rideDetails.set({ ...currentData });
          this.pickup = '';
          this.editLocation = false;
        });
    }
  }

  editP = false;
  editName = '';
  editEmail = '';
  updatedData: any;

  startEditing() {
    this.editP = true;
    this.editName = this.user()?.name || '';
    this.editEmail = this.user()?.email || '';
  }

  editProfile() {
    if (!this.editName.trim() || !this.editEmail.trim()) {
      this.notify.show('Name and Email cannot be empty.');
      return;
    }

    this.driverService.editProfile(this.editName, this.editEmail).subscribe({
      next: (res: any) => {
        const updatedData = {
          ...this.user(),
          name: res.user.name,
          email: res.user.email,
        };

        this.user.set(updatedData);
        this.editP = false;
      },

      error: (err) => {
        this.notify.show(err.error?.message || 'An error occurred while updating profile.');
      },
    });
  }
}
