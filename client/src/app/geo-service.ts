import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GeoService {
  private http = inject(HttpClient);

  private apiKey = 'pk.2291756e6d48580b693a0848389717a5';

  getCoordinates(place: string) {
    console.log("place=",place);
    const url = `https://us1.locationiq.com/v1/search?key=${this.apiKey}&q=${encodeURIComponent(place)}&format=json`;

    return this.http.get<any[]>(url);
  }
}