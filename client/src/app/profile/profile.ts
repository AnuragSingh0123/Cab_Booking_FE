import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {

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
