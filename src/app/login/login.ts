import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
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
export class Login {
  notify = inject(PopupService);
  router = inject(Router);
  authService = inject(AuthService);
  loading = false;

  constructor() {
    effect(() => {
      if (this.authService.isLoggedIn()) {
        this.router.navigate(['/']);
      }
    });
  }

  login(loginForm: NgForm) {
    if (loginForm.invalid) return;
    this.loading = true;

    const { email, password } = loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (res: any) => {
        this.loading = false;

        this.authService.checkAuthStatus();

        this.notify.show(res.message);

        this.router.navigate(['/']);
      },

      error: (err) => {
        this.loading = false;
        this.notify.show(err.error.message);
      },
    });
  }
}
