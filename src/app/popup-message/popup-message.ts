import { Component, inject } from '@angular/core';
import { PopupService } from '../popup-service';

@Component({
  selector: 'app-popup-message',
  imports: [],
  templateUrl: './popup-message.html',
  styleUrl: './popup-message.css',
})
export class PopupMessage {
  private popupService = inject(PopupService);
  message = this.popupService.message;
}
