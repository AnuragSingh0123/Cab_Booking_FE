import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  http = inject(HttpClient);

  getDriverDashboard() {
    return this.http.get(`${environment.baseUrl}/api/driver/dashboard`);
  }

  toggleDriverStatus(status: boolean) {
    return this.http.patch(`${environment.baseUrl}/api/driver/status`, {
      isAvailable: status,
    });
  }

  acceptRide(bookingId: string) {
    return this.http.patch(`${environment.baseUrl}/api/rides/${bookingId}`, { status: 'accepted' });
  }

  startRide(bookingId: string) {
    return this.http.patch(`${environment.baseUrl}/api/rides/${bookingId}`, { status: 'started' });
  }

  completeRide(bookingId: string) {
    return this.http.patch(`${environment.baseUrl}/api/rides/${bookingId}`, {
      status: 'completed',
      completedAt: Date.now(),
    });
  }

  addDirverLocation(place: string, driverCoordinates: Number[]) {
    let data = {
      place: place,
      driverCoordinates: driverCoordinates,
    };
    return this.http.patch(`${environment.baseUrl}/api/driver/location`, {
      data,
    });
  }

  editProfile(name: string, email: string) {
    let editUser = {
      name: name,
      email: email,
    };

    return this.http.patch(`${environment.baseUrl}/api/users/editProfile`, {
      editUser,
    });
  }
  rejectRide(bookingId: string) {
    return this.http.patch(`${environment.baseUrl}/api/driver/reject`, { bookingId });
  }
}
