import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { RideService } from '../ride-service';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, of, Subject, switchMap } from 'rxjs';
import { LocationService } from '../location-service';
import { DriverService } from '../driver-service';
import { Login } from '../login/login';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-profile',
  imports: [CommonModule,FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
    user: any;

  rideDetails = signal({
    totalRides: 0,
    distanceTravelled: 0,
    totalSpent: 0
  });

  rideService = inject(RideService);
  router = inject(Router);

  //----------------By Aditya--------------------------
  pickup: string = '';
  pickupSuggestions: any[] = [];
  pickupSubject = new Subject<string>();
  locationService = inject(LocationService);
  driverService = inject(DriverService);
  locationUpdated = '';

  ngOnInit() {
    const userData = localStorage.getItem('user');
    
    if (userData) {
      this.user = JSON.parse(userData);
      
      this.rideService.getProfile().subscribe((res: any) => {
        console.log(res);
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

  async selectPickup(place: any) {
    this.pickup = place.display_name;
    this.pickupSuggestions = [];
    if(this.pickup){
        
      this.rideService.updateRide({
          pickup: this.pickup,
      });
          this.driverService.addDirverLocation(this.pickup).subscribe(res=>{
            console.log("location updated successfully", res);
            
          })
    }
  }





}
