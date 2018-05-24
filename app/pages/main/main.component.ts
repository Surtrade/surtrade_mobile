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
import { BeaconService } from "../../shared/beacon/beacon.service";
import { BeaconDatabaseService } from "../../shared/beacon/beacon.db.service";
import { ContractService } from "../../shared/contract/contract.service";

import * as application from 'application';
import { AndroidApplication, AndroidActivityBackPressedEventData } from "application";
import { isAndroid } from "platform";
import { Beacon } from "../../shared/beacon/beacon";

// import { storage } from "../../utils/local";
var appSettings = require("application-settings");

// estimote beacons
var Estimote = require("nativescript-estimote-sdk");
import * as Permissions from "nativescript-permissions";
declare var android: any;

@Component({
    selector: "main",
    providers: [BeaconService, BeaconDatabaseService, ContractService],
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
    private contractService: ContractService,
    private route: ActivatedRoute,
    private router: RouterExtensions,
    private locationCommon: LocationCommon,
    private zone: NgZone,
    private page: Page
  ){
      console.log("Main Constructor");
      this.isBusy = true;
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

    if (isAndroid) {
      application.android.on(AndroidApplication.activityBackPressedEvent, (data: AndroidActivityBackPressedEventData) => {
        this.router.navigate(["/"]), { clearHistory: true };
        // this.logout();
      });
    }

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
        console.log("Amount of Beacons in range: "+beacons.length)
        this.zone.run(() => {
          // console.log("Amount of Beacons in range: "+beacons.count)
          if(beacons.length>0){
            this.currentBeacons = [];
            beacons.forEach(beacon => {
              if(beacon.major){
                
                let b =new Beacon(beacon.major.toString(),beacon.minor.toString());
                // console.log("Beacon identificator "+b.identificator);
                this.currentBeacons.push(b);
              }
            });

            // Check for active contracts
            this.verifyContract();
            console.log("+++++++++++++++++++++++++")
            // Check for nearby item beacons
            this.verifyBehavior();
            console.log("-------------------------")
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

    //Updates the DB, this should not be done every time, but rather once every day
    if(this.isBeaconDatabaseEmpty()){
      console.log("Local DB is empty.");
      this.updateBeaconDatabase();
    }else{
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
    let stores: Array<Beacon> = [];
    // this.beaconDatabaseService.selectAllBeacons("where role=store").forEach(storeDB=>{
    this.beaconDatabaseService.selectBeacons("store").forEach(storeDB=>{
      // console.log("storeDB iden: "+storeDB.identificator);
      this.currentBeacons.forEach(beaconCurrent=>{
        // console.log("beaconCurrent iden: "+beaconCurrent.identificator);
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

  verifyBehavior(){
    let nearbyItems = this.nearbyItems();
    console.log("Nearby items: "+nearbyItems.length)

    nearbyItems.forEach(item=>{
      
    });
  }

  verifyContract(){
    console.log("Verifying contracts..");
    this.isBusy = true;
    let nearbyStores = this.nearbyStores();
    console.log("Nearby stores: "+nearbyStores.length)
    if (nearbyStores.length>0){
      nearbyStores.forEach(store => {
        this.contractService.getActiveContract(store.location_id, this._customer_id)
        .subscribe(responseContract => {
          if (!responseContract.message){
            this._contract = responseContract;
            this.canContract = false;
            this.hasContract = true;
            this.location_id = store.location_id;
            console.log("Active contract.");
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