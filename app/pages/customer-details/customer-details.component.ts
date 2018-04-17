import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { Switch } from "ui/switch";

import * as application from 'application';
import { AndroidApplication, AndroidActivityBackPressedEventData } from "application";
import { isAndroid } from "platform";

import { User } from "../../shared/user/user";

// import { Contract } from "../../shared/contract/contract";
import { UserService } from "../../shared/user/user.service";

var appSettings = require("application-settings");

@Component({
    selector: "ns-customer-details",
    providers: [UserService],
    // moduleId: module.id,
    templateUrl: "./pages/customer-details/customer-details.html",
    styleUrls:["./pages/customer-details/customer-details.css"] 
})
export class CustomerDetailsComponent implements OnInit {
    // Private variables
    private _location_id: Number;
    private _customer_id: Number;
    private _agent_id: Number;

    // Public variables
    public title: String = "Customer: X";
    public personal : Array<any> = [];
    public recommendations: Array<any> = [];
    public recommendations2 : Array<any> = [];
    // Semi-hard coding
    public clothing : Array<any> = [];
    public electronics : Array<any> = [];

    // Flags
    public isBusy: boolean;
    public listsLoaded = false;

    constructor(
        private userService: UserService,
        private route: ActivatedRoute,
        private router: RouterExtensions
    ) { 
       this.isBusy = false;
    }

    ngOnInit(): void {
      this.isBusy = true;
      
      // this._location_id = parseInt(this.route.snapshot.params["location_id"]);
      this._customer_id = (this.route.snapshot.params["customer_id"]);

      // if (isAndroid) {
      //   application.android.on(AndroidApplication.activityBackPressedEvent, (data: AndroidActivityBackPressedEventData) => {
      //     this.goMainAgent();
      //   });
      // }

      try{
        this._agent_id = appSettings.getNumber("user_id");
        this._location_id = appSettings.getNumber("user_location_id");
      }catch(e){
        this.goMainAgent();
      }   

      // Get Customer's information
      this.isBusy = true;
      this.userService.getRecommendations(this._customer_id, this._location_id)     
        .subscribe(response => {
          this.isBusy = false;
          // for( var key in response.personal){
          //   if (response.personal.hasOwnProperty(key)) {
          //     // alert("Personal: Key is " + key + ", value is " + response.personal[key]);
          //     this.personal[key] = response.personal[key];
          //   }
          // }
          // // this.personal3 = response.personal;
          // for( var key in response.recommendations){
          //   if (response.recommendations.hasOwnProperty(key)) {
          //     this.recommendations[key] = response.recommendations[key];
          //     // alert("Recommendations: Key is " + key + ", value is " + this.recommendations[key]);
          //   }
          // }
          
          

          this.personal = this.toArray(response.personal);
          console.log(response.personal['name']);
          this.title = "Customer "+response.personal['name'] 

          this.recommendations = this.toArray(response.recommendations);
          this.clothing = this.toArray(response.recommendations.clothing);
          this.electronics = this.toArray(response.recommendations.electronics);
          // console.log(this.recommendations);
          
          this.listsLoaded = true;
        },error => {
          this.goMainAgent();
        });

      
    }

    private toArray(obj){
      return Object.keys(obj).map(function(key) {
        var o = obj[key]
        // console.log("o: "+o);
        // if (typeof o == 'object'){
        //   console.log("object: "+o.length);
        //   o = this.toArray(o);
        // }
        return [String(key), o];
      });
    }

    public goMainAgent(){
      this.router.navigate(["/main-agent"], {
          // animation: true,
          transition: {
              name: "slideRight",
              duration: 200,
              curve: "linear"
          }
        });
    }
}