import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  user: any = null;
  showMenu = false;

  authService = inject(AuthService);

  constructor() {
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  logout() {
    this.authService.logout();
    this.showMenu = false;
  }

  get firstLetter(): string {
    return this.user?.name?.charAt(0).toUpperCase() || '';
  }
}