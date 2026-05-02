import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RideService {

  http = inject(HttpClient);

  mapLoading = signal(false);
  router=inject(Router);

  booking = signal<any>({
    pickup: '',
    drop: '',
    distance: 0,
    duration: 0,
    fare: 0,
    gst: 0,
    total: 0,
    vehicle: ''
  });

  updateRide(data: any) {
    this.booking.update(old => ({
      ...old,
      ...data
    }));

    console.log(this.booking());
  }


  bookRide(rideData: any) {
  let { pickup, drop, fare, gst, vehicle, distance } = rideData;

  const activeRide = {
    id: crypto.randomUUID(),

    pickup,
    drop,
    fare,
    gst,
    vehicle,
    distance,

    total: Number(fare) + Number(gst),

    status: "SEARCHING_DRIVER",
    driver: null,

    createdAt: Date.now(),
    expiresAt: Date.now() + 60000
  };

  localStorage.setItem(
    "activeRide",
    JSON.stringify(activeRide)
  );
}

  rideSubject = new BehaviorSubject<any>({
    pickUp: '',
    drop: ''
  });
  ride$ = this.rideSubject;

  setRide(pickUp: string, drop: string) {
    this.rideSubject.next({ pickUp, drop });
  }

  loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject;
  
  setLoading(val: boolean) {
    this.loadingSubject.next(val);
  }

  msgSubject = new BehaviorSubject<String>('')

  msg$=this.msgSubject;

  setMsg(msg:string){
    this.msgSubject.next(msg);
  }


  bookingRide(data: any) {
    console.log("inside bookingRide");
    const token = localStorage.getItem('token');

    return this.http.post(
      'http://localhost:3000/book-ride',
      data,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`
        })
      }
    );
  }

  updateBookingStatus(id: string, data: any) {
  const token = localStorage.getItem('token');

  return this.http.patch(
    `http://localhost:3000/booking-status/${id}`,
    data,
    {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    }
  );
}


  getMyBookings() {
  const token = localStorage.getItem('token');

  return this.http.get(
    'http://localhost:3000/my-bookings',
    {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    }
  );
}

}
