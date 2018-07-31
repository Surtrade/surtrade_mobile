import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { Switch } from "ui/switch";
import * as Toast from 'nativescript-toast';

import * as application from 'application';
import { AndroidApplication, AndroidActivityBackPressedEventData } from "application";
import { isAndroid } from "platform";

// import { Contract } from "../../shared/contract/contract";
import { ContractService } from "../../shared/contract/contract.service";
// import { LocationDatabaseService } from '../../shared/location/location.db.service';
import { BeaconDatabaseService } from '../../shared/beacon/beacon.db.service';
import { InterestDatabaseService } from '../../shared/interest/interest.db.service';
import { InterestService } from "../../shared/interest/interest.service";
import { shimHostAttribute } from "../../../node_modules/@angular/platform-browser/src/dom/dom_renderer";

var appSettings = require("application-settings");

@Component({
    selector: "ns-contract",
    // providers: [ContractService,LocationDatabaseService],
    providers: [ContractService, BeaconDatabaseService, InterestDatabaseService, InterestService],
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
    behaviourTracking: string;
    shelfInfo: string;

    public aac: boolean;
    public etc: boolean;
    public bht: boolean;
    public shi: boolean;
    public title: string = "Welcome to Narnia";


    isBusy: boolean;
    isSettings: boolean;

    constructor(
        private contractService: ContractService,
        private route: ActivatedRoute,
        private router: RouterExtensions,
        // private locationDatabaseService: LocationDatabaseService
        private interestDatabaseService: InterestDatabaseService,
        private interestService: InterestService,
        private beaconDatabaseService: BeaconDatabaseService
    ) { 
      console.log("In Create contract constructor.")
      this.expireByTime = "OFF";
      this.etc = false
      this.autoauthorize = "ON";
      this.aac = true;  
      this.behaviourTracking = "ON";
      this.bht = true; 
      this.shelfInfo = "ON";
      this.shi = true;

       
       
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
      this.title = "At "+this.beaconDatabaseService.selectBeaconByLocation(this._location_id)[6]+" store";
      // alert("stuff:"+ this.locationDatabaseService.selectLocation(this._location_id)[1]);

      if (isAndroid) {
        application.android.on(AndroidApplication.activityBackPressedEvent, (data: AndroidActivityBackPressedEventData) => {
          this.goMain();
        });
      }

      try{
        this._customer_id = appSettings.getNumber("user_id");
      }catch(e){
        this._customer_id = 0;
      }   

      
      if (this.isSettings == true){
        this.isBusy = true;
        console.log("in settings");
        this.contractService.getActiveContract(this._customer_id, this._location_id)
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

              if(responseContract.options.behaviour_tracking == false){
                this.behaviourTracking = "OFF";
                this.bht = false;
              }

              if(responseContract.options.shelf_info == false){
                this.shelfInfo = "OFF";
                this.shi = false;
              }

            }else{
              console.log("message:"+responseContract.message);
              // alert("Contract expired.");
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

    public behaviourTrackingEvent(args) {
      let switchBox = <Switch>args.object;
      if (switchBox.checked) {
          this.behaviourTracking = "ON";
      } else {
          this.behaviourTracking = "OFF";
      }
    }

    public shelfInfoEvent(args) {
      let switchBox = <Switch>args.object;
      if (switchBox.checked) {
          this.shelfInfo = "ON";
      } else {
          this.shelfInfo = "OFF";
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
        "expire_method":"",
        "behaviour_tracking":true,
        "shelf_info":true
      };

      let expire_method = "location";
      if (this.expireByTime == "ON"){
        expire_method = "time";
      }
      options.expire_method = expire_method;

      let behaviour_tracking = true;
      if(this.behaviourTracking == "OFF"){
        
        behaviour_tracking = false;
      }
      options.behaviour_tracking = behaviour_tracking;

      let shelf_info = true;
      if(this.shelfInfo == "OFF"){
        
        shelf_info = false;
      }
      options.shelf_info = shelf_info;
      
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
        Toast.makeText("Contract created succesfully!").show();
        this.goMain();
      },error => {
        this.isBusy = false;
        alert("Error creating the contract: "+error);
        this.goMain();
        // throw new Error(error);
      });
    }


    expireContract(){
      this.isBusy = true;
      console.log("expiring contract in settings");

      // let finishedInterests = this.interestDatabaseService.finishInterests(); 
      // if (finishedInterests.length > 0){
      //   finishedInterests.forEach(interest=>{
      //     // send interest
      //     console.log("Sending interest from finish interest: "+interest.beacon);
      //     console.log("Actual implementation pending..");

      //     Toast.makeText("Interest stored.").show();
      //     console.log("Interest stored.")
      //   });
      // }

      this.verifyInterest();

      // // Retrive all interests (should be max 1)
      // let interests = this.interestDatabaseService.selectInterests();

      // console.log("how many intersts to finish: "+interests.length);
      // // if there is an interest 
      // if (interests.length > 0){
      //     interests.forEach(interest =>{
      //     let start = new Date(interest.start);
      //     let end = new Date(interest.end);
      //     let duration = end.getTime() - start.getTime();
      //     let sinceLast = new Date().getTime() - end.getTime();
      //     console.log("Interest: "+interest.beacon+", sinceLast: "+sinceLast+", duration: "+duration);
          
      //     // if duration  > 1 minute then send interest
      //     if( duration > 60000){
      //         console.log("Sending interest b: "+interest.beacon)
      //         console.log("Actual implementation pending..");
      //         Toast.makeText("Interest stored.").show();
      //     }
      //     console.log("Deleting interest due to expiring contract: "+interest.beacon);
      //     this.interestDatabaseService.deleteInterest(interest.id);
          
      //     });
      // }

      this.contractService.expireContract(this._location_id, this._customer_id)
        .subscribe(responseContract => {
          this.isBusy = false;
          // alert("Contract expired succesfully!");
          Toast.makeText("Contract expired succesfully!").show();
          this.goMain();
        },error => {
          console.log("error in contract");
          if (error.status != 404){
            alert("Error expiring the contract: "+error);
          }
          this.isBusy = false;
          this.goMain();
        });
    }

    verifyInterest(){
      // Retrive all interests (should be max 1)
      let interests = this.interestDatabaseService.selectInterests();
  
      console.log("how many intersts cc.: "+interests.length);
      // if there is an interest 
      if (interests.length > 0){
        interests.forEach(interest =>{
          let start = new Date(interest.start);
          let end = new Date(interest.end);
          let duration = end.getTime() - start.getTime();
          let sinceLast = new Date().getTime() - end.getTime();
          // if sinceLast > 60 seconds <- this is crucial for knowing if it is away
          console.log("Interest cc.: "+interest.beacon+", sinceLast: "+sinceLast+", duration: "+duration);
          if(sinceLast > 60000){
            // if duration  > 1 minute then send interest
            if( duration > 60000){
              console.log("Sending interest cc.: "+interest.beacon)
              console.log("Actual implementation pending.. work in progress..");
              this.interestService.createInterest(interest).subscribe(response => { 
                // this.isBusy = false;
                Toast.makeText("Interest Sent!  cc.").show();
              },error => {
                this.isBusy = false;
                alert("Error sending the interest: "+error);
                // throw new Error(error);
              });
              Toast.makeText("Interest stored.").show();
            }
            console.log("Deleting interest due to more than 1 minute away cc.: "+interest.id);
            this.interestDatabaseService.deleteInterest(interest.id);
          }
        });
      }  
    }

    // verifyBehaviour(){
    //   // Retrive all interests (should be max 1)
    //   let interests = this.interestDatabaseService.selectInterests();

    //   console.log("how many intersts: "+interests.length);
    //   // if there is an interest 
    //   if (interests.length > 0){
    //     interests.forEach(interest =>{
    //       let start = new Date(interest[3]);
    //       let end = new Date(interest[4]);
    //       let duration = end.getTime() - start.getTime();
    //       let sinceLast = new Date().getTime() - end.getTime();
    //       // if sinceLast > 60 seconds <- this is crucial for knowing if it is away
    //       if(sinceLast > 60000){
    //         // if duration  > 1 minute then send interest
    //         if( duration > 60000){
    //           console.log("Sending interest b: "+interest[0])
    //           console.log("Actual implementation pending..");
    //           Toast.makeText("Interest stored.").show();
    //         }
    //         console.log("Deleting interest due to more than 1 minute away: "+interest[0]);
    //         this.interestDatabaseService.deleteInterest(interest[0]);
    //       }
    //     });
    //   }
    // }

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