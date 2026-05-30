import { Component, inject } from '@angular/core';
import { MapRenderService } from '../map-render-service';
import { RideService } from '../ride-service';

@Component({
  selector: 'app-map',
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Map {
  rideService = inject(RideService);
  mapRender = inject(MapRenderService);

  ngAfterViewInit() {
    this.mapRender.initMap('map');
  }
}
