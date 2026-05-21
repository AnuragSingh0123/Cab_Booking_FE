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

  user = signal<any | null>(this.getUserFromStorage());
  token = signal<string | null>(this.getTokenFromStorage());

  isLoggedIn = computed(() => !!this.token());
  role = computed(() => this.user()?.role);


  login(data: any) {
    return this.http.post<{message: string}>(`${environment.baseUrl}/auth/login`, data);
  }

  signUp(userData: any) {
  return this.http.post<{ message: string }>(`${environment.baseUrl}/auth/sign-up`, userData);
}


  setSession(res: any) {
    localStorage.setItem('user', JSON.stringify(res.user));
    localStorage.setItem('token', res.token);

    this.user.set(res.user);
    this.token.set(res.token);
  }


  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    this.user.set(null);
    this.token.set(null);
    
    this.router.navigate(["/"]);
  }


  private getUserFromStorage() {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }

  private getTokenFromStorage() {
    return localStorage.getItem('token');
  }
}