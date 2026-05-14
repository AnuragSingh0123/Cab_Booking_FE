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
      'http://localhost:7000/driver/dashboard',
      this.getHeaders()
    );
  }

  toggleDriverStatus() {
    return this.http.patch(
      'http://localhost:7000/driver/toggle-status',
      {},
      this.getHeaders()
    );
  }

  acceptRide(bookingId: string) {
    return this.http.patch(
      `http://localhost:7000/booking/${bookingId}`,
      {
        status: 'accepted',
      },
      this.getHeaders()
    );
  }

  startRide(bookingId: string) {
    return this.http.patch(
      `http://localhost:7000/booking/${bookingId}`,
      {
        status: 'started',
      },
      this.getHeaders()
    );
  }

  completeRide(bookingId: string) {
    return this.http.patch(
      `http://localhost:7000/booking/${bookingId}`,
      {
        status: 'completed',
        completedAt: Date.now(),
      },
      this.getHeaders()
    );
  }


  addDirverLocation(place:string, userId:string){
    return this.http.patch(`http://localhost:7000/driverLocation/${place}`,{
      userId:userId,
      status:'Location Updated',
      updatedAt: Date.now()
    }, this.getHeaders()
  );
  }
}