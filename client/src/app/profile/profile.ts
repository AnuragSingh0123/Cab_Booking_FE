import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { RideService } from '../ride-service';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, of, Subject, switchMap } from 'rxjs';
import { LocationService } from '../location-service';
import { DriverService } from '../driver-service';

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
    driverLocation: null
  });

  rideService = inject(RideService);
  router = inject(Router);

  //----------------By Aditya--------------------------
  
  pickup: string = '';
  pickupSuggestions: any[] = [];
  pickupSubject = new Subject<string>();
  locationService = inject(LocationService);
  driverService = inject(DriverService);

  ngOnInit() {
    const userData = localStorage.getItem('user');

    if (userData) {
      this.user.set(JSON.parse(userData));
      this.rideService.getProfile().subscribe((res: any) => {
        this.rideDetails.set(res);
      });
    }

    this.pickupSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value || value.trim().length < 3) {
          this.pickupSuggestions = [];
          return of([]);
        }
        return this.locationService.searchLocation(value);
      })
    ).subscribe((res: any) => {
      this.pickupSuggestions = res || [];
    });
  }


  //----------------By Aditya--------------------------
  onPickupChange(value: string) {
    if (!value || value.trim().length < 3) {
      this.pickupSuggestions = [];
    }
    this.pickupSubject.next(value);
  }


  driverCoordinates: Number[]= [];

  async selectPickup(place: any) {

    this.driverCoordinates.push(place.lat,place.lon);
    this.pickup = place.display_name;
    this.pickupSuggestions = [];
  }

  

  editLocation = false;

  updateLocation() {

    this.editLocation = true;

    if (this.pickup) {
      this.driverService.addDirverLocation(this.pickup, this.driverCoordinates).subscribe((res: any) => {
        

        const currentData = this.rideDetails();
        currentData.driverLocation = res.driverLocation;
        this.rideDetails.set({ ...currentData });
        this.pickup = '';
        this.editLocation = false;

      });
    }
  }


  editP = false;
  editName = ''
  editEmail = ''
  updatedData :any

  startEditing() {
    this.editP = true;
    this.editName = this.user()?.name || '';
    this.editEmail = this.user()?.email || '';
  }

  editProfile(){
if (!this.editName.trim() || !this.editEmail.trim()) {
      alert("Name and Email cannot be empty.");
      return;
    }

    this.driverService.editProfile(this.editName, this.editEmail).subscribe({
      next: (res: any) => {
        console.log("Name is ", res.user.name);
        console.log("Email is ", res.user.email);

        const updatedData = {
          ...this.user(),
          name: res.user.name,
          email: res.user.email
        };

        this.user.set(updatedData);
        localStorage.setItem('user', JSON.stringify(this.user));

        this.editP = false;
      },

      error: (err) => {
   
        alert(err.error?.message || "An error occurred while updating profile.");
      }
    });
    
  }


}
