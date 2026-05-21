import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

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
          key: environment.mapApiKey,
          q: query,
          countrycodes: 'IN',
          limit: 5,
          dedupe: 1, // remove duplicate/similar results
        }
      }
    );
  }
}