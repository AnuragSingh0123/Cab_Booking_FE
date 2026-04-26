import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email:string='';
  password:string='';

  route=inject(Router);

  authService=inject(AuthService);

  login(){
    let userData = {
      name:"Anurag",
      email: this.email,
      password: this.password,
      isLoggedIn: true
    }
    
    this.authService.login(userData);
    this.route.navigate([""]);
  }
}
