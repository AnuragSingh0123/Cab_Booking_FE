import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { SignUp } from './sign-up/sign-up';
import { Map } from './map/map';
import { RideSuccess } from './ride-success/ride-success';
import { Profile } from './profile/profile';
import { DriverDashboard } from './driver-dashboard/driver-dashboard';
import { MyTrips } from './my-trips/my-trips';
import { RideRequest } from './ride-request/ride-request';
import { VehicleSelection } from './vehicle-selection/vehicle-selection';
import { Checkout } from './checkout/checkout';
import { authGuard } from './auth-guard';

export const routes: Routes = [
  { path: "", component: Home, children:[
    {path:"", component: RideRequest},
    {path: "vehicle", component: VehicleSelection, canActivate: [authGuard], data: {roles: ['rider']}},
    {path: "checkout", component: Checkout, canActivate: [authGuard], data: {roles: ['rider']}}
  ] },
  { path: "login", component: Login },
  { path: "sign-up", component: SignUp },
  {path: "profile", component: Profile},
  {path: "my-trips", component: MyTrips, canActivate: [authGuard], data: {roles: ['rider']}},
  {path: "driver-dashboard", component: DriverDashboard, canActivate: [authGuard], data: {roles: ['driver']}},
  { path: "map", component: Map },
  { path: "ride-booked", component:RideSuccess }
];
