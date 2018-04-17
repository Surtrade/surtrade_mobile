import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";

import { Config } from "../config";
import { Beacon } from "./beacon";

var appSettings = require("application-settings");

@Injectable()
export class BeaconService {

  constructor(
    private http: Http, 
  ){
    console.log("In Beacon Service Constructor");
  }
  

  // this method calls the API and receives a list of all beacons
  getBeacons(type='all'){
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + Config.token);

    return this.http.get(Config.apiUrl + "beacons", {
      headers: headers
    })
    .map(res => res.json())
    .map(data => {
      let beaconList = new Array<Beacon>();
      data.forEach((beacon) => {
        let beaconObj = new Beacon(beacon.major, beacon.minor);
        beaconObj.id = beacon.id;
        beaconObj.role = beacon.role;
        beaconObj.name = beacon.name;
        beaconObj.active = beacon.active;
        beaconObj.keywords = beacon.keywords;
        beaconObj.location_id = beacon.location_id;
        
        if(type == beacon.role.toString()){
          beaconList.push(beaconObj);
        }else if (type == 'all'){
          beaconList.push(beaconObj);
        }
        
      });
      return beaconList;
    })
    .catch(this.handleErrors);
  }

  handleErrors(error: Response,) {
    // var err = new Error(error)
    console.log("Error in Beacon Service: "+error);
    console.log("Type of error: "+error.type);
    // return Promise.reject(error);
    return Observable.throw(error);
    // throw error;
    // return error;
  }
}