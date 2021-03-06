import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";

import { Config } from "../config";
import { Interest } from "./interest";

var appSettings = require("application-settings");

@Injectable()
export class InterestService {

  constructor(
    private http: Http, 
  ){
    console.log("In Interest Service Constructor");
  }
  

  // this method calls the API and receives a list of all interests
  getInterests(type='all'){
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + Config.token);

    return this.http.get(Config.apiUrl + "interests", {
      headers: headers
    })
    .map(res => res.json())
    .map(data => {
      let interestList = new Array<Interest>();
      data.forEach((interest) => {
        let interestObj = new Interest(interest.customer_id, interest.beacon, interest.start, interest.end);
        interestObj.id = interest.id;
        interestObj.active = interest.active;
        interestObj.keywords = interest.keywords;
        interestObj.creating = interest.creating;
        
        interestList.push(interestObj);
        
      });
      return interestList;
    })
    .catch(this.handleErrors);
  }

  dateFormatter(date: Date){
    return date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
  }

  createInterest(interest: Interest){
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + Config.token);
    
    console.log("creating interest: "+typeof interest);
    console.log("creating interest for beacon: "+interest.beacon);
    console.log("creating interest for beacon []: "+interest[2]);
    console.log("formatted end: "+this.dateFormatter(new Date(interest.end)));

    let data = {
      customer_id: interest.customer_id,
      beacon: interest.beacon,
      start: this.dateFormatter(new Date(interest.start)),
      end: this.dateFormatter(new Date(interest.end)),
      creating: interest.creating,
      active: interest.active,
      keywords: interest.keywords
    };


    return this.http.post(
      Config.apiUrl + "interests",
      JSON.stringify(data),
      { headers: headers }
    )
    .catch(this.handleErrors);
  }

  handleErrors(error: Response,) {
    // var err = new Error(error)
    console.log("Error in Interest Service: "+error);
    console.log("Type of error: "+error.type);
    // return Promise.reject(error);
    return Observable.throw(error);
    // throw error;
    // return error;
  }
}