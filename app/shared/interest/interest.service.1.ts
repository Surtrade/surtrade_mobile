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

  createInterst(interest: Interest){
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    // console.log("url: "+Config.apiUrl + "auth/register");
    // console.log("JSON: "+ JSON.stringify({
    //     username: user.username,
    //     password: user.password,
    //     email: user.username,
    //     name: user.username,
    //     role: "Customer"
    //   }));

    return this.http.post(
      Config.apiUrl + "interests",
      JSON.stringify({
        customer_id: interest.customer_id,
        beacon: interest.beacon,
        start: interest.start,
        end: interest.end,
        creating: interest.creating,
        active: interest.active,
        keywords: interest.keywords
      }),
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