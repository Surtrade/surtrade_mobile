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
var MainComponent = (function () {
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
                    var start = new Date(visit[3]);
                    var end = new Date(visit[4]);
                    var duration = end.getTime() - start.getTime();
                    var sinceLast = new Date().getTime() - end.getTime();
                    // console.log("visit");
                    console.log("start: " + (visit.start));
                    console.log("start: " + (start.getTime()));
                    console.log("start: " + (start.toDateString()));
                    console.log("start: " + (start.toString()));
                    console.log("start: " + (_this.dateFormatter(start)));
                    // console.log("end: "+ end.getTime());
                    console.log('visit duration: ' + duration);
                    console.log('visit sinceLast: ' + sinceLast);
                    console.log("Visit post test: " + visit);
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
                        _this.visitDatabaseService.updateVisit(visit[0], visit[1], visit[2], visit[3], new Date(), visit[5], visit[6], visit[7]);
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
                                alert("Error creating the contract: " + error);
                                // throw new Error(error);
                            });
                            Toast.makeText("Goodbye from " + store.name).show();
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
                            // Retrive all interests (should be max 1)
                            var interests = _this.interestDatabaseService.selectInterests();
                            console.log("how many intersts to finish: " + interests.length);
                            // if there is an interest 
                            if (interests.length > 0) {
                                interests.forEach(function (interest) {
                                    var start = new Date(interest.start);
                                    var end = new Date(interest.end);
                                    var duration = end.getTime() - start.getTime();
                                    var sinceLast = new Date().getTime() - end.getTime();
                                    console.log("Interest: " + interest.beacon + ", sinceLast: " + sinceLast + ", duration: " + duration);
                                    // if duration  > 1 minute then send interest
                                    if (duration > 60000) {
                                        console.log("Sending interest b: " + interest.beacon);
                                        console.log("Actual implementation pending..");
                                        Toast.makeText("Interest stored.").show();
                                        console.log("Interest stored.");
                                        // finishedInterests.push(interest);
                                    }
                                    console.log("Deleting interest due to expiring contract: " + interest.beacon);
                                    _this.interestDatabaseService.deleteInterest(interest.id);
                                });
                            }
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
                        console.log("Deleting visit due to less than 59 seconds: " + visit[0]);
                        _this.visitDatabaseService.deleteVisit(visit[0]);
                    }
                }
                else {
                    console.log("Creating new visit");
                    var visitObj = new visit_1.Visit(_this._customer_id, store.identificator);
                    visitObj.keywords = store.keywords;
                    _this.visitDatabaseService.insertVisit(visitObj);
                    Toast.makeText("Wellcome to " + store.name).show();
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
                    console.log("sinceLast: " + sinceLast);
                    console.log("duration: " + duration);
                    // if sinceLast > 60 seconds <- this is crucial for knowing if it is away
                    if (sinceLast > 60000) {
                        // if duration  > 1 minute then send visit
                        if (duration > 60000) {
                            console.log("Sending visit b : " + visit.id);
                            // console.log("Actual implementation pending..");
                            _this.visitService.createVisit(visit).subscribe(function (response) {
                                // this.isBusy = false;
                                Toast.makeText("Visit Sent!").show();
                            }, function (error) {
                                _this.isBusy = false;
                                alert("Error creating the contract: " + error);
                                // throw new Error(error);
                            });
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
                            // Retrive all interests (should be max 1)
                            var interests = _this.interestDatabaseService.selectInterests();
                            console.log("how many intersts to finish: " + interests.length);
                            // if there is an interest 
                            if (interests.length > 0) {
                                interests.forEach(function (interest) {
                                    var start = new Date(interest.start);
                                    var end = new Date(interest.end);
                                    var duration = end.getTime() - start.getTime();
                                    var sinceLast = new Date().getTime() - end.getTime();
                                    console.log("Interest: " + interest.beacon + ", sinceLast: " + sinceLast + ", duration: " + duration);
                                    // if duration  > 1 minute then send interest
                                    if (duration > 60000) {
                                        console.log("Sending interest b: " + interest.beacon);
                                        console.log("Actual implementation pending..");
                                        Toast.makeText("Interest stored.").show();
                                        console.log("Interest stored.");
                                        // finishedInterests.push(interest);
                                    }
                                    console.log("Deleting interest due to expiring contract: " + interest.beacon);
                                    _this.interestDatabaseService.deleteInterest(interest.id);
                                });
                            }
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
                        console.log("Deleting visit due to more than 1 minute away: " + visit.id);
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
                // Verify if interest is being created
                if (interest != null) {
                    var start = new Date(interest[3]);
                    var end = new Date(interest[4]);
                    var duration = end.getTime() - start.getTime();
                    var sinceLast = new Date().getTime() - end.getTime();
                    // console.log("interest");
                    // console.log("start: "+(start.getTime()));
                    // console.log("end: "+ end.getTime());
                    console.log('interest duration: ' + duration);
                    console.log('interest sinceLast: ' + sinceLast);
                    // if last reading of item was less than 20 seconds ago
                    if (sinceLast < 59000) {
                        _this.interestDatabaseService.updateInterest(interest[0], interest[1], interest[2], interest[3], new Date(), interest[5], interest[6], interest[7]);
                        console.log("interest 'end' updated");
                    }
                    else {
                        if (duration > 60000) {
                            console.log("Sending interesta : " + interest);
                            console.log("Actual implementation pending..");
                            Toast.makeText("Interest stored.").show();
                        }
                        // delete record
                        console.log("Deleting interest due to less than 20 seconds: " + interest[0]);
                        _this.interestDatabaseService.deleteInterest(interest[0]);
                    }
                }
                else {
                    console.log("Creating new interest");
                    var interestObj = new interest_1.Interest(_this._customer_id, item.identificator);
                    interestObj.keywords = item.keywords;
                    _this.interestDatabaseService.insertInterest(interestObj);
                    Toast.makeText("Recording interest.").show();
                }
            });
        }
        else {
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
                    console.log("Interest: " + interest.beacon + ", sinceLast: " + sinceLast + ", duration: " + duration);
                    if (sinceLast > 60000) {
                        // if duration  > 1 minute then send interest
                        if (duration > 60000) {
                            console.log("Sending interest b: " + interest.beacon);
                            console.log("Actual implementation pending..");
                            Toast.makeText("Interest stored.").show();
                        }
                        console.log("Deleting interest due to more than 1 minute away: " + interest.id);
                        _this.interestDatabaseService.deleteInterest(interest.id);
                    }
                });
            }
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
                        _this.location_id = store.location_id;
                        console.log("Active contract.");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYWluLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUEwRDtBQUMxRCxvQ0FBc0M7QUFDdEMsaURBQWdEO0FBQ2hELDBDQUFpRDtBQUNqRCxzREFBK0Q7QUFDL0QsMENBQTZEO0FBTTdELDRFQUE0RTtBQUM1RSx1RkFBdUY7QUFDdkYsa0VBQWdFO0FBQ2hFLHdFQUEyRTtBQUMzRSwyRUFBeUU7QUFDekUsaUZBQW9GO0FBQ3BGLHFFQUFtRTtBQUNuRSwyRUFBOEU7QUFDOUUsMkVBQXlFO0FBSXpFLHFDQUFxQztBQUNyQyxxREFBb0Q7QUFDcEQsa0RBQWlEO0FBQ2pELDJEQUEwRDtBQUUxRCwwQ0FBNEM7QUFFNUMsK0NBQStDO0FBQy9DLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBRWxELG1CQUFtQjtBQUNuQixJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUNwRCxzREFBd0Q7QUFZeEQ7SUFvQ0U7UUFDRSw0Q0FBNEM7UUFDNUMsNERBQTREO1FBQ3BELGFBQTRCLEVBQzVCLHFCQUE0QyxFQUM1QyxZQUEwQixFQUMxQixvQkFBMEMsRUFDMUMsZUFBZ0MsRUFDaEMsdUJBQWdELEVBQ2hELGVBQWdDLEVBQ2hDLEtBQXFCLEVBQ3JCLE1BQXdCLEVBQ3hCLGNBQThCLEVBQzlCLElBQVksRUFDWixJQUFVO1FBWFYsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtRQUM1QyxpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQix5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO1FBQzFDLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUNoQyw0QkFBdUIsR0FBdkIsdUJBQXVCLENBQXlCO1FBQ2hELG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUNoQyxV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RCxLQUFJLENBQUMscUJBQXFCLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRWxELENBQUMsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBQ2pDLEtBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUN0RCxDQUFDLEVBQUMsVUFBQSxLQUFLO1lBQ0wsS0FBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7WUFDcEIsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2YsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBL3pCVSxhQUFhO1FBVHpCLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsTUFBTTtZQUNoQixTQUFTLEVBQUUsQ0FBQyw4QkFBYSxFQUFFLHlDQUFxQixFQUFFLDRCQUFZLEVBQUUsdUNBQW9CLEVBQUUsa0NBQWUsRUFBRSw2Q0FBdUIsRUFBRSxrQ0FBZSxDQUFDO1lBQ2hKLDJFQUEyRTtZQUMzRSxpREFBaUQ7WUFDakQsV0FBVyxFQUFFLHNCQUFzQjtZQUNuQyxTQUFTLEVBQUMsQ0FBQyw0QkFBNEIsQ0FBQztTQUMzQyxDQUFDO3lDQXlDeUIsOEJBQWE7WUFDTCx5Q0FBcUI7WUFDOUIsNEJBQVk7WUFDSix1Q0FBb0I7WUFDekIsa0NBQWU7WUFDUCw2Q0FBdUI7WUFDL0Isa0NBQWU7WUFDekIsdUJBQWM7WUFDYix5QkFBZ0I7WUFDUixpQkFBYztZQUN4QixhQUFNO1lBQ04sV0FBSTtPQWxEVCxhQUFhLENBZzBCekI7SUFBRCxvQkFBQztDQUFBLEFBaDBCRCxJQWcwQkM7QUFoMEJZLHNDQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIE5nWm9uZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgKiBhcyBkaWFsb2dzIGZyb20gXCJ1aS9kaWFsb2dzXCI7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvdWkvcGFnZVwiO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUgfSBmcm9tIFwiQGFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQgeyBSb3V0ZXJFeHRlbnNpb25zIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgTG9jYXRpb24gYXMgTG9jYXRpb25Db21tb24gfSBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uXCI7XG5cbmltcG9ydCB7IFVzZXIgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3VzZXIvdXNlclwiO1xuaW1wb3J0IHsgTG9jYXRpb24gfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2xvY2F0aW9uL2xvY2F0aW9uXCI7XG5pbXBvcnQgeyBDb250cmFjdCB9IGZyb20gXCIuLi8uLi9zaGFyZWQvY29udHJhY3QvY29udHJhY3RcIjtcblxuLy8gaW1wb3J0IHsgTG9jYXRpb25TZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9sb2NhdGlvbi9sb2NhdGlvbi5zZXJ2aWNlXCI7XG4vLyBpbXBvcnQgeyBMb2NhdGlvbkRhdGFiYXNlU2VydmljZSB9IGZyb20gJy4uLy4uL3NoYXJlZC9sb2NhdGlvbi9sb2NhdGlvbi5kYi5zZXJ2aWNlJztcbmltcG9ydCB7IFZpc2l0U2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvdmlzaXQvdmlzaXQuc2VydmljZVwiO1xuaW1wb3J0IHsgVmlzaXREYXRhYmFzZVNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3Zpc2l0L3Zpc2l0LmRiLnNlcnZpY2VcIjtcbmltcG9ydCB7IEludGVyZXN0U2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvaW50ZXJlc3QvaW50ZXJlc3Quc2VydmljZVwiO1xuaW1wb3J0IHsgSW50ZXJlc3REYXRhYmFzZVNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2ludGVyZXN0L2ludGVyZXN0LmRiLnNlcnZpY2VcIjtcbmltcG9ydCB7IEJlYWNvblNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2JlYWNvbi9iZWFjb24uc2VydmljZVwiO1xuaW1wb3J0IHsgQmVhY29uRGF0YWJhc2VTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9iZWFjb24vYmVhY29uLmRiLnNlcnZpY2VcIjtcbmltcG9ydCB7IENvbnRyYWN0U2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvY29udHJhY3QvY29udHJhY3Quc2VydmljZVwiO1xuXG5pbXBvcnQgKiBhcyBhcHBsaWNhdGlvbiBmcm9tICdhcHBsaWNhdGlvbic7XG5pbXBvcnQgeyBBbmRyb2lkQXBwbGljYXRpb24sIEFuZHJvaWRBY3Rpdml0eUJhY2tQcmVzc2VkRXZlbnREYXRhIH0gZnJvbSBcImFwcGxpY2F0aW9uXCI7XG5pbXBvcnQgeyBpc0FuZHJvaWQgfSBmcm9tIFwicGxhdGZvcm1cIjtcbmltcG9ydCB7IEJlYWNvbiB9IGZyb20gXCIuLi8uLi9zaGFyZWQvYmVhY29uL2JlYWNvblwiO1xuaW1wb3J0IHsgVmlzaXQgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3Zpc2l0L3Zpc2l0XCI7XG5pbXBvcnQgeyBJbnRlcmVzdCB9IGZyb20gXCIuLi8uLi9zaGFyZWQvaW50ZXJlc3QvaW50ZXJlc3RcIjtcblxuaW1wb3J0ICogYXMgVG9hc3QgZnJvbSAnbmF0aXZlc2NyaXB0LXRvYXN0JztcblxuLy8gaW1wb3J0IHsgc3RvcmFnZSB9IGZyb20gXCIuLi8uLi91dGlscy9sb2NhbFwiO1xudmFyIGFwcFNldHRpbmdzID0gcmVxdWlyZShcImFwcGxpY2F0aW9uLXNldHRpbmdzXCIpO1xuXG4vLyBlc3RpbW90ZSBiZWFjb25zXG52YXIgRXN0aW1vdGUgPSByZXF1aXJlKFwibmF0aXZlc2NyaXB0LWVzdGltb3RlLXNka1wiKTtcbmltcG9ydCAqIGFzIFBlcm1pc3Npb25zIGZyb20gXCJuYXRpdmVzY3JpcHQtcGVybWlzc2lvbnNcIjtcbmRlY2xhcmUgdmFyIGFuZHJvaWQ6IGFueTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwibWFpblwiLFxuICAgIHByb3ZpZGVyczogW0JlYWNvblNlcnZpY2UsIEJlYWNvbkRhdGFiYXNlU2VydmljZSwgVmlzaXRTZXJ2aWNlLCBWaXNpdERhdGFiYXNlU2VydmljZSwgSW50ZXJlc3RTZXJ2aWNlLCBJbnRlcmVzdERhdGFiYXNlU2VydmljZSwgQ29udHJhY3RTZXJ2aWNlXSxcbiAgICAvLyBwcm92aWRlcnM6IFtMb2NhdGlvblNlcnZpY2UsIExvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlLCBDb250cmFjdFNlcnZpY2VdLCBcbiAgICAvLyBwcm92aWRlcnM6IFtMb2NhdGlvblNlcnZpY2UsIENvbnRyYWN0U2VydmljZV0sXG4gICAgdGVtcGxhdGVVcmw6IFwicGFnZXMvbWFpbi9tYWluLmh0bWxcIixcbiAgICBzdHlsZVVybHM6W1wicGFnZXMvbWFpbi9tYWluLWNvbW1vbi5jc3NcIl0gXG59KVxuXG5leHBvcnQgY2xhc3MgTWFpbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdHtcblxuICAvLyBwcml2YXRlIHZhcmlhYmxlc1xuICBwcml2YXRlIF9jdXJyZW50X2xvY2F0aW9uOiBMb2NhdGlvbjtcbiAgcHJpdmF0ZSBsb2NhdGlvbl9pZDogc3RyaW5nO1xuICAvLyBwcml2YXRlIF9hbGxfbG9jYXRpb25zOiBBcnJheTxMb2NhdGlvbj47XG4gIHByaXZhdGUgX25hbWUgPSBcImNhcmxvc1wiO1xuICBwcml2YXRlIF9jb250cmFjdDogQ29udHJhY3Q7XG4gIC8vIHByaXZhdGUgX2xvY2F0aW9uX2RhdGFiYXNlOiBhbnk7XG4gIHByaXZhdGUgX2xvY2F0aW9uc19pbl9kYjogQXJyYXk8TG9jYXRpb24+O1xuICAvLyBwcml2YXRlIF9sb2NhdGlvbl9pZDogbnVtYmVyO1xuICBwcml2YXRlIF93YXRjaF9sb2NhdGlvbl9pZDogYW55O1xuICBwcml2YXRlIF9jdXN0b21lcl9pZDogbnVtYmVyO1xuXG4gIC8vIHB1YmxpYyB2YXJpYWJsZXNcbiAgcHVibGljIHRpdGxlOiBzdHJpbmc7XG5cbiAgLy8gYnV0dG9uIGZsYWdzXG4gIC8vIHB1YmxpYyBpbkxvY2F0aW9uID0gZmFsc2U7XG4gIHB1YmxpYyBpc0N1cnJlbnRMb2NhdGlvbiA9IGZhbHNlO1xuICBwdWJsaWMgaXNBbGxMb2NhdGlvbnMgPSBmYWxzZTtcbiAgcHVibGljIGlzQnVzeSA9IGZhbHNlO1xuICBwdWJsaWMgY2FuQ29udHJhY3QgPSBmYWxzZTtcbiAgcHVibGljIGhhc0NvbnRyYWN0ID0gZmFsc2U7XG5cbiAgLy8gQmVhY29uIHZhcmlhYmxlXG4gIHB1YmxpYyBlc3RpbW90ZTogYW55O1xuICBwdWJsaWMgb3B0aW9uczogYW55O1xuICBwdWJsaWMgY3VycmVudEJlYWNvbnM6IEFycmF5PEJlYWNvbj47XG4gIHB1YmxpYyBwZXJtaXNzaW9uczogYW55O1xuXG4gIC8vIEljb25zXG4gIHB1YmxpYyBnZWFyc0ljb24gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4ZjA4NSk7XG4gIHB1YmxpYyBsb2dvdXRJY29uID0gU3RyaW5nLmZyb21DaGFyQ29kZSgweGYwOGIpO1xuICBwdWJsaWMgaGFuZHNoYWtlSWNvbiA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMHhmMmI1KTtcbiAgXG4gIGNvbnN0cnVjdG9yKFxuICAgIC8vIHByaXZhdGUgbG9jYXRpb25TZXJ2aWNlOiBMb2NhdGlvblNlcnZpY2UsXG4gICAgLy8gcHJpdmF0ZSBsb2NhdGlvbkRhdGFiYXNlU2VydmljZTogTG9jYXRpb25EYXRhYmFzZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBiZWFjb25TZXJ2aWNlOiBCZWFjb25TZXJ2aWNlLFxuICAgIHByaXZhdGUgYmVhY29uRGF0YWJhc2VTZXJ2aWNlOiBCZWFjb25EYXRhYmFzZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSB2aXNpdFNlcnZpY2U6IFZpc2l0U2VydmljZSxcbiAgICBwcml2YXRlIHZpc2l0RGF0YWJhc2VTZXJ2aWNlOiBWaXNpdERhdGFiYXNlU2VydmljZSxcbiAgICBwcml2YXRlIGludGVyZXN0U2VydmljZTogSW50ZXJlc3RTZXJ2aWNlLFxuICAgIHByaXZhdGUgaW50ZXJlc3REYXRhYmFzZVNlcnZpY2U6IEludGVyZXN0RGF0YWJhc2VTZXJ2aWNlLFxuICAgIHByaXZhdGUgY29udHJhY3RTZXJ2aWNlOiBDb250cmFjdFNlcnZpY2UsXG4gICAgcHJpdmF0ZSByb3V0ZTogQWN0aXZhdGVkUm91dGUsXG4gICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlckV4dGVuc2lvbnMsXG4gICAgcHJpdmF0ZSBsb2NhdGlvbkNvbW1vbjogTG9jYXRpb25Db21tb24sXG4gICAgcHJpdmF0ZSB6b25lOiBOZ1pvbmUsXG4gICAgcHJpdmF0ZSBwYWdlOiBQYWdlXG4gICl7XG4gICAgICBjb25zb2xlLmxvZyhcIk1haW4gQ29uc3RydWN0b3JcIik7XG4gICAgICAvLyB0aGlzLmlzQnVzeSA9IHRydWU7XG4gICAgICB0aGlzLl9jdXJyZW50X2xvY2F0aW9uID0gbnVsbDtcbiAgICAgIC8vIHRoaXMuX2FsbF9sb2NhdGlvbnMgPSBbXTtcbiAgICAgIHRoaXMuX2xvY2F0aW9uc19pbl9kYiA9IFtdO1xuICAgICAgLy8gdGhpcy5fbG9jYXRpb25fZGF0YWJhc2UgPSB0aGlzLmxvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlLmdldERhdGFiYXNlKCk7XG5cbiAgICAgIC8vIEJlYWNvbnMgaW5zdGFuY2UgXG4gICAgICAvLyB0aGlzLmVzdGltb3RlID0gbmV3IEVzdGltb3RlKG9wdGlvbnMpO1xuICAgICAgdGhpcy5jdXJyZW50QmVhY29ucyA9IFtdO1xuICAgICAgLy8gdGhpcy5wZXJtaXNzaW9ucyA9IG5ldyBQZXJtaXNzaW9ucygpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgY29uc29sZS5sb2coXCJNYWluIG9uIEluaXRcIik7XG5cbiAgICAvLyBSZXR1cm4gdG8gbG9naW4gaWYgYXBwIHNldHRpbmdzIGFyZSBub3Qgc2V0XG4gICAgaWYgKCFhcHBTZXR0aW5ncy5oYXNLZXkoXCJ1c2VyX25hbWVcIikgfHwgIWFwcFNldHRpbmdzLmhhc0tleShcInVzZXJfcGFzc3dvcmRcIikpe1xuICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL1wiXSksIHsgY2xlYXJIaXN0b3J5OiB0cnVlIH07XG4gICAgfVxuXG4gICAgLy8gaWYgKGlzQW5kcm9pZCkge1xuICAgIC8vICAgYXBwbGljYXRpb24uYW5kcm9pZC5vbihBbmRyb2lkQXBwbGljYXRpb24uYWN0aXZpdHlCYWNrUHJlc3NlZEV2ZW50LCAoZGF0YTogQW5kcm9pZEFjdGl2aXR5QmFja1ByZXNzZWRFdmVudERhdGEpID0+IHtcbiAgICAvLyAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL1wiXSksIHsgY2xlYXJIaXN0b3J5OiB0cnVlIH07XG4gICAgLy8gICAgIC8vIHRoaXMubG9nb3V0KCk7XG4gICAgLy8gICB9KTtcbiAgICAvLyB9XG5cbiAgICB0aGlzLnRpdGxlID0gXCJXZWxjb21lIFwiKyBhcHBTZXR0aW5ncy5nZXRTdHJpbmcoXCJ1c2VyX25hbWVcIik7ICAgIFxuXG4gICAgdHJ5e1xuICAgICAgdGhpcy5fY3VzdG9tZXJfaWQgPSBhcHBTZXR0aW5ncy5nZXROdW1iZXIoXCJ1c2VyX2lkXCIpO1xuICAgICAgY29uc29sZS5sb2coXCJ0cnlpbmcgY3VzdDogXCIrdGhpcy5fY3VzdG9tZXJfaWQpO1xuICAgIH1jYXRjaChlKXtcbiAgICAgIHRoaXMuX2N1c3RvbWVyX2lkID0gMDtcbiAgICB9ICAgICAgXG4gICAgICBcblxuICAgIC8vIEJlYWNvbnMgcHJvY2Vzc1xuICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgIHJlZ2lvbiA6ICdQcm9ncmVzcycsIC8vIG9wdGlvbmFsXG4gICAgICBjYWxsYmFjayA6IGJlYWNvbnMgPT4ge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkJlYWNvbnM6IFwiK2JlYWNvbnMpXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQW1vdW50IG9mIEJlYWNvbnMgaW4gcmFuZ2U6IFwiK2JlYWNvbnMubGVuZ3RoKVxuICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkFtb3VudCBvZiBCZWFjb25zIGluIHJhbmdlOiBcIitiZWFjb25zLmxlbmd0aCk7XG4gICAgICAgICAgaWYoYmVhY29ucy5sZW5ndGg+MCl7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRCZWFjb25zID0gW107XG4gICAgICAgICAgICBiZWFjb25zLmZvckVhY2goYmVhY29uID0+IHtcbiAgICAgICAgICAgICAgaWYoYmVhY29uLm1ham9yKXtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBsZXQgYiA9bmV3IEJlYWNvbihiZWFjb24ubWFqb3IudG9TdHJpbmcoKSxiZWFjb24ubWlub3IudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJCZWFjb24gaWRlbnRpZmljYXRvciBcIitiLmlkZW50aWZpY2F0b3IpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEJlYWNvbnMucHVzaChiKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRCZWFjb25zID0gW107XG4gICAgICAgICAgfVxuXG5cbiAgICAgICAgICAvLyBDaGVjayBmb3IgYWN0aXZlIGNvbnRyYWN0c1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiKysrKysrKysrKysrKysrKysrKysrKysrK1wiKTtcbiAgICAgICAgICB0aGlzLnZlcmlmeUNvbnRyYWN0KCk7XG5cblxuICAgICAgICAgIC8vIENoZWNrIGlmIHVzZXIgaXMgaW4gc3RvcmUgb3IganVzdCBwYXNzaW5nIGJ5XG4gICAgICAgICAgY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKioqKioqKioqKioqXCIpO1xuICAgICAgICAgIHRoaXMudmVyaWZ5VmlzaXQoKTtcbiAgICAgICAgICBcblxuXG4gICAgICAgICAgXG5cbiAgICAgICAgICAvLyBDaGVjayBpZiBiZWhhdmlvdXIgdHJhY2tpbmcgaXMgZW5hYmxlZCBhbmQgdHJhY2tcbiAgICAgICAgICBpZiggdHlwZW9mIHRoaXMuX2NvbnRyYWN0ICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiB0aGlzLl9jb250cmFjdC5vcHRpb25zWydiZWhhdmlvdXJfdHJhY2tpbmcnXSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0aGlzLl9jb250cmFjdC5vcHRpb25zWydiZWhhdmlvdXJfdHJhY2tpbmcnXSl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgICAgICB0aGlzLnZlcmlmeUJlaGF2aW9yKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIFxuICAgICAgfVxuICAgIH1cbiAgICBcblxuICAgIHRoaXMuZXN0aW1vdGUgPSBuZXcgRXN0aW1vdGUodGhpcy5vcHRpb25zKTtcblxuICAgIGlmKGlzQW5kcm9pZCl7XG4gICAgICBjb25zb2xlLmxvZyhcIkl0IGlzIEFuZHJvaWRcIik7XG4gICAgICBQZXJtaXNzaW9ucy5yZXF1ZXN0UGVybWlzc2lvbnMoW1xuICAgICAgICBhbmRyb2lkLk1hbmlmZXN0LnBlcm1pc3Npb24uQUNDRVNTX0NPQVJTRV9MT0NBVElPTixcbiAgICAgICAgYW5kcm9pZC5NYW5pZmVzdC5wZXJtaXNzaW9uLkFDQ0VTU19GSU5FX0xPQ0FUSU9OLFxuICAgICAgICBhbmRyb2lkLk1hbmlmZXN0LnBlcm1pc3Npb24uQkxVRVRPT1RILFxuICAgICAgICBhbmRyb2lkLk1hbmlmZXN0LnBlcm1pc3Npb24uQkxVRVRPT1RIX0FETUlOXSwgXCJQZXJtaXNzaW9ucyBvZiBTdXJ0cmFkZVwiKVxuICAgICAgLnRoZW4oKCk9PntcbiAgICAgICAgY29uc29sZS5sb2coXCJQZXJtaXNzaW9ucyBncmFudGVkXCIpO1xuICAgICAgICB0aGlzLmVzdGltb3RlLnN0YXJ0UmFuZ2luZygpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlN0YXJ0IHJhbmdpbmdcIik7XG4gICAgICB9KS5jYXRjaCgoZXJyb3IpPT57XG4gICAgICAgIGFsZXJ0KFwiRXJyb3IgZ2V0dGluZyBwZXJtaXNzaW9uczogXCIrZXJyb3IubWVzc2FnZSk7XG4gICAgICB9KTtcbiAgICB9ZWxzZXtcbiAgICAgIGNvbnNvbGUubG9nKFwiSXQgaXMgaU9TXCIpO1xuICAgICAgdGhpcy5lc3RpbW90ZS5zdGFydFJhbmdpbmcoKTtcbiAgICAgIGNvbnNvbGUubG9nKFwiU3RhcnQgcmFuZ2luZ1wiKTtcbiAgICB9XG5cbiAgICAvLyBMb2NhdGlvbiByZWZhY3RvclxuICAgIC8vIENyZWF0ZXMgREIgaWYgbm90IGV4aXN0XG4gICAgLy8gdGhpcy5sb2NhdGlvbkRhdGFiYXNlU2VydmljZS5jcmVhdGVUYWJsZSgpO1xuXG4gICAgLy9VcGRhdGVzIHRoZSBsb2NhdGlvbnMgREIsIHRoaXMgc2hvdWxkIG5vdCBiZSBkb25lIGV2ZXJ5IHRpbWUsIGJ1dCByYXRoZXIgb25jZSBldmVyeSBkYXlcbiAgICAvLyBpZih0aGlzLmlzTG9jYXRpb25EYXRhYmFzZUVtcHR5KCkpe1xuICAgIC8vICAgdGhpcy51cGRhdGVMb2NhdGlvbkRhdGFiYXNlKCk7XG4gICAgLy8gfVxuXG4gICAgLy8gRXh0cmFjdHMgbG9jYXRpb25zIGZyb20gREJcbiAgICAvLyB0aGlzLl9sb2NhdGlvbnNfaW5fZGIgPSB0aGlzLmxvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlLnNlbGVjdEFsbExvY2F0aW9ucygpO1xuICAgIC8vIC8vIFN0YXJ0IHdhdGNoaW5nIGZvciBsb2NhdGlvblxuICAgIC8vIC8vIHRoaXMuX3dhdGNoX2xvY2F0aW9uX2lkID0gdGhpcy5sb2NhdGlvblNlcnZpY2Uuc3RhcnRXYXRjaGluZ0xvY2F0aW9uKCk7XG5cblxuICAgIC8vIENyZWF0ZXMgREIgaWYgbm90IGV4aXN0XG4gICAgLy8gdGhpcy5iZWFjb25EYXRhYmFzZVNlcnZpY2UuZHJvcFRhYmxlKCk7XG4gICAgdGhpcy5iZWFjb25EYXRhYmFzZVNlcnZpY2UuY3JlYXRlVGFibGUoKTtcbiAgICB0aGlzLnZpc2l0RGF0YWJhc2VTZXJ2aWNlLmNyZWF0ZVRhYmxlKCk7XG4gICAgdGhpcy5pbnRlcmVzdERhdGFiYXNlU2VydmljZS5jcmVhdGVUYWJsZSgpO1xuXG4gICAgLy9VcGRhdGVzIHRoZSBEQiwgdGhpcyBzaG91bGQgbm90IGJlIGRvbmUgZXZlcnkgdGltZSwgYnV0IHJhdGhlciBvbmNlIGV2ZXJ5IGRheVxuICAgIGlmKHRoaXMuaXNCZWFjb25EYXRhYmFzZUVtcHR5KCkpe1xuICAgICAgY29uc29sZS5sb2coXCJMb2NhbCBEQiBpcyBlbXB0eS5cIik7XG4gICAgICB0aGlzLnVwZGF0ZUJlYWNvbkRhdGFiYXNlKCk7XG4gICAgfWVsc2V7XG4gICAgICAvLyBEZWxldGU6IG5leHQgbGluZSBzaG91bGQgYmUgdXNlZCBvbmx5IHBlcmlvZGljYWxseS5cbiAgICAgIC8vIHRoaXMudXBkYXRlQmVhY29uRGF0YWJhc2UoKTtcbiAgICAgIGNvbnNvbGUubG9nKFwiTG9jYWwgREIgaGFzIGRhdGEuXCIpO1xuICAgIH1cblxuICAgIHRoaXMucGFnZS5vbignbmF2aWdhdGluZ0Zyb20nLCAoZGF0YSkgPT4ge1xuICAgICAgLy8gcnVuIGRlc3Ryb3kgY29kZVxuICAgICAgLy8gKG5vdGU6IHRoaXMgd2lsbCBydW4gd2hlbiB5b3UgZWl0aGVyIG1vdmUgZm9yd2FyZCB0byBhIG5ldyBwYWdlIG9yIGJhY2sgdG8gdGhlIHByZXZpb3VzIHBhZ2UpXG4gICAgICAvLyBCZWFjb25zIHN0b3BcbiAgICAgIHRoaXMuZXN0aW1vdGUuc3RvcFJhbmdpbmcoKTtcbiAgICAgIGNvbnNvbGUubG9nKFwiU3RvcCByYW5naW5nXCIpO1xuICAgIH0pO1xuXG4gIH1cblxuICBwdWJsaWMgbmdPbkRlc3Ryb3koKSB7XG4gICAgLy9DYWxsZWQgb25jZSwgYmVmb3JlIHRoZSBpbnN0YW5jZSBpcyBkZXN0cm95ZWQuXG4gICAgLy8gTG9jYXRpb24gcmVmYWN0b3JcbiAgICAvLyB0aGlzLmxvY2F0aW9uU2VydmljZS5zdG9wV2F0Y2hpbmdMb2NhdGlvbih0aGlzLl93YXRjaF9sb2NhdGlvbl9pZClcblxuICAgIC8vIC8vIEJlYWNvbnMgc3RvcFxuICAgIC8vIHRoaXMuZXN0aW1vdGUuc3RvcFJhbmdpbmcoKTtcbiAgICAvLyBjb25zb2xlLmxvZyhcIlN0b3AgcmFuZ2luZ1wiKTtcblxuICAgIC8vIHRoaXMudmVyaWZ5VmlzaXQoKTtcbiAgICAvLyB0aGlzLnZlcmlmeUJlaGF2aW9yKCk7XG4gICAgXG4gIH1cblxuICBwdWJsaWMgY29udHJhY3RTZXR0aW5ncygpe1xuICAgIC8vIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9jb250cmFjdGNyZWF0ZS9cIit0aGlzLl9jdXJyZW50X2xvY2F0aW9uLmlkK1wiLzFcIl0sIHtcbiAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvY29udHJhY3RjcmVhdGVcIix0aGlzLmxvY2F0aW9uX2lkLDFdLCB7XG4gICAgICAvLyBhbmltYXRpb246IHRydWUsXG4gICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgbmFtZTogXCJzbGlkZUxlZnRcIixcbiAgICAgICAgICBkdXJhdGlvbjogMjAwLFxuICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgY3JlYXRlQ29udHJhY3QoKXtcblxuICAgIGxldCBzdG9yZXMgPSB0aGlzLm5lYXJieVN0b3JlcygpO1xuICAgIGxldCBzdG9yZV9uYW1lcyA9IFtdO1xuICAgIC8vIGxldCBsb2NhdGlvbl9pZHMgPSBbXTtcblxuICAgIHN0b3Jlcy5mb3JFYWNoKHN0b3JlID0+IHsgXG4gICAgICBzdG9yZV9uYW1lcy5wdXNoKHN0b3JlLm5hbWUpO1xuICAgICAgLy8gbG9jYXRpb25faWRzLnB1c2goc3RvcmUubG9jYXRpb25faWQpO1xuICAgICB9KTtcblxuICAgIGRpYWxvZ3MuYWN0aW9uKHtcbiAgICAgIG1lc3NhZ2U6IFwiU2VsZWN0IFN0b3JlXCIsXG4gICAgICBjYW5jZWxCdXR0b25UZXh0OiBcIkNhbmNlbFwiLFxuICAgICAgYWN0aW9uczogc3RvcmVfbmFtZXNcbiAgICB9KS50aGVuKG5hbWUgPT4ge1xuICAgICAgc3RvcmVzLmZvckVhY2goc3RvcmUgPT4geyBcbiAgICAgICAgaWYoc3RvcmUubmFtZSA9PSBuYW1lKXtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkdvaW5nIHRvIGNyZWF0ZSBjb250cmFjdC5cIik7XG4gICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL2NvbnRyYWN0Y3JlYXRlXCIsc3RvcmUubG9jYXRpb25faWQsMF0sIHtcbiAgICAgICAgICAgIC8vIGFuaW1hdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlTGVmdFwiLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAyMDAsXG4gICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgIH0pO1xuICAgIH0pO1xuICAgIFxuICB9XG5cbiAgcHVibGljIGxvZ291dCgpe1xuICAgIGFwcFNldHRpbmdzLnJlbW92ZShcInVzZXJfbmFtZVwiKTtcbiAgICBhcHBTZXR0aW5ncy5yZW1vdmUoXCJ1c2VyX3Bhc3N3b3JkXCIpO1xuXG4gICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL1wiXSwgeyBjbGVhckhpc3Rvcnk6IHRydWUgfSk7XG4gIH1cblxuICAvLyBMb2NhdGlvbiByZWZhY3RvclxuICAvLyB2ZXJpZnlDb250cmFjdCgpe1xuICAvLyAgIHRoaXMuaXNCdXN5ID0gdHJ1ZTtcbiAgLy8gICB0aGlzLmxvY2F0aW9uU2VydmljZS5nZXRDdXJyZW50TG9jYXRpb24oKVxuICAvLyAgICAgLnRoZW4oKGxvY2F0aW9uOiBMb2NhdGlvbikgPT4ge1xuICAvLyAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAvLyAgICAgICBpZihsb2NhdGlvbiAhPSB1bmRlZmluZWQpe1xuICAvLyAgICAgICAgIHRoaXMuX2N1cnJlbnRfbG9jYXRpb24gPSBsb2NhdGlvbjtcbiAgLy8gICAgICAgICB0aGlzLmlzQ3VycmVudExvY2F0aW9uID0gdHJ1ZTtcblxuICAvLyAgICAgICAgIGNvbnNvbGUubG9nKFwiZ290dGVuIGxvY2F0aW9uLCBsYXQ6IFwiK2xvY2F0aW9uLmxhdCtcIiwgbG5nOiBcIitsb2NhdGlvbi5sbmcpO1xuICAgICAgICBcbiAgLy8gICAgICAgICB0aGlzLl9sb2NhdGlvbnNfaW5fZGIuZm9yRWFjaChsb2NhdGlvbiA9PntcbiAgICAgICAgXG4gIC8vICAgICAgICAgICBpZiAoKGxvY2F0aW9uLm5lX2xhdCA+PSB0aGlzLl9jdXJyZW50X2xvY2F0aW9uLmxhdCAmJiBsb2NhdGlvbi5uZV9sbmcgPj0gdGhpcy5fY3VycmVudF9sb2NhdGlvbi5sbmcpIFxuICAvLyAgICAgICAgICAgICAmJiAobG9jYXRpb24uc3dfbGF0IDw9IHRoaXMuX2N1cnJlbnRfbG9jYXRpb24ubGF0ICYmIGxvY2F0aW9uLnN3X2xuZyA8PSB0aGlzLl9jdXJyZW50X2xvY2F0aW9uLmxuZykgKXtcbiAgLy8gICAgICAgICAgICAgICB0aGlzLmNhbkNvbnRyYWN0ID0gdHJ1ZTtcbiAgLy8gICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImluIGxvY2F0aW9uOiBcIisgbG9jYXRpb24ubmFtZSk7XG4gIC8vICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudF9sb2NhdGlvbiA9IGxvY2F0aW9uO1xuXG4gIC8vICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb29raW5nIGZvciBhIGNvbnRyYWN0IGJldHdlZW4gbG9jYXRpb246IFwiKyB0aGlzLl9jdXJyZW50X2xvY2F0aW9uLmlkK1wiIGFuZCBjdXN0b21lciBcIiArdGhpcy5fY3VzdG9tZXJfaWQpO1xuICAvLyAgICAgICAgICAgICAgIHRoaXMuY29udHJhY3RTZXJ2aWNlLmdldEFjdGl2ZUNvbnRyYWN0KHRoaXMuX2N1cnJlbnRfbG9jYXRpb24uaWQsIHRoaXMuX2N1c3RvbWVyX2lkKVxuICAvLyAgICAgICAgICAgICAgICAgLnN1YnNjcmliZShyZXNwb25zZUNvbnRyYWN0ID0+IHtcbiAgLy8gICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ5b3UgaGF2ZSBhIGNvbnRyYWN0IC0tMi4xLCBzdGF0dXM6IFwiK3Jlc3BvbnNlQ29udHJhY3Quc3RhdHVzKTtcbiAgLy8gICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ5b3UgaGF2ZSBhIGNvbnRyYWN0IC0tMi4xLCBtZXNzYWdlOiBcIityZXNwb25zZUNvbnRyYWN0Lm1lc3NhZ2UpO1xuICAvLyAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3BvbnNlQ29udHJhY3QubWVzc2FnZSl7XG4gIC8vICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ5b3UgaGF2ZSBhIGNvbnRyYWN0OiBcIityZXNwb25zZUNvbnRyYWN0LnN0YXR1cyk7XG4gIC8vICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29udHJhY3QgPSByZXNwb25zZUNvbnRyYWN0O1xuICAvLyAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FuQ29udHJhY3QgPSBmYWxzZTtcbiAgLy8gICAgICAgICAgICAgICAgICAgICB0aGlzLmhhc0NvbnRyYWN0ID0gdHJ1ZTtcbiAgLy8gICAgICAgICAgICAgICAgICAgfVxuICAvLyAgICAgICAgICAgICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAvLyAgICAgICAgICAgICAgICAgfSxlcnJvciA9PiB7XG4gIC8vICAgICAgICAgICAgICAgICAgIGlmIChlcnJvci5zdGF0dXMgPT0gNDA0KXtcbiAgICAgICAgICAgICAgICAgICAgICBcbiAgLy8gICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbkNvbnRyYWN0ID0gdHJ1ZTtcbiAgLy8gICAgICAgICAgICAgICAgICAgICB0aGlzLmhhc0NvbnRyYWN0ID0gZmFsc2U7XG4gIC8vICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAvLyAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgZ2V0dGluZyBhY3RpdmUgY29udHJhY3QgaW5mb3JtYXRpb246IFwiK2Vycm9yKTtcbiAgLy8gICAgICAgICAgICAgICAgICAgfVxuICAvLyAgICAgICAgICAgICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBcbiAgLy8gICAgICAgICAgICAgICAgIH0pO1xuICAvLyAgICAgICAgICAgICB9XG4gIC8vICAgICAgICAgfSk7XG4gIC8vICAgICAgIH1cbiAgLy8gICAgICAgZWxzZXtcbiAgLy8gICAgICAgICB0aHJvdyBcIkxvY2F0aW9uIG5vdCBmb3VuZFwiO1xuICAvLyAgICAgICB9IFxuICAvLyAgICAgfVxuICAvLyAgICAgKS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgLy8gICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgLy8gICAgICAgYWxlcnQoZXJyb3IpXG4gIC8vICAgICB9KTtcbiAgLy8gfVxuXG4gIG5lYXJieVN0b3Jlcygpe1xuICAgIGNvbnNvbGUubG9nKFwiQ2hlY2tpbmcgbmVhcmJ5IHN0b3Jlcy4uXCIpO1xuICAgIGxldCBzdG9yZXM6IEFycmF5PEJlYWNvbj4gPSBbXTtcbiAgICAvLyB0aGlzLmJlYWNvbkRhdGFiYXNlU2VydmljZS5zZWxlY3RBbGxCZWFjb25zKFwid2hlcmUgcm9sZT1zdG9yZVwiKS5mb3JFYWNoKHN0b3JlREI9PntcbiAgICB0aGlzLmJlYWNvbkRhdGFiYXNlU2VydmljZS5zZWxlY3RCZWFjb25zKFwic3RvcmVcIikuZm9yRWFjaChzdG9yZURCPT57XG4gICAgICAvLyBjb25zb2xlLmxvZyhcInN0b3JlREIgaWRlbjogXCIrc3RvcmVEQi5pZGVudGlmaWNhdG9yKTtcbiAgICAgIHRoaXMuY3VycmVudEJlYWNvbnMuZm9yRWFjaChiZWFjb25DdXJyZW50PT57XG4gICAgICAgIGNvbnNvbGUubG9nKFwiYmVhY29uQ3VycmVudCBpZGVuOiBcIitiZWFjb25DdXJyZW50LmlkZW50aWZpY2F0b3IpO1xuICAgICAgICBpZihzdG9yZURCLmlkZW50aWZpY2F0b3I9PWJlYWNvbkN1cnJlbnQuaWRlbnRpZmljYXRvcil7XG4gICAgICAgICAgc3RvcmVzLnB1c2goc3RvcmVEQik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgICAgXG4gICAgcmV0dXJuIHN0b3JlcztcbiAgfVxuXG4gIG5lYXJieUl0ZW1zKCl7XG4gICAgbGV0IGl0ZW1zOiBBcnJheTxCZWFjb24+ID0gW107XG4gICAgdGhpcy5iZWFjb25EYXRhYmFzZVNlcnZpY2Uuc2VsZWN0QmVhY29ucyhcIml0ZW1cIiwgdGhpcy5sb2NhdGlvbl9pZCkuZm9yRWFjaChpdGVtREI9PntcbiAgICAgIHRoaXMuY3VycmVudEJlYWNvbnMuZm9yRWFjaChiZWFjb25DdXJyZW50PT57XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiYmVhY29uIGRiOiBcIitpdGVtREIuaWRlbnRpZmljYXRvcik7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiYmVhY29uIGN1cnJlbnQ6IFwiK2JlYWNvbkN1cnJlbnQuaWRlbnRpZmljYXRvcik7XG4gICAgICAgIGlmKGl0ZW1EQi5pZGVudGlmaWNhdG9yPT1iZWFjb25DdXJyZW50LmlkZW50aWZpY2F0b3Ipe1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiTmVhcmJ5IGl0ZW06IFwiK2l0ZW1EQi5uYW1lKTtcbiAgICAgICAgICBpdGVtcy5wdXNoKGl0ZW1EQik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgICAgXG4gICAgcmV0dXJuIGl0ZW1zO1xuICB9XG4gIGRhdGVGb3JtYXR0ZXIoZGF0ZTogRGF0ZSl7XG4gICAgcmV0dXJuIGRhdGUuZ2V0RnVsbFllYXIoKStcIi1cIitkYXRlLmdldE1vbnRoKCkrXCItXCIrZGF0ZS5nZXREYXRlKCkrXCIgXCIrZGF0ZS5nZXRIb3VycygpK1wiOlwiK2RhdGUuZ2V0TWludXRlcygpK1wiOlwiK2RhdGUuZ2V0U2Vjb25kcygpXG4gIH1cblxuICB2ZXJpZnlWaXNpdCgpe1xuICAgIGxldCBuZWFyYnlTdG9yZXMgPSB0aGlzLm5lYXJieVN0b3JlcygpO1xuICAgIGNvbnNvbGUubG9nKFwiTmVhcmJ5IHN0b3JlczogXCIrbmVhcmJ5U3RvcmVzLmxlbmd0aClcbiAgICBpZiAobmVhcmJ5U3RvcmVzLmxlbmd0aD4wKXtcbiAgICAgIG5lYXJieVN0b3Jlcy5mb3JFYWNoKHN0b3JlPT57XG4gICAgICAgIGNvbnNvbGUubG9nKFwiU3RvcmUgaWRlbnRpZmljYXRvcjogXCIrc3RvcmUuaWRlbnRpZmljYXRvcik7XG4gICAgICAgIGxldCB2aXNpdCAgPSB0aGlzLnZpc2l0RGF0YWJhc2VTZXJ2aWNlLnNlbGVjdFZpc2l0QnlCZWFjb24oc3RvcmUuaWRlbnRpZmljYXRvcik7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwidmlzaXQgaWQ6IFwiK3Zpc2l0KTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJ2aXNpdC5pZDogXCIrdmlzaXQuaWQpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInZpc2l0WzBdOiBcIit2aXNpdFswXSk7XG4gICAgICAgIC8vIFZlcmlmeSBpZiB2aXNpdCBpcyBiZWluZyBjcmVhdGVkXG4gICAgICAgIGlmICh2aXNpdCAhPSBudWxsKXtcbiAgICAgICAgICBsZXQgc3RhcnQgPSBuZXcgRGF0ZSh2aXNpdFszXSk7XG4gICAgICAgICAgbGV0IGVuZCA9IG5ldyBEYXRlKHZpc2l0WzRdKTtcbiAgICAgICAgICBsZXQgZHVyYXRpb24gPSBlbmQuZ2V0VGltZSgpIC0gc3RhcnQuZ2V0VGltZSgpO1xuICAgICAgICAgIGxldCBzaW5jZUxhc3QgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIGVuZC5nZXRUaW1lKCk7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ2aXNpdFwiKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcInN0YXJ0OiBcIisodmlzaXQuc3RhcnQpKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcInN0YXJ0OiBcIisoc3RhcnQuZ2V0VGltZSgpKSk7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJzdGFydDogXCIrKHN0YXJ0LnRvRGF0ZVN0cmluZygpKSk7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJzdGFydDogXCIrKHN0YXJ0LnRvU3RyaW5nKCkpKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcInN0YXJ0OiBcIisodGhpcy5kYXRlRm9ybWF0dGVyKHN0YXJ0KSkpO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZW5kOiBcIisgZW5kLmdldFRpbWUoKSk7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3Zpc2l0IGR1cmF0aW9uOiAnK2R1cmF0aW9uKTtcbiAgICAgICAgICBjb25zb2xlLmxvZygndmlzaXQgc2luY2VMYXN0OiAnK3NpbmNlTGFzdCk7XG5cbiAgICAgICAgICBjb25zb2xlLmxvZyhcIlZpc2l0IHBvc3QgdGVzdDogXCIrdmlzaXQpO1xuICAgICAgICAgIC8vIHRoaXMudmlzaXRTZXJ2aWNlLmNyZWF0ZVZpc2l0KHZpc2l0KS5zdWJzY3JpYmUocmVzcG9uc2UgPT4geyBcbiAgICAgICAgICAvLyAgIC8vIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgICAgLy8gICBUb2FzdC5tYWtlVGV4dChcIlZpc2l0IFNlbnQhXCIpLnNob3coKTtcbiAgICAgICAgICAvLyB9LGVycm9yID0+IHtcbiAgICAgICAgICAvLyAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgICAgLy8gICBhbGVydChcIkVycm9yIGNyZWF0aW5nIHRoZSBjb250cmFjdDogXCIrZXJyb3IpO1xuICAgICAgICAgIC8vICAgLy8gdGhyb3cgbmV3IEVycm9yKGVycm9yKTtcbiAgICAgICAgICAvLyB9KTtcblxuXG4gICAgICAgICAgLy8gaWYgbGFzdCByZWFkaW5nIG9mIHN0b3JlIHdhcyBsZXNzIHRoYW4gMjAgc2Vjb25kcyBhZ29cbiAgICAgICAgICBpZihzaW5jZUxhc3QgPCA1OTAwMCl7IC8vIHVwZGF0ZSBlbmQgZGF0ZSB0byBjdXJyZW50XG4gICAgICAgICAgICB0aGlzLnZpc2l0RGF0YWJhc2VTZXJ2aWNlLnVwZGF0ZVZpc2l0KHZpc2l0WzBdLHZpc2l0WzFdLCAgdmlzaXRbMl0gLCB2aXNpdFszXSAsbmV3IERhdGUoKSwgdmlzaXRbNV0gLCB2aXNpdFs2XSAsIHZpc2l0WzddKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidmlzaXQgJ2VuZCcgdXBkYXRlZFwiKTtcbiAgICAgICAgICB9ZWxzZXsvLyBpZiBsYXN0IHJlYWRpbmcgb2Ygc3RvcmUgd2FzIG1vcmUgdGhhbiAyMCBzZWNvbmRzIGFnb1xuICAgICAgICAgICAgaWYoZHVyYXRpb24gPiA2MDAwMCl7IC8vIGlmIHJlYWRpbmdzIGxhc3RlZCBtb3JlIHRoYW4gMyBtaW51dGVzICwgc2VuZCByZWNvcmQuLiAxIG1pblxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNlbmRpbmcgdmlzaXQgYTogXCIrdmlzaXQpXG4gICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQWN0dWFsIGltcGxlbWVudGF0aW9uIHBlbmRpbmcuLlwiKTtcbiAgICAgICAgICAgICAgdGhpcy52aXNpdFNlcnZpY2UuY3JlYXRlVmlzaXQodmlzaXQpLnN1YnNjcmliZShyZXNwb25zZSA9PiB7IFxuICAgICAgICAgICAgICAgICAgLy8gdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiVmlzaXQgU2VudCFcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgIH0sZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgY3JlYXRpbmcgdGhlIGNvbnRyYWN0OiBcIitlcnJvcik7XG4gICAgICAgICAgICAgICAgICAvLyB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiR29vZGJ5ZSBmcm9tIFwiK3N0b3JlLm5hbWUpLnNob3coKTtcblxuICAgICAgICAgICAgICAvLyBTZW5kIGZpbmlzaGVkIGludGVyZXN0c1xuICAgICAgICAgICAgICAvLyBsZXQgZmluaXNoZWRJbnRlcmVzdHMgPSB0aGlzLmludGVyZXN0RGF0YWJhc2VTZXJ2aWNlLmZpbmlzaEludGVyZXN0cygpOyBcbiAgICAgICAgICAgICAgLy8gaWYgKGZpbmlzaGVkSW50ZXJlc3RzLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgICAvLyAgIGZpbmlzaGVkSW50ZXJlc3RzLmZvckVhY2goaW50ZXJlc3Q9PntcbiAgICAgICAgICAgICAgLy8gICAgIC8vIHNlbmQgaW50ZXJlc3RcbiAgICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyBpbnRlcmVzdCBmcm9tIGZpbmlzaCBpbnRlcmVzdDogXCIraW50ZXJlc3QuYmVhY29uKTtcbiAgICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwiQWN0dWFsIGltcGxlbWVudGF0aW9uIHBlbmRpbmcuLlwiKTtcblxuICAgICAgICAgICAgICAvLyAgICAgVG9hc3QubWFrZVRleHQoXCJJbnRlcmVzdCBzdG9yZWQuXCIpLnNob3coKTtcbiAgICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwiSW50ZXJlc3Qgc3RvcmVkLlwiKVxuICAgICAgICAgICAgICAvLyAgIH0pO1xuICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgIC8vIFJldHJpdmUgYWxsIGludGVyZXN0cyAoc2hvdWxkIGJlIG1heCAxKVxuXG4gICAgICAgICAgICAgIGxldCBpbnRlcmVzdHMgPSB0aGlzLmludGVyZXN0RGF0YWJhc2VTZXJ2aWNlLnNlbGVjdEludGVyZXN0cygpO1xuXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaG93IG1hbnkgaW50ZXJzdHMgdG8gZmluaXNoOiBcIitpbnRlcmVzdHMubGVuZ3RoKTtcbiAgICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgYW4gaW50ZXJlc3QgXG4gICAgICAgICAgICAgIGlmIChpbnRlcmVzdHMubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAgICAgICBpbnRlcmVzdHMuZm9yRWFjaChpbnRlcmVzdCA9PntcbiAgICAgICAgICAgICAgICAgIGxldCBzdGFydCA9IG5ldyBEYXRlKGludGVyZXN0LnN0YXJ0KTtcbiAgICAgICAgICAgICAgICAgIGxldCBlbmQgPSBuZXcgRGF0ZShpbnRlcmVzdC5lbmQpO1xuICAgICAgICAgICAgICAgICAgbGV0IGR1cmF0aW9uID0gZW5kLmdldFRpbWUoKSAtIHN0YXJ0LmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgICAgIGxldCBzaW5jZUxhc3QgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIGVuZC5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkludGVyZXN0OiBcIitpbnRlcmVzdC5iZWFjb24rXCIsIHNpbmNlTGFzdDogXCIrc2luY2VMYXN0K1wiLCBkdXJhdGlvbjogXCIrZHVyYXRpb24pO1xuICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAvLyBpZiBkdXJhdGlvbiAgPiAxIG1pbnV0ZSB0aGVuIHNlbmQgaW50ZXJlc3RcbiAgICAgICAgICAgICAgICAgIGlmKCBkdXJhdGlvbiA+IDYwMDAwKXtcbiAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNlbmRpbmcgaW50ZXJlc3QgYjogXCIraW50ZXJlc3QuYmVhY29uKVxuICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQWN0dWFsIGltcGxlbWVudGF0aW9uIHBlbmRpbmcuLlwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiSW50ZXJlc3Qgc3RvcmVkLlwiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJbnRlcmVzdCBzdG9yZWQuXCIpXG5cbiAgICAgICAgICAgICAgICAgICAgICAvLyBmaW5pc2hlZEludGVyZXN0cy5wdXNoKGludGVyZXN0KTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRGVsZXRpbmcgaW50ZXJlc3QgZHVlIHRvIGV4cGlyaW5nIGNvbnRyYWN0OiBcIitpbnRlcmVzdC5iZWFjb24pO1xuICAgICAgICAgICAgICAgICAgdGhpcy5pbnRlcmVzdERhdGFiYXNlU2VydmljZS5kZWxldGVJbnRlcmVzdChpbnRlcmVzdC5pZCk7XG4gICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDb250cmFjdCBpbmZvLi5cIik7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidGhpcy5fY29udHJhY3Q6IFwiK3RoaXMuX2NvbnRyYWN0KTtcbiAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ0aGlzLl9jb250cmFjdC5vcHRpb25zOiBcIit0aGlzLl9jb250cmFjdC5vcHRpb25zKTtcbiAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ0aGlzLl9jb250cmFjdC5vcHRpb25zWydleHBpcmVfbWV0aG9kJ106IFwiK3RoaXMuX2NvbnRyYWN0Lm9wdGlvbnNbJ2V4cGlyZV9tZXRob2QnXSk7XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICBpZiggdHlwZW9mIHRoaXMuX2NvbnRyYWN0ICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiB0aGlzLl9jb250cmFjdC5vcHRpb25zWydleHBpcmVfbWV0aG9kJ10gIT09IFwidW5kZWZpbmVkXCIgJiYgdGhpcy5fY29udHJhY3Qub3B0aW9uc1snZXhwaXJlX21ldGhvZCddID09ICdsb2NhdGlvbicpe1xuICAgICAgICAgICAgICAgIC8vIGV4cGlyZSBjb250cmFjdCBpZiBsb2NhdGlvbiBvblxuICAgICAgICAgICAgICAgIHRoaXMuaXNCdXN5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyYWN0U2VydmljZS5leHBpcmVDb250cmFjdCh0aGlzLl9jb250cmFjdC5sb2NhdGlvbl9pZCx0aGlzLl9jb250cmFjdC5jdXN0b21lcl9pZClcbiAgICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUocmVzcG9uc2VDb250cmFjdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIC8vIGFsZXJ0KFwiQ29udHJhY3QgZXhwaXJlZCBzdWNjZXNmdWxseSFcIik7XG4gICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiQ29udHJhY3QgZXhwaXJlZCBzdWNjZXNmdWxseSFcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgfSxlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgaW4gY29udHJhY3RcIik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnJvci5zdGF0dXMgIT0gNDA0KXtcbiAgICAgICAgICAgICAgICAgICAgICBhbGVydChcIkVycm9yIGV4cGlyaW5nIHRoZSBjb250cmFjdDogXCIrZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAvLyBkZWxldGUgcmVjb3JkXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkRlbGV0aW5nIHZpc2l0IGR1ZSB0byBsZXNzIHRoYW4gNTkgc2Vjb25kczogXCIrdmlzaXRbMF0pO1xuICAgICAgICAgICAgdGhpcy52aXNpdERhdGFiYXNlU2VydmljZS5kZWxldGVWaXNpdCh2aXNpdFswXSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICBcbiAgICAgICAgICB9XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ3JlYXRpbmcgbmV3IHZpc2l0XCIpXG4gICAgICAgICAgbGV0IHZpc2l0T2JqID0gbmV3IFZpc2l0KHRoaXMuX2N1c3RvbWVyX2lkLCBzdG9yZS5pZGVudGlmaWNhdG9yKTtcbiAgICAgICAgICB2aXNpdE9iai5rZXl3b3Jkcz1zdG9yZS5rZXl3b3JkcztcbiAgICAgICAgICB0aGlzLnZpc2l0RGF0YWJhc2VTZXJ2aWNlLmluc2VydFZpc2l0KHZpc2l0T2JqKTtcbiAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIldlbGxjb21lIHRvIFwiK3N0b3JlLm5hbWUpLnNob3coKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfWVsc2V7XG4gICAgICAvLyBSZXRyaXZlIGFsbCB2aXNpdHMgKHNob3VsZCBiZSBtYXggMSlcbiAgICAgIGxldCB2aXNpdHMgPSB0aGlzLnZpc2l0RGF0YWJhc2VTZXJ2aWNlLnNlbGVjdFZpc2l0cygpO1xuXG4gICAgICBjb25zb2xlLmxvZyhcImhvdyBtYW55IHZpc2l0czogXCIrdmlzaXRzLmxlbmd0aCk7XG4gICAgICAvLyBpZiB0aGVyZSBpcyBhbiB2aXNpdCBcbiAgICAgIGlmICh2aXNpdHMubGVuZ3RoID4gMCl7XG4gICAgICAgIHZpc2l0cy5mb3JFYWNoKHZpc2l0ID0+e1xuICAgICAgICAgIGxldCBzdGFydCA9IG5ldyBEYXRlKHZpc2l0LnN0YXJ0KTtcbiAgICAgICAgICBsZXQgZW5kID0gbmV3IERhdGUodmlzaXQuZW5kKTtcbiAgICAgICAgICBsZXQgZHVyYXRpb24gPSBlbmQuZ2V0VGltZSgpIC0gc3RhcnQuZ2V0VGltZSgpO1xuICAgICAgICAgIGxldCBzaW5jZUxhc3QgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIGVuZC5nZXRUaW1lKCk7XG5cbiAgICAgICAgICBjb25zb2xlLmxvZyhcInNpbmNlTGFzdDogXCIrIHNpbmNlTGFzdCk7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJkdXJhdGlvbjogXCIrIGR1cmF0aW9uKTtcbiAgICAgICAgICAvLyBpZiBzaW5jZUxhc3QgPiA2MCBzZWNvbmRzIDwtIHRoaXMgaXMgY3J1Y2lhbCBmb3Iga25vd2luZyBpZiBpdCBpcyBhd2F5XG4gICAgICAgICAgaWYoc2luY2VMYXN0ID4gNjAwMDApe1xuICAgICAgICAgICAgLy8gaWYgZHVyYXRpb24gID4gMSBtaW51dGUgdGhlbiBzZW5kIHZpc2l0XG4gICAgICAgICAgICBpZiggZHVyYXRpb24gPiA2MDAwMCl7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyB2aXNpdCBiIDogXCIrdmlzaXQuaWQpXG4gICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQWN0dWFsIGltcGxlbWVudGF0aW9uIHBlbmRpbmcuLlwiKTtcbiAgICAgICAgICAgICAgdGhpcy52aXNpdFNlcnZpY2UuY3JlYXRlVmlzaXQodmlzaXQpLnN1YnNjcmliZShyZXNwb25zZSA9PiB7IFxuICAgICAgICAgICAgICAgICAgLy8gdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiVmlzaXQgU2VudCFcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgIH0sZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgY3JlYXRpbmcgdGhlIGNvbnRyYWN0OiBcIitlcnJvcik7XG4gICAgICAgICAgICAgICAgICAvLyB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiR29vZGJ5ZSFcIikuc2hvdygpO1xuXG4gICAgICAgICAgICAgIC8vIFNlbmQgZmluaXNoZWQgaW50ZXJlc3RzXG4gICAgICAgICAgICAgIC8vIGxldCBmaW5pc2hlZEludGVyZXN0cyA9IHRoaXMuaW50ZXJlc3REYXRhYmFzZVNlcnZpY2UuZmluaXNoSW50ZXJlc3RzKCk7IFxuICAgICAgICAgICAgICAvLyBpZiAoZmluaXNoZWRJbnRlcmVzdHMubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAgIC8vICAgZmluaXNoZWRJbnRlcmVzdHMuZm9yRWFjaChpbnRlcmVzdD0+e1xuICAgICAgICAgICAgICAvLyAgICAgLy8gc2VuZCBpbnRlcmVzdFxuICAgICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coXCJTZW5kaW5nIGludGVyZXN0IGZyb20gZmluaXNoIGludGVyZXN0OiBcIitpbnRlcmVzdC5iZWFjb24pO1xuICAgICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coXCJBY3R1YWwgaW1wbGVtZW50YXRpb24gcGVuZGluZy4uXCIpO1xuXG4gICAgICAgICAgICAgIC8vICAgICBUb2FzdC5tYWtlVGV4dChcIkludGVyZXN0IHN0b3JlZC5cIikuc2hvdygpO1xuICAgICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coXCJJbnRlcmVzdCBzdG9yZWQuXCIpXG4gICAgICAgICAgICAgIC8vICAgfSk7XG4gICAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgICAvLyBSZXRyaXZlIGFsbCBpbnRlcmVzdHMgKHNob3VsZCBiZSBtYXggMSlcbiAgICAgICAgICAgICAgbGV0IGludGVyZXN0cyA9IHRoaXMuaW50ZXJlc3REYXRhYmFzZVNlcnZpY2Uuc2VsZWN0SW50ZXJlc3RzKCk7XG5cbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJob3cgbWFueSBpbnRlcnN0cyB0byBmaW5pc2g6IFwiK2ludGVyZXN0cy5sZW5ndGgpO1xuICAgICAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBhbiBpbnRlcmVzdCBcbiAgICAgICAgICAgICAgaWYgKGludGVyZXN0cy5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgICAgICAgIGludGVyZXN0cy5mb3JFYWNoKGludGVyZXN0ID0+e1xuICAgICAgICAgICAgICAgICAgbGV0IHN0YXJ0ID0gbmV3IERhdGUoaW50ZXJlc3Quc3RhcnQpO1xuICAgICAgICAgICAgICAgICAgbGV0IGVuZCA9IG5ldyBEYXRlKGludGVyZXN0LmVuZCk7XG4gICAgICAgICAgICAgICAgICBsZXQgZHVyYXRpb24gPSBlbmQuZ2V0VGltZSgpIC0gc3RhcnQuZ2V0VGltZSgpO1xuICAgICAgICAgICAgICAgICAgbGV0IHNpbmNlTGFzdCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gZW5kLmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSW50ZXJlc3Q6IFwiK2ludGVyZXN0LmJlYWNvbitcIiwgc2luY2VMYXN0OiBcIitzaW5jZUxhc3QrXCIsIGR1cmF0aW9uOiBcIitkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgIC8vIGlmIGR1cmF0aW9uICA+IDEgbWludXRlIHRoZW4gc2VuZCBpbnRlcmVzdFxuICAgICAgICAgICAgICAgICAgaWYoIGR1cmF0aW9uID4gNjAwMDApe1xuICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyBpbnRlcmVzdCBiOiBcIitpbnRlcmVzdC5iZWFjb24pXG4gICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJBY3R1YWwgaW1wbGVtZW50YXRpb24gcGVuZGluZy4uXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJJbnRlcmVzdCBzdG9yZWQuXCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkludGVyZXN0IHN0b3JlZC5cIilcblxuICAgICAgICAgICAgICAgICAgICAgIC8vIGZpbmlzaGVkSW50ZXJlc3RzLnB1c2goaW50ZXJlc3QpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJEZWxldGluZyBpbnRlcmVzdCBkdWUgdG8gZXhwaXJpbmcgY29udHJhY3Q6IFwiK2ludGVyZXN0LmJlYWNvbik7XG4gICAgICAgICAgICAgICAgICB0aGlzLmludGVyZXN0RGF0YWJhc2VTZXJ2aWNlLmRlbGV0ZUludGVyZXN0KGludGVyZXN0LmlkKTtcbiAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ29udHJhY3QgaW5mby4uXCIpO1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInRoaXMuX2NvbnRyYWN0OiBcIit0aGlzLl9jb250cmFjdCk7XG4gICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwidGhpcy5fY29udHJhY3Qub3B0aW9uczogXCIrdGhpcy5fY29udHJhY3Qub3B0aW9ucyk7XG4gICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwidGhpcy5fY29udHJhY3Qub3B0aW9uc1snZXhwaXJlX21ldGhvZCddOiBcIit0aGlzLl9jb250cmFjdC5vcHRpb25zWydleHBpcmVfbWV0aG9kJ10pO1xuXG4gICAgICAgICAgICAgIGlmKCB0eXBlb2YgdGhpcy5fY29udHJhY3QgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIHRoaXMuX2NvbnRyYWN0Lm9wdGlvbnNbJ2V4cGlyZV9tZXRob2QnXSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0aGlzLl9jb250cmFjdC5vcHRpb25zWydleHBpcmVfbWV0aG9kJ10gPT0gJ2xvY2F0aW9uJyl7XG4gICAgICAgICAgICAgICAgLy8gZXhwaXJlIGNvbnRyYWN0IGlmIGxvY2F0aW9uIG9uXG4gICAgICAgICAgICAgICAgdGhpcy5pc0J1c3kgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuY29udHJhY3RTZXJ2aWNlLmV4cGlyZUNvbnRyYWN0KHRoaXMuX2NvbnRyYWN0LmxvY2F0aW9uX2lkLHRoaXMuX2NvbnRyYWN0LmN1c3RvbWVyX2lkKVxuICAgICAgICAgICAgICAgICAgLnN1YnNjcmliZShyZXNwb25zZUNvbnRyYWN0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgLy8gYWxlcnQoXCJDb250cmFjdCBleHBpcmVkIHN1Y2Nlc2Z1bGx5IVwiKTtcbiAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJDb250cmFjdCBleHBpcmVkIHN1Y2Nlc2Z1bGx5IVwiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICB9LGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciBpbiBjb250cmFjdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yLnN0YXR1cyAhPSA0MDQpe1xuICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgZXhwaXJpbmcgdGhlIGNvbnRyYWN0OiBcIitlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRGVsZXRpbmcgdmlzaXQgZHVlIHRvIG1vcmUgdGhhbiAxIG1pbnV0ZSBhd2F5OiBcIit2aXNpdC5pZCk7XG4gICAgICAgICAgICB0aGlzLnZpc2l0RGF0YWJhc2VTZXJ2aWNlLmRlbGV0ZVZpc2l0KHZpc2l0LmlkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHZlcmlmeUJlaGF2aW9yKCl7XG4gICAgbGV0IG5lYXJieUl0ZW1zID0gdGhpcy5uZWFyYnlJdGVtcygpO1xuICAgIGNvbnNvbGUubG9nKFwiTmVhcmJ5IGl0ZW1zOiBcIituZWFyYnlJdGVtcy5sZW5ndGgpXG5cbiAgICBpZiAobmVhcmJ5SXRlbXMubGVuZ3RoPjApe1xuICAgICAgbmVhcmJ5SXRlbXMuZm9yRWFjaChpdGVtPT57XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQmVhY29uIGlkZW50aWZpY2F0b3I6IFwiK2l0ZW0uaWRlbnRpZmljYXRvcik7XG4gICAgICAgIGxldCBpbnRlcmVzdCAgPSB0aGlzLmludGVyZXN0RGF0YWJhc2VTZXJ2aWNlLnNlbGVjdEludGVyZXN0QnlCZWFjb24oaXRlbS5pZGVudGlmaWNhdG9yKTtcbiAgICAgICAgLy8gVmVyaWZ5IGlmIGludGVyZXN0IGlzIGJlaW5nIGNyZWF0ZWRcbiAgICAgICAgaWYgKGludGVyZXN0ICE9IG51bGwpe1xuICAgICAgICAgIGxldCBzdGFydCA9IG5ldyBEYXRlKGludGVyZXN0WzNdKTtcbiAgICAgICAgICBsZXQgZW5kID0gbmV3IERhdGUoaW50ZXJlc3RbNF0pO1xuICAgICAgICAgIGxldCBkdXJhdGlvbiA9IGVuZC5nZXRUaW1lKCkgLSBzdGFydC5nZXRUaW1lKCk7XG4gICAgICAgICAgbGV0IHNpbmNlTGFzdCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gZW5kLmdldFRpbWUoKTtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImludGVyZXN0XCIpO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwic3RhcnQ6IFwiKyhzdGFydC5nZXRUaW1lKCkpKTtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImVuZDogXCIrIGVuZC5nZXRUaW1lKCkpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdpbnRlcmVzdCBkdXJhdGlvbjogJytkdXJhdGlvbik7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2ludGVyZXN0IHNpbmNlTGFzdDogJytzaW5jZUxhc3QpO1xuICAgICAgICAgIC8vIGlmIGxhc3QgcmVhZGluZyBvZiBpdGVtIHdhcyBsZXNzIHRoYW4gMjAgc2Vjb25kcyBhZ29cbiAgICAgICAgICBpZihzaW5jZUxhc3QgPCA1OTAwMCl7IC8vIHVwZGF0ZSBlbmQgZGF0ZSB0byBjdXJyZW50XG4gICAgICAgICAgICB0aGlzLmludGVyZXN0RGF0YWJhc2VTZXJ2aWNlLnVwZGF0ZUludGVyZXN0KGludGVyZXN0WzBdLGludGVyZXN0WzFdLCAgaW50ZXJlc3RbMl0gLCBpbnRlcmVzdFszXSAsbmV3IERhdGUoKSwgaW50ZXJlc3RbNV0gLCBpbnRlcmVzdFs2XSAsIGludGVyZXN0WzddKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW50ZXJlc3QgJ2VuZCcgdXBkYXRlZFwiKTtcbiAgICAgICAgICB9ZWxzZXsvLyBpZiBsYXN0IHJlYWRpbmcgb2YgaXRlbSB3YXMgbW9yZSB0aGFuIDIwIHNlY29uZHMgYWdvXG4gICAgICAgICAgICBpZihkdXJhdGlvbiA+IDYwMDAwKXsgLy8gaWYgcmVhZGluZ3MgbGFzdGVkIG1vcmUgdGhhbiA2MCBzZWNvbmRzLCBzZW5kIHJlY29yZFxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNlbmRpbmcgaW50ZXJlc3RhIDogXCIraW50ZXJlc3QpXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQWN0dWFsIGltcGxlbWVudGF0aW9uIHBlbmRpbmcuLlwiKTtcbiAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJJbnRlcmVzdCBzdG9yZWQuXCIpLnNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGRlbGV0ZSByZWNvcmRcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRGVsZXRpbmcgaW50ZXJlc3QgZHVlIHRvIGxlc3MgdGhhbiAyMCBzZWNvbmRzOiBcIitpbnRlcmVzdFswXSk7XG4gICAgICAgICAgICB0aGlzLmludGVyZXN0RGF0YWJhc2VTZXJ2aWNlLmRlbGV0ZUludGVyZXN0KGludGVyZXN0WzBdKTtcbiAgICAgICAgICBcbiAgICAgICAgICB9XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ3JlYXRpbmcgbmV3IGludGVyZXN0XCIpXG4gICAgICAgICAgbGV0IGludGVyZXN0T2JqID0gbmV3IEludGVyZXN0KHRoaXMuX2N1c3RvbWVyX2lkLCBpdGVtLmlkZW50aWZpY2F0b3IpO1xuICAgICAgICAgIGludGVyZXN0T2JqLmtleXdvcmRzPWl0ZW0ua2V5d29yZHM7XG4gICAgICAgICAgdGhpcy5pbnRlcmVzdERhdGFiYXNlU2VydmljZS5pbnNlcnRJbnRlcmVzdChpbnRlcmVzdE9iaik7XG4gICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJSZWNvcmRpbmcgaW50ZXJlc3QuXCIpLnNob3coKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfWVsc2V7XG4gICAgICAvLyBSZXRyaXZlIGFsbCBpbnRlcmVzdHMgKHNob3VsZCBiZSBtYXggMSlcbiAgICAgIGxldCBpbnRlcmVzdHMgPSB0aGlzLmludGVyZXN0RGF0YWJhc2VTZXJ2aWNlLnNlbGVjdEludGVyZXN0cygpO1xuXG4gICAgICBjb25zb2xlLmxvZyhcImhvdyBtYW55IGludGVyc3RzOiBcIitpbnRlcmVzdHMubGVuZ3RoKTtcbiAgICAgIC8vIGlmIHRoZXJlIGlzIGFuIGludGVyZXN0IFxuICAgICAgaWYgKGludGVyZXN0cy5sZW5ndGggPiAwKXtcbiAgICAgICAgaW50ZXJlc3RzLmZvckVhY2goaW50ZXJlc3QgPT57XG4gICAgICAgICAgbGV0IHN0YXJ0ID0gbmV3IERhdGUoaW50ZXJlc3Quc3RhcnQpO1xuICAgICAgICAgIGxldCBlbmQgPSBuZXcgRGF0ZShpbnRlcmVzdC5lbmQpO1xuICAgICAgICAgIGxldCBkdXJhdGlvbiA9IGVuZC5nZXRUaW1lKCkgLSBzdGFydC5nZXRUaW1lKCk7XG4gICAgICAgICAgbGV0IHNpbmNlTGFzdCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gZW5kLmdldFRpbWUoKTtcbiAgICAgICAgICAvLyBpZiBzaW5jZUxhc3QgPiA2MCBzZWNvbmRzIDwtIHRoaXMgaXMgY3J1Y2lhbCBmb3Iga25vd2luZyBpZiBpdCBpcyBhd2F5XG4gICAgICAgICAgY29uc29sZS5sb2coXCJJbnRlcmVzdDogXCIraW50ZXJlc3QuYmVhY29uK1wiLCBzaW5jZUxhc3Q6IFwiK3NpbmNlTGFzdCtcIiwgZHVyYXRpb246IFwiK2R1cmF0aW9uKTtcbiAgICAgICAgICBpZihzaW5jZUxhc3QgPiA2MDAwMCl7XG4gICAgICAgICAgICAvLyBpZiBkdXJhdGlvbiAgPiAxIG1pbnV0ZSB0aGVuIHNlbmQgaW50ZXJlc3RcbiAgICAgICAgICAgIGlmKCBkdXJhdGlvbiA+IDYwMDAwKXtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTZW5kaW5nIGludGVyZXN0IGI6IFwiK2ludGVyZXN0LmJlYWNvbilcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJBY3R1YWwgaW1wbGVtZW50YXRpb24gcGVuZGluZy4uXCIpO1xuICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkludGVyZXN0IHN0b3JlZC5cIikuc2hvdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJEZWxldGluZyBpbnRlcmVzdCBkdWUgdG8gbW9yZSB0aGFuIDEgbWludXRlIGF3YXk6IFwiK2ludGVyZXN0LmlkKTtcbiAgICAgICAgICAgIHRoaXMuaW50ZXJlc3REYXRhYmFzZVNlcnZpY2UuZGVsZXRlSW50ZXJlc3QoaW50ZXJlc3QuaWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdmVyaWZ5Q29udHJhY3QoKXtcbiAgICBjb25zb2xlLmxvZyhcIlZlcmlmeWluZyBjb250cmFjdHMuLlwiKTtcbiAgICAvLyB0aGlzLmlzQnVzeSA9IHRydWU7XG4gICAgbGV0IG5lYXJieVN0b3JlcyA9IHRoaXMubmVhcmJ5U3RvcmVzKCk7XG4gICAgY29uc29sZS5sb2coXCJOZWFyYnkgc3RvcmVzOiBcIituZWFyYnlTdG9yZXMubGVuZ3RoKVxuICAgIGlmIChuZWFyYnlTdG9yZXMubGVuZ3RoPjApe1xuICAgICAgbmVhcmJ5U3RvcmVzLmZvckVhY2goc3RvcmUgPT4ge1xuICAgICAgICB0aGlzLmNvbnRyYWN0U2VydmljZS5nZXRBY3RpdmVDb250cmFjdCggdGhpcy5fY3VzdG9tZXJfaWQgLHBhcnNlSW50KHN0b3JlLmxvY2F0aW9uX2lkKSlcbiAgICAgICAgLnN1YnNjcmliZShyZXNwb25zZUNvbnRyYWN0ID0+IHtcbiAgICAgICAgICBpZiAoIXJlc3BvbnNlQ29udHJhY3QubWVzc2FnZSl7XG4gICAgICAgICAgICB0aGlzLl9jb250cmFjdCA9IHJlc3BvbnNlQ29udHJhY3Q7XG4gICAgICAgICAgICB0aGlzLmNhbkNvbnRyYWN0ID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmhhc0NvbnRyYWN0ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMubG9jYXRpb25faWQgPSBzdG9yZS5sb2NhdGlvbl9pZDtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQWN0aXZlIGNvbnRyYWN0LlwiKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgfSxlcnJvciA9PiB7XG4gICAgICAgICAgaWYgKGVycm9yLnN0YXR1cyA9PSA0MDQpe1xuICAgICAgICAgICAgdGhpcy5jYW5Db250cmFjdCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmhhc0NvbnRyYWN0ID0gZmFsc2U7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vIGFjdGl2ZSBDb250cmFjdHMuXCIpO1xuICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBnZXR0aW5nIGFjdGl2ZSBjb250cmFjdCBpbmZvcm1hdGlvbjogXCIrZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlOyAgXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfWVsc2V7XG4gICAgICBjb25zb2xlLmxvZyhcImFib3V0IHRvIHZlcmlmeSBjb250cmFjdCB3aXRob3V0IHN0b3JlL2xvY2F0aW9uXCIpO1xuICAgICAgY29uc29sZS5sb2coXCJjdXN0OiBcIit0aGlzLl9jdXN0b21lcl9pZCk7XG4gICAgICB0aGlzLmNvbnRyYWN0U2VydmljZS5nZXRBY3RpdmVDb250cmFjdCggdGhpcy5fY3VzdG9tZXJfaWQgKVxuICAgICAgICAuc3Vic2NyaWJlKHJlc3BvbnNlQ29udHJhY3QgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwibWVzc2FnZT8gXCIrcmVzcG9uc2VDb250cmFjdCk7XG4gICAgICAgICAgaWYgKCFyZXNwb25zZUNvbnRyYWN0Lm1lc3NhZ2Upe1xuICAgICAgICAgICAgdGhpcy5fY29udHJhY3QgPSByZXNwb25zZUNvbnRyYWN0O1xuICAgICAgICAgICAgdGhpcy5jYW5Db250cmFjdCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5oYXNDb250cmFjdCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmxvY2F0aW9uX2lkID0gcmVzcG9uc2VDb250cmFjdC5sb2NhdGlvbl9pZDtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQWN0aXZlIGNvbnRyYWN0LlwiKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY29udHJhY3QgYnV0IG5vIG1lc3NhZ2VcIilcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgfSxlcnJvciA9PiB7XG4gICAgICAgICAgaWYgKGVycm9yLnN0YXR1cyA9PSA0MDQpe1xuICAgICAgICAgICAgdGhpcy5jYW5Db250cmFjdCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmhhc0NvbnRyYWN0ID0gZmFsc2U7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vIGFjdGl2ZSBDb250cmFjdHMuXCIpO1xuICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBnZXR0aW5nIGFjdGl2ZSBjb250cmFjdCBpbmZvcm1hdGlvbjogXCIrZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlOyAgXG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIExvY2F0aW9uIHJlZmFjdG9yXG4gIC8vIHByaXZhdGUgZ2V0Q3VycmVudExvY2F0aW9uKCl7XG4gIC8vICAgLy8gVE9ETyBnZXQgb3duIGNvb3JkZW5hdGVzXG4gIC8vICAgdGhpcy5pc0J1c3kgPSB0cnVlO1xuICAvLyAgIHRoaXMubG9jYXRpb25TZXJ2aWNlLmdldEN1cnJlbnRMb2NhdGlvbigpXG4gIC8vICAgICAudGhlbigobG9jYXRpb246IExvY2F0aW9uKSA9PiB7XG4gIC8vICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gIC8vICAgICAgIGlmKGxvY2F0aW9uICE9IHVuZGVmaW5lZCl7XG4gIC8vICAgICAgICAgdGhpcy5fY3VycmVudF9sb2NhdGlvbiA9IGxvY2F0aW9uO1xuICAvLyAgICAgICAgIHRoaXMuaXNDdXJyZW50TG9jYXRpb24gPSB0cnVlO1xuICAvLyAgICAgICB9XG4gIC8vICAgICAgIGVsc2V7XG4gIC8vICAgICAgICAgdGhyb3cgXCJMb2NhdGlvbiBub3QgZm91bmRcIjtcbiAgLy8gICAgICAgfSBcbiAgLy8gICAgIH1cbiAgLy8gICAgICkuY2F0Y2goKGVycm9yKSA9PiB7XG4gIC8vICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gIC8vICAgICAgIGFsZXJ0KGVycm9yKVxuICAvLyAgICAgfSk7XG4gIC8vIH1cblxuXG4gIC8vIE1FVEhPRFMgT05MWSBGT1IgVEVTVElORyBEQVRBQkFTRVxuICBwdWJsaWMgc2hvd0xvY2F0aW9uc0luRGF0YWJhc2UoKSB7IFxuICAgIHRoaXMuX2xvY2F0aW9uc19pbl9kYi5mb3JFYWNoKGxvY2F0aW9uID0+IHtcbiAgICAgIGFsZXJ0KFwiTG9jYXRpb246IFwiK2xvY2F0aW9uLm5hbWUpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gTG9jYXRpb24gcmVmYWN0b3JcbiAgLy8gcHVibGljIGlzTG9jYXRpb25EYXRhYmFzZUVtcHR5KCl7XG4gIC8vICAgbGV0IGVtcHR5ID0gdHJ1ZTtcbiAgLy8gICAvLyBjb25zb2xlLmxvZyhcIlRlc3QxLjZcIik7XG4gIC8vICAgLy8gY29uc29sZS5sb2coXCJUZXN0MS43LCBsZW5ndGg6IFwiK3RoaXMubG9jYXRpb25EYXRhYmFzZVNlcnZpY2Uuc2VsZWN0QWxsTG9jYXRpb25zKCkubGVuZ3RoKTtcbiAgLy8gICBpZiAodGhpcy5sb2NhdGlvbkRhdGFiYXNlU2VydmljZS5zZWxlY3RBbGxMb2NhdGlvbnMoKS5sZW5ndGggPiAwKXtcbiAgLy8gICAgIGNvbnNvbGUubG9nKFwiRGF0YWJhc2UgZW1wdHlcIik7XG4gIC8vICAgICBlbXB0eSA9IGZhbHNlO1xuICAvLyAgIH1cbiAgLy8gICByZXR1cm4gZW1wdHk7XG4gIC8vIH1cblxuICAvLyBMb2NhdGlvbiByZWZhY3RvclxuICAvLyBwdWJsaWMgdXBkYXRlTG9jYXRpb25EYXRhYmFzZSgpe1xuICAvLyAgIC8vIGFsZXJ0KFwidXBkYXRpbmcgbG9jYXRpb25zIGRiLi5cIilcbiAgLy8gICAvLyBEcm9wcyBEQiBpZiAgZXhpc3RcbiAgLy8gICB0aGlzLmxvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlLmRyb3BUYWJsZSgpO1xuICAvLyAgIC8vIENyZWF0ZXMgREIgaWYgbm90IGV4aXN0XG4gIC8vICAgdGhpcy5sb2NhdGlvbkRhdGFiYXNlU2VydmljZS5jcmVhdGVUYWJsZSgpO1xuXG4gIC8vICAgdGhpcy5pc0J1c3kgPSB0cnVlO1xuICAvLyAgIHRoaXMubG9jYXRpb25TZXJ2aWNlLmdldExvY2F0aW9ucygpXG4gIC8vICAgICAuc3Vic2NyaWJlKHJlc3BvbnNlID0+IHtcbiAgLy8gICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgXG4gIC8vICAgICAgIHJlc3BvbnNlLmZvckVhY2gobG9jYXRpb24gPT4ge1xuICAvLyAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwibG9jYXRpb24gbmFtZTogXCIrIGxvY2F0aW9uLm5hbWUpO1xuICAvLyAgICAgICAgIHRoaXMubG9jYXRpb25EYXRhYmFzZVNlcnZpY2UuaW5zZXJ0TG9jYXRpb24obG9jYXRpb24pO1xuXG4gIC8vICAgICAgIH0pO1xuICAvLyAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvbWFpblwiXSk7ICBcbiAgLy8gICAgIH0sZXJyb3IgPT4ge1xuICAvLyAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAvLyAgICAgICBhbGVydChlcnJvcik7XG4gIC8vICAgICB9KTtcbiAgLy8gfVxuXG4gIHB1YmxpYyBpc0JlYWNvbkRhdGFiYXNlRW1wdHkoKXtcbiAgICBsZXQgZW1wdHkgPSB0cnVlO1xuICAgIC8vIGNvbnNvbGUubG9nKFwiVGVzdDEuNlwiKTtcbiAgICAvLyBjb25zb2xlLmxvZyhcIlRlc3QxLjcsIGxlbmd0aDogXCIrdGhpcy5sb2NhdGlvbkRhdGFiYXNlU2VydmljZS5zZWxlY3RBbGxMb2NhdGlvbnMoKS5sZW5ndGgpO1xuICAgIGlmICh0aGlzLmJlYWNvbkRhdGFiYXNlU2VydmljZS5zZWxlY3RCZWFjb25zKFwiYWxsXCIpLmxlbmd0aCA+IDApe1xuICAgICAgZW1wdHkgPSBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZW1wdHk7XG4gIH1cblxuICBwdWJsaWMgdXBkYXRlQmVhY29uRGF0YWJhc2UoKXtcbiAgICAvLyBhbGVydChcInVwZGF0aW5nIGxvY2F0aW9ucyBkYi4uXCIpXG4gICAgLy8gRHJvcHMgREIgaWYgIGV4aXN0XG4gICAgdGhpcy5iZWFjb25EYXRhYmFzZVNlcnZpY2UuZHJvcFRhYmxlKCk7XG4gICAgLy8gQ3JlYXRlcyBEQiBpZiBub3QgZXhpc3RcbiAgICB0aGlzLmJlYWNvbkRhdGFiYXNlU2VydmljZS5jcmVhdGVUYWJsZSgpO1xuICAgIGNvbnNvbGUubG9nKFwiTG9jYWwgREIgY3JlYXRlZCwgbm8gZXJyb3JzIHNvIGZhci4uXCIpO1xuICAgIHRoaXMuaXNCdXN5ID0gdHJ1ZTtcbiAgICB0aGlzLmJlYWNvblNlcnZpY2UuZ2V0QmVhY29ucygpXG4gICAgICAuc3Vic2NyaWJlKHJlc3BvbnNlID0+IHtcbiAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgXG4gICAgICAgIHJlc3BvbnNlLmZvckVhY2goYmVhY29uID0+IHtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImxvY2F0aW9uIG5hbWU6IFwiKyBsb2NhdGlvbi5uYW1lKTtcbiAgICAgICAgICB0aGlzLmJlYWNvbkRhdGFiYXNlU2VydmljZS5pbnNlcnRCZWFjb24oYmVhY29uKTtcblxuICAgICAgICB9KTtcbiAgICAgICAgY29uc29sZS5sb2coXCJMb2NhbCBEQiB1cGRhdGVkLlwiKTtcbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL1wiXSwgeyBjbGVhckhpc3Rvcnk6IHRydWUgfSk7XG4gICAgICB9LGVycm9yID0+IHtcbiAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgYWxlcnQoZXJyb3IpO1xuICAgICAgfSk7XG4gIH1cbn0iXX0=