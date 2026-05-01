import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service';
import { RideService } from '../ride-service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  router=inject(Router);

  authService=inject(AuthService);
  rideService=inject(RideService);

  ride = this.rideService.booking;

  login(loginForm: NgForm) {
  const { email, password } =
    loginForm.control.value;

  const userData = {
    name: 'Anurag',
    email,
    password,
    isLoggedIn: true
  };

  this.authService.login(userData);

  const ride = this.ride();

  if (ride.pickup && ride.drop) {
    this.router.navigate(['/vehicle']);
  } else {
    this.router.navigate(['/']);
  }
}
}
