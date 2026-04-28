import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RideService {

  bookRide(RideData:any){
    let {pickup, drop, fare, gst, vehicle, distance} = RideData;
    
    let userRides = JSON.parse(localStorage.getItem("userRides")??"[]");
    userRides.push({
      pickup,
      drop,
      fare,
      gst,
      vehicle,
      distance,
      total: Number(fare)+ Number(gst)
    });

    localStorage.setItem("userRides", JSON.stringify(userRides));
    
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

  rideDetailsSubject = new BehaviorSubject<any>({
    Distance: '',
    Time: ''
  })

  msgSubject = new BehaviorSubject<String>('')

  msg$=this.msgSubject;

  rideDetails$ = this.rideDetailsSubject;

  setMsg(msg:string){
    this.msgSubject.next(msg);
  }

  setRideDetails(distance:string, time:string) {
    console.log("here.........")
    console.log(distance, time);
    if(Number(distance)>60){
      this.msgSubject.next(
      "We can't process rides beyond 60 km from pickup"
    );
      return;
    }

    this.msgSubject.next('');
    this.rideDetailsSubject.next({distance, time});
  }


}
