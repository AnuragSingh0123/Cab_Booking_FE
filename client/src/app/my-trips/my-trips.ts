import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-my-trips',
  imports: [CommonModule],
  templateUrl: './my-trips.html',
  styleUrl: './my-trips.css',
})
export class MyTrips {

    user:any;
  userRides:any;
  
  ngOnInit() {
  const userData = localStorage.getItem("user");
  const ridesData = localStorage.getItem("userRides");

  if (userData) {
    this.user = JSON.parse(userData);
  }
  
  if (ridesData) {
    this.userRides = JSON.parse(ridesData);
  } else {
    this.userRides = [];
  }
}

}
