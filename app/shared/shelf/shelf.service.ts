import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";

import { Config } from "../config";
import { Shelf, Product } from "./shelf";

var appSettings = require("application-settings");

@Injectable()
export class ShelfService {

  constructor(
    private http: Http, 
  ){
    console.log("In Shelf Service Constructor");
  }
  

  // this method calls the API and receives a list of all beacons
  getShelves(){
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + Config.token);

    return this.http.get(Config.apiUrl + "shelves", {
      headers: headers
    })
    .map(res => res.json())
    .map(data => {
      let shelvesList = new Array<Shelf>();
      data.forEach((shelf) => {
        let shelfObj = new Shelf(shelf.code, shelf.beacon);
        shelfObj.id = shelf.id;
        shelfObj.code = shelf.role;
        shelfObj.beacon = shelf.beacon;
        shelfObj.active = shelf.active;
        shelfObj.keywords = shelf.keywords;
        shelfObj.created_dt = shelf.created_dt;

        let products = []

        shelf.products.forEach(product => {
            let productObj = new Product(product.code,product.name, product.description);
            productObj.keywords = product.keywords;
            productObj.image = product.image;
            productObj.video = product.video;
            productObj.remark = product.remark;

            products.push(productObj);
        });

        shelfObj.products = products;

        
      });
      return shelvesList;
    })
    .catch(this.handleErrors);
  }

  getShelf(beacon){
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + Config.token);
    
    return this.http.get(Config.apiUrl + "shelves/beacon/"+beacon, {
      headers: headers
    })
    .map(res => res.json())
    .map(shelf  => {
    
        let shelfObj = new Shelf(shelf.code, shelf.beacon);
        shelfObj.id = shelf.id;
        shelfObj.code = shelf.code;
        shelfObj.beacon = shelf.beacon;
        shelfObj.active = shelf.active;
        shelfObj.keywords = shelf.keywords;

        shelfObj.created_dt = shelf.created_dt;
        let products = []

        shelf.products.forEach(product => {
            let productObj = new Product(product.code,product.name, product.description);
            productObj.keywords = product.keywords;
            productObj.image = product.image;
            productObj.video = product.video;
            productObj.remark = product.remark;

            products.push(productObj);
        });
        shelfObj.products = products;

        return shelfObj;

    })
    .catch(this.handleErrors); 
  }

  handleErrors(error: Response,) {
    // var err = new Error(error)
    console.log("in Shelf Service: "+error);
    console.log("Type of error: "+error.type);
    // return Promise.reject(error);
    return Observable.throw(error);
    // throw error;
    // return error;
  }
}