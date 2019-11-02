import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AlertController} from "@ionic/angular";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

import {Categories} from "../../../../../../backend/app/categories";
import {Weekdays} from "../../../../../../backend/app/weekdays";
import {AuthService} from "../../../AuthService/auth.service";


@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.page.html',
  styleUrls: ['./create-service.page.scss'],
})

export class CreateServicePage implements OnInit {

  // Array of weekdays
  weekdays: Weekdays[];

  //Some properties used for user feedback
  loading: boolean;
  error: string;



  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private http: HttpClient,
    private alertController: AlertController,
    private router: Router) {
  }

  ngOnInit() {
    this.loading = false;
    this.error = '';
    // Reset weekdays Array
    this.weekdays = [Weekdays.NoDay];
  }

  serviceForm = this.formBuilder.group({
    category: ['', Validators.required],
    title: ['', [Validators.required, Validators.maxLength(30)]],
    street: ['', Validators.required],
    housenumber: ['', [Validators.required, Validators.pattern('[1-9]*')]],
    zip: ['', [Validators.required, Validators.pattern('[1-9][1-9][1-9][1-9]')]],
    city: ['', Validators.required],
    distance: ['0', Validators.required],
    capacity: ['200+', Validators.required],
    availability: ['', Validators.required],
    price: ['', Validators.required],
    type: ['', Validators.required],
    requirements: [''],
    description: ['', Validators.maxLength(140)]
  });

  get category() {
    return this.serviceForm.get('category');
  }
  get title() {
    return this.serviceForm.get('title');
  }
  get street() {
    return this.serviceForm.get('street');
  }
  get housenumber() {
    return this.serviceForm.get('housenumber');
  }
  get zip() {
    return this.serviceForm.get('zip');
  }
  get city() {
    return this.serviceForm.get('city');
  }
  get distance() {
    return this.serviceForm.get('distance');
  }
  get capacity() {
    return this.serviceForm.get('capacity');
  }
  get availability() {
    return this.serviceForm.get('availability');
  }
  get price() {
    return this.serviceForm.get('price');
  }
  get type() {
    return this.serviceForm.get('type');
  }
  get requirements() {
    return this.serviceForm.get('requirements');
  }

  get description() {
    return this.serviceForm.get('description');
  }

  //ToDo: Test whether this works with backend
  /**
   * Called by the user by pushing the correspondent button
   * Sets the body-params and makes a http-request to the backend
   * Handles the result
   */
  createService() {
    // To see the format of the input. Can be deleted later.
    console.log(this.category.value + ' | ' + this.title.value);
    console.log(this.street.value + ' | ' + this.housenumber.value + ' | ' + this.zip.value + ' | ' + this.city.value);
    console.log(this.distance.value + ' | ' + this.capacity.value);
    console.log(this.availability.value + ' | ' + this.price.value);
    console.log(this.type.value);
    console.log(this.requirements.value + ' | ' + this.description.value);

    this.loading = true;
    if (this.validateInput()) {
      this.getAvailability();
      const providerId = this.authService.getUserId();
      const category = this.setCategory();
      const title = this.title.value;
      const street = this.street.value;
      const housenumber = this.housenumber.value;
      const zip = this.zip.value;
      const city = this.city.value;
      const capacity = this.capacity.value;
      const availability = this.weekdays;
      const price = this.price.value;
      const type = this.setType();
      const requirements = this.requirements;
      const description = this.description;

      this.http.post('http://localhost:3000/eventservice/add/',
        {
          providerId, category, title, street, housenumber, zip, city, capacity,
          availability, price, type, requirements, description
        }).subscribe(
        () => {
          this.loading = false;
          this.ConfirmationPopUp().then(r => {
          });
        },
        (error) => {
          this.loading = false;
          this.error = error.message;
        });


    }
  }

  /**
   * Called by {@link createService()}
   * Sets the category according to the user input
   * Returns a {@link Categories} type
   */
  private setCategory() {
    switch (this.category.value) {
      case 'Location':
        return Categories.location;
      case 'Gastronomy':
        return Categories.gastronomy;
      case 'Music':
        return Categories.music;
      case 'Entertainment':
        return Categories.entertainment;
      case 'Photographer':
        return Categories.photographer;
      default:
        // Should never be reached
        return Categories.none;
    }
  }

  /**
   * ConfirmationPopUp
   * Called by {@link createService} when creating a service was successful
   * Navigates the user to {@link StartPage} or {@link UserProfilePage}
   */
  async ConfirmationPopUp() {
    const alert = await this.alertController.create({
      header: 'Service was Created successfully',
      message: this.category.value + 'Service: ' + this.title.value + 'has successfully been created. What do you want to do next?',
      buttons: [
        {
          text: 'Go to start page',
          handler: () => {
            this.router.navigate(['/start']);
          }
        },
        {
          text: 'Go to profile page',
          handler: () => {
            this.router.navigate(['/start/userprofile']);
          }
        }]
    });

    await alert.present();
  }

  /* --- Helper Methods --- */

  /**
   * Called by {@link createService()}
   * Returns the "type" constant according to the user input
   */
  private setType() {
    switch (this.category.value) {

      case 'Gastronomy':
      case 'Music':
      case 'Entertainment':
        return this.type.value;

      default:
        // Location or Photographer (or none)
        return [''];
    }
  }

  /**
   * Called by {@link createService()}
   * Reads the Input for Availability and
   * Pushes {@link Weekdays} to the weekdays Array according to the input
   */
  private getAvailability() {
    // remove "noDay"
    this.weekdays.pop();

    if (this.availability.value.toString().includes('Monday'))
      this.weekdays.push(Weekdays.Monday);
    if (this.availability.value.toString().includes('Tuesday'))
      this.weekdays.push(Weekdays.Tuesday);
    if (this.availability.value.toString().includes('Wednesday'))
      this.weekdays.push(Weekdays.Wednesday);
    if (this.availability.value.toString().includes('Thursday'))
      this.weekdays.push(Weekdays.Thursday);
    if (this.availability.value.toString().includes('Friday'))
      this.weekdays.push(Weekdays.Friday);
    if (this.availability.value.toString().includes('Saturday'))
      this.weekdays.push(Weekdays.Saturday);
    if (this.availability.value.toString().includes('Sunday'))
      this.weekdays.push(Weekdays.Sunday);
  }

  /**
   * Called by {@link createService()}
   * Validates the most important inputs
   */
  private validateInput() {
    if (this.category.value == '')
      this.error += 'Category missing \n';
    if (this.title.invalid)
      this.error += 'Title missing \n';
    if (this.street.invalid || this.housenumber.invalid || this.zip.invalid || this.city.invalid)
      this.error += 'Invalid address \n';
    if (this.availability.value == '')
      this.error += 'Available days missing \n';
    if (this.price.value == '')
      this.error += 'Standard price missing \n';

    if (this.error == '') {
      return true;
    } else {
      this.loading = false;
      return false;
    }
  }

}


