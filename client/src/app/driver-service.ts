import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  http = inject(HttpClient);

  private getHeaders() {
    const token = localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  getDriverDashboard() {
    return this.http.get(
      'http://localhost:7000/api/driver/dashboard',
      this.getHeaders()
    );
  }

  toggleDriverStatus() {
    return this.http.patch(
      'http://localhost:7000/api/driver/status',
      {},
      this.getHeaders()
    );
  }

  acceptRide(bookingId: string) {
    return this.http.patch(
      `http://localhost:7000/api/rides/${bookingId}`,
      { status: 'accepted' },
      this.getHeaders()
    );
  }

  startRide(bookingId: string) {
    return this.http.patch(
      `http://localhost:7000/api/rides/${bookingId}`,
      { status: 'started' },
      this.getHeaders()
    );
  }

  completeRide(bookingId: string) {
    return this.http.patch(
      `http://localhost:7000/api/rides/${bookingId}`,
      {
        status: 'completed',
        completedAt: Date.now(),
      },
      this.getHeaders()
    );
  }

  addDirverLocation(place: string) {
    return this.http.patch(
      `http://localhost:7000/api/driver/location/${place}`,
      {},
      this.getHeaders()
    );
  }
}