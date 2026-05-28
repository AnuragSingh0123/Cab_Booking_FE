import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  message = signal<string>("");

  show(text: string, duration: number = 5000) {
    this.message.set(text);
    setTimeout(() => {
      this.message.set("");
    }, duration);
  }
}
