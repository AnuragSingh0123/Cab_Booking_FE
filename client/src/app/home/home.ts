import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Map } from '../map/map';
import { RideRequest } from '../ride-request/ride-request';

@Component({
  selector: 'app-home',
  imports: [RouterModule,Map],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
