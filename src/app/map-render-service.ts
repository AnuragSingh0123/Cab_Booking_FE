import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class MapRenderService {
  map: any;
  routeLine: any;
  pickupMarker: any;
  dropMarker: any;

  initMap(containerId: string) {
    this.map = L.map(containerId).setView([13.0475, 77.62], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
  }

  drawRoute(latlngs: any, start: any, end: any) {
    if (this.routeLine) this.map.removeLayer(this.routeLine);
    if (this.pickupMarker) this.map.removeLayer(this.pickupMarker);
    if (this.dropMarker) this.map.removeLayer(this.dropMarker);

    this.routeLine = L.polyline(latlngs, {
      color: 'blue',
      weight: 4,
    }).addTo(this.map);

    const icon = L.icon({
      iconUrl: 'location-pin.png',
      iconSize: [22, 22],
      iconAnchor: [11, 22],
    });

    this.pickupMarker = L.marker([start.lat, start.lng], { icon })
      .addTo(this.map)
      .bindPopup('Pickup');

    this.dropMarker = L.marker([end.lat, end.lng], { icon }).addTo(this.map).bindPopup('Drop');

    this.map.fitBounds(this.routeLine.getBounds());
  }
}
