import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { Switch } from "ui/switch";

import * as application from 'application';
import { AndroidApplication, AndroidActivityBackPressedEventData } from "application";
import { isAndroid } from "platform";

// import { Contract } from "../../shared/contract/contract";
import { ContractService } from "../../shared/contract/contract.service";
// import { LocationDatabaseService } from '../../shared/location/location.db.service';
import { BeaconDatabaseService } from '../../shared/beacon/beacon.db.service';

var appSettings = require("application-settings");

@Component({
    selector: "ns-contract",
    // providers: [ContractService,LocationDatabaseService],
    providers: [ContractService, BeaconDatabaseService],
    // moduleId: module.id,
    templateUrl: "./pages/contract/contract.html",
    styleUrls:["./pages/contract/contract.css"] 
})
export class ContractComponent implements OnInit {
    private _location_id: number;
    private _customer_id: number;
    // private _contract: Contract;

    minutes: number;
    expireByTime: string;
    autoauthorize: string;

    public aac: boolean;
    public etc: boolean;
    public title: string = "Welcome to Narnia";


    isBusy: boolean;
    isSettings: boolean;

    constructor(
        private contractService: ContractService,
        private route: ActivatedRoute,
        private router: RouterExtensions,
        // private locationDatabaseService: LocationDatabaseService
        private beaconDatabaseService: BeaconDatabaseService
    ) { 
      this.expireByTime = "OFF";
      this.etc = false
      this.autoauthorize = "ON";
      this.aac = true;  
       
       
      //  this._contract = null;
       this.isBusy = false;
       this.isSettings = false;

      this.minutes = 10;
      // console.log("init time: "+this.minutes);
    }

    ngOnInit(): void {
      this._location_id = parseInt(this.route.snapshot.params["location_id"]);
      this.isSettings = (this.route.snapshot.params["settings"]);
      // console.log("is settings: "+this.isSettings);

      // alert("Wait for it.. with location id: "+this._location_id);
      
      // this.locationDatabaseService.selectLocation(this._location_id)
      // this.title = "At "+this.locationDatabaseService.selectLocation(this._location_id)[1];
      this.title = "At "+this.beaconDatabaseService.selectBeaconByLocation(this._location_id)[6];
      // alert("stuff:"+ this.locationDatabaseService.selectLocation(this._location_id)[1]);

      // if (isAndroid) {
      //   application.android.on(AndroidApplication.activityBackPressedEvent, (data: AndroidActivityBackPressedEventData) => {
      //     this.goMain();
      //   });
      // }

      // try{
      //   this._customer_id = appSettings.getNumber("user_id");
      // }catch(e){
      //   this._customer_id = 0;
      // }   

      
      if (this.isSettings == true){
        this.isBusy = true;
        console.log("in settings");
        this.contractService.getActiveContract(this._location_id, this._customer_id)
          .subscribe(responseContract => {
            if (!responseContract.message && responseContract.status != undefined){
              console.log("no message :), status: "+responseContract.status);
              if(!responseContract.auto_authorize){
                this.autoauthorize = "OFF";
                this.aac = false;  
              }

              if(responseContract.options.expire_method == 'time'){
                this.expireByTime = "ON";
                this.etc = true;
              }

            }else{
              console.log("message:"+responseContract.message);
              alert("Contract expired.");
              this.goMain();
            }
            this.isBusy = false;
          },error => {
            console.log("error in contract");
            if (error.status != 404){
              alert("Error getting active contract information: "+error);
            }
            this.isBusy = false;
            this.goMain();
          });
      }

    }

   public expireByTimeEvent(args) {
        let switchBox = <Switch>args.object;
        if (switchBox.checked) {
            this.expireByTime = "ON";
        } else {
            this.expireByTime = "OFF";
        }
    }
    public autoauthorizeEvent(args) {
        let switchBox = <Switch>args.object;
        if (switchBox.checked) {
            this.autoauthorize = "ON";
        } else {
            this.autoauthorize = "OFF";
        }
    }

    createContract(){
      this.isBusy = true;
      let auto_authorize;
      if (this.autoauthorize == "ON")
        auto_authorize = true;
      else
        auto_authorize = false;
      
      let options = {
        "expire_method":""
      };

      let expire_method = "location";
      if (this.expireByTime == "ON"){
        expire_method = "time";
      }

      options.expire_method = expire_method;
      
      let contractData={
        "location_id": this._location_id,
        "auto_authorize": auto_authorize,
        // "expire": this.time.minutes,
        "expire": this.minutes,
        "options": options
      };

      this.contractService.createContract(contractData)
      .subscribe(response => { 
        this.isBusy = false;    
        this.goMain();
      },error => {
        this.isBusy = false;
        alert("Error creating the contract: "+error);
        this.goMain();
        // throw new Error(error);
      });
    }

    public cancel(){
      this.goMain();
    }

    public goMain(){
      this.router.navigate(["/main"], {
          // animation: true,
          transition: {
              name: "slideRight",
              duration: 200,
              curve: "linear"
          }
        });
    }
}