import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth-service';
import { PopupService } from '../popup-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  notify = inject(PopupService);

  auth = inject(AuthService);

  showMenu = false;

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  logout() {
    this.auth.logout();
    this.showMenu = false;
    this.notify.show("Logged out Successfully");
  }

  get firstLetter(): string {
    return this.auth.user()?.name?.charAt(0).toUpperCase() || '';
  }
}