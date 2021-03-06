import { Component, OnInit } from '@angular/core';
import {AuthService} from "../AuthService/auth.service";
import {EventService} from "../../../../backend/app/models/eventService.model";
import {FormBuilder} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {format} from 'date-fns';
import * as moment from 'moment';
import {userJson} from "./userprofile/userJson";



@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})

/**
 * Landing page for all users visiting Eventdoo.
 *  Displays all EventServices stored in the DB.
 *  EventServices can be filtered by category and subtype, availability, city, price, capacity and text search.
 *  Results are loaded dynamically.
 */
export class StartPage implements OnInit {

  readonly ROOT_URL = 'http://localhost:3000/profile/';
  private userId: number;

  // Stores all EventServices or those matching the parameters set by the user.
  services: EventService[];

  // Variables for user feedback
  loading: boolean;

  // Variables for datetime pickers
  today: string;
  year: string;

  //To disable the plus-button, if the user has more than 4 services
  private numberOfServices: number = 0;

  httpGetSuccess:boolean;


  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private formBuilder: FormBuilder
  ) {}


  searchForm = this.formBuilder.group({
      category: [''],
      subtype: [''],
      weekday: [''],
      city: [''],
      price: [''],
      persons: [''],
      text: ['']
    });

  /* Get-methods for searchForm */
  get category () {
    return this.searchForm.get('category');
  }
  get subtype() {
    return this.searchForm.get('subtype');
  }
  get weekdays() {
    return this.searchForm.get('weekday');
  }
  get city() {
    return this.searchForm.get('city');
  }
  get price() {
    return this.searchForm.get('price');
  }
  get persons() {
    return this.searchForm.get('persons');
  }
  get text() {
    return this.searchForm.get('text');
  }


  /**
   * Gets all EventServices from backend
   * Assigns them to services so they are displayed in the UI
   */
 ngOnInit() {
    this.loading = true;
    this.today = moment().format("YYYY-MM-DD").toString();
    this.year = moment().add(1, "year").format("YYYY-MM-DD").toString();

    this.http.get<Array<EventService>>('http://localhost:3000/search')
      .subscribe(
        (data)=> {
          this.services = data;
        }, (error) => {
          console.log(error);
        });
    this.loading = false;

    this.getUserData();

  }

  /**
   * Called when search params are changed or the user pushes the search button.
   * Gets all services matching the search params entered by the user
   * Updates "services" which leads to an updated page only displaying the matching services
   */
  search() {
    let url = this.getUrl();
    this.http.get<Array<EventService>>(url).subscribe(
      (data) => {
        this.services = data;
      },
    (err) => {
        console.log(err.message);
    });
  }

  /**
   * Called by {@link search}
   * Generates the URL according to the search parameters set by the user and returns it.
   */
  private getUrl() {
    let result = 'http://localhost:3000/search/filter/';

    if (this.text.value == '')
      result += ':textsearch?';
    else
      result += (':text?text=' + this.text.value + '&');

    if (this.category.value != '')
      result += ('category=' + this.category.value + '&');
    if (this.subtype.value != '')
      result += ('subtype=' + this.subtype.value + '&');
    if (this.city.value != '')
      result += ('city=' + this.city.value + '&');
    if (this.price.value != '')
      result += ('price=' + this.price.value + '&');
    if (this.persons.value != '')
      result += ('people=' + this.persons.value + '&');
    if (this.weekdays.value != '')
      result += ('availability=' + format(new Date(this.weekdays.value), "iiii") + '&');

    if (result.charAt(result.length - 1) == '&') {
      return (result.substr(0, result.length - 1));
    } else {
      return result;
    }
  }

  getUserData(){
    try {
      this.userId = this.authService.getUserId();
      this.http.get<userJson>(this.ROOT_URL + this.userId)
        .subscribe(
          (user)=> {
            this.numberOfServices = user.size;
          },
          (error)=> {
            this.httpGetSuccess = false;
            console.log(error);
          });


    }
    catch (e) {
      this.httpGetSuccess = false;
      console.log(e);
    }
  }


  refreshPage() {
    location.reload();
  }
}
