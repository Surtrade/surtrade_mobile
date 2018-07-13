import { Component, OnInit, NgZone } from "@angular/core";
import * as dialogs from "ui/dialogs";
import { Page } from "tns-core-modules/ui/page";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { Location as LocationCommon } from "@angular/common";

import { User } from "../../shared/user/user";
import { Location } from "../../shared/location/location";
import { Contract } from "../../shared/contract/contract";

// import { LocationService } from "../../shared/location/location.service";
// import { LocationDatabaseService } from '../../shared/location/location.db.service';
import { VisitService } from "../../shared/visit/visit.service";
import { VisitDatabaseService } from "../../shared/visit/visit.db.service";
import { InterestService } from "../../shared/interest/interest.service";
import { InterestDatabaseService } from "../../shared/interest/interest.db.service";
import { BeaconService } from "../../shared/beacon/beacon.service";
import { BeaconDatabaseService } from "../../shared/beacon/beacon.db.service";
import { ContractService } from "../../shared/contract/contract.service";

import * as application from 'application';
import { AndroidApplication, AndroidActivityBackPressedEventData } from "application";
import { isAndroid } from "platform";
import { Beacon } from "../../shared/beacon/beacon";
import { Visit } from "../../shared/visit/visit";
import { Interest } from "../../shared/interest/interest";

import * as Toast from 'nativescript-toast';

// import { storage } from "../../utils/local";
var appSettings = require("application-settings");

// estimote beacons
var Estimote = require("nativescript-estimote-sdk");
import * as Permissions from "nativescript-permissions";
declare var android: any;

@Component({
    selector: "main",
    providers: [BeaconService, BeaconDatabaseService, VisitService, VisitDatabaseService, InterestService, InterestDatabaseService, ContractService],
    // providers: [LocationService, LocationDatabaseService, ContractService], 
    // providers: [LocationService, ContractService],
    templateUrl: "pages/main/main.html",
    styleUrls:["pages/main/main-common.css"] 
})

export class MainComponent implements OnInit{

  // private variables
  private _current_location: Location;
  private location_id: string;
  // private _all_locations: Array<Location>;
  private _name = "carlos";
  private _contract: Contract;
  // private _location_database: any;
  private _locations_in_db: Array<Location>;
  // private _location_id: number;
  private _watch_location_id: any;
  private _customer_id: number;

  // public variables
  public title: string;

  // button flags
  // public inLocation = false;
  public isCurrentLocation = false;
  public isAllLocations = false;
  public isBusy = false;
  public canContract = false;
  public hasContract = false;
  public expirationText = "";
  public atStore = "@Flick's";

  // Beacon variable
  public estimote: any;
  public options: any;
  public currentBeacons: Array<Beacon>;
  public permissions: any;

  // Icons
  public gearsIcon = String.fromCharCode(0xf085);
  public logoutIcon = String.fromCharCode(0xf08b);
  public handshakeIcon = String.fromCharCode(0xf2b5);
  
  constructor(
    // private locationService: LocationService,
    // private locationDatabaseService: LocationDatabaseService,
    private beaconService: BeaconService,
    private beaconDatabaseService: BeaconDatabaseService,
    private visitService: VisitService,
    private visitDatabaseService: VisitDatabaseService,
    private interestService: InterestService,
    private interestDatabaseService: InterestDatabaseService,
    private contractService: ContractService,
    private route: ActivatedRoute,
    private router: RouterExtensions,
    private locationCommon: LocationCommon,
    private zone: NgZone,
    private page: Page
  ){
      console.log("Main Constructor");
      // this.isBusy = true;
      this._current_location = null;
      // this._all_locations = [];
      this._locations_in_db = [];
      // this._location_database = this.locationDatabaseService.getDatabase();

      // Beacons instance 
      // this.estimote = new Estimote(options);
      this.currentBeacons = [];
      // this.permissions = new Permissions();
  }

  ngOnInit() {
    console.log("Main on Init");

    // Return to login if app settings are not set
    if (!appSettings.hasKey("user_name") || !appSettings.hasKey("user_password")){
      this.router.navigate(["/"]), { clearHistory: true };
    }

    // if (isAndroid) {
    //   application.android.on(AndroidApplication.activityBackPressedEvent, (data: AndroidActivityBackPressedEventData) => {
    //     this.router.navigate(["/"]), { clearHistory: true };
    //     // this.logout();
    //   });
    // }

    this.title = "Welcome "+ appSettings.getString("user_name");    

    try{
      this._customer_id = appSettings.getNumber("user_id");
      console.log("trying cust: "+this._customer_id);
    }catch(e){
      this._customer_id = 0;
    }      
      

    // Beacons process
    this.options = {
      region : 'Progress', // optional
      callback : beacons => {
        // console.log("Beacons: "+beacons)
        // console.log("Amount of Beacons in range: "+beacons.length)
        this.zone.run(() => {
          console.log("Amount of Beacons in range: "+beacons.length);
          if(beacons.length>0){
            this.currentBeacons = [];
            beacons.forEach(beacon => {
              if(beacon.major){
                
                let b =new Beacon(beacon.major.toString(),beacon.minor.toString());
                // console.log("Beacon identificator "+b.identificator);
                this.currentBeacons.push(b);
              }
            });
          }else{
            this.currentBeacons = [];
          }


          // Check for active contracts
          console.log("+++++++++++++++++++++++++");
          this.verifyContract();


          // Check if user is in store or just passing by
          console.log("*************************");
          this.verifyVisit();
          


          

          // Check if behaviour tracking is enabled and track
          if( typeof this._contract !== "undefined" && typeof this._contract.options['behaviour_tracking'] !== "undefined" && this._contract.options['behaviour_tracking']){
            console.log("-------------------------");
            this.verifyBehavior();
          }

        });

        
      }
    }
    

    this.estimote = new Estimote(this.options);

    if(isAndroid){
      console.log("It is Android");
      Permissions.requestPermissions([
        android.Manifest.permission.ACCESS_COARSE_LOCATION,
        android.Manifest.permission.ACCESS_FINE_LOCATION,
        android.Manifest.permission.BLUETOOTH,
        android.Manifest.permission.BLUETOOTH_ADMIN], "Permissions of Surtrade")
      .then(()=>{
        console.log("Permissions granted");
        this.estimote.startRanging();
        console.log("Start ranging");
      }).catch((error)=>{
        alert("Error getting permissions: "+error.message);
      });
    }else{
      console.log("It is iOS");
      this.estimote.startRanging();
      console.log("Start ranging");
    }

    // Location refactor
    // Creates DB if not exist
    // this.locationDatabaseService.createTable();

    //Updates the locations DB, this should not be done every time, but rather once every day
    // if(this.isLocationDatabaseEmpty()){
    //   this.updateLocationDatabase();
    // }

    // Extracts locations from DB
    // this._locations_in_db = this.locationDatabaseService.selectAllLocations();
    // // Start watching for location
    // // this._watch_location_id = this.locationService.startWatchingLocation();


    // Creates DB if not exist
    // this.beaconDatabaseService.dropTable();
    this.beaconDatabaseService.createTable();
    this.visitDatabaseService.createTable();
    this.interestDatabaseService.createTable();

    //Updates the DB, this should not be done every time, but rather once every day
    if(this.isBeaconDatabaseEmpty()){
      console.log("Local DB is empty.");
      this.updateBeaconDatabase();
    }else{
      // Delete: next line should be used only periodically.
      // this.updateBeaconDatabase();
      console.log("Local DB has data.");
    }

    this.page.on('navigatingFrom', (data) => {
      // run destroy code
      // (note: this will run when you either move forward to a new page or back to the previous page)
      // Beacons stop
      this.estimote.stopRanging();
      console.log("Stop ranging");
    });

  }

  public ngOnDestroy() {
    //Called once, before the instance is destroyed.
    // Location refactor
    // this.locationService.stopWatchingLocation(this._watch_location_id)

    // // Beacons stop
    // this.estimote.stopRanging();
    // console.log("Stop ranging");

    // this.verifyVisit();
    // this.verifyBehavior();
    
  }

  public contractSettings(){
    // this.router.navigate(["/contractcreate/"+this._current_location.id+"/1"], {
    this.router.navigate(["/contractcreate",this.location_id,1], {
      // animation: true,
      transition: {
          name: "slideLeft",
          duration: 200,
          curve: "linear"
      }
    });
  }

  public createContract(){

    let stores = this.nearbyStores();
    let store_names = [];
    // let location_ids = [];

    stores.forEach(store => { 
      store_names.push(store.name);
      // location_ids.push(store.location_id);
     });

    dialogs.action({
      message: "Select Store",
      cancelButtonText: "Cancel",
      actions: store_names
    }).then(name => {
      stores.forEach(store => { 
        if(store.name == name){
          console.log("Going to create contract.");
          this.router.navigate(["/contractcreate",store.location_id,0], {
            // animation: true,
            transition: {
                name: "slideLeft",
                duration: 200,
                curve: "linear"
            }
          });
        }
       });
    });
    
  }

  public logout(){
    appSettings.remove("user_name");
    appSettings.remove("user_password");

    this.router.navigate(["/"], { clearHistory: true });
  }

  // Location refactor
  // verifyContract(){
  //   this.isBusy = true;
  //   this.locationService.getCurrentLocation()
  //     .then((location: Location) => {
  //       this.isBusy = false;
  //       if(location != undefined){
  //         this._current_location = location;
  //         this.isCurrentLocation = true;

  //         console.log("gotten location, lat: "+location.lat+", lng: "+location.lng);
        
  //         this._locations_in_db.forEach(location =>{
        
  //           if ((location.ne_lat >= this._current_location.lat && location.ne_lng >= this._current_location.lng) 
  //             && (location.sw_lat <= this._current_location.lat && location.sw_lng <= this._current_location.lng) ){
  //               this.canContract = true;
  //               console.log("in location: "+ location.name);
  //               this._current_location = location;

  //               console.log("looking for a contract between location: "+ this._current_location.id+" and customer " +this._customer_id);
  //               this.contractService.getActiveContract(this._current_location.id, this._customer_id)
  //                 .subscribe(responseContract => {
  //                   console.log("you have a contract --2.1, status: "+responseContract.status);
  //                   console.log("you have a contract --2.1, message: "+responseContract.message);
  //                   if (!responseContract.message){
  //                     console.log("you have a contract: "+responseContract.status);
  //                     this._contract = responseContract;
  //                     this.canContract = false;
  //                     this.hasContract = true;
  //                   }
  //                   this.isBusy = false;
  //                 },error => {
  //                   if (error.status == 404){
                      
  //                     this.canContract = true;
  //                     this.hasContract = false;
  //                   }else{
  //                     alert("Error getting active contract information: "+error);
  //                   }
  //                   this.isBusy = false;
                    
  //                 });
  //             }
  //         });
  //       }
  //       else{
  //         throw "Location not found";
  //       } 
  //     }
  //     ).catch((error) => {
  //       this.isBusy = false;
  //       alert(error)
  //     });
  // }

  nearbyStores(){
    console.log("Checking nearby stores..");
    let stores: Array<Beacon> = [];
    // this.beaconDatabaseService.selectAllBeacons("where role=store").forEach(storeDB=>{
    this.beaconDatabaseService.selectBeacons("store").forEach(storeDB=>{
      // console.log("storeDB iden: "+storeDB.identificator);
      this.currentBeacons.forEach(beaconCurrent=>{
        console.log("beaconCurrent iden: "+beaconCurrent.identificator);
        if(storeDB.identificator==beaconCurrent.identificator){
          stores.push(storeDB);
        }
      });
    });
      
    return stores;
  }

  nearbyItems(){
    let items: Array<Beacon> = [];
    this.beaconDatabaseService.selectBeacons("item", this.location_id).forEach(itemDB=>{
      this.currentBeacons.forEach(beaconCurrent=>{
        // console.log("beacon db: "+itemDB.identificator);
        // console.log("beacon current: "+beaconCurrent.identificator);
        if(itemDB.identificator==beaconCurrent.identificator){
          // console.log("Nearby item: "+itemDB.name);
          items.push(itemDB);
        }
      });
    });
      
    return items;
  }
  dateFormatter(date: Date){
    return date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
  }

  verifyVisit(){
    let nearbyStores = this.nearbyStores();
    console.log("Nearby stores: "+nearbyStores.length)
    if (nearbyStores.length>0){
      nearbyStores.forEach(store=>{
        console.log("Store identificator: "+store.identificator);
        let visit  = this.visitDatabaseService.selectVisitByBeacon(store.identificator);
        
        // console.log("visit id: "+visit);
        // console.log("visit.id: "+visit.id);
        // console.log("visit[0]: "+visit[0]);
        // Verify if visit is being created
        if (visit != null){

          this.atStore = "@"+store.name;
          // console.log("visit constructor name: "+visit.constructor.name);

          let start = new Date(visit.start);
          let end = new Date(visit.end);
          let duration = end.getTime() - start.getTime();
          let sinceLast = new Date().getTime() - end.getTime();
          // console.log("visit typeof: "+typeof visit);
          // console.log("start xa.: "+(visit.start));
          // console.log("start: "+(start.getTime()));
          // console.log("start: "+(start.toDateString()));
          // console.log("start: "+(start.toString()));
          // console.log("start: "+(this.dateFormatter(start)));
          // // console.log("end: "+ end.getTime());
          // console.log('visit duration: '+duration);
          // console.log('visit sinceLast: '+sinceLast);

          // console.log("Visit post test id: "+visit.id);
          // console.log("Visit post test beacon: "+visit.beacon);
          // this.visitService.createVisit(visit).subscribe(response => { 
          //   // this.isBusy = false;
          //   Toast.makeText("Visit Sent!").show();
          // },error => {
          //   this.isBusy = false;
          //   alert("Error creating the contract: "+error);
          //   // throw new Error(error);
          // });


          // if last reading of store was less than 20 seconds ago
          if(sinceLast < 59000){ // update end date to current
            // this.visitDatabaseService.updateVisit(visit[0],visit[1],  visit[2] , visit[3] ,new Date(), visit[5] , visit[6] , visit[7]);
            this.visitDatabaseService.updateVisit(visit);
            console.log("visit 'end' updated");
          }else{// if last reading of store was more than 20 seconds ago
            if(duration > 60000){ // if readings lasted more than 3 minutes , send record.. 1 min
              console.log("Sending visit a: "+visit)
              // console.log("Actual implementation pending..");
              this.visitService.createVisit(visit).subscribe(response => { 
                  // this.isBusy = false;
                  Toast.makeText("Visit Sent!").show();
                },error => {
                  this.isBusy = false;
                  alert("Error sending the visit: "+error);
                  // throw new Error(error);
                });

              Toast.makeText("Goodbye from "+store.name).show();

              this.verifyInterest();
              // let interests = this.interestDatabaseService.selectInterests();

              // console.log("how many intersts to finish: "+interests.length);
              // // if there is an interest 
              // if (interests.length > 0){
              //     interests.forEach(interest =>{
              //     let start = new Date(interest.start);
              //     let end = new Date(interest.end);
              //     let duration = end.getTime() - start.getTime();
              //     let sinceLast = new Date().getTime() - end.getTime();
              //     console.log("Interest xd.: "+interest.beacon+", sinceLast: "+sinceLast+", duration: "+duration);
                  
              //     // if duration  > 1 minute then send interest
              //     if( duration > 60000){
              //         console.log("Sending interest b e.: "+interest.beacon)
              //         console.log("Actual implementation pending.. work in progress..");
              //         this.interestService.createInterest(interest).subscribe(response => { 
              //           // this.isBusy = false;
              //           Toast.makeText("Interest Sent!").show();
              //         },error => {
              //           this.isBusy = false;
              //           alert("Error sending the interest: "+error);
              //           // throw new Error(error);
              //         });

              //         Toast.makeText("Interest stored.").show();
              //         console.log("Interest stored.")

              //         // finishedInterests.push(interest);
              //     }
              //     console.log("Deleting interest due to expiring contract f.: "+interest.beacon);
              //     this.interestDatabaseService.deleteInterest(interest.id);
                  
              //     });
              // }

              console.log("Contract info..");
              console.log("this._contract: "+this._contract);
              // console.log("this._contract.options: "+this._contract.options);
              // console.log("this._contract.options['expire_method']: "+this._contract.options['expire_method']);
              
              if( typeof this._contract !== "undefined" && typeof this._contract.options['expire_method'] !== "undefined" && this._contract.options['expire_method'] == 'location'){
                // expire contract if location on
                this.isBusy = true;
                this.contractService.expireContract(this._contract.location_id,this._contract.customer_id)
                  .subscribe(responseContract => {
                    this.isBusy = false;
                    // alert("Contract expired succesfully!");
                    Toast.makeText("Contract expired succesfully!").show();
                  },error => {
                    console.log("error in contract");
                    if (error.status != 404){
                      alert("Error expiring the contract: "+error);
                    }
                    this.isBusy = false;
                  });
              }


            } 
            // delete record
            console.log("Deleting visit due to less than 59 seconds: "+visit.id);
            this.visitDatabaseService.deleteVisit(visit.id);
            
          
          }
        }else{
          console.log("Creating new visit")
          let visitObj = new Visit(this._customer_id, store.identificator);
          visitObj.keywords=store.keywords;
          console.log("visitObj constructor name: "+ visitObj.constructor.name);

          this.visitDatabaseService.insertVisit(visitObj);
          Toast.makeText("Welcome to "+store.name).show();
          this.atStore = "@"+store.name;
        }
      });
    }else{
      // Retrive all visits (should be max 1)
      let visits = this.visitDatabaseService.selectVisits();

      console.log("how many visits: "+visits.length);
      // if there is an visit 
      if (visits.length > 0){
        visits.forEach(visit =>{
          let start = new Date(visit.start);
          let end = new Date(visit.end);
          let duration = end.getTime() - start.getTime();
          let sinceLast = new Date().getTime() - end.getTime();

          console.log("visit .: "+visit.id);
          console.log("start x.: "+start.getTime());
          console.log("end x.: "+end.getTime());
          console.log("sinceLast yb.: "+ sinceLast);
          console.log("duration yc.: "+ duration);
          console.log("Visit xg.: "+visit.beacon+", sinceLast: "+sinceLast+", duration: "+duration);
          // if sinceLast > 60 seconds <- this is crucial for knowing if it is away
          if(sinceLast > 60000){
            // if duration  > 1 minute then send visit
            if( duration > 60000){
              console.log("Sending visit b .: "+visit)
              // console.log("Actual implementation pending..");
              this.visitService.createVisit(visit).subscribe(response => { 
                  // this.isBusy = false;
                  Toast.makeText("Visit Sent!").show();
                },error => {
                  this.isBusy = false;
                  alert("Error sending the visit: "+error);
                  // throw new Error(error);
                });


              this.atStore = "";
              Toast.makeText("Goodbye!").show();

              // Send finished interests
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
              // Retrive all interests (should be max 1)
              // let interests = this.interestDatabaseService.selectInterests();

              // console.log("how many intersts to finish: "+interests.length);
              // // if there is an interest 
              // if (interests.length > 0){
              //     interests.forEach(interest =>{
              //     let start = new Date(interest.start);
              //     let end = new Date(interest.end);
              //     let duration = end.getTime() - start.getTime();
              //     let sinceLast = new Date().getTime() - end.getTime();
              //     console.log("Interest xg.: "+interest.beacon+", sinceLast: "+sinceLast+", duration: "+duration);
                  
              //     // if duration  > 1 minute then send interest
              //     if( duration > 60000){
              //         console.log("Sending interest b h.: "+interest.beacon)
              //         console.log("Actual implementation pending.. work in progress..");
              //         this.interestService.createInterest(interest).subscribe(response => { 
              //           // this.isBusy = false;
              //           Toast.makeText("Interest Sent!").show();
              //         },error => {
              //           this.isBusy = false;
              //           alert("Error sending the interest: "+error);
              //           // throw new Error(error);
              //         });

              //         Toast.makeText("Interest stored.").show();
              //         console.log("Interest stored.")

              //         // finishedInterests.push(interest);
              //     }
              //     console.log("Deleting interest due to expiring contract i.: "+interest.beacon);
              //     this.interestDatabaseService.deleteInterest(interest.id);
                  
              //     });

                  
              // }


              console.log("Contract info..");
              console.log("this._contract: "+this._contract);
              // console.log("this._contract.options: "+this._contract.options);
              // console.log("this._contract.options['expire_method']: "+this._contract.options['expire_method']);

              if( typeof this._contract !== "undefined" && typeof this._contract.options['expire_method'] !== "undefined" && this._contract.options['expire_method'] == 'location'){
                // expire contract if location on
                this.isBusy = true;
                this.contractService.expireContract(this._contract.location_id,this._contract.customer_id)
                  .subscribe(responseContract => {
                    this.isBusy = false;
                    // alert("Contract expired succesfully!");
                    Toast.makeText("Contract expired succesfully!").show();
                  },error => {
                    console.log("error in contract");
                    if (error.status != 404){
                      alert("Error expiring the contract: "+error);
                    }
                    this.isBusy = false;
                  });
              }

            }
            console.log("Deleting visit due to more than 1 minute away d.: "+visit.id);
            this.visitDatabaseService.deleteVisit(visit.id);
          }
        });
      }
    }
  }

  verifyBehavior(){
    let nearbyItems = this.nearbyItems();
    console.log("Nearby items: "+nearbyItems.length)

    if (nearbyItems.length>0){
      nearbyItems.forEach(item=>{
        console.log("Beacon identificator: "+item.identificator);
        let interest: Interest  = this.interestDatabaseService.selectInterestByBeacon(item.identificator);
        // console.log("interest len: "+ interest.)
        // Verify if interest is being created
        if (interest != null){
          let start = new Date(interest.start);
          let end = new Date(interest.end);
          let duration = end.getTime() - start.getTime();
          let sinceLast = new Date().getTime() - end.getTime();
          console.log("interest type: "+ typeof interest);
          console.log("interest constructor name: "+ interest.constructor.name);
          console.log("interest instance of Interest: "+ (interest instanceof Interest));
          // console.log("start: "+(start.getTime()));
          // console.log("end: "+ end.getTime());
          console.log('interest duration: '+duration);
          console.log('interest sinceLast: '+sinceLast);
          // if last reading of item was less than 20 seconds ago
          if(sinceLast < 59000){ // update end date to current
            // this.interestDatabaseService.updateInterest(interest[0],interest[1],  interest[2] , interest[3] ,new Date(), interest[5] , interest[6] , interest[7]);
            this.interestDatabaseService.updateInterest(interest);
            console.log("interest 'end' updated");
          }else{// if last reading of item was more than 20 seconds ago
            if(duration > 60000){ // if readings lasted more than 60 seconds, send record
              console.log("Sending interest a : "+interest)
              console.log("Actual implementation pending.. work in progress..");
              this.interestService.createInterest(interest).subscribe(response => { 
                // this.isBusy = false;
                Toast.makeText("Interest Sent!").show();
              },error => {
                this.isBusy = false;
                alert("Error sending the interest: "+error);
                // throw new Error(error);
              });
              Toast.makeText("Interest stored.").show();
            }
            // delete record
            console.log("Deleting interest due to less than 20 seconds: "+interest.id);
            this.interestDatabaseService.deleteInterest(interest.id);
          
          }
        }else{
          console.log("Creating new interest")
          let interestObj = new Interest(this._customer_id, item.identificator);
          interestObj.keywords=item.keywords;
          console.log("cId unde: "+this._customer_id);
          console.log("iId unde: "+item.identificator);
          console.log("interestObj constructor name: "+ interestObj.constructor.name)
          this.interestDatabaseService.insertInterest(interestObj);
          Toast.makeText("Recording interest.").show();
        }
      });
    }else{
      this.verifyInterest();
      // // Retrive all interests (should be max 1)
      // let interests = this.interestDatabaseService.selectInterests();

      // console.log("how many intersts: "+interests.length);
      // // if there is an interest 
      // if (interests.length > 0){
      //   interests.forEach(interest =>{
      //     let start = new Date(interest.start);
      //     let end = new Date(interest.end);
      //     let duration = end.getTime() - start.getTime();
      //     let sinceLast = new Date().getTime() - end.getTime();
      //     // if sinceLast > 60 seconds <- this is crucial for knowing if it is away
      //     console.log("Interest xa.: "+interest.beacon+", sinceLast: "+sinceLast+", duration: "+duration);
      //     if(sinceLast > 60000){
      //       // if duration  > 1 minute then send interest
      //       if( duration > 60000){
      //         console.log("Sending interest b b.: "+interest.beacon)
      //         console.log("Actual implementation pending.. work in progress..");
      //         this.interestService.createInterest(interest).subscribe(response => { 
      //           // this.isBusy = false;
      //           Toast.makeText("Interest Sent!").show();
      //         },error => {
      //           this.isBusy = false;
      //           alert("Error sending the interest: "+error);
      //           // throw new Error(error);
      //         });
      //         Toast.makeText("Interest stored.").show();
      //       }
      //       console.log("Deleting interest due to more than 1 minute away c.: "+interest.id);
      //       this.interestDatabaseService.deleteInterest(interest.id);
      //     }
      //   });
      // }
    }
  }

  verifyInterest(){
    // Retrive all interests (should be max 1)
    let interests = this.interestDatabaseService.selectInterests();

    console.log("how many intersts: "+interests.length);
    // if there is an interest 
    if (interests.length > 0){
      interests.forEach(interest =>{
        let start = new Date(interest.start);
        let end = new Date(interest.end);
        let duration = end.getTime() - start.getTime();
        let sinceLast = new Date().getTime() - end.getTime();
        // if sinceLast > 60 seconds <- this is crucial for knowing if it is away
        console.log("Interest xa.: "+interest.beacon+", sinceLast: "+sinceLast+", duration: "+duration);
        if(sinceLast > 60000){
          // if duration  > 1 minute then send interest
          if( duration > 60000){
            console.log("Sending interest b b.: "+interest.beacon)
            console.log("Actual implementation pending.. work in progress..");
            this.interestService.createInterest(interest).subscribe(response => { 
              // this.isBusy = false;
              Toast.makeText("Interest Sent!").show();
            },error => {
              this.isBusy = false;
              alert("Error sending the interest: "+error);
              // throw new Error(error);
            });
            Toast.makeText("Interest stored.").show();
          }
          console.log("Deleting interest due to more than 1 minute away c.: "+interest.id);
          this.interestDatabaseService.deleteInterest(interest.id);
        }
      });
    }  
  }

  verifyContract(){
    console.log("Verifying contracts..");
    // this.isBusy = true;
    let nearbyStores = this.nearbyStores();
    console.log("Nearby stores: "+nearbyStores.length)
    if (nearbyStores.length>0){
      nearbyStores.forEach(store => {
        this.contractService.getActiveContract( this._customer_id ,parseInt(store.location_id))
        .subscribe(responseContract => {
          if (!responseContract.message){
            this._contract = responseContract;
            this.canContract = false;
            this.hasContract = true;
            if (this._contract.options['expire_method']=="location"){
              this.expirationText = "Expires leaving the store.";
            }else{
              let dt = new Date(this._contract.expire);
              
              this.expirationText = "Expires at: "+dt.getDate()+"/"+dt.getMonth()+"/"+dt.getFullYear()+" "+dt.getHours()+":"+dt.getMinutes()+":"+dt.getSeconds();
            }
            
            this.location_id = store.location_id;
            console.log("Active contract.");
          }
          this.isBusy = false;
        },error => {
          if (error.status == 404){
            this.canContract = true;
            this.hasContract = false;
            console.log("No active Contracts.");

            console.log("Visits and interests to send?");

          }else{
            alert("Error getting active contract information: "+error);
          }
          this.isBusy = false;  
        });
      });
    }else{
      console.log("about to verify contract without store/location");
      console.log("cust: "+this._customer_id);
      this.contractService.getActiveContract( this._customer_id )
        .subscribe(responseContract => {
          console.log("message? "+responseContract);
          if (!responseContract.message){
            this._contract = responseContract;
            this.canContract = false;
            this.hasContract = true;
            if (this._contract.options['expire_method']=="location"){
              this.expirationText = "Expires leaving the store.";
            }else{
              let dt = new Date(this._contract.expire);
              this.expirationText = "Expires at: "+dt.getDate()+"/"+dt.getMonth()+"/"+dt.getFullYear()+" "+dt.getHours()+":"+dt.getMinutes()+":"+dt.getSeconds();
            }
            this.location_id = responseContract.location_id;
            console.log("Active contract.");
          }
          else{
            console.log("contract but no message")
          }
          this.isBusy = false;
        },error => {
          if (error.status == 404){
            this.canContract = true;
            this.hasContract = false;
            console.log("No active Contracts.");
          }else{
            alert("Error getting active contract information: "+error);
          }
          this.isBusy = false;  
        });
    }
  }

  // Location refactor
  // private getCurrentLocation(){
  //   // TODO get own coordenates
  //   this.isBusy = true;
  //   this.locationService.getCurrentLocation()
  //     .then((location: Location) => {
  //       this.isBusy = false;
  //       if(location != undefined){
  //         this._current_location = location;
  //         this.isCurrentLocation = true;
  //       }
  //       else{
  //         throw "Location not found";
  //       } 
  //     }
  //     ).catch((error) => {
  //       this.isBusy = false;
  //       alert(error)
  //     });
  // }


  // METHODS ONLY FOR TESTING DATABASE
  public showLocationsInDatabase() { 
    this._locations_in_db.forEach(location => {
      alert("Location: "+location.name);
    });
  }

  // Location refactor
  // public isLocationDatabaseEmpty(){
  //   let empty = true;
  //   // console.log("Test1.6");
  //   // console.log("Test1.7, length: "+this.locationDatabaseService.selectAllLocations().length);
  //   if (this.locationDatabaseService.selectAllLocations().length > 0){
  //     console.log("Database empty");
  //     empty = false;
  //   }
  //   return empty;
  // }

  // Location refactor
  // public updateLocationDatabase(){
  //   // alert("updating locations db..")
  //   // Drops DB if  exist
  //   this.locationDatabaseService.dropTable();
  //   // Creates DB if not exist
  //   this.locationDatabaseService.createTable();

  //   this.isBusy = true;
  //   this.locationService.getLocations()
  //     .subscribe(response => {
  //       this.isBusy = false;
        
  //       response.forEach(location => {
  //         // console.log("location name: "+ location.name);
  //         this.locationDatabaseService.insertLocation(location);

  //       });
  //       this.router.navigate(["/main"]);  
  //     },error => {
  //       this.isBusy = false;
  //       alert(error);
  //     });
  // }

  public isBeaconDatabaseEmpty(){
    let empty = true;
    // console.log("Test1.6");
    // console.log("Test1.7, length: "+this.locationDatabaseService.selectAllLocations().length);
    if (this.beaconDatabaseService.selectBeacons("all").length > 0){
      empty = false;
    }

    return empty;
  }

  public updateBeaconDatabase(){
    // alert("updating locations db..")
    // Drops DB if  exist
    this.beaconDatabaseService.dropTable();
    // Creates DB if not exist
    this.beaconDatabaseService.createTable();
    console.log("Local DB created, no errors so far..");
    this.isBusy = true;
    this.beaconService.getBeacons()
      .subscribe(response => {
        this.isBusy = false;
        
        response.forEach(beacon => {
          // console.log("location name: "+ location.name);
          this.beaconDatabaseService.insertBeacon(beacon);

        });
        console.log("Local DB updated.");
        this.router.navigate(["/"], { clearHistory: true });
      },error => {
        this.isBusy = false;
        alert(error);
      });
  }
}