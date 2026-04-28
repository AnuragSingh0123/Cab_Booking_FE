import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
    user:any;
  
  ngOnInit() {
  const userData = localStorage.getItem("user");

  if (userData) {
    this.user = JSON.parse(userData);
  }
}

}
