import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { SignUp } from './sign-up/sign-up';
import { Map } from './map/map';
import { RideSuccess } from './ride-success/ride-success';
import { Profile } from './profile/profile';
import { DriverDashboard } from './driver-dashboard/driver-dashboard';
import { MyTrips } from './my-trips/my-trips';

export const routes: Routes = [
  { path: "", component: Home },
  { path: "login", component: Login },
  { path: "sign-up", component: SignUp },
  {path: "profile", component: Profile},
  {path: "my-trips", component: MyTrips},
  {path: "driver-dashboard", component: DriverDashboard},
  { path: "map", component: Map },
  { path: "ride-booked", component:RideSuccess }
];
