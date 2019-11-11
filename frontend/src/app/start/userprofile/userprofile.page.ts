import { Component, OnInit } from '@angular/core';
import {AlertController} from "@ionic/angular";
import {FormBuilder, Validators} from "@angular/forms";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {User} from "../../../../../backend/app/models/user.model";
import {Address} from "../../../../../backend/app/models/address.model";
import {AuthService} from "../../AuthService/auth.service";
import {userJson} from "./userJson";
import {EventServiceContainer} from "../../../../../backend/app/models/eventServiceContainer.model";


@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.page.html',
  styleUrls: ['./userprofile.page.scss'],
})


export class UserprofilePage implements OnInit {


  readonly ROOT_URL = 'http://localhost:3000/profile/';
  private userId: number;

  private firstname: string = 'initial';
  private lastname: string = '';
  private email:string = '';
  private street: string = '';
  private housenumber: string = '';
  private zip: string = '';
  private city: string = '';
  private firmname: string = '';
  private phonenumber: string = '';

  private allServicesContainer: EventServiceContainer[];

  httpGetSuccess:boolean;
  isEditing:boolean = false;


  constructor(
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private authservice:AuthService) { }

  ngOnInit() {
    this.getUserData();
  }

  editForm = this.formBuilder.group({
    firstnameInput: [this.firstname, [Validators.required]],
    lastnameInput: [this.lastname, Validators.required],
    firmnameInput: [this.firmname],
    streetInput: [this.street, Validators.required],
    housenumberInput: [this.housenumber, [Validators.required, Validators.pattern('[0-9]+')]],
    zipInput: [this.zip, [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern('[0-9]+')]],
    cityInput: [this.city, Validators.required],
    phonenumberInput: [this.phonenumber, [Validators.pattern('[0-9]+')]]
  });

  get firstnameInput() {
    return this.editForm.get('firstnameInput');
  }

  get lastnameInput() {
    return this.editForm.get('lastnameInput');
  }

  get firmnameInput() {
    return this.editForm.get('firmnameInput');
  }

  get streetInput() {
    return this.editForm.get('streetInput');
  }

  get housenumberInput() {
    return this.editForm.get('housenumberInput');
  }

  get zipInput() {
    return this.editForm.get('zipInput');
  }

  get cityInput() {
    return this.editForm.get('cityInput');
  }

  get phonenumberInput() {
    return this.editForm.get('phonenumberInput');
  }

  /**
   * Fetching UserInformation from Backend to display
   */
  getUserData(){
    try {
      this.userId = this.authservice.getUserId();
     //var userJson: userJson = {firstname: 'not initialized', lastname: 'not initialized', email: 'not initialized', street: 'not initialized', housenumber: 'not initialized', zip: 'not initialized', city: 'not initialized'};
      this.http.get<userJson>(this.ROOT_URL + this.userId)
        .subscribe(
          (user)=> {

            this.firstname = user.firstname; //this.user.getFirstname();
            this.lastname = user.lastname; //this.user.getLastname();
            this.email = user.email;
            //let address: Address = this.user.getAddress();
            this.street = user.street;
            this.housenumber = user.housenumber; //address.housenumber;
            this.zip = user.zip; //address.zip;
            this.city = user.city; //address.city;
            if(user.firmname!='null' && user.firmname!=null) this.firmname = user.firmname;
            if(user.phonenumber!='null' && user.phonenumber!=null)this.phonenumber = user.phonenumber;
            this.allServicesContainer = user.allServicesContainer;
            this.httpGetSuccess = true;
          },
          (error)=> {
            this.httpGetSuccess = false;
            console.log(error());
          });


    }
    catch (e) {
      this.httpGetSuccess = false;
      console.log(e);
    }
  }

  enableEditing(){
    this.isEditing = true;
  }

  saveChanges(){
    console.log(this.firstnameInput.value);
    this.firstname = this.firstnameInput.value;
    this.lastname = this.lastnameInput.value;
    this.street = this.streetInput.value;
    this.housenumber = this.housenumberInput.value;
    this.zip = this.zipInput.value;
    this.city = this.cityInput.value;
    this.firmname = this.firmnameInput.value;
    this.phonenumber = this.phonenumberInput.value;
    const isFirm = (this.firmname !=null && this.firmname!='null' && this.firmname!='');
    console.log('sending update Data to backend'+ this.firstname + this.lastname + this.firmname + this.street + this. housenumber + this.zip + this.city + this.phonenumber);
    this.http.post(this.ROOT_URL+'update', {
      id: this.userId,
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      firmname: this.firmname,
      street: this.street,
      housenumber: this.housenumber,
      zip: this.zip,
      city: this.city,
      phonenumber: this.phonenumber,
      isFirm: isFirm
    })
      .subscribe(
        (success) => {
          this.httpGetSuccess = true;
        },
        (error) => {
          this.httpGetSuccess = false;
          console.log(error);
        }
      );
   // this.getUserData();
    this.isEditing = false;
  }


}
