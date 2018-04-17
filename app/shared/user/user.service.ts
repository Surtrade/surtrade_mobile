import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { User } from "./user";
import { Config } from "../config";



@Injectable()
export class UserService {
  constructor(private http: Http) {}

  register(user: User) {
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
      Config.apiUrl + "auth/register",
      JSON.stringify({
        username: user.username,
        password: user.password,
        email: user.username,
        name: user.username,
        role: "Customer"
      }),
      { headers: headers }
    )
    .catch(this.handleErrors);
  }

  login(user: User) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    
    

    return this.http.post(
      Config.apiUrl + "auth/login",
      // "http://174.138.48.44:5000/auth/login",
      JSON.stringify({
        username: user.username,
        password: user.password
      }),
      { headers: headers }
    )
    .map(response => response.json())
    .do(data => {
      // alert("user: "+user.username+", pass: "+user.password);
      // console.log("user: "+user.username+", pass: "+user.password);

      Config.token = data.access_token;
    })
    .catch(this.handleErrors);
  }

  getRecommendations(customer_id: Number, location_id: Number){
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + Config.token);

    return this.http.post(
      Config.apiUrl + "customers/recommendations",
      JSON.stringify({
        "customer_id": customer_id,
        "location_id": location_id
      }),
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {
      
      return data;
    })
    .catch(this.handleErrors);
  }

  handleErrors(error: Response) {
    console.log("Error in User Service. "+error.toString());
    return Observable.throw(error);
  }

  
}