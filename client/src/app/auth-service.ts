import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient);
  router=inject(Router);
  authChecked = signal(false);
  user = signal<any | null>(null);

  isLoggedIn = computed(() => this.user() !== null);
  role = computed(() => this.user()?.role);

  constructor() {
    console.log("check auth status called..")
    this.checkAuthStatus();
  }

  login(data: any) {
    return this.http.post<{ message: string }>(`${environment.baseUrl}/auth/login`, data);
  }

  signUp(userData: any) {
    return this.http.post<{ message: string }>(`${environment.baseUrl}/auth/sign-up`, userData);
  }

  logout() {
    this.http.post(`${environment.baseUrl}/auth/logout`, {}).subscribe({
      next: () => this.clearSession(),
      error: () => this.clearSession()
    });
  }

  private clearSession() {
    this.user.set(null);
    this.router.navigate(['/']);
  }


  checkAuthStatus() {
  this.http.get<any>(`${environment.baseUrl}/auth/me`).subscribe({
    next: (userData) => {
      this.user.set(userData);
      this.authChecked.set(true);
    },
    error: () => {
      this.user.set(null);
      this.authChecked.set(true);
    }
  });
}

}