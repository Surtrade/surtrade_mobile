import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";

import { Config } from "../config";
import { Visit } from "./visit";

var appSettings = require("application-settings");

@Injectable()
export class VisitService {

  constructor(
    private http: Http, 
  ){
    console.log("In Visit Service Constructor");
  }
  

  // this method calls the API and receives a list of all visits
  getVisits(type='all'){
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + Config.token);

    return this.http.get(Config.apiUrl + "visits", {
      headers: headers
    })
    .map(res => res.json())
    .map(data => {
      let visitList = new Array<Visit>();
      data.forEach((visit) => {
        let visitObj = new Visit(visit.customer_id, visit.beacon, visit.start, visit.end);
        visitObj.id = visit.id;
        visitObj.active = visit.active;
        visitObj.keywords = visit.keywords;
        visitObj.creating = visit.creating;
        
        visitList.push(visitObj);
        
      });
      return visitList;
    })
    .catch(this.handleErrors);
  }

  dateFormatter(date: Date){
    return date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
  }

  createVisit(visit: Visit){
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + Config.token);
    
    // console.log("url: "+Config.apiUrl + "auth/register");
    // console.log("JSON: "+ JSON.stringify({
    //     username: user.username,
    //     password: user.password,
    //     email: user.username,
    //     name: user.username,
    //     role: "Customer"
    //   }));

    console.log("creating visit for beacon: "+visit.beacon);
    console.log("formatted end: "+this.dateFormatter(new Date(visit.end)));

    let data = {
      customer_id: visit.customer_id,
      beacon: visit.beacon,
      start: this.dateFormatter(new Date(visit.start)),
      end: this.dateFormatter(new Date(visit.end)),
      creating: visit.creating,
      active: visit.active,
      keywords: visit.keywords
    };


    return this.http.post(
      Config.apiUrl + "visits",
      JSON.stringify(data),
      { headers: headers }
    )
    .catch(this.handleErrors);
  }

  handleErrors(error: Response,) {
    // var err = new Error(error)
    console.log("Error in Visit Service: "+error);
    console.log("Type of error: "+error.type);
    // return Promise.reject(error);
    return Observable.throw(error);
    // throw error;
    // return error;
  }
}