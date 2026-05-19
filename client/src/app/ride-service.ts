import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RideService {
  http = inject(HttpClient);

  mapLoading = signal(false);
  router = inject(Router);

  msg = signal('');

  booking = signal<any>({
  pickup: '',
  pickUpCoordinates: [],
  dropCoordinates: [],
  drop: '',
  distance: 0,
  duration: 0,
  fare: 0,
  gst: 0,
  total: 0,
  vehicle: '',
});

  updateRide(data: any) {
    this.booking.update((old) => ({
      ...old,
      ...data,
    }));
  }


  bookRide(data: any) {
    return this.http.post('http://localhost:7000/api/rides', data);
  }

  cancelBooking(id: string, data: any) {
    return this.http.patch(`http://localhost:7000/api/rides/${id}`, data);
  }

  bookingProgress(rideID: string) {
    return this.http.get(`http://localhost:7000/api/rides/${rideID}`);
  }


  submitFeedback(data: any) {
    return this.http.post('http://localhost:7000/api/reviews', data);
  }


  getMyBookings() {
    return this.http.get('http://localhost:7000/api/rides');
  }


  getProfile() {
    return this.http.get('http://localhost:7000/api/users/profile');
  }
}