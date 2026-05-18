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

  // POST /api/rides
  bookRide(data: any) {
    return this.http.post('http://localhost:7000/api/rides', data);
  }

  // PATCH /api/rides/:id
  cancelBooking(id: string, data: any) {
    return this.http.patch(`http://localhost:7000/api/rides/${id}`, data);
  }

  // GET /api/rides/:id
  bookingProgress(rideID: string) {
    console.log(rideID);
    return this.http.get(`http://localhost:7000/api/rides/${rideID}`);
  }

  // POST /api/reviews
  submitFeedback(data: any) {
    return this.http.post('http://localhost:7000/api/reviews', data);
  }

  // GET /api/rides
  getMyBookings() {
    return this.http.get('http://localhost:7000/api/rides');
  }

  // GET /api/users/profile
  getProfile() {
    return this.http.get('http://localhost:7000/api/users/profile');
  }
}