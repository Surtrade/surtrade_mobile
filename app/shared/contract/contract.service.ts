import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
// import { isEnabled, enableLocationRequest, getCurrentLocation, watchLocation, distance, clearWatch } from "nativescript-geolocation";

import { Config } from "../config";
import { Contract } from "./contract";
import { User } from "../user/user";

@Injectable()
export class ContractService {
  constructor(private http: Http){}

  private _contract: Contract;

  getContract(location_id){
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + Config.token);

    return this.http.get(Config.apiUrl + "contracts/"+location_id, {
      headers: headers
    })
    .map(res => res.json())
    .catch(this.handleErrors);
  }

  getActiveContract(location_id, customer_id){
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + Config.token);

    // console.log("customer: "+ customer_id+", loc: "+location_id);

    return this.http.post(
      Config.apiUrl + "contracts/active", 
      JSON.stringify({
        "customer_id": customer_id,
        "location_id": location_id
      }),
      {headers: headers})
      .map(res => res.json()[0])
      .catch(this.handleErrors);
  }

  createContract(contractData){
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + Config.token);
    // console.log("Attempting to create a contract.");
    // console.log("in Contract service");
    // console.log("Contract data expire: "+ contractData.expire);
    // console.log("Contract data options expire_method: "+ contractData.options.toString());

    // console.log("contract data: "+JSON.stringify(contractData));

    return this.http.post(
      Config.apiUrl + "contracts",
      JSON.stringify(contractData),
      { headers: headers }
    )
    .map(response => response.json())
    .catch(this.handleErrors);
  }

  getCustomersWithContract(location_id){
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + Config.token);

    return this.http.get(Config.apiUrl + "contracts/customers/"+location_id, {
      headers: headers
    })
    .map(res => res.json())
    .map(data => {
      let customerList = new Array<User>();
      data.forEach((customer) => {
        let cust = new User();
        cust.id = customer.customer_id;
        cust.name = customer.customer_name;
        cust.username = customer.customer_username;
        cust.email = customer.customer_email;
        customerList.push(cust);
      });
      return customerList;
    })
    .catch(this.handleErrors);
  }

  expireContract(location_id, customer_id){
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + Config.token);
    
    return this.http.post(
      Config.apiUrl + "contracts/expire", 
      JSON.stringify({
        "customer_id": customer_id,
        "location_id": location_id
      }),
      {headers: headers})
      .map(res => res.json()[0])
      .catch(this.handleErrors);
  }

  handleErrors(error: Response,) {
    // console.log("Error in Contract Service: "+error);
    // console.log("Error status: "+error.status);
    return Observable.throw(error);
  }
}