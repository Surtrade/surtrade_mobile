import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { isEnabled, enableLocationRequest, getCurrentLocation, watchLocation, distance, clearWatch } from "nativescript-geolocation";
// import { LocationDatabaseService } from '../../shared/location/location.db.service';

import { Config } from "../config";
import { Location } from "./location";

var appSettings = require("application-settings");

@Injectable()
export class LocationService {

  public _location: Location;
  public _location_database: any;

  // Temporal use of a locations list in memory
  // private _locationList: Array<Location>;

  constructor(
    private http: Http, 
    // private locationDatabaseService: LocationDatabaseService
  ){
    // this._location_database = this.locationDatabaseService.getDatabase();
    // console.log("Constructing location..");
    this._location = new Location(0.0,0.0);
    // console.log("Constructing location lat: "+this._location.lat);
  }

  enableLocation() {
    // console.log("Enabling location services.");
    if (!isEnabled()) {
        enableLocationRequest();
    }
  }
  
  getCurrentLocation() {
    console.log("Before enabling");
    this.enableLocation();
    console.log("After enabling");
    // return getCurrentLocation({desiredAccuracy: 3, updateDistance: 10, maximumAge: 5000, timeout: 5000})
    return getCurrentLocation({timeout: 5000})
      .then((loc) => {
          console.log("-------Current Latitude is: " + loc.latitude);
          console.log("-------Current Longitud is: " + loc.longitude);
          return new Location(loc.latitude, loc.longitude);       
      },(error)=>{
        console.log("Error :( .."+error);
        this.handleErrors(error);
      });
  }

  public getWatchedLocation(){
    return this._location;
  }

  public startWatchingLocation(){
    // let location;
    return watchLocation(
      function (loc) {
          if (loc) {
              console.log("Received location lat: " + loc.latitude);
              appSettings.setString("latitud",loc.latitude.toString());
              appSettings.setString("longitud",loc.longitude.toString());
              // this._location = new Location(loc.latitude, loc.longitude);
              // this._location.lat = loc.latitude;
              // this._location.lng = loc.longitude;
          }
      }, 
      function(e){
          console.log("Error: " + e.message);
      }, 
      {desiredAccuracy: 3, updateDistance: 10, minimumUpdateTime : 1000 * 20}
      ); // Should update every 20 seconds according to Googe documentation. Not verified.
  }

  public stopWatchingLocation(watchId){
    if (watchId) {
        clearWatch(watchId);
        return true;
    }
    return false;
  }

  // this method calls the API and receives a list of all locations
  getLocations(){
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + Config.token);

    return this.http.get(Config.apiUrl + "locations", {
      headers: headers
    })
    .map(res => res.json())
    .map(data => {
      let locationList = new Array<Location>();
      data.forEach((location) => {
        let loc = new Location(location.geolocation.location.lat,location.geolocation.location.lng);
        loc.address = location.address;
        loc.name = location.name;
        loc.id = location.id;
        loc.ne_lat = location.geolocation.bounds.northeast.lat;
        loc.ne_lng = location.geolocation.bounds.northeast.lng;
        loc.sw_lat = location.geolocation.bounds.southwest.lat;
        loc.sw_lng = location.geolocation.bounds.southwest.lng;
        locationList.push(loc);
      });
      return locationList;
    })
    .catch(this.handleErrors);
  }

  // public isUserInLocation(){
  //   var inLocation = new Location(0,0);
  //   inLocation.id = 0;

  //   return this.getCurrentLocation()
  //     .then((currentLocation: Location) => {
  //       if(currentLocation != undefined){
  //         this.locationDatabaseService.query("locations").forEach(location =>{
  //           if ((location.ne_lat >= currentLocation.lat && location.ne_lng >= currentLocation.lng) 
  //             && (location.sw_lat <= currentLocation.lat && location.sw_lng <= currentLocation.lng) ){
  //               inLocation = location;
  //             }
  //         });
  //       }
  //       else{
  //         throw "Location not found";
  //       } 
  //       return inLocation;
  //     });

  //   // return inLocation;
  // }

  // public updateLocationDatabase(){

  //   // Delete existing database
  //   // try{
  //   //   this._location_database.deleteDatabase();
  //   // }catch(e){
  //   //   this.handleErrors(e);
  //   // }   

  //   let headers = new Headers();
  //   headers.append("Content-Type", "application/json");
  //   headers.append("Authorization", "Bearer " + Config.token);

  //   return this.http.get(Config.apiUrl + "locations", {
  //     headers: headers
  //   })
  //   .map(res => res.json())
  //   .map(data => {
  //     let locationList = [];
  //     console.log("Response from API with locations.. "+ data.length);
  //     data.forEach((location) => {
  //       let loc = new Location(location.geolocation.location.lat,location.geolocation.location.lng);
  //       loc.address = location.address;
  //       loc.name = location.name;
  //       loc.id = location.id;
  //       loc.ne_lat = location.geolocation.bounds.northeast.lat;
  //       loc.ne_lng = location.geolocation.bounds.northeast.lng;
  //       loc.sw_lat = location.geolocation.bounds.southwest.lat;
  //       loc.sw_lng = location.geolocation.bounds.southwest.lng;

  //       let document_location = this._location_database.createDocument(loc);
  //       console.log("Location created: "+document_location);

        
  //     });
  //     console.log("Locations in DB: "+this._location_database)

  //     return "Success";
  //   })
  //   .catch(this.handleErrors);

  // }

  handleErrors(error: Response,) {
    // var err = new Error(error)
    console.log("Error in Location Service: "+error);
    console.log("Type of error: "+error.type);
    // return Promise.reject(error);
    return Observable.throw(error);
    // throw error;
    // return error;
  }
}