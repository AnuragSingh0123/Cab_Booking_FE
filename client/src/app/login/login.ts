import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service';
import { RideService } from '../ride-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  router = inject(Router);
  authService = inject(AuthService);
  rideService = inject(RideService);

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

        if (ride?.pickup && ride?.drop) {
          this.router.navigate(['/vehicle']);
        } else {
          this.router.navigate(['/']);
        }
      },

      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Login failed';
      }
    });
  }
}