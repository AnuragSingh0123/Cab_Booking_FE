import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LocationService {

  http = inject(HttpClient);

  searchLocation(query: string) {
    return this.http.get<any[]>(
      'https://api.locationiq.com/v1/autocomplete',
      {
        params: {
          key: 'pk.2291756e6d48580b693a0848389717a5',
          q: query,
          countrycodes: 'IN',
          limit: 5,
          dedupe: 1, // remove duplicate/similar results
        }
      }
    );
  }
}