import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { PopupMessage } from './popup-message/popup-message';

@Component({
  selector: 'app-root',
  imports: [RouterModule, Navbar, PopupMessage],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('client');
}
