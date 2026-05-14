import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth-service';
import { PopupService } from '../popup-service';
import { debounceTime, of, switchMap } from 'rxjs';
import { LocationService } from '../location-service';
import { GeoService } from '../geo-service';

@Component({
  selector: 'app-sign-up',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {

  notify=inject(PopupService);
  locationService = inject(LocationService);
  geoService=inject(GeoService);
  router=inject(Router);

  formBuilder=inject(FormBuilder);
  activatedRoute = inject(ActivatedRoute);
  authService=inject(AuthService);
  role!:string|null;

  signUpForm = this.formBuilder.group({
  name: ['', [Validators.required, Validators.minLength(3)]],
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(6)]],
  confirmPassword: ['', [Validators.required]],
  driverLocation: [''],
  licenseNumber: [''],
  vehicleType: [''],
  vehicleNumber: ['']
});



  //suggestions

  currentAddressSuggestions: any[] = [];

  
  driverCoordinates: number[] | null = null;


  ngOnInit(){

    this.signUpForm.get('driverLocation')?.valueChanges.pipe(
    debounceTime(300),
    switchMap(value => {
      if (!value || value.trim().length < 3) {
        return of([]); 
      }
      return this.locationService.searchLocation(value);
    })
  ).subscribe((res: any) => {
    this.currentAddressSuggestions = res || [];
  });

    const user = localStorage.getItem('user');

  if (user) {
    this.router.navigate(['/']);
  }
    // if we use subscribe, event fires if queryParms changes even after component is already rendered
    // which doesnt work with queryParamsMap
    this.activatedRoute.queryParamMap.subscribe(params => {
    this.role = params.get('role');
    console.log(this.role);

    if (this.role === 'driver') {
      this.signUpForm.get('licenseNumber')?.setValidators([Validators.required]);
      this.signUpForm.get('vehicleType')?.setValidators([Validators.required]);
      this.signUpForm.get('vehicleNumber')?.setValidators([Validators.required]);
    } else {
      this.signUpForm.get('licenseNumber')?.clearValidators();
      this.signUpForm.get('vehicleType')?.clearValidators();
      this.signUpForm.get('vehicleNumber')?.clearValidators();
    }

    this.signUpForm.get('licenseNumber')?.updateValueAndValidity();
    this.signUpForm.get('vehicleType')?.updateValueAndValidity();
    this.signUpForm.get('vehicleNumber')?.updateValueAndValidity();

    });
  }

  selectAddress(place: any) {
  this.signUpForm.patchValue({
    driverLocation: place.display_name
  });

  this.geoService.getCoordinates(place).subscribe({
    next: (coordinates: any) => {
      this.driverCoordinates = [
        +coordinates[0].lat,
        +coordinates[0].lon,
      ]

      console.log('Coordinates set:', this.driverCoordinates);
    },
    error: (err) => {
      console.error('Error fetching coordinates:', err);
      this.notify.show("Failed to get location details.");
    }
  });

  this.currentAddressSuggestions = [];
}


  signup() {
  if (this.signUpForm.invalid) {
    this.signUpForm.markAllAsTouched();
    return;
  }

  if (this.signUpForm.value.password !== this.signUpForm.value.confirmPassword) {
    this.notify.show("Passwords do not match");
    return;
  }

  const { confirmPassword, ...formValues } = this.signUpForm.value;

  const formData = {
    ...formValues,
    role: this.role,
    driverCoordinates: this.driverCoordinates
  };



  this.authService.signUp(formData).subscribe({
    next: res => {
      console.log(res)
      this.notify.show("Registration Successful");
      this.router.navigate(["/login"]);
    },
    error: err => {
      console.log(err),
      this.notify.show("Error while registration. Please try again later")
    }
  });
}
}
