import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth-service';
import { RideService } from '../ride-service';
import { PopupService } from '../popup-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login{

  notify = inject(PopupService);
  
  router = inject(Router);
  authService = inject(AuthService);
  rideService = inject(RideService);
  
  ngOnInit() {
  const user = localStorage.getItem('user');

  if (user) {
    this.router.navigate(['/']);
  }
}
  ride = this.rideService.booking;

  loading = false;
  errorMsg = '';

  login(loginForm: NgForm) {

    if (loginForm.invalid) return;

    this.loading = true;
    this.errorMsg = '';

    const { email, password } = loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (res: any) => {

        this.loading = false;

        this.authService.setSession(res);

        const ride = this.ride();

        this.notify.show("Login Successfully");

        if (ride?.pickup && ride?.drop) {
          this.router.navigate(['/vehicle']);
        } else {
          this.router.navigate(['/']);
        }
      },

      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Login failed';
        this.notify.show("Error occured while login. Please try again later");
      }
    });
  }
}