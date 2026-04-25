import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RideService } from '../ride-service';

@Component({
  selector: 'app-ride-success',
  imports: [RouterModule],
  templateUrl: './ride-success.html',
  styleUrl: './ride-success.css',
})
export class RideSuccess {
  rideService=inject(RideService);

  ngOnInit(){
    this.rideService.setRideDetails('','');
    this.rideService.setRide('','');
  }
}
