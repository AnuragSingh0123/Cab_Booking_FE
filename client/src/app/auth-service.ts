import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class AuthService {

  http=inject(HttpClient);

  userSubject = new BehaviorSubject<any>(this.getUser());

  user$ = this.userSubject;

  getUser(){
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }


  login(user: any){
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  signUp(data:any){
    console.log(data);
    return this.http.post("http://localhost:3000/auth/sign-up",data);
  }
}
