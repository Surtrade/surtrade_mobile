"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var dialogs = require("ui/dialogs");
var page_1 = require("tns-core-modules/ui/page");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
var common_1 = require("@angular/common");
// import { LocationService } from "../../shared/location/location.service";
// import { LocationDatabaseService } from '../../shared/location/location.db.service';
var visit_service_1 = require("../../shared/visit/visit.service");
var visit_db_service_1 = require("../../shared/visit/visit.db.service");
var interest_service_1 = require("../../shared/interest/interest.service");
var interest_db_service_1 = require("../../shared/interest/interest.db.service");
var beacon_service_1 = require("../../shared/beacon/beacon.service");
var beacon_db_service_1 = require("../../shared/beacon/beacon.db.service");
var contract_service_1 = require("../../shared/contract/contract.service");
var platform_1 = require("platform");
var beacon_1 = require("../../shared/beacon/beacon");
var visit_1 = require("../../shared/visit/visit");
var interest_1 = require("../../shared/interest/interest");
var Toast = require("nativescript-toast");
// import { storage } from "../../utils/local";
var appSettings = require("application-settings");
// estimote beacons
var Estimote = require("nativescript-estimote-sdk");
var Permissions = require("nativescript-permissions");
var MainComponent = /** @class */ (function () {
    function MainComponent(
    // private locationService: LocationService,
    // private locationDatabaseService: LocationDatabaseService,
    beaconService, beaconDatabaseService, visitService, visitDatabaseService, interestService, interestDatabaseService, contractService, route, router, locationCommon, zone, page) {
        this.beaconService = beaconService;
        this.beaconDatabaseService = beaconDatabaseService;
        this.visitService = visitService;
        this.visitDatabaseService = visitDatabaseService;
        this.interestService = interestService;
        this.interestDatabaseService = interestDatabaseService;
        this.contractService = contractService;
        this.route = route;
        this.router = router;
        this.locationCommon = locationCommon;
        this.zone = zone;
        this.page = page;
        // private _all_locations: Array<Location>;
        this._name = "carlos";
        // button flags
        // public inLocation = false;
        this.isCurrentLocation = false;
        this.isAllLocations = false;
        this.isBusy = false;
        this.canContract = false;
        this.hasContract = false;
        this.expirationText = "";
        this.atStore = "@Flick's";
        // Icons
        this.gearsIcon = String.fromCharCode(0xf085);
        this.logoutIcon = String.fromCharCode(0xf08b);
        this.handshakeIcon = String.fromCharCode(0xf2b5);
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
    MainComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log("Main on Init");
        // Return to login if app settings are not set
        if (!appSettings.hasKey("user_name") || !appSettings.hasKey("user_password")) {
            this.router.navigate(["/"]), { clearHistory: true };
        }
        // if (isAndroid) {
        //   application.android.on(AndroidApplication.activityBackPressedEvent, (data: AndroidActivityBackPressedEventData) => {
        //     this.router.navigate(["/"]), { clearHistory: true };
        //     // this.logout();
        //   });
        // }
        this.title = "Welcome " + appSettings.getString("user_name");
        try {
            this._customer_id = appSettings.getNumber("user_id");
            console.log("trying cust: " + this._customer_id);
        }
        catch (e) {
            this._customer_id = 0;
        }
        // Beacons process
        this.options = {
            region: 'Progress',
            callback: function (beacons) {
                // console.log("Beacons: "+beacons)
                // console.log("Amount of Beacons in range: "+beacons.length)
                _this.zone.run(function () {
                    console.log("Amount of Beacons in range: " + beacons.length);
                    if (beacons.length > 0) {
                        _this.currentBeacons = [];
                        beacons.forEach(function (beacon) {
                            if (beacon.major) {
                                var b = new beacon_1.Beacon(beacon.major.toString(), beacon.minor.toString());
                                // console.log("Beacon identificator "+b.identificator);
                                _this.currentBeacons.push(b);
                            }
                        });
                    }
                    else {
                        _this.currentBeacons = [];
                    }
                    // Check for active contracts
                    console.log("+++++++++++++++++++++++++");
                    _this.verifyContract();
                    // Check if user is in store or just passing by
                    console.log("*************************");
                    _this.verifyVisit();
                    // Check if behaviour tracking is enabled and track
                    if (typeof _this._contract !== "undefined" && typeof _this._contract.options['behaviour_tracking'] !== "undefined" && _this._contract.options['behaviour_tracking']) {
                        console.log("-------------------------");
                        _this.verifyBehavior();
                    }
                });
            }
        };
        this.estimote = new Estimote(this.options);
        if (platform_1.isAndroid) {
            console.log("It is Android");
            Permissions.requestPermissions([
                android.Manifest.permission.ACCESS_COARSE_LOCATION,
                android.Manifest.permission.ACCESS_FINE_LOCATION,
                android.Manifest.permission.BLUETOOTH,
                android.Manifest.permission.BLUETOOTH_ADMIN
            ], "Permissions of Surtrade")
                .then(function () {
                console.log("Permissions granted");
                _this.estimote.startRanging();
                console.log("Start ranging");
            }).catch(function (error) {
                alert("Error getting permissions: " + error.message);
            });
        }
        else {
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
        if (this.isBeaconDatabaseEmpty()) {
            console.log("Local DB is empty.");
            this.updateBeaconDatabase();
        }
        else {
            // Delete: next line should be used only periodically.
            // this.updateBeaconDatabase();
            console.log("Local DB has data.");
        }
        this.page.on('navigatingFrom', function (data) {
            // run destroy code
            // (note: this will run when you either move forward to a new page or back to the previous page)
            // Beacons stop
            _this.estimote.stopRanging();
            console.log("Stop ranging");
        });
    };
    MainComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        // Location refactor
        // this.locationService.stopWatchingLocation(this._watch_location_id)
        // // Beacons stop
        // this.estimote.stopRanging();
        // console.log("Stop ranging");
        // this.verifyVisit();
        // this.verifyBehavior();
    };
    MainComponent.prototype.contractSettings = function () {
        // this.router.navigate(["/contractcreate/"+this._current_location.id+"/1"], {
        this.router.navigate(["/contractcreate", this.location_id, 1], {
            // animation: true,
            transition: {
                name: "slideLeft",
                duration: 200,
                curve: "linear"
            }
        });
    };
    MainComponent.prototype.createContract = function () {
        var _this = this;
        var stores = this.nearbyStores();
        var store_names = [];
        // let location_ids = [];
        stores.forEach(function (store) {
            store_names.push(store.name);
            // location_ids.push(store.location_id);
        });
        dialogs.action({
            message: "Select Store",
            cancelButtonText: "Cancel",
            actions: store_names
        }).then(function (name) {
            stores.forEach(function (store) {
                if (store.name == name) {
                    console.log("Going to create contract.");
                    _this.router.navigate(["/contractcreate", store.location_id, 0], {
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
    };
    MainComponent.prototype.logout = function () {
        appSettings.remove("user_name");
        appSettings.remove("user_password");
        this.router.navigate(["/"], { clearHistory: true });
    };
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
    MainComponent.prototype.nearbyStores = function () {
        var _this = this;
        console.log("Checking nearby stores..");
        var stores = [];
        // this.beaconDatabaseService.selectAllBeacons("where role=store").forEach(storeDB=>{
        this.beaconDatabaseService.selectBeacons("store").forEach(function (storeDB) {
            // console.log("storeDB iden: "+storeDB.identificator);
            _this.currentBeacons.forEach(function (beaconCurrent) {
                console.log("beaconCurrent iden: " + beaconCurrent.identificator);
                if (storeDB.identificator == beaconCurrent.identificator) {
                    stores.push(storeDB);
                }
            });
        });
        return stores;
    };
    MainComponent.prototype.nearbyItems = function () {
        var _this = this;
        var items = [];
        this.beaconDatabaseService.selectBeacons("item", this.location_id).forEach(function (itemDB) {
            _this.currentBeacons.forEach(function (beaconCurrent) {
                // console.log("beacon db: "+itemDB.identificator);
                // console.log("beacon current: "+beaconCurrent.identificator);
                if (itemDB.identificator == beaconCurrent.identificator) {
                    // console.log("Nearby item: "+itemDB.name);
                    items.push(itemDB);
                }
            });
        });
        return items;
    };
    MainComponent.prototype.dateFormatter = function (date) {
        return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    };
    MainComponent.prototype.verifyVisit = function () {
        var _this = this;
        var nearbyStores = this.nearbyStores();
        console.log("Nearby stores: " + nearbyStores.length);
        if (nearbyStores.length > 0) {
            nearbyStores.forEach(function (store) {
                console.log("Store identificator: " + store.identificator);
                var visit = _this.visitDatabaseService.selectVisitByBeacon(store.identificator);
                // console.log("visit id: "+visit);
                // console.log("visit.id: "+visit.id);
                // console.log("visit[0]: "+visit[0]);
                // Verify if visit is being created
                if (visit != null) {
                    _this.atStore = "@" + store.name;
                    // console.log("visit constructor name: "+visit.constructor.name);
                    var start = new Date(visit.start);
                    var end = new Date(visit.end);
                    var duration = end.getTime() - start.getTime();
                    var sinceLast = new Date().getTime() - end.getTime();
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
                    if (sinceLast < 59000) {
                        // this.visitDatabaseService.updateVisit(visit[0],visit[1],  visit[2] , visit[3] ,new Date(), visit[5] , visit[6] , visit[7]);
                        _this.visitDatabaseService.updateVisit(visit);
                        console.log("visit 'end' updated");
                    }
                    else {
                        if (duration > 60000) {
                            console.log("Sending visit a: " + visit);
                            // console.log("Actual implementation pending..");
                            _this.visitService.createVisit(visit).subscribe(function (response) {
                                // this.isBusy = false;
                                Toast.makeText("Visit Sent!").show();
                            }, function (error) {
                                _this.isBusy = false;
                                alert("Error sending the visit: " + error);
                                // throw new Error(error);
                            });
                            Toast.makeText("Goodbye from " + store.name).show();
                            _this.verifyInterest();
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
                            console.log("this._contract: " + _this._contract);
                            // console.log("this._contract.options: "+this._contract.options);
                            // console.log("this._contract.options['expire_method']: "+this._contract.options['expire_method']);
                            if (typeof _this._contract !== "undefined" && typeof _this._contract.options['expire_method'] !== "undefined" && _this._contract.options['expire_method'] == 'location') {
                                // expire contract if location on
                                _this.isBusy = true;
                                _this.contractService.expireContract(_this._contract.location_id, _this._contract.customer_id)
                                    .subscribe(function (responseContract) {
                                    _this.isBusy = false;
                                    // alert("Contract expired succesfully!");
                                    Toast.makeText("Contract expired succesfully!").show();
                                }, function (error) {
                                    console.log("error in contract");
                                    if (error.status != 404) {
                                        alert("Error expiring the contract: " + error);
                                    }
                                    _this.isBusy = false;
                                });
                            }
                        }
                        // delete record
                        console.log("Deleting visit due to less than 59 seconds: " + visit.id);
                        _this.visitDatabaseService.deleteVisit(visit.id);
                    }
                }
                else {
                    console.log("Creating new visit");
                    var visitObj = new visit_1.Visit(_this._customer_id, store.identificator);
                    visitObj.keywords = store.keywords;
                    console.log("visitObj constructor name: " + visitObj.constructor.name);
                    _this.visitDatabaseService.insertVisit(visitObj);
                    Toast.makeText("Welcome to " + store.name).show();
                    _this.atStore = "@" + store.name;
                }
            });
        }
        else {
            // Retrive all visits (should be max 1)
            var visits = this.visitDatabaseService.selectVisits();
            console.log("how many visits: " + visits.length);
            // if there is an visit 
            if (visits.length > 0) {
                visits.forEach(function (visit) {
                    var start = new Date(visit.start);
                    var end = new Date(visit.end);
                    var duration = end.getTime() - start.getTime();
                    var sinceLast = new Date().getTime() - end.getTime();
                    console.log("visit .: " + visit.id);
                    console.log("start x.: " + start.getTime());
                    console.log("end x.: " + end.getTime());
                    console.log("sinceLast yb.: " + sinceLast);
                    console.log("duration yc.: " + duration);
                    console.log("Visit xg.: " + visit.beacon + ", sinceLast: " + sinceLast + ", duration: " + duration);
                    // if sinceLast > 60 seconds <- this is crucial for knowing if it is away
                    if (sinceLast > 60000) {
                        // if duration  > 1 minute then send visit
                        if (duration > 60000) {
                            console.log("Sending visit b .: " + visit);
                            // console.log("Actual implementation pending..");
                            _this.visitService.createVisit(visit).subscribe(function (response) {
                                // this.isBusy = false;
                                Toast.makeText("Visit Sent!").show();
                            }, function (error) {
                                _this.isBusy = false;
                                alert("Error sending the visit: " + error);
                                // throw new Error(error);
                            });
                            _this.atStore = "";
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
                            _this.verifyInterest();
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
                            console.log("this._contract: " + _this._contract);
                            // console.log("this._contract.options: "+this._contract.options);
                            // console.log("this._contract.options['expire_method']: "+this._contract.options['expire_method']);
                            if (typeof _this._contract !== "undefined" && typeof _this._contract.options['expire_method'] !== "undefined" && _this._contract.options['expire_method'] == 'location') {
                                // expire contract if location on
                                _this.isBusy = true;
                                _this.contractService.expireContract(_this._contract.location_id, _this._contract.customer_id)
                                    .subscribe(function (responseContract) {
                                    _this.isBusy = false;
                                    // alert("Contract expired succesfully!");
                                    Toast.makeText("Contract expired succesfully!").show();
                                }, function (error) {
                                    console.log("error in contract");
                                    if (error.status != 404) {
                                        alert("Error expiring the contract: " + error);
                                    }
                                    _this.isBusy = false;
                                });
                            }
                        }
                        console.log("Deleting visit due to more than 1 minute away d.: " + visit.id);
                        _this.visitDatabaseService.deleteVisit(visit.id);
                    }
                });
            }
        }
    };
    MainComponent.prototype.verifyBehavior = function () {
        var _this = this;
        var nearbyItems = this.nearbyItems();
        console.log("Nearby items: " + nearbyItems.length);
        if (nearbyItems.length > 0) {
            nearbyItems.forEach(function (item) {
                console.log("Beacon identificator: " + item.identificator);
                var interest = _this.interestDatabaseService.selectInterestByBeacon(item.identificator);
                // console.log("interest len: "+ interest.)
                // Verify if interest is being created
                if (interest != null) {
                    var start = new Date(interest.start);
                    var end = new Date(interest.end);
                    var duration = end.getTime() - start.getTime();
                    var sinceLast = new Date().getTime() - end.getTime();
                    console.log("interest type: " + typeof interest);
                    console.log("interest constructor name: " + interest.constructor.name);
                    console.log("interest instance of Interest: " + (interest instanceof interest_1.Interest));
                    // console.log("start: "+(start.getTime()));
                    // console.log("end: "+ end.getTime());
                    console.log('interest duration: ' + duration);
                    console.log('interest sinceLast: ' + sinceLast);
                    // if last reading of item was less than 20 seconds ago
                    if (sinceLast < 59000) {
                        // this.interestDatabaseService.updateInterest(interest[0],interest[1],  interest[2] , interest[3] ,new Date(), interest[5] , interest[6] , interest[7]);
                        _this.interestDatabaseService.updateInterest(interest);
                        console.log("interest 'end' updated");
                    }
                    else {
                        if (duration > 60000) {
                            console.log("Sending interest a : " + interest);
                            console.log("Actual implementation pending.. work in progress..");
                            _this.interestService.createInterest(interest).subscribe(function (response) {
                                // this.isBusy = false;
                                Toast.makeText("Interest Sent!").show();
                            }, function (error) {
                                _this.isBusy = false;
                                alert("Error sending the interest: " + error);
                                // throw new Error(error);
                            });
                            Toast.makeText("Interest stored.").show();
                        }
                        // delete record
                        console.log("Deleting interest due to less than 20 seconds: " + interest.id);
                        _this.interestDatabaseService.deleteInterest(interest.id);
                    }
                }
                else {
                    console.log("Creating new interest");
                    var interestObj = new interest_1.Interest(_this._customer_id, item.identificator);
                    interestObj.keywords = item.keywords;
                    console.log("cId unde: " + _this._customer_id);
                    console.log("iId unde: " + item.identificator);
                    console.log("interestObj constructor name: " + interestObj.constructor.name);
                    _this.interestDatabaseService.insertInterest(interestObj);
                    Toast.makeText("Recording interest.").show();
                }
            });
        }
        else {
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
    };
    MainComponent.prototype.verifyInterest = function () {
        var _this = this;
        // Retrive all interests (should be max 1)
        var interests = this.interestDatabaseService.selectInterests();
        console.log("how many intersts: " + interests.length);
        // if there is an interest 
        if (interests.length > 0) {
            interests.forEach(function (interest) {
                var start = new Date(interest.start);
                var end = new Date(interest.end);
                var duration = end.getTime() - start.getTime();
                var sinceLast = new Date().getTime() - end.getTime();
                // if sinceLast > 60 seconds <- this is crucial for knowing if it is away
                console.log("Interest xa.: " + interest.beacon + ", sinceLast: " + sinceLast + ", duration: " + duration);
                if (sinceLast > 60000) {
                    // if duration  > 1 minute then send interest
                    if (duration > 60000) {
                        console.log("Sending interest b b.: " + interest.beacon);
                        console.log("Actual implementation pending.. work in progress..");
                        _this.interestService.createInterest(interest).subscribe(function (response) {
                            // this.isBusy = false;
                            Toast.makeText("Interest Sent!").show();
                        }, function (error) {
                            _this.isBusy = false;
                            alert("Error sending the interest: " + error);
                            // throw new Error(error);
                        });
                        Toast.makeText("Interest stored.").show();
                    }
                    console.log("Deleting interest due to more than 1 minute away c.: " + interest.id);
                    _this.interestDatabaseService.deleteInterest(interest.id);
                }
            });
        }
    };
    MainComponent.prototype.verifyContract = function () {
        var _this = this;
        console.log("Verifying contracts..");
        // this.isBusy = true;
        var nearbyStores = this.nearbyStores();
        console.log("Nearby stores: " + nearbyStores.length);
        if (nearbyStores.length > 0) {
            nearbyStores.forEach(function (store) {
                _this.contractService.getActiveContract(_this._customer_id, parseInt(store.location_id))
                    .subscribe(function (responseContract) {
                    if (!responseContract.message) {
                        _this._contract = responseContract;
                        _this.canContract = false;
                        _this.hasContract = true;
                        if (_this._contract.options['expire_method'] == "location") {
                            _this.expirationText = "Expires leaving the store.";
                        }
                        else {
                            var dt = new Date(_this._contract.expire);
                            _this.expirationText = "Expires at: " + dt.getDate() + "/" + dt.getMonth() + "/" + dt.getFullYear() + " " + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
                        }
                        _this.location_id = store.location_id;
                        console.log("Active contract.");
                    }
                    _this.isBusy = false;
                }, function (error) {
                    if (error.status == 404) {
                        _this.canContract = true;
                        _this.hasContract = false;
                        console.log("No active Contracts.");
                        console.log("Visits and interests to send?");
                    }
                    else {
                        alert("Error getting active contract information: " + error);
                    }
                    _this.isBusy = false;
                });
            });
        }
        else {
            console.log("about to verify contract without store/location");
            console.log("cust: " + this._customer_id);
            this.contractService.getActiveContract(this._customer_id)
                .subscribe(function (responseContract) {
                console.log("message? " + responseContract);
                if (!responseContract.message) {
                    _this._contract = responseContract;
                    _this.canContract = false;
                    _this.hasContract = true;
                    if (_this._contract.options['expire_method'] == "location") {
                        _this.expirationText = "Expires leaving the store.";
                    }
                    else {
                        var dt = new Date(_this._contract.expire);
                        _this.expirationText = "Expires at: " + dt.getDate() + "/" + dt.getMonth() + "/" + dt.getFullYear() + " " + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
                    }
                    _this.location_id = responseContract.location_id;
                    console.log("Active contract.");
                }
                else {
                    console.log("contract but no message");
                }
                _this.isBusy = false;
            }, function (error) {
                if (error.status == 404) {
                    _this.canContract = true;
                    _this.hasContract = false;
                    console.log("No active Contracts.");
                }
                else {
                    alert("Error getting active contract information: " + error);
                }
                _this.isBusy = false;
            });
        }
    };
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
    MainComponent.prototype.showLocationsInDatabase = function () {
        this._locations_in_db.forEach(function (location) {
            alert("Location: " + location.name);
        });
    };
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
    MainComponent.prototype.isBeaconDatabaseEmpty = function () {
        var empty = true;
        // console.log("Test1.6");
        // console.log("Test1.7, length: "+this.locationDatabaseService.selectAllLocations().length);
        if (this.beaconDatabaseService.selectBeacons("all").length > 0) {
            empty = false;
        }
        return empty;
    };
    MainComponent.prototype.updateBeaconDatabase = function () {
        var _this = this;
        // alert("updating locations db..")
        // Drops DB if  exist
        this.beaconDatabaseService.dropTable();
        // Creates DB if not exist
        this.beaconDatabaseService.createTable();
        console.log("Local DB created, no errors so far..");
        this.isBusy = true;
        this.beaconService.getBeacons()
            .subscribe(function (response) {
            _this.isBusy = false;
            response.forEach(function (beacon) {
                // console.log("location name: "+ location.name);
                _this.beaconDatabaseService.insertBeacon(beacon);
            });
            console.log("Local DB updated.");
            _this.router.navigate(["/"], { clearHistory: true });
        }, function (error) {
            _this.isBusy = false;
            alert(error);
        });
    };
    MainComponent = __decorate([
        core_1.Component({
            selector: "main",
            providers: [beacon_service_1.BeaconService, beacon_db_service_1.BeaconDatabaseService, visit_service_1.VisitService, visit_db_service_1.VisitDatabaseService, interest_service_1.InterestService, interest_db_service_1.InterestDatabaseService, contract_service_1.ContractService],
            // providers: [LocationService, LocationDatabaseService, ContractService], 
            // providers: [LocationService, ContractService],
            templateUrl: "pages/main/main.html",
            styleUrls: ["pages/main/main-common.css"]
        }),
        __metadata("design:paramtypes", [beacon_service_1.BeaconService,
            beacon_db_service_1.BeaconDatabaseService,
            visit_service_1.VisitService,
            visit_db_service_1.VisitDatabaseService,
            interest_service_1.InterestService,
            interest_db_service_1.InterestDatabaseService,
            contract_service_1.ContractService,
            router_1.ActivatedRoute,
            router_2.RouterExtensions,
            common_1.Location,
            core_1.NgZone,
            page_1.Page])
    ], MainComponent);
    return MainComponent;
}());
exports.MainComponent = MainComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYWluLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUEwRDtBQUMxRCxvQ0FBc0M7QUFDdEMsaURBQWdEO0FBQ2hELDBDQUFpRDtBQUNqRCxzREFBK0Q7QUFDL0QsMENBQTZEO0FBTTdELDRFQUE0RTtBQUM1RSx1RkFBdUY7QUFDdkYsa0VBQWdFO0FBQ2hFLHdFQUEyRTtBQUMzRSwyRUFBeUU7QUFDekUsaUZBQW9GO0FBQ3BGLHFFQUFtRTtBQUNuRSwyRUFBOEU7QUFDOUUsMkVBQXlFO0FBSXpFLHFDQUFxQztBQUNyQyxxREFBb0Q7QUFDcEQsa0RBQWlEO0FBQ2pELDJEQUEwRDtBQUUxRCwwQ0FBNEM7QUFFNUMsK0NBQStDO0FBQy9DLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBRWxELG1CQUFtQjtBQUNuQixJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUNwRCxzREFBd0Q7QUFZeEQ7SUFzQ0U7SUFDRSw0Q0FBNEM7SUFDNUMsNERBQTREO0lBQ3BELGFBQTRCLEVBQzVCLHFCQUE0QyxFQUM1QyxZQUEwQixFQUMxQixvQkFBMEMsRUFDMUMsZUFBZ0MsRUFDaEMsdUJBQWdELEVBQ2hELGVBQWdDLEVBQ2hDLEtBQXFCLEVBQ3JCLE1BQXdCLEVBQ3hCLGNBQThCLEVBQzlCLElBQVksRUFDWixJQUFVO1FBWFYsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtRQUM1QyxpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQix5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO1FBQzFDLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUNoQyw0QkFBdUIsR0FBdkIsdUJBQXVCLENBQXlCO1FBQ2hELG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUNoQyxV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O1lBQ2pDLEtBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUN0RCxDQUFDLEVBQUMsVUFBQSxLQUFLO1lBQ0wsS0FBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7WUFDcEIsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2YsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBcjZCVSxhQUFhO1FBVHpCLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsTUFBTTtZQUNoQixTQUFTLEVBQUUsQ0FBQyw4QkFBYSxFQUFFLHlDQUFxQixFQUFFLDRCQUFZLEVBQUUsdUNBQW9CLEVBQUUsa0NBQWUsRUFBRSw2Q0FBdUIsRUFBRSxrQ0FBZSxDQUFDO1lBQ2hKLDJFQUEyRTtZQUMzRSxpREFBaUQ7WUFDakQsV0FBVyxFQUFFLHNCQUFzQjtZQUNuQyxTQUFTLEVBQUMsQ0FBQyw0QkFBNEIsQ0FBQztTQUMzQyxDQUFDO3lDQTJDeUIsOEJBQWE7WUFDTCx5Q0FBcUI7WUFDOUIsNEJBQVk7WUFDSix1Q0FBb0I7WUFDekIsa0NBQWU7WUFDUCw2Q0FBdUI7WUFDL0Isa0NBQWU7WUFDekIsdUJBQWM7WUFDYix5QkFBZ0I7WUFDUixpQkFBYztZQUN4QixhQUFNO1lBQ04sV0FBSTtPQXBEVCxhQUFhLENBczZCekI7SUFBRCxvQkFBQztDQUFBLEFBdDZCRCxJQXM2QkM7QUF0NkJZLHNDQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIE5nWm9uZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgKiBhcyBkaWFsb2dzIGZyb20gXCJ1aS9kaWFsb2dzXCI7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvdWkvcGFnZVwiO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUgfSBmcm9tIFwiQGFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQgeyBSb3V0ZXJFeHRlbnNpb25zIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgTG9jYXRpb24gYXMgTG9jYXRpb25Db21tb24gfSBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uXCI7XG5cbmltcG9ydCB7IFVzZXIgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3VzZXIvdXNlclwiO1xuaW1wb3J0IHsgTG9jYXRpb24gfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2xvY2F0aW9uL2xvY2F0aW9uXCI7XG5pbXBvcnQgeyBDb250cmFjdCB9IGZyb20gXCIuLi8uLi9zaGFyZWQvY29udHJhY3QvY29udHJhY3RcIjtcblxuLy8gaW1wb3J0IHsgTG9jYXRpb25TZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9sb2NhdGlvbi9sb2NhdGlvbi5zZXJ2aWNlXCI7XG4vLyBpbXBvcnQgeyBMb2NhdGlvbkRhdGFiYXNlU2VydmljZSB9IGZyb20gJy4uLy4uL3NoYXJlZC9sb2NhdGlvbi9sb2NhdGlvbi5kYi5zZXJ2aWNlJztcbmltcG9ydCB7IFZpc2l0U2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvdmlzaXQvdmlzaXQuc2VydmljZVwiO1xuaW1wb3J0IHsgVmlzaXREYXRhYmFzZVNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3Zpc2l0L3Zpc2l0LmRiLnNlcnZpY2VcIjtcbmltcG9ydCB7IEludGVyZXN0U2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvaW50ZXJlc3QvaW50ZXJlc3Quc2VydmljZVwiO1xuaW1wb3J0IHsgSW50ZXJlc3REYXRhYmFzZVNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2ludGVyZXN0L2ludGVyZXN0LmRiLnNlcnZpY2VcIjtcbmltcG9ydCB7IEJlYWNvblNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2JlYWNvbi9iZWFjb24uc2VydmljZVwiO1xuaW1wb3J0IHsgQmVhY29uRGF0YWJhc2VTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9iZWFjb24vYmVhY29uLmRiLnNlcnZpY2VcIjtcbmltcG9ydCB7IENvbnRyYWN0U2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvY29udHJhY3QvY29udHJhY3Quc2VydmljZVwiO1xuXG5pbXBvcnQgKiBhcyBhcHBsaWNhdGlvbiBmcm9tICdhcHBsaWNhdGlvbic7XG5pbXBvcnQgeyBBbmRyb2lkQXBwbGljYXRpb24sIEFuZHJvaWRBY3Rpdml0eUJhY2tQcmVzc2VkRXZlbnREYXRhIH0gZnJvbSBcImFwcGxpY2F0aW9uXCI7XG5pbXBvcnQgeyBpc0FuZHJvaWQgfSBmcm9tIFwicGxhdGZvcm1cIjtcbmltcG9ydCB7IEJlYWNvbiB9IGZyb20gXCIuLi8uLi9zaGFyZWQvYmVhY29uL2JlYWNvblwiO1xuaW1wb3J0IHsgVmlzaXQgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3Zpc2l0L3Zpc2l0XCI7XG5pbXBvcnQgeyBJbnRlcmVzdCB9IGZyb20gXCIuLi8uLi9zaGFyZWQvaW50ZXJlc3QvaW50ZXJlc3RcIjtcblxuaW1wb3J0ICogYXMgVG9hc3QgZnJvbSAnbmF0aXZlc2NyaXB0LXRvYXN0JztcblxuLy8gaW1wb3J0IHsgc3RvcmFnZSB9IGZyb20gXCIuLi8uLi91dGlscy9sb2NhbFwiO1xudmFyIGFwcFNldHRpbmdzID0gcmVxdWlyZShcImFwcGxpY2F0aW9uLXNldHRpbmdzXCIpO1xuXG4vLyBlc3RpbW90ZSBiZWFjb25zXG52YXIgRXN0aW1vdGUgPSByZXF1aXJlKFwibmF0aXZlc2NyaXB0LWVzdGltb3RlLXNka1wiKTtcbmltcG9ydCAqIGFzIFBlcm1pc3Npb25zIGZyb20gXCJuYXRpdmVzY3JpcHQtcGVybWlzc2lvbnNcIjtcbmRlY2xhcmUgdmFyIGFuZHJvaWQ6IGFueTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwibWFpblwiLFxuICAgIHByb3ZpZGVyczogW0JlYWNvblNlcnZpY2UsIEJlYWNvbkRhdGFiYXNlU2VydmljZSwgVmlzaXRTZXJ2aWNlLCBWaXNpdERhdGFiYXNlU2VydmljZSwgSW50ZXJlc3RTZXJ2aWNlLCBJbnRlcmVzdERhdGFiYXNlU2VydmljZSwgQ29udHJhY3RTZXJ2aWNlXSxcbiAgICAvLyBwcm92aWRlcnM6IFtMb2NhdGlvblNlcnZpY2UsIExvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlLCBDb250cmFjdFNlcnZpY2VdLCBcbiAgICAvLyBwcm92aWRlcnM6IFtMb2NhdGlvblNlcnZpY2UsIENvbnRyYWN0U2VydmljZV0sXG4gICAgdGVtcGxhdGVVcmw6IFwicGFnZXMvbWFpbi9tYWluLmh0bWxcIixcbiAgICBzdHlsZVVybHM6W1wicGFnZXMvbWFpbi9tYWluLWNvbW1vbi5jc3NcIl0gXG59KVxuXG5leHBvcnQgY2xhc3MgTWFpbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdHtcblxuICAvLyBwcml2YXRlIHZhcmlhYmxlc1xuICBwcml2YXRlIF9jdXJyZW50X2xvY2F0aW9uOiBMb2NhdGlvbjtcbiAgcHJpdmF0ZSBsb2NhdGlvbl9pZDogc3RyaW5nO1xuICAvLyBwcml2YXRlIF9hbGxfbG9jYXRpb25zOiBBcnJheTxMb2NhdGlvbj47XG4gIHByaXZhdGUgX25hbWUgPSBcImNhcmxvc1wiO1xuICBwcml2YXRlIF9jb250cmFjdDogQ29udHJhY3Q7XG4gIC8vIHByaXZhdGUgX2xvY2F0aW9uX2RhdGFiYXNlOiBhbnk7XG4gIHByaXZhdGUgX2xvY2F0aW9uc19pbl9kYjogQXJyYXk8TG9jYXRpb24+O1xuICAvLyBwcml2YXRlIF9sb2NhdGlvbl9pZDogbnVtYmVyO1xuICBwcml2YXRlIF93YXRjaF9sb2NhdGlvbl9pZDogYW55O1xuICBwcml2YXRlIF9jdXN0b21lcl9pZDogbnVtYmVyO1xuXG4gIC8vIHB1YmxpYyB2YXJpYWJsZXNcbiAgcHVibGljIHRpdGxlOiBzdHJpbmc7XG5cbiAgLy8gYnV0dG9uIGZsYWdzXG4gIC8vIHB1YmxpYyBpbkxvY2F0aW9uID0gZmFsc2U7XG4gIHB1YmxpYyBpc0N1cnJlbnRMb2NhdGlvbiA9IGZhbHNlO1xuICBwdWJsaWMgaXNBbGxMb2NhdGlvbnMgPSBmYWxzZTtcbiAgcHVibGljIGlzQnVzeSA9IGZhbHNlO1xuICBwdWJsaWMgY2FuQ29udHJhY3QgPSBmYWxzZTtcbiAgcHVibGljIGhhc0NvbnRyYWN0ID0gZmFsc2U7XG4gIHB1YmxpYyBleHBpcmF0aW9uVGV4dCA9IFwiXCI7XG4gIHB1YmxpYyBhdFN0b3JlID0gXCJARmxpY2snc1wiO1xuXG4gIC8vIEJlYWNvbiB2YXJpYWJsZVxuICBwdWJsaWMgZXN0aW1vdGU6IGFueTtcbiAgcHVibGljIG9wdGlvbnM6IGFueTtcbiAgcHVibGljIGN1cnJlbnRCZWFjb25zOiBBcnJheTxCZWFjb24+O1xuICBwdWJsaWMgcGVybWlzc2lvbnM6IGFueTtcblxuICAvLyBJY29uc1xuICBwdWJsaWMgZ2VhcnNJY29uID0gU3RyaW5nLmZyb21DaGFyQ29kZSgweGYwODUpO1xuICBwdWJsaWMgbG9nb3V0SWNvbiA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMHhmMDhiKTtcbiAgcHVibGljIGhhbmRzaGFrZUljb24gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4ZjJiNSk7XG4gIFxuICBjb25zdHJ1Y3RvcihcbiAgICAvLyBwcml2YXRlIGxvY2F0aW9uU2VydmljZTogTG9jYXRpb25TZXJ2aWNlLFxuICAgIC8vIHByaXZhdGUgbG9jYXRpb25EYXRhYmFzZVNlcnZpY2U6IExvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlLFxuICAgIHByaXZhdGUgYmVhY29uU2VydmljZTogQmVhY29uU2VydmljZSxcbiAgICBwcml2YXRlIGJlYWNvbkRhdGFiYXNlU2VydmljZTogQmVhY29uRGF0YWJhc2VTZXJ2aWNlLFxuICAgIHByaXZhdGUgdmlzaXRTZXJ2aWNlOiBWaXNpdFNlcnZpY2UsXG4gICAgcHJpdmF0ZSB2aXNpdERhdGFiYXNlU2VydmljZTogVmlzaXREYXRhYmFzZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBpbnRlcmVzdFNlcnZpY2U6IEludGVyZXN0U2VydmljZSxcbiAgICBwcml2YXRlIGludGVyZXN0RGF0YWJhc2VTZXJ2aWNlOiBJbnRlcmVzdERhdGFiYXNlU2VydmljZSxcbiAgICBwcml2YXRlIGNvbnRyYWN0U2VydmljZTogQ29udHJhY3RTZXJ2aWNlLFxuICAgIHByaXZhdGUgcm91dGU6IEFjdGl2YXRlZFJvdXRlLFxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXJFeHRlbnNpb25zLFxuICAgIHByaXZhdGUgbG9jYXRpb25Db21tb246IExvY2F0aW9uQ29tbW9uLFxuICAgIHByaXZhdGUgem9uZTogTmdab25lLFxuICAgIHByaXZhdGUgcGFnZTogUGFnZVxuICApe1xuICAgICAgY29uc29sZS5sb2coXCJNYWluIENvbnN0cnVjdG9yXCIpO1xuICAgICAgLy8gdGhpcy5pc0J1c3kgPSB0cnVlO1xuICAgICAgdGhpcy5fY3VycmVudF9sb2NhdGlvbiA9IG51bGw7XG4gICAgICAvLyB0aGlzLl9hbGxfbG9jYXRpb25zID0gW107XG4gICAgICB0aGlzLl9sb2NhdGlvbnNfaW5fZGIgPSBbXTtcbiAgICAgIC8vIHRoaXMuX2xvY2F0aW9uX2RhdGFiYXNlID0gdGhpcy5sb2NhdGlvbkRhdGFiYXNlU2VydmljZS5nZXREYXRhYmFzZSgpO1xuXG4gICAgICAvLyBCZWFjb25zIGluc3RhbmNlIFxuICAgICAgLy8gdGhpcy5lc3RpbW90ZSA9IG5ldyBFc3RpbW90ZShvcHRpb25zKTtcbiAgICAgIHRoaXMuY3VycmVudEJlYWNvbnMgPSBbXTtcbiAgICAgIC8vIHRoaXMucGVybWlzc2lvbnMgPSBuZXcgUGVybWlzc2lvbnMoKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGNvbnNvbGUubG9nKFwiTWFpbiBvbiBJbml0XCIpO1xuXG4gICAgLy8gUmV0dXJuIHRvIGxvZ2luIGlmIGFwcCBzZXR0aW5ncyBhcmUgbm90IHNldFxuICAgIGlmICghYXBwU2V0dGluZ3MuaGFzS2V5KFwidXNlcl9uYW1lXCIpIHx8ICFhcHBTZXR0aW5ncy5oYXNLZXkoXCJ1c2VyX3Bhc3N3b3JkXCIpKXtcbiAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9cIl0pLCB7IGNsZWFySGlzdG9yeTogdHJ1ZSB9O1xuICAgIH1cblxuICAgIC8vIGlmIChpc0FuZHJvaWQpIHtcbiAgICAvLyAgIGFwcGxpY2F0aW9uLmFuZHJvaWQub24oQW5kcm9pZEFwcGxpY2F0aW9uLmFjdGl2aXR5QmFja1ByZXNzZWRFdmVudCwgKGRhdGE6IEFuZHJvaWRBY3Rpdml0eUJhY2tQcmVzc2VkRXZlbnREYXRhKSA9PiB7XG4gICAgLy8gICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9cIl0pLCB7IGNsZWFySGlzdG9yeTogdHJ1ZSB9O1xuICAgIC8vICAgICAvLyB0aGlzLmxvZ291dCgpO1xuICAgIC8vICAgfSk7XG4gICAgLy8gfVxuXG4gICAgdGhpcy50aXRsZSA9IFwiV2VsY29tZSBcIisgYXBwU2V0dGluZ3MuZ2V0U3RyaW5nKFwidXNlcl9uYW1lXCIpOyAgICBcblxuICAgIHRyeXtcbiAgICAgIHRoaXMuX2N1c3RvbWVyX2lkID0gYXBwU2V0dGluZ3MuZ2V0TnVtYmVyKFwidXNlcl9pZFwiKTtcbiAgICAgIGNvbnNvbGUubG9nKFwidHJ5aW5nIGN1c3Q6IFwiK3RoaXMuX2N1c3RvbWVyX2lkKTtcbiAgICB9Y2F0Y2goZSl7XG4gICAgICB0aGlzLl9jdXN0b21lcl9pZCA9IDA7XG4gICAgfSAgICAgIFxuICAgICAgXG5cbiAgICAvLyBCZWFjb25zIHByb2Nlc3NcbiAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICByZWdpb24gOiAnUHJvZ3Jlc3MnLCAvLyBvcHRpb25hbFxuICAgICAgY2FsbGJhY2sgOiBiZWFjb25zID0+IHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJCZWFjb25zOiBcIitiZWFjb25zKVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkFtb3VudCBvZiBCZWFjb25zIGluIHJhbmdlOiBcIitiZWFjb25zLmxlbmd0aClcbiAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJBbW91bnQgb2YgQmVhY29ucyBpbiByYW5nZTogXCIrYmVhY29ucy5sZW5ndGgpO1xuICAgICAgICAgIGlmKGJlYWNvbnMubGVuZ3RoPjApe1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50QmVhY29ucyA9IFtdO1xuICAgICAgICAgICAgYmVhY29ucy5mb3JFYWNoKGJlYWNvbiA9PiB7XG4gICAgICAgICAgICAgIGlmKGJlYWNvbi5tYWpvcil7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgbGV0IGIgPW5ldyBCZWFjb24oYmVhY29uLm1ham9yLnRvU3RyaW5nKCksYmVhY29uLm1pbm9yLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQmVhY29uIGlkZW50aWZpY2F0b3IgXCIrYi5pZGVudGlmaWNhdG9yKTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRCZWFjb25zLnB1c2goYik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50QmVhY29ucyA9IFtdO1xuICAgICAgICAgIH1cblxuXG4gICAgICAgICAgLy8gQ2hlY2sgZm9yIGFjdGl2ZSBjb250cmFjdHNcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIisrKysrKysrKysrKysrKysrKysrKysrKytcIik7XG4gICAgICAgICAgdGhpcy52ZXJpZnlDb250cmFjdCgpO1xuXG5cbiAgICAgICAgICAvLyBDaGVjayBpZiB1c2VyIGlzIGluIHN0b3JlIG9yIGp1c3QgcGFzc2luZyBieVxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiKioqKioqKioqKioqKioqKioqKioqKioqKlwiKTtcbiAgICAgICAgICB0aGlzLnZlcmlmeVZpc2l0KCk7XG4gICAgICAgICAgXG5cblxuICAgICAgICAgIFxuXG4gICAgICAgICAgLy8gQ2hlY2sgaWYgYmVoYXZpb3VyIHRyYWNraW5nIGlzIGVuYWJsZWQgYW5kIHRyYWNrXG4gICAgICAgICAgaWYoIHR5cGVvZiB0aGlzLl9jb250cmFjdCAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgdGhpcy5fY29udHJhY3Qub3B0aW9uc1snYmVoYXZpb3VyX3RyYWNraW5nJ10gIT09IFwidW5kZWZpbmVkXCIgJiYgdGhpcy5fY29udHJhY3Qub3B0aW9uc1snYmVoYXZpb3VyX3RyYWNraW5nJ10pe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICAgICAgdGhpcy52ZXJpZnlCZWhhdmlvcigpO1xuICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgICAgICBcbiAgICAgIH1cbiAgICB9XG4gICAgXG5cbiAgICB0aGlzLmVzdGltb3RlID0gbmV3IEVzdGltb3RlKHRoaXMub3B0aW9ucyk7XG5cbiAgICBpZihpc0FuZHJvaWQpe1xuICAgICAgY29uc29sZS5sb2coXCJJdCBpcyBBbmRyb2lkXCIpO1xuICAgICAgUGVybWlzc2lvbnMucmVxdWVzdFBlcm1pc3Npb25zKFtcbiAgICAgICAgYW5kcm9pZC5NYW5pZmVzdC5wZXJtaXNzaW9uLkFDQ0VTU19DT0FSU0VfTE9DQVRJT04sXG4gICAgICAgIGFuZHJvaWQuTWFuaWZlc3QucGVybWlzc2lvbi5BQ0NFU1NfRklORV9MT0NBVElPTixcbiAgICAgICAgYW5kcm9pZC5NYW5pZmVzdC5wZXJtaXNzaW9uLkJMVUVUT09USCxcbiAgICAgICAgYW5kcm9pZC5NYW5pZmVzdC5wZXJtaXNzaW9uLkJMVUVUT09USF9BRE1JTl0sIFwiUGVybWlzc2lvbnMgb2YgU3VydHJhZGVcIilcbiAgICAgIC50aGVuKCgpPT57XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUGVybWlzc2lvbnMgZ3JhbnRlZFwiKTtcbiAgICAgICAgdGhpcy5lc3RpbW90ZS5zdGFydFJhbmdpbmcoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJTdGFydCByYW5naW5nXCIpO1xuICAgICAgfSkuY2F0Y2goKGVycm9yKT0+e1xuICAgICAgICBhbGVydChcIkVycm9yIGdldHRpbmcgcGVybWlzc2lvbnM6IFwiK2Vycm9yLm1lc3NhZ2UpO1xuICAgICAgfSk7XG4gICAgfWVsc2V7XG4gICAgICBjb25zb2xlLmxvZyhcIkl0IGlzIGlPU1wiKTtcbiAgICAgIHRoaXMuZXN0aW1vdGUuc3RhcnRSYW5naW5nKCk7XG4gICAgICBjb25zb2xlLmxvZyhcIlN0YXJ0IHJhbmdpbmdcIik7XG4gICAgfVxuXG4gICAgLy8gTG9jYXRpb24gcmVmYWN0b3JcbiAgICAvLyBDcmVhdGVzIERCIGlmIG5vdCBleGlzdFxuICAgIC8vIHRoaXMubG9jYXRpb25EYXRhYmFzZVNlcnZpY2UuY3JlYXRlVGFibGUoKTtcblxuICAgIC8vVXBkYXRlcyB0aGUgbG9jYXRpb25zIERCLCB0aGlzIHNob3VsZCBub3QgYmUgZG9uZSBldmVyeSB0aW1lLCBidXQgcmF0aGVyIG9uY2UgZXZlcnkgZGF5XG4gICAgLy8gaWYodGhpcy5pc0xvY2F0aW9uRGF0YWJhc2VFbXB0eSgpKXtcbiAgICAvLyAgIHRoaXMudXBkYXRlTG9jYXRpb25EYXRhYmFzZSgpO1xuICAgIC8vIH1cblxuICAgIC8vIEV4dHJhY3RzIGxvY2F0aW9ucyBmcm9tIERCXG4gICAgLy8gdGhpcy5fbG9jYXRpb25zX2luX2RiID0gdGhpcy5sb2NhdGlvbkRhdGFiYXNlU2VydmljZS5zZWxlY3RBbGxMb2NhdGlvbnMoKTtcbiAgICAvLyAvLyBTdGFydCB3YXRjaGluZyBmb3IgbG9jYXRpb25cbiAgICAvLyAvLyB0aGlzLl93YXRjaF9sb2NhdGlvbl9pZCA9IHRoaXMubG9jYXRpb25TZXJ2aWNlLnN0YXJ0V2F0Y2hpbmdMb2NhdGlvbigpO1xuXG5cbiAgICAvLyBDcmVhdGVzIERCIGlmIG5vdCBleGlzdFxuICAgIC8vIHRoaXMuYmVhY29uRGF0YWJhc2VTZXJ2aWNlLmRyb3BUYWJsZSgpO1xuICAgIHRoaXMuYmVhY29uRGF0YWJhc2VTZXJ2aWNlLmNyZWF0ZVRhYmxlKCk7XG4gICAgdGhpcy52aXNpdERhdGFiYXNlU2VydmljZS5jcmVhdGVUYWJsZSgpO1xuICAgIHRoaXMuaW50ZXJlc3REYXRhYmFzZVNlcnZpY2UuY3JlYXRlVGFibGUoKTtcblxuICAgIC8vVXBkYXRlcyB0aGUgREIsIHRoaXMgc2hvdWxkIG5vdCBiZSBkb25lIGV2ZXJ5IHRpbWUsIGJ1dCByYXRoZXIgb25jZSBldmVyeSBkYXlcbiAgICBpZih0aGlzLmlzQmVhY29uRGF0YWJhc2VFbXB0eSgpKXtcbiAgICAgIGNvbnNvbGUubG9nKFwiTG9jYWwgREIgaXMgZW1wdHkuXCIpO1xuICAgICAgdGhpcy51cGRhdGVCZWFjb25EYXRhYmFzZSgpO1xuICAgIH1lbHNle1xuICAgICAgLy8gRGVsZXRlOiBuZXh0IGxpbmUgc2hvdWxkIGJlIHVzZWQgb25seSBwZXJpb2RpY2FsbHkuXG4gICAgICAvLyB0aGlzLnVwZGF0ZUJlYWNvbkRhdGFiYXNlKCk7XG4gICAgICBjb25zb2xlLmxvZyhcIkxvY2FsIERCIGhhcyBkYXRhLlwiKTtcbiAgICB9XG5cbiAgICB0aGlzLnBhZ2Uub24oJ25hdmlnYXRpbmdGcm9tJywgKGRhdGEpID0+IHtcbiAgICAgIC8vIHJ1biBkZXN0cm95IGNvZGVcbiAgICAgIC8vIChub3RlOiB0aGlzIHdpbGwgcnVuIHdoZW4geW91IGVpdGhlciBtb3ZlIGZvcndhcmQgdG8gYSBuZXcgcGFnZSBvciBiYWNrIHRvIHRoZSBwcmV2aW91cyBwYWdlKVxuICAgICAgLy8gQmVhY29ucyBzdG9wXG4gICAgICB0aGlzLmVzdGltb3RlLnN0b3BSYW5naW5nKCk7XG4gICAgICBjb25zb2xlLmxvZyhcIlN0b3AgcmFuZ2luZ1wiKTtcbiAgICB9KTtcblxuICB9XG5cbiAgcHVibGljIG5nT25EZXN0cm95KCkge1xuICAgIC8vQ2FsbGVkIG9uY2UsIGJlZm9yZSB0aGUgaW5zdGFuY2UgaXMgZGVzdHJveWVkLlxuICAgIC8vIExvY2F0aW9uIHJlZmFjdG9yXG4gICAgLy8gdGhpcy5sb2NhdGlvblNlcnZpY2Uuc3RvcFdhdGNoaW5nTG9jYXRpb24odGhpcy5fd2F0Y2hfbG9jYXRpb25faWQpXG5cbiAgICAvLyAvLyBCZWFjb25zIHN0b3BcbiAgICAvLyB0aGlzLmVzdGltb3RlLnN0b3BSYW5naW5nKCk7XG4gICAgLy8gY29uc29sZS5sb2coXCJTdG9wIHJhbmdpbmdcIik7XG5cbiAgICAvLyB0aGlzLnZlcmlmeVZpc2l0KCk7XG4gICAgLy8gdGhpcy52ZXJpZnlCZWhhdmlvcigpO1xuICAgIFxuICB9XG5cbiAgcHVibGljIGNvbnRyYWN0U2V0dGluZ3MoKXtcbiAgICAvLyB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvY29udHJhY3RjcmVhdGUvXCIrdGhpcy5fY3VycmVudF9sb2NhdGlvbi5pZCtcIi8xXCJdLCB7XG4gICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL2NvbnRyYWN0Y3JlYXRlXCIsdGhpcy5sb2NhdGlvbl9pZCwxXSwge1xuICAgICAgLy8gYW5pbWF0aW9uOiB0cnVlLFxuICAgICAgdHJhbnNpdGlvbjoge1xuICAgICAgICAgIG5hbWU6IFwic2xpZGVMZWZ0XCIsXG4gICAgICAgICAgZHVyYXRpb246IDIwMCxcbiAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGNyZWF0ZUNvbnRyYWN0KCl7XG5cbiAgICBsZXQgc3RvcmVzID0gdGhpcy5uZWFyYnlTdG9yZXMoKTtcbiAgICBsZXQgc3RvcmVfbmFtZXMgPSBbXTtcbiAgICAvLyBsZXQgbG9jYXRpb25faWRzID0gW107XG5cbiAgICBzdG9yZXMuZm9yRWFjaChzdG9yZSA9PiB7IFxuICAgICAgc3RvcmVfbmFtZXMucHVzaChzdG9yZS5uYW1lKTtcbiAgICAgIC8vIGxvY2F0aW9uX2lkcy5wdXNoKHN0b3JlLmxvY2F0aW9uX2lkKTtcbiAgICAgfSk7XG5cbiAgICBkaWFsb2dzLmFjdGlvbih7XG4gICAgICBtZXNzYWdlOiBcIlNlbGVjdCBTdG9yZVwiLFxuICAgICAgY2FuY2VsQnV0dG9uVGV4dDogXCJDYW5jZWxcIixcbiAgICAgIGFjdGlvbnM6IHN0b3JlX25hbWVzXG4gICAgfSkudGhlbihuYW1lID0+IHtcbiAgICAgIHN0b3Jlcy5mb3JFYWNoKHN0b3JlID0+IHsgXG4gICAgICAgIGlmKHN0b3JlLm5hbWUgPT0gbmFtZSl7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJHb2luZyB0byBjcmVhdGUgY29udHJhY3QuXCIpO1xuICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9jb250cmFjdGNyZWF0ZVwiLHN0b3JlLmxvY2F0aW9uX2lkLDBdLCB7XG4gICAgICAgICAgICAvLyBhbmltYXRpb246IHRydWUsXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZUxlZnRcIixcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogMjAwLFxuICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICB9KTtcbiAgICB9KTtcbiAgICBcbiAgfVxuXG4gIHB1YmxpYyBsb2dvdXQoKXtcbiAgICBhcHBTZXR0aW5ncy5yZW1vdmUoXCJ1c2VyX25hbWVcIik7XG4gICAgYXBwU2V0dGluZ3MucmVtb3ZlKFwidXNlcl9wYXNzd29yZFwiKTtcblxuICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9cIl0sIHsgY2xlYXJIaXN0b3J5OiB0cnVlIH0pO1xuICB9XG5cbiAgLy8gTG9jYXRpb24gcmVmYWN0b3JcbiAgLy8gdmVyaWZ5Q29udHJhY3QoKXtcbiAgLy8gICB0aGlzLmlzQnVzeSA9IHRydWU7XG4gIC8vICAgdGhpcy5sb2NhdGlvblNlcnZpY2UuZ2V0Q3VycmVudExvY2F0aW9uKClcbiAgLy8gICAgIC50aGVuKChsb2NhdGlvbjogTG9jYXRpb24pID0+IHtcbiAgLy8gICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgLy8gICAgICAgaWYobG9jYXRpb24gIT0gdW5kZWZpbmVkKXtcbiAgLy8gICAgICAgICB0aGlzLl9jdXJyZW50X2xvY2F0aW9uID0gbG9jYXRpb247XG4gIC8vICAgICAgICAgdGhpcy5pc0N1cnJlbnRMb2NhdGlvbiA9IHRydWU7XG5cbiAgLy8gICAgICAgICBjb25zb2xlLmxvZyhcImdvdHRlbiBsb2NhdGlvbiwgbGF0OiBcIitsb2NhdGlvbi5sYXQrXCIsIGxuZzogXCIrbG9jYXRpb24ubG5nKTtcbiAgICAgICAgXG4gIC8vICAgICAgICAgdGhpcy5fbG9jYXRpb25zX2luX2RiLmZvckVhY2gobG9jYXRpb24gPT57XG4gICAgICAgIFxuICAvLyAgICAgICAgICAgaWYgKChsb2NhdGlvbi5uZV9sYXQgPj0gdGhpcy5fY3VycmVudF9sb2NhdGlvbi5sYXQgJiYgbG9jYXRpb24ubmVfbG5nID49IHRoaXMuX2N1cnJlbnRfbG9jYXRpb24ubG5nKSBcbiAgLy8gICAgICAgICAgICAgJiYgKGxvY2F0aW9uLnN3X2xhdCA8PSB0aGlzLl9jdXJyZW50X2xvY2F0aW9uLmxhdCAmJiBsb2NhdGlvbi5zd19sbmcgPD0gdGhpcy5fY3VycmVudF9sb2NhdGlvbi5sbmcpICl7XG4gIC8vICAgICAgICAgICAgICAgdGhpcy5jYW5Db250cmFjdCA9IHRydWU7XG4gIC8vICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbiBsb2NhdGlvbjogXCIrIGxvY2F0aW9uLm5hbWUpO1xuICAvLyAgICAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRfbG9jYXRpb24gPSBsb2NhdGlvbjtcblxuICAvLyAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9va2luZyBmb3IgYSBjb250cmFjdCBiZXR3ZWVuIGxvY2F0aW9uOiBcIisgdGhpcy5fY3VycmVudF9sb2NhdGlvbi5pZCtcIiBhbmQgY3VzdG9tZXIgXCIgK3RoaXMuX2N1c3RvbWVyX2lkKTtcbiAgLy8gICAgICAgICAgICAgICB0aGlzLmNvbnRyYWN0U2VydmljZS5nZXRBY3RpdmVDb250cmFjdCh0aGlzLl9jdXJyZW50X2xvY2F0aW9uLmlkLCB0aGlzLl9jdXN0b21lcl9pZClcbiAgLy8gICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUocmVzcG9uc2VDb250cmFjdCA9PiB7XG4gIC8vICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwieW91IGhhdmUgYSBjb250cmFjdCAtLTIuMSwgc3RhdHVzOiBcIityZXNwb25zZUNvbnRyYWN0LnN0YXR1cyk7XG4gIC8vICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwieW91IGhhdmUgYSBjb250cmFjdCAtLTIuMSwgbWVzc2FnZTogXCIrcmVzcG9uc2VDb250cmFjdC5tZXNzYWdlKTtcbiAgLy8gICAgICAgICAgICAgICAgICAgaWYgKCFyZXNwb25zZUNvbnRyYWN0Lm1lc3NhZ2Upe1xuICAvLyAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwieW91IGhhdmUgYSBjb250cmFjdDogXCIrcmVzcG9uc2VDb250cmFjdC5zdGF0dXMpO1xuICAvLyAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRyYWN0ID0gcmVzcG9uc2VDb250cmFjdDtcbiAgLy8gICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbkNvbnRyYWN0ID0gZmFsc2U7XG4gIC8vICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYXNDb250cmFjdCA9IHRydWU7XG4gIC8vICAgICAgICAgICAgICAgICAgIH1cbiAgLy8gICAgICAgICAgICAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgLy8gICAgICAgICAgICAgICAgIH0sZXJyb3IgPT4ge1xuICAvLyAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3Iuc3RhdHVzID09IDQwNCl7XG4gICAgICAgICAgICAgICAgICAgICAgXG4gIC8vICAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW5Db250cmFjdCA9IHRydWU7XG4gIC8vICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYXNDb250cmFjdCA9IGZhbHNlO1xuICAvLyAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgLy8gICAgICAgICAgICAgICAgICAgICBhbGVydChcIkVycm9yIGdldHRpbmcgYWN0aXZlIGNvbnRyYWN0IGluZm9ybWF0aW9uOiBcIitlcnJvcik7XG4gIC8vICAgICAgICAgICAgICAgICAgIH1cbiAgLy8gICAgICAgICAgICAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgXG4gIC8vICAgICAgICAgICAgICAgICB9KTtcbiAgLy8gICAgICAgICAgICAgfVxuICAvLyAgICAgICAgIH0pO1xuICAvLyAgICAgICB9XG4gIC8vICAgICAgIGVsc2V7XG4gIC8vICAgICAgICAgdGhyb3cgXCJMb2NhdGlvbiBub3QgZm91bmRcIjtcbiAgLy8gICAgICAgfSBcbiAgLy8gICAgIH1cbiAgLy8gICAgICkuY2F0Y2goKGVycm9yKSA9PiB7XG4gIC8vICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gIC8vICAgICAgIGFsZXJ0KGVycm9yKVxuICAvLyAgICAgfSk7XG4gIC8vIH1cblxuICBuZWFyYnlTdG9yZXMoKXtcbiAgICBjb25zb2xlLmxvZyhcIkNoZWNraW5nIG5lYXJieSBzdG9yZXMuLlwiKTtcbiAgICBsZXQgc3RvcmVzOiBBcnJheTxCZWFjb24+ID0gW107XG4gICAgLy8gdGhpcy5iZWFjb25EYXRhYmFzZVNlcnZpY2Uuc2VsZWN0QWxsQmVhY29ucyhcIndoZXJlIHJvbGU9c3RvcmVcIikuZm9yRWFjaChzdG9yZURCPT57XG4gICAgdGhpcy5iZWFjb25EYXRhYmFzZVNlcnZpY2Uuc2VsZWN0QmVhY29ucyhcInN0b3JlXCIpLmZvckVhY2goc3RvcmVEQj0+e1xuICAgICAgLy8gY29uc29sZS5sb2coXCJzdG9yZURCIGlkZW46IFwiK3N0b3JlREIuaWRlbnRpZmljYXRvcik7XG4gICAgICB0aGlzLmN1cnJlbnRCZWFjb25zLmZvckVhY2goYmVhY29uQ3VycmVudD0+e1xuICAgICAgICBjb25zb2xlLmxvZyhcImJlYWNvbkN1cnJlbnQgaWRlbjogXCIrYmVhY29uQ3VycmVudC5pZGVudGlmaWNhdG9yKTtcbiAgICAgICAgaWYoc3RvcmVEQi5pZGVudGlmaWNhdG9yPT1iZWFjb25DdXJyZW50LmlkZW50aWZpY2F0b3Ipe1xuICAgICAgICAgIHN0b3Jlcy5wdXNoKHN0b3JlREIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICAgIFxuICAgIHJldHVybiBzdG9yZXM7XG4gIH1cblxuICBuZWFyYnlJdGVtcygpe1xuICAgIGxldCBpdGVtczogQXJyYXk8QmVhY29uPiA9IFtdO1xuICAgIHRoaXMuYmVhY29uRGF0YWJhc2VTZXJ2aWNlLnNlbGVjdEJlYWNvbnMoXCJpdGVtXCIsIHRoaXMubG9jYXRpb25faWQpLmZvckVhY2goaXRlbURCPT57XG4gICAgICB0aGlzLmN1cnJlbnRCZWFjb25zLmZvckVhY2goYmVhY29uQ3VycmVudD0+e1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImJlYWNvbiBkYjogXCIraXRlbURCLmlkZW50aWZpY2F0b3IpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImJlYWNvbiBjdXJyZW50OiBcIitiZWFjb25DdXJyZW50LmlkZW50aWZpY2F0b3IpO1xuICAgICAgICBpZihpdGVtREIuaWRlbnRpZmljYXRvcj09YmVhY29uQ3VycmVudC5pZGVudGlmaWNhdG9yKXtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIk5lYXJieSBpdGVtOiBcIitpdGVtREIubmFtZSk7XG4gICAgICAgICAgaXRlbXMucHVzaChpdGVtREIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICAgIFxuICAgIHJldHVybiBpdGVtcztcbiAgfVxuICBkYXRlRm9ybWF0dGVyKGRhdGU6IERhdGUpe1xuICAgIHJldHVybiBkYXRlLmdldEZ1bGxZZWFyKCkrXCItXCIrZGF0ZS5nZXRNb250aCgpK1wiLVwiK2RhdGUuZ2V0RGF0ZSgpK1wiIFwiK2RhdGUuZ2V0SG91cnMoKStcIjpcIitkYXRlLmdldE1pbnV0ZXMoKStcIjpcIitkYXRlLmdldFNlY29uZHMoKVxuICB9XG5cbiAgdmVyaWZ5VmlzaXQoKXtcbiAgICBsZXQgbmVhcmJ5U3RvcmVzID0gdGhpcy5uZWFyYnlTdG9yZXMoKTtcbiAgICBjb25zb2xlLmxvZyhcIk5lYXJieSBzdG9yZXM6IFwiK25lYXJieVN0b3Jlcy5sZW5ndGgpXG4gICAgaWYgKG5lYXJieVN0b3Jlcy5sZW5ndGg+MCl7XG4gICAgICBuZWFyYnlTdG9yZXMuZm9yRWFjaChzdG9yZT0+e1xuICAgICAgICBjb25zb2xlLmxvZyhcIlN0b3JlIGlkZW50aWZpY2F0b3I6IFwiK3N0b3JlLmlkZW50aWZpY2F0b3IpO1xuICAgICAgICBsZXQgdmlzaXQgID0gdGhpcy52aXNpdERhdGFiYXNlU2VydmljZS5zZWxlY3RWaXNpdEJ5QmVhY29uKHN0b3JlLmlkZW50aWZpY2F0b3IpO1xuICAgICAgICBcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJ2aXNpdCBpZDogXCIrdmlzaXQpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInZpc2l0LmlkOiBcIit2aXNpdC5pZCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwidmlzaXRbMF06IFwiK3Zpc2l0WzBdKTtcbiAgICAgICAgLy8gVmVyaWZ5IGlmIHZpc2l0IGlzIGJlaW5nIGNyZWF0ZWRcbiAgICAgICAgaWYgKHZpc2l0ICE9IG51bGwpe1xuXG4gICAgICAgICAgdGhpcy5hdFN0b3JlID0gXCJAXCIrc3RvcmUubmFtZTtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInZpc2l0IGNvbnN0cnVjdG9yIG5hbWU6IFwiK3Zpc2l0LmNvbnN0cnVjdG9yLm5hbWUpO1xuXG4gICAgICAgICAgbGV0IHN0YXJ0ID0gbmV3IERhdGUodmlzaXQuc3RhcnQpO1xuICAgICAgICAgIGxldCBlbmQgPSBuZXcgRGF0ZSh2aXNpdC5lbmQpO1xuICAgICAgICAgIGxldCBkdXJhdGlvbiA9IGVuZC5nZXRUaW1lKCkgLSBzdGFydC5nZXRUaW1lKCk7XG4gICAgICAgICAgbGV0IHNpbmNlTGFzdCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gZW5kLmdldFRpbWUoKTtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInZpc2l0IHR5cGVvZjogXCIrdHlwZW9mIHZpc2l0KTtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInN0YXJ0IHhhLjogXCIrKHZpc2l0LnN0YXJ0KSk7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coXCJzdGFydDogXCIrKHN0YXJ0LmdldFRpbWUoKSkpO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwic3RhcnQ6IFwiKyhzdGFydC50b0RhdGVTdHJpbmcoKSkpO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwic3RhcnQ6IFwiKyhzdGFydC50b1N0cmluZygpKSk7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coXCJzdGFydDogXCIrKHRoaXMuZGF0ZUZvcm1hdHRlcihzdGFydCkpKTtcbiAgICAgICAgICAvLyAvLyBjb25zb2xlLmxvZyhcImVuZDogXCIrIGVuZC5nZXRUaW1lKCkpO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd2aXNpdCBkdXJhdGlvbjogJytkdXJhdGlvbik7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coJ3Zpc2l0IHNpbmNlTGFzdDogJytzaW5jZUxhc3QpO1xuXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coXCJWaXNpdCBwb3N0IHRlc3QgaWQ6IFwiK3Zpc2l0LmlkKTtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlZpc2l0IHBvc3QgdGVzdCBiZWFjb246IFwiK3Zpc2l0LmJlYWNvbik7XG4gICAgICAgICAgLy8gdGhpcy52aXNpdFNlcnZpY2UuY3JlYXRlVmlzaXQodmlzaXQpLnN1YnNjcmliZShyZXNwb25zZSA9PiB7IFxuICAgICAgICAgIC8vICAgLy8gdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgICAvLyAgIFRvYXN0Lm1ha2VUZXh0KFwiVmlzaXQgU2VudCFcIikuc2hvdygpO1xuICAgICAgICAgIC8vIH0sZXJyb3IgPT4ge1xuICAgICAgICAgIC8vICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgICAvLyAgIGFsZXJ0KFwiRXJyb3IgY3JlYXRpbmcgdGhlIGNvbnRyYWN0OiBcIitlcnJvcik7XG4gICAgICAgICAgLy8gICAvLyB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xuICAgICAgICAgIC8vIH0pO1xuXG5cbiAgICAgICAgICAvLyBpZiBsYXN0IHJlYWRpbmcgb2Ygc3RvcmUgd2FzIGxlc3MgdGhhbiAyMCBzZWNvbmRzIGFnb1xuICAgICAgICAgIGlmKHNpbmNlTGFzdCA8IDU5MDAwKXsgLy8gdXBkYXRlIGVuZCBkYXRlIHRvIGN1cnJlbnRcbiAgICAgICAgICAgIC8vIHRoaXMudmlzaXREYXRhYmFzZVNlcnZpY2UudXBkYXRlVmlzaXQodmlzaXRbMF0sdmlzaXRbMV0sICB2aXNpdFsyXSAsIHZpc2l0WzNdICxuZXcgRGF0ZSgpLCB2aXNpdFs1XSAsIHZpc2l0WzZdICwgdmlzaXRbN10pO1xuICAgICAgICAgICAgdGhpcy52aXNpdERhdGFiYXNlU2VydmljZS51cGRhdGVWaXNpdCh2aXNpdCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInZpc2l0ICdlbmQnIHVwZGF0ZWRcIik7XG4gICAgICAgICAgfWVsc2V7Ly8gaWYgbGFzdCByZWFkaW5nIG9mIHN0b3JlIHdhcyBtb3JlIHRoYW4gMjAgc2Vjb25kcyBhZ29cbiAgICAgICAgICAgIGlmKGR1cmF0aW9uID4gNjAwMDApeyAvLyBpZiByZWFkaW5ncyBsYXN0ZWQgbW9yZSB0aGFuIDMgbWludXRlcyAsIHNlbmQgcmVjb3JkLi4gMSBtaW5cbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTZW5kaW5nIHZpc2l0IGE6IFwiK3Zpc2l0KVxuICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkFjdHVhbCBpbXBsZW1lbnRhdGlvbiBwZW5kaW5nLi5cIik7XG4gICAgICAgICAgICAgIHRoaXMudmlzaXRTZXJ2aWNlLmNyZWF0ZVZpc2l0KHZpc2l0KS5zdWJzY3JpYmUocmVzcG9uc2UgPT4geyBcbiAgICAgICAgICAgICAgICAgIC8vIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIlZpc2l0IFNlbnQhXCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICB9LGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICBhbGVydChcIkVycm9yIHNlbmRpbmcgdGhlIHZpc2l0OiBcIitlcnJvcik7XG4gICAgICAgICAgICAgICAgICAvLyB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiR29vZGJ5ZSBmcm9tIFwiK3N0b3JlLm5hbWUpLnNob3coKTtcblxuICAgICAgICAgICAgICB0aGlzLnZlcmlmeUludGVyZXN0KCk7XG4gICAgICAgICAgICAgIC8vIGxldCBpbnRlcmVzdHMgPSB0aGlzLmludGVyZXN0RGF0YWJhc2VTZXJ2aWNlLnNlbGVjdEludGVyZXN0cygpO1xuXG4gICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiaG93IG1hbnkgaW50ZXJzdHMgdG8gZmluaXNoOiBcIitpbnRlcmVzdHMubGVuZ3RoKTtcbiAgICAgICAgICAgICAgLy8gLy8gaWYgdGhlcmUgaXMgYW4gaW50ZXJlc3QgXG4gICAgICAgICAgICAgIC8vIGlmIChpbnRlcmVzdHMubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAgIC8vICAgICBpbnRlcmVzdHMuZm9yRWFjaChpbnRlcmVzdCA9PntcbiAgICAgICAgICAgICAgLy8gICAgIGxldCBzdGFydCA9IG5ldyBEYXRlKGludGVyZXN0LnN0YXJ0KTtcbiAgICAgICAgICAgICAgLy8gICAgIGxldCBlbmQgPSBuZXcgRGF0ZShpbnRlcmVzdC5lbmQpO1xuICAgICAgICAgICAgICAvLyAgICAgbGV0IGR1cmF0aW9uID0gZW5kLmdldFRpbWUoKSAtIHN0YXJ0LmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgLy8gICAgIGxldCBzaW5jZUxhc3QgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIGVuZC5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhcIkludGVyZXN0IHhkLjogXCIraW50ZXJlc3QuYmVhY29uK1wiLCBzaW5jZUxhc3Q6IFwiK3NpbmNlTGFzdCtcIiwgZHVyYXRpb246IFwiK2R1cmF0aW9uKTtcbiAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAvLyAgICAgLy8gaWYgZHVyYXRpb24gID4gMSBtaW51dGUgdGhlbiBzZW5kIGludGVyZXN0XG4gICAgICAgICAgICAgIC8vICAgICBpZiggZHVyYXRpb24gPiA2MDAwMCl7XG4gICAgICAgICAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2coXCJTZW5kaW5nIGludGVyZXN0IGIgZS46IFwiK2ludGVyZXN0LmJlYWNvbilcbiAgICAgICAgICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhcIkFjdHVhbCBpbXBsZW1lbnRhdGlvbiBwZW5kaW5nLi4gd29yayBpbiBwcm9ncmVzcy4uXCIpO1xuICAgICAgICAgICAgICAvLyAgICAgICAgIHRoaXMuaW50ZXJlc3RTZXJ2aWNlLmNyZWF0ZUludGVyZXN0KGludGVyZXN0KS5zdWJzY3JpYmUocmVzcG9uc2UgPT4geyBcbiAgICAgICAgICAgICAgLy8gICAgICAgICAgIC8vIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgICAgICAgIC8vICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkludGVyZXN0IFNlbnQhXCIpLnNob3coKTtcbiAgICAgICAgICAgICAgLy8gICAgICAgICB9LGVycm9yID0+IHtcbiAgICAgICAgICAgICAgLy8gICAgICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgICAgICAgIC8vICAgICAgICAgICBhbGVydChcIkVycm9yIHNlbmRpbmcgdGhlIGludGVyZXN0OiBcIitlcnJvcik7XG4gICAgICAgICAgICAgIC8vICAgICAgICAgICAvLyB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAvLyAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIC8vICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJJbnRlcmVzdCBzdG9yZWQuXCIpLnNob3coKTtcbiAgICAgICAgICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhcIkludGVyZXN0IHN0b3JlZC5cIilcblxuICAgICAgICAgICAgICAvLyAgICAgICAgIC8vIGZpbmlzaGVkSW50ZXJlc3RzLnB1c2goaW50ZXJlc3QpO1xuICAgICAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coXCJEZWxldGluZyBpbnRlcmVzdCBkdWUgdG8gZXhwaXJpbmcgY29udHJhY3QgZi46IFwiK2ludGVyZXN0LmJlYWNvbik7XG4gICAgICAgICAgICAgIC8vICAgICB0aGlzLmludGVyZXN0RGF0YWJhc2VTZXJ2aWNlLmRlbGV0ZUludGVyZXN0KGludGVyZXN0LmlkKTtcbiAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAvLyAgICAgfSk7XG4gICAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvbnRyYWN0IGluZm8uLlwiKTtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ0aGlzLl9jb250cmFjdDogXCIrdGhpcy5fY29udHJhY3QpO1xuICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInRoaXMuX2NvbnRyYWN0Lm9wdGlvbnM6IFwiK3RoaXMuX2NvbnRyYWN0Lm9wdGlvbnMpO1xuICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInRoaXMuX2NvbnRyYWN0Lm9wdGlvbnNbJ2V4cGlyZV9tZXRob2QnXTogXCIrdGhpcy5fY29udHJhY3Qub3B0aW9uc1snZXhwaXJlX21ldGhvZCddKTtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIGlmKCB0eXBlb2YgdGhpcy5fY29udHJhY3QgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIHRoaXMuX2NvbnRyYWN0Lm9wdGlvbnNbJ2V4cGlyZV9tZXRob2QnXSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0aGlzLl9jb250cmFjdC5vcHRpb25zWydleHBpcmVfbWV0aG9kJ10gPT0gJ2xvY2F0aW9uJyl7XG4gICAgICAgICAgICAgICAgLy8gZXhwaXJlIGNvbnRyYWN0IGlmIGxvY2F0aW9uIG9uXG4gICAgICAgICAgICAgICAgdGhpcy5pc0J1c3kgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuY29udHJhY3RTZXJ2aWNlLmV4cGlyZUNvbnRyYWN0KHRoaXMuX2NvbnRyYWN0LmxvY2F0aW9uX2lkLHRoaXMuX2NvbnRyYWN0LmN1c3RvbWVyX2lkKVxuICAgICAgICAgICAgICAgICAgLnN1YnNjcmliZShyZXNwb25zZUNvbnRyYWN0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgLy8gYWxlcnQoXCJDb250cmFjdCBleHBpcmVkIHN1Y2Nlc2Z1bGx5IVwiKTtcbiAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJDb250cmFjdCBleHBpcmVkIHN1Y2Nlc2Z1bGx5IVwiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICB9LGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciBpbiBjb250cmFjdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yLnN0YXR1cyAhPSA0MDQpe1xuICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgZXhwaXJpbmcgdGhlIGNvbnRyYWN0OiBcIitlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIC8vIGRlbGV0ZSByZWNvcmRcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRGVsZXRpbmcgdmlzaXQgZHVlIHRvIGxlc3MgdGhhbiA1OSBzZWNvbmRzOiBcIit2aXNpdC5pZCk7XG4gICAgICAgICAgICB0aGlzLnZpc2l0RGF0YWJhc2VTZXJ2aWNlLmRlbGV0ZVZpc2l0KHZpc2l0LmlkKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgIFxuICAgICAgICAgIH1cbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJDcmVhdGluZyBuZXcgdmlzaXRcIilcbiAgICAgICAgICBsZXQgdmlzaXRPYmogPSBuZXcgVmlzaXQodGhpcy5fY3VzdG9tZXJfaWQsIHN0b3JlLmlkZW50aWZpY2F0b3IpO1xuICAgICAgICAgIHZpc2l0T2JqLmtleXdvcmRzPXN0b3JlLmtleXdvcmRzO1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwidmlzaXRPYmogY29uc3RydWN0b3IgbmFtZTogXCIrIHZpc2l0T2JqLmNvbnN0cnVjdG9yLm5hbWUpO1xuXG4gICAgICAgICAgdGhpcy52aXNpdERhdGFiYXNlU2VydmljZS5pbnNlcnRWaXNpdCh2aXNpdE9iaik7XG4gICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJXZWxjb21lIHRvIFwiK3N0b3JlLm5hbWUpLnNob3coKTtcbiAgICAgICAgICB0aGlzLmF0U3RvcmUgPSBcIkBcIitzdG9yZS5uYW1lO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9ZWxzZXtcbiAgICAgIC8vIFJldHJpdmUgYWxsIHZpc2l0cyAoc2hvdWxkIGJlIG1heCAxKVxuICAgICAgbGV0IHZpc2l0cyA9IHRoaXMudmlzaXREYXRhYmFzZVNlcnZpY2Uuc2VsZWN0VmlzaXRzKCk7XG5cbiAgICAgIGNvbnNvbGUubG9nKFwiaG93IG1hbnkgdmlzaXRzOiBcIit2aXNpdHMubGVuZ3RoKTtcbiAgICAgIC8vIGlmIHRoZXJlIGlzIGFuIHZpc2l0IFxuICAgICAgaWYgKHZpc2l0cy5sZW5ndGggPiAwKXtcbiAgICAgICAgdmlzaXRzLmZvckVhY2godmlzaXQgPT57XG4gICAgICAgICAgbGV0IHN0YXJ0ID0gbmV3IERhdGUodmlzaXQuc3RhcnQpO1xuICAgICAgICAgIGxldCBlbmQgPSBuZXcgRGF0ZSh2aXNpdC5lbmQpO1xuICAgICAgICAgIGxldCBkdXJhdGlvbiA9IGVuZC5nZXRUaW1lKCkgLSBzdGFydC5nZXRUaW1lKCk7XG4gICAgICAgICAgbGV0IHNpbmNlTGFzdCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gZW5kLmdldFRpbWUoKTtcblxuICAgICAgICAgIGNvbnNvbGUubG9nKFwidmlzaXQgLjogXCIrdmlzaXQuaWQpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwic3RhcnQgeC46IFwiK3N0YXJ0LmdldFRpbWUoKSk7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJlbmQgeC46IFwiK2VuZC5nZXRUaW1lKCkpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwic2luY2VMYXN0IHliLjogXCIrIHNpbmNlTGFzdCk7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJkdXJhdGlvbiB5Yy46IFwiKyBkdXJhdGlvbik7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJWaXNpdCB4Zy46IFwiK3Zpc2l0LmJlYWNvbitcIiwgc2luY2VMYXN0OiBcIitzaW5jZUxhc3QrXCIsIGR1cmF0aW9uOiBcIitkdXJhdGlvbik7XG4gICAgICAgICAgLy8gaWYgc2luY2VMYXN0ID4gNjAgc2Vjb25kcyA8LSB0aGlzIGlzIGNydWNpYWwgZm9yIGtub3dpbmcgaWYgaXQgaXMgYXdheVxuICAgICAgICAgIGlmKHNpbmNlTGFzdCA+IDYwMDAwKXtcbiAgICAgICAgICAgIC8vIGlmIGR1cmF0aW9uICA+IDEgbWludXRlIHRoZW4gc2VuZCB2aXNpdFxuICAgICAgICAgICAgaWYoIGR1cmF0aW9uID4gNjAwMDApe1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNlbmRpbmcgdmlzaXQgYiAuOiBcIit2aXNpdClcbiAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJBY3R1YWwgaW1wbGVtZW50YXRpb24gcGVuZGluZy4uXCIpO1xuICAgICAgICAgICAgICB0aGlzLnZpc2l0U2VydmljZS5jcmVhdGVWaXNpdCh2aXNpdCkuc3Vic2NyaWJlKHJlc3BvbnNlID0+IHsgXG4gICAgICAgICAgICAgICAgICAvLyB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJWaXNpdCBTZW50IVwiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgfSxlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBzZW5kaW5nIHRoZSB2aXNpdDogXCIrZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgLy8gdGhyb3cgbmV3IEVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgICAgIHRoaXMuYXRTdG9yZSA9IFwiXCI7XG4gICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiR29vZGJ5ZSFcIikuc2hvdygpO1xuXG4gICAgICAgICAgICAgIC8vIFNlbmQgZmluaXNoZWQgaW50ZXJlc3RzXG4gICAgICAgICAgICAgIC8vIGxldCBmaW5pc2hlZEludGVyZXN0cyA9IHRoaXMuaW50ZXJlc3REYXRhYmFzZVNlcnZpY2UuZmluaXNoSW50ZXJlc3RzKCk7IFxuICAgICAgICAgICAgICAvLyBpZiAoZmluaXNoZWRJbnRlcmVzdHMubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAgIC8vICAgZmluaXNoZWRJbnRlcmVzdHMuZm9yRWFjaChpbnRlcmVzdD0+e1xuICAgICAgICAgICAgICAvLyAgICAgLy8gc2VuZCBpbnRlcmVzdFxuICAgICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coXCJTZW5kaW5nIGludGVyZXN0IGZyb20gZmluaXNoIGludGVyZXN0OiBcIitpbnRlcmVzdC5iZWFjb24pO1xuICAgICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coXCJBY3R1YWwgaW1wbGVtZW50YXRpb24gcGVuZGluZy4uXCIpO1xuXG4gICAgICAgICAgICAgIC8vICAgICBUb2FzdC5tYWtlVGV4dChcIkludGVyZXN0IHN0b3JlZC5cIikuc2hvdygpO1xuICAgICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coXCJJbnRlcmVzdCBzdG9yZWQuXCIpXG4gICAgICAgICAgICAgIC8vICAgfSk7XG4gICAgICAgICAgICAgIC8vIH1cblxuXG4gICAgICAgICAgICAgIHRoaXMudmVyaWZ5SW50ZXJlc3QoKTtcbiAgICAgICAgICAgICAgLy8gUmV0cml2ZSBhbGwgaW50ZXJlc3RzIChzaG91bGQgYmUgbWF4IDEpXG4gICAgICAgICAgICAgIC8vIGxldCBpbnRlcmVzdHMgPSB0aGlzLmludGVyZXN0RGF0YWJhc2VTZXJ2aWNlLnNlbGVjdEludGVyZXN0cygpO1xuXG4gICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiaG93IG1hbnkgaW50ZXJzdHMgdG8gZmluaXNoOiBcIitpbnRlcmVzdHMubGVuZ3RoKTtcbiAgICAgICAgICAgICAgLy8gLy8gaWYgdGhlcmUgaXMgYW4gaW50ZXJlc3QgXG4gICAgICAgICAgICAgIC8vIGlmIChpbnRlcmVzdHMubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAgIC8vICAgICBpbnRlcmVzdHMuZm9yRWFjaChpbnRlcmVzdCA9PntcbiAgICAgICAgICAgICAgLy8gICAgIGxldCBzdGFydCA9IG5ldyBEYXRlKGludGVyZXN0LnN0YXJ0KTtcbiAgICAgICAgICAgICAgLy8gICAgIGxldCBlbmQgPSBuZXcgRGF0ZShpbnRlcmVzdC5lbmQpO1xuICAgICAgICAgICAgICAvLyAgICAgbGV0IGR1cmF0aW9uID0gZW5kLmdldFRpbWUoKSAtIHN0YXJ0LmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgLy8gICAgIGxldCBzaW5jZUxhc3QgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIGVuZC5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhcIkludGVyZXN0IHhnLjogXCIraW50ZXJlc3QuYmVhY29uK1wiLCBzaW5jZUxhc3Q6IFwiK3NpbmNlTGFzdCtcIiwgZHVyYXRpb246IFwiK2R1cmF0aW9uKTtcbiAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAvLyAgICAgLy8gaWYgZHVyYXRpb24gID4gMSBtaW51dGUgdGhlbiBzZW5kIGludGVyZXN0XG4gICAgICAgICAgICAgIC8vICAgICBpZiggZHVyYXRpb24gPiA2MDAwMCl7XG4gICAgICAgICAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2coXCJTZW5kaW5nIGludGVyZXN0IGIgaC46IFwiK2ludGVyZXN0LmJlYWNvbilcbiAgICAgICAgICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhcIkFjdHVhbCBpbXBsZW1lbnRhdGlvbiBwZW5kaW5nLi4gd29yayBpbiBwcm9ncmVzcy4uXCIpO1xuICAgICAgICAgICAgICAvLyAgICAgICAgIHRoaXMuaW50ZXJlc3RTZXJ2aWNlLmNyZWF0ZUludGVyZXN0KGludGVyZXN0KS5zdWJzY3JpYmUocmVzcG9uc2UgPT4geyBcbiAgICAgICAgICAgICAgLy8gICAgICAgICAgIC8vIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgICAgICAgIC8vICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkludGVyZXN0IFNlbnQhXCIpLnNob3coKTtcbiAgICAgICAgICAgICAgLy8gICAgICAgICB9LGVycm9yID0+IHtcbiAgICAgICAgICAgICAgLy8gICAgICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgICAgICAgIC8vICAgICAgICAgICBhbGVydChcIkVycm9yIHNlbmRpbmcgdGhlIGludGVyZXN0OiBcIitlcnJvcik7XG4gICAgICAgICAgICAgIC8vICAgICAgICAgICAvLyB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAvLyAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIC8vICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJJbnRlcmVzdCBzdG9yZWQuXCIpLnNob3coKTtcbiAgICAgICAgICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhcIkludGVyZXN0IHN0b3JlZC5cIilcblxuICAgICAgICAgICAgICAvLyAgICAgICAgIC8vIGZpbmlzaGVkSW50ZXJlc3RzLnB1c2goaW50ZXJlc3QpO1xuICAgICAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coXCJEZWxldGluZyBpbnRlcmVzdCBkdWUgdG8gZXhwaXJpbmcgY29udHJhY3QgaS46IFwiK2ludGVyZXN0LmJlYWNvbik7XG4gICAgICAgICAgICAgIC8vICAgICB0aGlzLmludGVyZXN0RGF0YWJhc2VTZXJ2aWNlLmRlbGV0ZUludGVyZXN0KGludGVyZXN0LmlkKTtcbiAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAvLyAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAvLyB9XG5cblxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvbnRyYWN0IGluZm8uLlwiKTtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ0aGlzLl9jb250cmFjdDogXCIrdGhpcy5fY29udHJhY3QpO1xuICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInRoaXMuX2NvbnRyYWN0Lm9wdGlvbnM6IFwiK3RoaXMuX2NvbnRyYWN0Lm9wdGlvbnMpO1xuICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInRoaXMuX2NvbnRyYWN0Lm9wdGlvbnNbJ2V4cGlyZV9tZXRob2QnXTogXCIrdGhpcy5fY29udHJhY3Qub3B0aW9uc1snZXhwaXJlX21ldGhvZCddKTtcblxuICAgICAgICAgICAgICBpZiggdHlwZW9mIHRoaXMuX2NvbnRyYWN0ICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiB0aGlzLl9jb250cmFjdC5vcHRpb25zWydleHBpcmVfbWV0aG9kJ10gIT09IFwidW5kZWZpbmVkXCIgJiYgdGhpcy5fY29udHJhY3Qub3B0aW9uc1snZXhwaXJlX21ldGhvZCddID09ICdsb2NhdGlvbicpe1xuICAgICAgICAgICAgICAgIC8vIGV4cGlyZSBjb250cmFjdCBpZiBsb2NhdGlvbiBvblxuICAgICAgICAgICAgICAgIHRoaXMuaXNCdXN5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyYWN0U2VydmljZS5leHBpcmVDb250cmFjdCh0aGlzLl9jb250cmFjdC5sb2NhdGlvbl9pZCx0aGlzLl9jb250cmFjdC5jdXN0b21lcl9pZClcbiAgICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUocmVzcG9uc2VDb250cmFjdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIC8vIGFsZXJ0KFwiQ29udHJhY3QgZXhwaXJlZCBzdWNjZXNmdWxseSFcIik7XG4gICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiQ29udHJhY3QgZXhwaXJlZCBzdWNjZXNmdWxseSFcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgfSxlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgaW4gY29udHJhY3RcIik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnJvci5zdGF0dXMgIT0gNDA0KXtcbiAgICAgICAgICAgICAgICAgICAgICBhbGVydChcIkVycm9yIGV4cGlyaW5nIHRoZSBjb250cmFjdDogXCIrZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkRlbGV0aW5nIHZpc2l0IGR1ZSB0byBtb3JlIHRoYW4gMSBtaW51dGUgYXdheSBkLjogXCIrdmlzaXQuaWQpO1xuICAgICAgICAgICAgdGhpcy52aXNpdERhdGFiYXNlU2VydmljZS5kZWxldGVWaXNpdCh2aXNpdC5pZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB2ZXJpZnlCZWhhdmlvcigpe1xuICAgIGxldCBuZWFyYnlJdGVtcyA9IHRoaXMubmVhcmJ5SXRlbXMoKTtcbiAgICBjb25zb2xlLmxvZyhcIk5lYXJieSBpdGVtczogXCIrbmVhcmJ5SXRlbXMubGVuZ3RoKVxuXG4gICAgaWYgKG5lYXJieUl0ZW1zLmxlbmd0aD4wKXtcbiAgICAgIG5lYXJieUl0ZW1zLmZvckVhY2goaXRlbT0+e1xuICAgICAgICBjb25zb2xlLmxvZyhcIkJlYWNvbiBpZGVudGlmaWNhdG9yOiBcIitpdGVtLmlkZW50aWZpY2F0b3IpO1xuICAgICAgICBsZXQgaW50ZXJlc3Q6IEludGVyZXN0ICA9IHRoaXMuaW50ZXJlc3REYXRhYmFzZVNlcnZpY2Uuc2VsZWN0SW50ZXJlc3RCeUJlYWNvbihpdGVtLmlkZW50aWZpY2F0b3IpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImludGVyZXN0IGxlbjogXCIrIGludGVyZXN0LilcbiAgICAgICAgLy8gVmVyaWZ5IGlmIGludGVyZXN0IGlzIGJlaW5nIGNyZWF0ZWRcbiAgICAgICAgaWYgKGludGVyZXN0ICE9IG51bGwpe1xuICAgICAgICAgIGxldCBzdGFydCA9IG5ldyBEYXRlKGludGVyZXN0LnN0YXJ0KTtcbiAgICAgICAgICBsZXQgZW5kID0gbmV3IERhdGUoaW50ZXJlc3QuZW5kKTtcbiAgICAgICAgICBsZXQgZHVyYXRpb24gPSBlbmQuZ2V0VGltZSgpIC0gc3RhcnQuZ2V0VGltZSgpO1xuICAgICAgICAgIGxldCBzaW5jZUxhc3QgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIGVuZC5nZXRUaW1lKCk7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJpbnRlcmVzdCB0eXBlOiBcIisgdHlwZW9mIGludGVyZXN0KTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcImludGVyZXN0IGNvbnN0cnVjdG9yIG5hbWU6IFwiKyBpbnRlcmVzdC5jb25zdHJ1Y3Rvci5uYW1lKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcImludGVyZXN0IGluc3RhbmNlIG9mIEludGVyZXN0OiBcIisgKGludGVyZXN0IGluc3RhbmNlb2YgSW50ZXJlc3QpKTtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInN0YXJ0OiBcIisoc3RhcnQuZ2V0VGltZSgpKSk7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coXCJlbmQ6IFwiKyBlbmQuZ2V0VGltZSgpKTtcbiAgICAgICAgICBjb25zb2xlLmxvZygnaW50ZXJlc3QgZHVyYXRpb246ICcrZHVyYXRpb24pO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdpbnRlcmVzdCBzaW5jZUxhc3Q6ICcrc2luY2VMYXN0KTtcbiAgICAgICAgICAvLyBpZiBsYXN0IHJlYWRpbmcgb2YgaXRlbSB3YXMgbGVzcyB0aGFuIDIwIHNlY29uZHMgYWdvXG4gICAgICAgICAgaWYoc2luY2VMYXN0IDwgNTkwMDApeyAvLyB1cGRhdGUgZW5kIGRhdGUgdG8gY3VycmVudFxuICAgICAgICAgICAgLy8gdGhpcy5pbnRlcmVzdERhdGFiYXNlU2VydmljZS51cGRhdGVJbnRlcmVzdChpbnRlcmVzdFswXSxpbnRlcmVzdFsxXSwgIGludGVyZXN0WzJdICwgaW50ZXJlc3RbM10gLG5ldyBEYXRlKCksIGludGVyZXN0WzVdICwgaW50ZXJlc3RbNl0gLCBpbnRlcmVzdFs3XSk7XG4gICAgICAgICAgICB0aGlzLmludGVyZXN0RGF0YWJhc2VTZXJ2aWNlLnVwZGF0ZUludGVyZXN0KGludGVyZXN0KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW50ZXJlc3QgJ2VuZCcgdXBkYXRlZFwiKTtcbiAgICAgICAgICB9ZWxzZXsvLyBpZiBsYXN0IHJlYWRpbmcgb2YgaXRlbSB3YXMgbW9yZSB0aGFuIDIwIHNlY29uZHMgYWdvXG4gICAgICAgICAgICBpZihkdXJhdGlvbiA+IDYwMDAwKXsgLy8gaWYgcmVhZGluZ3MgbGFzdGVkIG1vcmUgdGhhbiA2MCBzZWNvbmRzLCBzZW5kIHJlY29yZFxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNlbmRpbmcgaW50ZXJlc3QgYSA6IFwiK2ludGVyZXN0KVxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkFjdHVhbCBpbXBsZW1lbnRhdGlvbiBwZW5kaW5nLi4gd29yayBpbiBwcm9ncmVzcy4uXCIpO1xuICAgICAgICAgICAgICB0aGlzLmludGVyZXN0U2VydmljZS5jcmVhdGVJbnRlcmVzdChpbnRlcmVzdCkuc3Vic2NyaWJlKHJlc3BvbnNlID0+IHsgXG4gICAgICAgICAgICAgICAgLy8gdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkludGVyZXN0IFNlbnQhXCIpLnNob3coKTtcbiAgICAgICAgICAgICAgfSxlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBhbGVydChcIkVycm9yIHNlbmRpbmcgdGhlIGludGVyZXN0OiBcIitlcnJvcik7XG4gICAgICAgICAgICAgICAgLy8gdGhyb3cgbmV3IEVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiSW50ZXJlc3Qgc3RvcmVkLlwiKS5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBkZWxldGUgcmVjb3JkXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkRlbGV0aW5nIGludGVyZXN0IGR1ZSB0byBsZXNzIHRoYW4gMjAgc2Vjb25kczogXCIraW50ZXJlc3QuaWQpO1xuICAgICAgICAgICAgdGhpcy5pbnRlcmVzdERhdGFiYXNlU2VydmljZS5kZWxldGVJbnRlcmVzdChpbnRlcmVzdC5pZCk7XG4gICAgICAgICAgXG4gICAgICAgICAgfVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkNyZWF0aW5nIG5ldyBpbnRlcmVzdFwiKVxuICAgICAgICAgIGxldCBpbnRlcmVzdE9iaiA9IG5ldyBJbnRlcmVzdCh0aGlzLl9jdXN0b21lcl9pZCwgaXRlbS5pZGVudGlmaWNhdG9yKTtcbiAgICAgICAgICBpbnRlcmVzdE9iai5rZXl3b3Jkcz1pdGVtLmtleXdvcmRzO1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiY0lkIHVuZGU6IFwiK3RoaXMuX2N1c3RvbWVyX2lkKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcImlJZCB1bmRlOiBcIitpdGVtLmlkZW50aWZpY2F0b3IpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW50ZXJlc3RPYmogY29uc3RydWN0b3IgbmFtZTogXCIrIGludGVyZXN0T2JqLmNvbnN0cnVjdG9yLm5hbWUpXG4gICAgICAgICAgdGhpcy5pbnRlcmVzdERhdGFiYXNlU2VydmljZS5pbnNlcnRJbnRlcmVzdChpbnRlcmVzdE9iaik7XG4gICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJSZWNvcmRpbmcgaW50ZXJlc3QuXCIpLnNob3coKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfWVsc2V7XG4gICAgICB0aGlzLnZlcmlmeUludGVyZXN0KCk7XG4gICAgICAvLyAvLyBSZXRyaXZlIGFsbCBpbnRlcmVzdHMgKHNob3VsZCBiZSBtYXggMSlcbiAgICAgIC8vIGxldCBpbnRlcmVzdHMgPSB0aGlzLmludGVyZXN0RGF0YWJhc2VTZXJ2aWNlLnNlbGVjdEludGVyZXN0cygpO1xuXG4gICAgICAvLyBjb25zb2xlLmxvZyhcImhvdyBtYW55IGludGVyc3RzOiBcIitpbnRlcmVzdHMubGVuZ3RoKTtcbiAgICAgIC8vIC8vIGlmIHRoZXJlIGlzIGFuIGludGVyZXN0IFxuICAgICAgLy8gaWYgKGludGVyZXN0cy5sZW5ndGggPiAwKXtcbiAgICAgIC8vICAgaW50ZXJlc3RzLmZvckVhY2goaW50ZXJlc3QgPT57XG4gICAgICAvLyAgICAgbGV0IHN0YXJ0ID0gbmV3IERhdGUoaW50ZXJlc3Quc3RhcnQpO1xuICAgICAgLy8gICAgIGxldCBlbmQgPSBuZXcgRGF0ZShpbnRlcmVzdC5lbmQpO1xuICAgICAgLy8gICAgIGxldCBkdXJhdGlvbiA9IGVuZC5nZXRUaW1lKCkgLSBzdGFydC5nZXRUaW1lKCk7XG4gICAgICAvLyAgICAgbGV0IHNpbmNlTGFzdCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gZW5kLmdldFRpbWUoKTtcbiAgICAgIC8vICAgICAvLyBpZiBzaW5jZUxhc3QgPiA2MCBzZWNvbmRzIDwtIHRoaXMgaXMgY3J1Y2lhbCBmb3Iga25vd2luZyBpZiBpdCBpcyBhd2F5XG4gICAgICAvLyAgICAgY29uc29sZS5sb2coXCJJbnRlcmVzdCB4YS46IFwiK2ludGVyZXN0LmJlYWNvbitcIiwgc2luY2VMYXN0OiBcIitzaW5jZUxhc3QrXCIsIGR1cmF0aW9uOiBcIitkdXJhdGlvbik7XG4gICAgICAvLyAgICAgaWYoc2luY2VMYXN0ID4gNjAwMDApe1xuICAgICAgLy8gICAgICAgLy8gaWYgZHVyYXRpb24gID4gMSBtaW51dGUgdGhlbiBzZW5kIGludGVyZXN0XG4gICAgICAvLyAgICAgICBpZiggZHVyYXRpb24gPiA2MDAwMCl7XG4gICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyBpbnRlcmVzdCBiIGIuOiBcIitpbnRlcmVzdC5iZWFjb24pXG4gICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKFwiQWN0dWFsIGltcGxlbWVudGF0aW9uIHBlbmRpbmcuLiB3b3JrIGluIHByb2dyZXNzLi5cIik7XG4gICAgICAvLyAgICAgICAgIHRoaXMuaW50ZXJlc3RTZXJ2aWNlLmNyZWF0ZUludGVyZXN0KGludGVyZXN0KS5zdWJzY3JpYmUocmVzcG9uc2UgPT4geyBcbiAgICAgIC8vICAgICAgICAgICAvLyB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgLy8gICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiSW50ZXJlc3QgU2VudCFcIikuc2hvdygpO1xuICAgICAgLy8gICAgICAgICB9LGVycm9yID0+IHtcbiAgICAgIC8vICAgICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgLy8gICAgICAgICAgIGFsZXJ0KFwiRXJyb3Igc2VuZGluZyB0aGUgaW50ZXJlc3Q6IFwiK2Vycm9yKTtcbiAgICAgIC8vICAgICAgICAgICAvLyB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xuICAgICAgLy8gICAgICAgICB9KTtcbiAgICAgIC8vICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJJbnRlcmVzdCBzdG9yZWQuXCIpLnNob3coKTtcbiAgICAgIC8vICAgICAgIH1cbiAgICAgIC8vICAgICAgIGNvbnNvbGUubG9nKFwiRGVsZXRpbmcgaW50ZXJlc3QgZHVlIHRvIG1vcmUgdGhhbiAxIG1pbnV0ZSBhd2F5IGMuOiBcIitpbnRlcmVzdC5pZCk7XG4gICAgICAvLyAgICAgICB0aGlzLmludGVyZXN0RGF0YWJhc2VTZXJ2aWNlLmRlbGV0ZUludGVyZXN0KGludGVyZXN0LmlkKTtcbiAgICAgIC8vICAgICB9XG4gICAgICAvLyAgIH0pO1xuICAgICAgLy8gfVxuICAgIH1cbiAgfVxuXG4gIHZlcmlmeUludGVyZXN0KCl7XG4gICAgLy8gUmV0cml2ZSBhbGwgaW50ZXJlc3RzIChzaG91bGQgYmUgbWF4IDEpXG4gICAgbGV0IGludGVyZXN0cyA9IHRoaXMuaW50ZXJlc3REYXRhYmFzZVNlcnZpY2Uuc2VsZWN0SW50ZXJlc3RzKCk7XG5cbiAgICBjb25zb2xlLmxvZyhcImhvdyBtYW55IGludGVyc3RzOiBcIitpbnRlcmVzdHMubGVuZ3RoKTtcbiAgICAvLyBpZiB0aGVyZSBpcyBhbiBpbnRlcmVzdCBcbiAgICBpZiAoaW50ZXJlc3RzLmxlbmd0aCA+IDApe1xuICAgICAgaW50ZXJlc3RzLmZvckVhY2goaW50ZXJlc3QgPT57XG4gICAgICAgIGxldCBzdGFydCA9IG5ldyBEYXRlKGludGVyZXN0LnN0YXJ0KTtcbiAgICAgICAgbGV0IGVuZCA9IG5ldyBEYXRlKGludGVyZXN0LmVuZCk7XG4gICAgICAgIGxldCBkdXJhdGlvbiA9IGVuZC5nZXRUaW1lKCkgLSBzdGFydC5nZXRUaW1lKCk7XG4gICAgICAgIGxldCBzaW5jZUxhc3QgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIGVuZC5nZXRUaW1lKCk7XG4gICAgICAgIC8vIGlmIHNpbmNlTGFzdCA+IDYwIHNlY29uZHMgPC0gdGhpcyBpcyBjcnVjaWFsIGZvciBrbm93aW5nIGlmIGl0IGlzIGF3YXlcbiAgICAgICAgY29uc29sZS5sb2coXCJJbnRlcmVzdCB4YS46IFwiK2ludGVyZXN0LmJlYWNvbitcIiwgc2luY2VMYXN0OiBcIitzaW5jZUxhc3QrXCIsIGR1cmF0aW9uOiBcIitkdXJhdGlvbik7XG4gICAgICAgIGlmKHNpbmNlTGFzdCA+IDYwMDAwKXtcbiAgICAgICAgICAvLyBpZiBkdXJhdGlvbiAgPiAxIG1pbnV0ZSB0aGVuIHNlbmQgaW50ZXJlc3RcbiAgICAgICAgICBpZiggZHVyYXRpb24gPiA2MDAwMCl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNlbmRpbmcgaW50ZXJlc3QgYiBiLjogXCIraW50ZXJlc3QuYmVhY29uKVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJBY3R1YWwgaW1wbGVtZW50YXRpb24gcGVuZGluZy4uIHdvcmsgaW4gcHJvZ3Jlc3MuLlwiKTtcbiAgICAgICAgICAgIHRoaXMuaW50ZXJlc3RTZXJ2aWNlLmNyZWF0ZUludGVyZXN0KGludGVyZXN0KS5zdWJzY3JpYmUocmVzcG9uc2UgPT4geyBcbiAgICAgICAgICAgICAgLy8gdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJJbnRlcmVzdCBTZW50IVwiKS5zaG93KCk7XG4gICAgICAgICAgICB9LGVycm9yID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBzZW5kaW5nIHRoZSBpbnRlcmVzdDogXCIrZXJyb3IpO1xuICAgICAgICAgICAgICAvLyB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkludGVyZXN0IHN0b3JlZC5cIikuc2hvdygpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkRlbGV0aW5nIGludGVyZXN0IGR1ZSB0byBtb3JlIHRoYW4gMSBtaW51dGUgYXdheSBjLjogXCIraW50ZXJlc3QuaWQpO1xuICAgICAgICAgIHRoaXMuaW50ZXJlc3REYXRhYmFzZVNlcnZpY2UuZGVsZXRlSW50ZXJlc3QoaW50ZXJlc3QuaWQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9ICBcbiAgfVxuXG4gIHZlcmlmeUNvbnRyYWN0KCl7XG4gICAgY29uc29sZS5sb2coXCJWZXJpZnlpbmcgY29udHJhY3RzLi5cIik7XG4gICAgLy8gdGhpcy5pc0J1c3kgPSB0cnVlO1xuICAgIGxldCBuZWFyYnlTdG9yZXMgPSB0aGlzLm5lYXJieVN0b3JlcygpO1xuICAgIGNvbnNvbGUubG9nKFwiTmVhcmJ5IHN0b3JlczogXCIrbmVhcmJ5U3RvcmVzLmxlbmd0aClcbiAgICBpZiAobmVhcmJ5U3RvcmVzLmxlbmd0aD4wKXtcbiAgICAgIG5lYXJieVN0b3Jlcy5mb3JFYWNoKHN0b3JlID0+IHtcbiAgICAgICAgdGhpcy5jb250cmFjdFNlcnZpY2UuZ2V0QWN0aXZlQ29udHJhY3QoIHRoaXMuX2N1c3RvbWVyX2lkICxwYXJzZUludChzdG9yZS5sb2NhdGlvbl9pZCkpXG4gICAgICAgIC5zdWJzY3JpYmUocmVzcG9uc2VDb250cmFjdCA9PiB7XG4gICAgICAgICAgaWYgKCFyZXNwb25zZUNvbnRyYWN0Lm1lc3NhZ2Upe1xuICAgICAgICAgICAgdGhpcy5fY29udHJhY3QgPSByZXNwb25zZUNvbnRyYWN0O1xuICAgICAgICAgICAgdGhpcy5jYW5Db250cmFjdCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5oYXNDb250cmFjdCA9IHRydWU7XG4gICAgICAgICAgICBpZiAodGhpcy5fY29udHJhY3Qub3B0aW9uc1snZXhwaXJlX21ldGhvZCddPT1cImxvY2F0aW9uXCIpe1xuICAgICAgICAgICAgICB0aGlzLmV4cGlyYXRpb25UZXh0ID0gXCJFeHBpcmVzIGxlYXZpbmcgdGhlIHN0b3JlLlwiO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgIGxldCBkdCA9IG5ldyBEYXRlKHRoaXMuX2NvbnRyYWN0LmV4cGlyZSk7XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICB0aGlzLmV4cGlyYXRpb25UZXh0ID0gXCJFeHBpcmVzIGF0OiBcIitkdC5nZXREYXRlKCkrXCIvXCIrZHQuZ2V0TW9udGgoKStcIi9cIitkdC5nZXRGdWxsWWVhcigpK1wiIFwiK2R0LmdldEhvdXJzKCkrXCI6XCIrZHQuZ2V0TWludXRlcygpK1wiOlwiK2R0LmdldFNlY29uZHMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5sb2NhdGlvbl9pZCA9IHN0b3JlLmxvY2F0aW9uX2lkO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJBY3RpdmUgY29udHJhY3QuXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICB9LGVycm9yID0+IHtcbiAgICAgICAgICBpZiAoZXJyb3Iuc3RhdHVzID09IDQwNCl7XG4gICAgICAgICAgICB0aGlzLmNhbkNvbnRyYWN0ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuaGFzQ29udHJhY3QgPSBmYWxzZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm8gYWN0aXZlIENvbnRyYWN0cy5cIik7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVmlzaXRzIGFuZCBpbnRlcmVzdHMgdG8gc2VuZD9cIik7XG5cbiAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgZ2V0dGluZyBhY3RpdmUgY29udHJhY3QgaW5mb3JtYXRpb246IFwiK2Vycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTsgIFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1lbHNle1xuICAgICAgY29uc29sZS5sb2coXCJhYm91dCB0byB2ZXJpZnkgY29udHJhY3Qgd2l0aG91dCBzdG9yZS9sb2NhdGlvblwiKTtcbiAgICAgIGNvbnNvbGUubG9nKFwiY3VzdDogXCIrdGhpcy5fY3VzdG9tZXJfaWQpO1xuICAgICAgdGhpcy5jb250cmFjdFNlcnZpY2UuZ2V0QWN0aXZlQ29udHJhY3QoIHRoaXMuX2N1c3RvbWVyX2lkIClcbiAgICAgICAgLnN1YnNjcmliZShyZXNwb25zZUNvbnRyYWN0ID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIm1lc3NhZ2U/IFwiK3Jlc3BvbnNlQ29udHJhY3QpO1xuICAgICAgICAgIGlmICghcmVzcG9uc2VDb250cmFjdC5tZXNzYWdlKXtcbiAgICAgICAgICAgIHRoaXMuX2NvbnRyYWN0ID0gcmVzcG9uc2VDb250cmFjdDtcbiAgICAgICAgICAgIHRoaXMuY2FuQ29udHJhY3QgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuaGFzQ29udHJhY3QgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKHRoaXMuX2NvbnRyYWN0Lm9wdGlvbnNbJ2V4cGlyZV9tZXRob2QnXT09XCJsb2NhdGlvblwiKXtcbiAgICAgICAgICAgICAgdGhpcy5leHBpcmF0aW9uVGV4dCA9IFwiRXhwaXJlcyBsZWF2aW5nIHRoZSBzdG9yZS5cIjtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICBsZXQgZHQgPSBuZXcgRGF0ZSh0aGlzLl9jb250cmFjdC5leHBpcmUpO1xuICAgICAgICAgICAgICB0aGlzLmV4cGlyYXRpb25UZXh0ID0gXCJFeHBpcmVzIGF0OiBcIitkdC5nZXREYXRlKCkrXCIvXCIrZHQuZ2V0TW9udGgoKStcIi9cIitkdC5nZXRGdWxsWWVhcigpK1wiIFwiK2R0LmdldEhvdXJzKCkrXCI6XCIrZHQuZ2V0TWludXRlcygpK1wiOlwiK2R0LmdldFNlY29uZHMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubG9jYXRpb25faWQgPSByZXNwb25zZUNvbnRyYWN0LmxvY2F0aW9uX2lkO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJBY3RpdmUgY29udHJhY3QuXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJjb250cmFjdCBidXQgbm8gbWVzc2FnZVwiKVxuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICB9LGVycm9yID0+IHtcbiAgICAgICAgICBpZiAoZXJyb3Iuc3RhdHVzID09IDQwNCl7XG4gICAgICAgICAgICB0aGlzLmNhbkNvbnRyYWN0ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuaGFzQ29udHJhY3QgPSBmYWxzZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm8gYWN0aXZlIENvbnRyYWN0cy5cIik7XG4gICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBhbGVydChcIkVycm9yIGdldHRpbmcgYWN0aXZlIGNvbnRyYWN0IGluZm9ybWF0aW9uOiBcIitlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7ICBcbiAgICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLy8gTG9jYXRpb24gcmVmYWN0b3JcbiAgLy8gcHJpdmF0ZSBnZXRDdXJyZW50TG9jYXRpb24oKXtcbiAgLy8gICAvLyBUT0RPIGdldCBvd24gY29vcmRlbmF0ZXNcbiAgLy8gICB0aGlzLmlzQnVzeSA9IHRydWU7XG4gIC8vICAgdGhpcy5sb2NhdGlvblNlcnZpY2UuZ2V0Q3VycmVudExvY2F0aW9uKClcbiAgLy8gICAgIC50aGVuKChsb2NhdGlvbjogTG9jYXRpb24pID0+IHtcbiAgLy8gICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgLy8gICAgICAgaWYobG9jYXRpb24gIT0gdW5kZWZpbmVkKXtcbiAgLy8gICAgICAgICB0aGlzLl9jdXJyZW50X2xvY2F0aW9uID0gbG9jYXRpb247XG4gIC8vICAgICAgICAgdGhpcy5pc0N1cnJlbnRMb2NhdGlvbiA9IHRydWU7XG4gIC8vICAgICAgIH1cbiAgLy8gICAgICAgZWxzZXtcbiAgLy8gICAgICAgICB0aHJvdyBcIkxvY2F0aW9uIG5vdCBmb3VuZFwiO1xuICAvLyAgICAgICB9IFxuICAvLyAgICAgfVxuICAvLyAgICAgKS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgLy8gICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgLy8gICAgICAgYWxlcnQoZXJyb3IpXG4gIC8vICAgICB9KTtcbiAgLy8gfVxuXG5cbiAgLy8gTUVUSE9EUyBPTkxZIEZPUiBURVNUSU5HIERBVEFCQVNFXG4gIHB1YmxpYyBzaG93TG9jYXRpb25zSW5EYXRhYmFzZSgpIHsgXG4gICAgdGhpcy5fbG9jYXRpb25zX2luX2RiLmZvckVhY2gobG9jYXRpb24gPT4ge1xuICAgICAgYWxlcnQoXCJMb2NhdGlvbjogXCIrbG9jYXRpb24ubmFtZSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBMb2NhdGlvbiByZWZhY3RvclxuICAvLyBwdWJsaWMgaXNMb2NhdGlvbkRhdGFiYXNlRW1wdHkoKXtcbiAgLy8gICBsZXQgZW1wdHkgPSB0cnVlO1xuICAvLyAgIC8vIGNvbnNvbGUubG9nKFwiVGVzdDEuNlwiKTtcbiAgLy8gICAvLyBjb25zb2xlLmxvZyhcIlRlc3QxLjcsIGxlbmd0aDogXCIrdGhpcy5sb2NhdGlvbkRhdGFiYXNlU2VydmljZS5zZWxlY3RBbGxMb2NhdGlvbnMoKS5sZW5ndGgpO1xuICAvLyAgIGlmICh0aGlzLmxvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlLnNlbGVjdEFsbExvY2F0aW9ucygpLmxlbmd0aCA+IDApe1xuICAvLyAgICAgY29uc29sZS5sb2coXCJEYXRhYmFzZSBlbXB0eVwiKTtcbiAgLy8gICAgIGVtcHR5ID0gZmFsc2U7XG4gIC8vICAgfVxuICAvLyAgIHJldHVybiBlbXB0eTtcbiAgLy8gfVxuXG4gIC8vIExvY2F0aW9uIHJlZmFjdG9yXG4gIC8vIHB1YmxpYyB1cGRhdGVMb2NhdGlvbkRhdGFiYXNlKCl7XG4gIC8vICAgLy8gYWxlcnQoXCJ1cGRhdGluZyBsb2NhdGlvbnMgZGIuLlwiKVxuICAvLyAgIC8vIERyb3BzIERCIGlmICBleGlzdFxuICAvLyAgIHRoaXMubG9jYXRpb25EYXRhYmFzZVNlcnZpY2UuZHJvcFRhYmxlKCk7XG4gIC8vICAgLy8gQ3JlYXRlcyBEQiBpZiBub3QgZXhpc3RcbiAgLy8gICB0aGlzLmxvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlLmNyZWF0ZVRhYmxlKCk7XG5cbiAgLy8gICB0aGlzLmlzQnVzeSA9IHRydWU7XG4gIC8vICAgdGhpcy5sb2NhdGlvblNlcnZpY2UuZ2V0TG9jYXRpb25zKClcbiAgLy8gICAgIC5zdWJzY3JpYmUocmVzcG9uc2UgPT4ge1xuICAvLyAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICBcbiAgLy8gICAgICAgcmVzcG9uc2UuZm9yRWFjaChsb2NhdGlvbiA9PiB7XG4gIC8vICAgICAgICAgLy8gY29uc29sZS5sb2coXCJsb2NhdGlvbiBuYW1lOiBcIisgbG9jYXRpb24ubmFtZSk7XG4gIC8vICAgICAgICAgdGhpcy5sb2NhdGlvbkRhdGFiYXNlU2VydmljZS5pbnNlcnRMb2NhdGlvbihsb2NhdGlvbik7XG5cbiAgLy8gICAgICAgfSk7XG4gIC8vICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9tYWluXCJdKTsgIFxuICAvLyAgICAgfSxlcnJvciA9PiB7XG4gIC8vICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gIC8vICAgICAgIGFsZXJ0KGVycm9yKTtcbiAgLy8gICAgIH0pO1xuICAvLyB9XG5cbiAgcHVibGljIGlzQmVhY29uRGF0YWJhc2VFbXB0eSgpe1xuICAgIGxldCBlbXB0eSA9IHRydWU7XG4gICAgLy8gY29uc29sZS5sb2coXCJUZXN0MS42XCIpO1xuICAgIC8vIGNvbnNvbGUubG9nKFwiVGVzdDEuNywgbGVuZ3RoOiBcIit0aGlzLmxvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlLnNlbGVjdEFsbExvY2F0aW9ucygpLmxlbmd0aCk7XG4gICAgaWYgKHRoaXMuYmVhY29uRGF0YWJhc2VTZXJ2aWNlLnNlbGVjdEJlYWNvbnMoXCJhbGxcIikubGVuZ3RoID4gMCl7XG4gICAgICBlbXB0eSA9IGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBlbXB0eTtcbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVCZWFjb25EYXRhYmFzZSgpe1xuICAgIC8vIGFsZXJ0KFwidXBkYXRpbmcgbG9jYXRpb25zIGRiLi5cIilcbiAgICAvLyBEcm9wcyBEQiBpZiAgZXhpc3RcbiAgICB0aGlzLmJlYWNvbkRhdGFiYXNlU2VydmljZS5kcm9wVGFibGUoKTtcbiAgICAvLyBDcmVhdGVzIERCIGlmIG5vdCBleGlzdFxuICAgIHRoaXMuYmVhY29uRGF0YWJhc2VTZXJ2aWNlLmNyZWF0ZVRhYmxlKCk7XG4gICAgY29uc29sZS5sb2coXCJMb2NhbCBEQiBjcmVhdGVkLCBubyBlcnJvcnMgc28gZmFyLi5cIik7XG4gICAgdGhpcy5pc0J1c3kgPSB0cnVlO1xuICAgIHRoaXMuYmVhY29uU2VydmljZS5nZXRCZWFjb25zKClcbiAgICAgIC5zdWJzY3JpYmUocmVzcG9uc2UgPT4ge1xuICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICBcbiAgICAgICAgcmVzcG9uc2UuZm9yRWFjaChiZWFjb24gPT4ge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwibG9jYXRpb24gbmFtZTogXCIrIGxvY2F0aW9uLm5hbWUpO1xuICAgICAgICAgIHRoaXMuYmVhY29uRGF0YWJhc2VTZXJ2aWNlLmluc2VydEJlYWNvbihiZWFjb24pO1xuXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkxvY2FsIERCIHVwZGF0ZWQuXCIpO1xuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvXCJdLCB7IGNsZWFySGlzdG9yeTogdHJ1ZSB9KTtcbiAgICAgIH0sZXJyb3IgPT4ge1xuICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICBhbGVydChlcnJvcik7XG4gICAgICB9KTtcbiAgfVxufSJdfQ==