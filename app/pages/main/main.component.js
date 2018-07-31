"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var dialogs = require("ui/dialogs");
var page_1 = require("tns-core-modules/ui/page");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
var common_1 = require("@angular/common");
var utils_1 = require("utils/utils");
// import { LocationService } from "../../shared/location/location.service";
// import { LocationDatabaseService } from '../../shared/location/location.db.service';
var visit_service_1 = require("../../shared/visit/visit.service");
var visit_db_service_1 = require("../../shared/visit/visit.db.service");
var interest_service_1 = require("../../shared/interest/interest.service");
var interest_db_service_1 = require("../../shared/interest/interest.db.service");
var beacon_service_1 = require("../../shared/beacon/beacon.service");
var beacon_db_service_1 = require("../../shared/beacon/beacon.db.service");
var contract_service_1 = require("../../shared/contract/contract.service");
var shelf_1 = require("../../shared/shelf/shelf");
var shelf_service_1 = require("../../shared/shelf/shelf.service");
// import { CFAlertDialogHelper } from "../../helpers/cfalertdialog-helper";
var nativescript_cfalert_dialog_1 = require("nativescript-cfalert-dialog");
var cfalertDialog = new nativescript_cfalert_dialog_1.CFAlertDialog();
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
    beaconService, beaconDatabaseService, visitService, visitDatabaseService, interestService, interestDatabaseService, contractService, route, router, locationCommon, zone, page, shelfService) {
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
        this.shelfService = shelfService;
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
        this.atStore = "@Street";
        this.shelfInfo = false;
        this.shelfInfoSeen = [];
        // public productsByRemarkList: ProductsByRemark[];
        // public remarks = [];
        this.storeIcons = [
            { "icon": String.fromCharCode(0xf085), "color": "red" },
            { "icon": String.fromCharCode(0xf08b), "color": "blue" }
        ];
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
        // this.cfalertDialogHelper = new CFAlertDialogHelper();
        this.cfalertDialog = new nativescript_cfalert_dialog_1.CFAlertDialog();
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
                    console.log(".........................");
                    if (typeof _this._contract !== "undefined" && typeof _this._contract.options['shelf_info'] !== "undefined" && _this._contract.options['shelf_info']) {
                        _this.verifyShelfInfo();
                    }
                    else {
                        _this.shelfInfoSeen = [];
                    }
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
        // this.router.navigate(["/contract-create/"+this._current_location.id+"/1"], {
        this.router.navigate(["/contract-create", this.location_id, 1], {
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
                    _this.router.navigate(["/contract-create", store.location_id, 0], {
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
    MainComponent.prototype.verifyShelfInfo = function () {
        var _this = this;
        // console.log("Verifying shelf info..");
        var nearbyItems = this.nearbyItems();
        // console.log("Shelfs nearby: "+nearbyItems.length);
        if (nearbyItems.length > 0) {
            // console.log("Shelfs seen: "+this.shelfInfoSeen );
            nearbyItems.forEach(function (item) {
                // console.log("Shelf: "+item.identificator);
                // console.log("Shelf index: "+this.shelfInfoSeen.indexOf(item.identificator));
                if (_this.shelfInfoSeen.indexOf(item.identificator) == -1) {
                    // console.log("Shelf info available!");
                    _this.shelfInfoSeen.push(item.identificator);
                    // if (this.cfalertDialogHelper.showBottomSheet(item.identificator)){
                    //   console.log("Displaying shelf info!");
                    //   alert("Going to Shelf info!");
                    // }
                    _this.showBottomSheet(item.identificator);
                }
            });
        }
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
                    _this.verifyStoreItems(store.identificator);
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
                            _this.containerProductsO = [];
                            _this.containerProductsR = [];
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
    MainComponent.prototype.verifyStoreItems = function (beacon) {
        var _this = this;
        // alert("Store: "+beacon);
        this.shelfService.getShelf(beacon)
            .subscribe(function (responseShelf) {
            if (!responseShelf.message) {
                // this.container = new Shelf(responseShelf.code, responseShelf.beacon);
                // this.container.keywords = responseShelf.keywords;
                var productsR_1 = [];
                var productsO_1 = [];
                responseShelf.products.forEach(function (product) {
                    var productObj = new shelf_1.Product(product.code, product.name, product.description);
                    productObj.keywords = product.keywords;
                    productObj.image = product.image;
                    productObj.video = product.video;
                    productObj.remark = product.remark;
                    // products.push(productObj);
                    if (product.remark == 'offer') {
                        productsO_1.push(product);
                    }
                    else {
                        productsR_1.push(product);
                    }
                    // if(this.remarks.indexOf(product.remark)==-1){
                    //   this.remarks.push(product.remark);
                    // }
                    // if (this.remarks.indexOf(product.remark)==-1){
                    //   this.remarks.push(product.remark);
                    //   this.productsByRemarkList.push( new ProductsByRemark(product.remark));
                    //   this.productsByRemarkList.indexOf
                    // }
                    // if(this.productsByRemarkList.)
                });
                // this.container.products = products;
                // this.containerProducts = products;
                // this.productsByRemarkList.push()
                _this.containerProductsO = productsO_1;
                _this.containerProductsR = productsR_1;
                // console.log("~~~~~~~~~~~~~~~~")
                // console.log("code: "+this.shelf.code);
                // console.log("beacon: "+this.shelf.beacon);
                // console.log("kewords"+this.shelf.keywords);
                // console.log("products: "+this.shelf.products.length);
                // this.shelf.products.forEach(product => {
                //   console.log("code: "+product.code);
                //   console.log("name: "+product.name);
                //   console.log("description: "+product.description);
                //   console.log("keywords: "+product.keywords);
                //   console.log("image: "+product.image);
                //   console.log("video: "+product.video);
                // });
                // this.shelfTitle = this.shelf.code;
                // console.log("~ ~ ~ ~ ~ ~ ~ ~ ~")
            }
            else {
                console.log("message:" + responseShelf.message);
                // alert("Contract expired.");
                // this.goMain();
            }
        }, function (error) {
            console.log("error in shelf component");
            if (error.status == 401) {
                alert("No available information for this Shelf.");
            }
            else if (error.status != 404) {
                alert("Error getting shelf by beacon information: " + error);
            }
            // this.goMain();
        });
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
    MainComponent.prototype.verifyContract2 = function () {
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
                        if (_this._contract.options['shelf_info'] == "true") {
                            _this.shelfInfo = true;
                        }
                        else {
                            _this.shelfInfo = false;
                        }
                        _this.location_id = store.location_id;
                        console.log("Active contract.");
                    }
                    _this.isBusy = false;
                }, function (error) {
                    if (error.status == 404) {
                        _this.canContract = true;
                        _this.hasContract = false;
                        _this.shelfInfo = false;
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
                    if (_this._contract.options['shelf_info'] == "true") {
                        _this.shelfInfo = true;
                    }
                    else {
                        _this.shelfInfo = false;
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
                    _this.shelfInfo = false;
                    console.log("No active Contracts.");
                }
                else {
                    alert("Error getting active contract information: " + error);
                }
                _this.isBusy = false;
            });
        }
    };
    MainComponent.prototype.verifyContract = function () {
        var _this = this;
        console.log("New verification of contracts..");
        this.contractService.getActiveContract(this._customer_id)
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
                if (_this._contract.options['shelf_info'] == "true") {
                    _this.shelfInfo = true;
                }
                else {
                    _this.shelfInfo = false;
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
                _this.shelfInfo = false;
                console.log("No active Contracts.");
            }
            else {
                alert("Error getting active contract information: " + error);
            }
            _this.isBusy = false;
        });
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
    MainComponent.prototype.showBottomSheet = function (beacon, title) {
        var _this = this;
        if (title === void 0) { title = "Your selection:"; }
        var onSelection = function (response) {
            console.log("The response for shelf was: " + response);
            if (response == "Okay") {
                // alert({
                //   title: title,
                //   message: response,
                //   okButtonText: "Go"
                // });
                console.log("Going to shelf-info");
                _this.router.navigate(["/shelf-info", beacon], {
                    // animation: true,
                    transition: {
                        name: "slideLeft",
                        duration: 200,
                        curve: "linear"
                    }
                });
            }
        };
        var options = {
            dialogStyle: nativescript_cfalert_dialog_1.CFAlertStyle.BOTTOM_SHEET,
            title: "Information available!",
            message: "Would you like to know more about " + beacon + "?",
            buttons: [
                {
                    text: "Okay",
                    buttonStyle: nativescript_cfalert_dialog_1.CFAlertActionStyle.POSITIVE,
                    buttonAlignment: nativescript_cfalert_dialog_1.CFAlertActionAlignment.JUSTIFIED,
                    onClick: onSelection
                },
                {
                    text: "Nope",
                    buttonStyle: nativescript_cfalert_dialog_1.CFAlertActionStyle.NEGATIVE,
                    buttonAlignment: nativescript_cfalert_dialog_1.CFAlertActionAlignment.JUSTIFIED,
                    onClick: onSelection
                }
            ]
        };
        this.cfalertDialog.show(options);
    };
    MainComponent.prototype.playVideo = function (video) {
        utils_1.openUrl(video);
    };
    MainComponent = __decorate([
        core_1.Component({
            selector: "main",
            providers: [beacon_service_1.BeaconService, beacon_db_service_1.BeaconDatabaseService, visit_service_1.VisitService, visit_db_service_1.VisitDatabaseService, interest_service_1.InterestService, interest_db_service_1.InterestDatabaseService, contract_service_1.ContractService, shelf_service_1.ShelfService],
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
            page_1.Page,
            shelf_service_1.ShelfService])
    ], MainComponent);
    return MainComponent;
}());
exports.MainComponent = MainComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYWluLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUEwRDtBQUMxRCxvQ0FBc0M7QUFDdEMsaURBQWdEO0FBQ2hELDBDQUFpRDtBQUNqRCxzREFBK0Q7QUFDL0QsMENBQTZEO0FBQzdELHFDQUFzQztBQU10Qyw0RUFBNEU7QUFDNUUsdUZBQXVGO0FBQ3ZGLGtFQUFnRTtBQUNoRSx3RUFBMkU7QUFDM0UsMkVBQXlFO0FBQ3pFLGlGQUFvRjtBQUNwRixxRUFBbUU7QUFDbkUsMkVBQThFO0FBQzlFLDJFQUF5RTtBQUV6RSxrREFBNEU7QUFDNUUsa0VBQWdFO0FBRWhFLDRFQUE0RTtBQUM1RSwyRUFNcUM7QUFDckMsSUFBSSxhQUFhLEdBQUcsSUFBSSwyQ0FBYSxFQUFFLENBQUM7QUFJeEMscUNBQXFDO0FBQ3JDLHFEQUFvRDtBQUNwRCxrREFBaUQ7QUFDakQsMkRBQTBEO0FBRTFELDBDQUE0QztBQUc1QywrQ0FBK0M7QUFDL0MsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFFbEQsbUJBQW1CO0FBQ25CLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQ3BELHNEQUF3RDtBQWF4RDtJQXNERTtJQUNFLDRDQUE0QztJQUM1Qyw0REFBNEQ7SUFDcEQsYUFBNEIsRUFDNUIscUJBQTRDLEVBQzVDLFlBQTBCLEVBQzFCLG9CQUEwQyxFQUMxQyxlQUFnQyxFQUNoQyx1QkFBZ0QsRUFDaEQsZUFBZ0MsRUFDaEMsS0FBcUIsRUFDckIsTUFBd0IsRUFDeEIsY0FBOEIsRUFDOUIsSUFBWSxFQUNaLElBQVUsRUFDVixZQUEwQjtRQVoxQixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QiwwQkFBcUIsR0FBckIscUJBQXFCLENBQXVCO1FBQzVDLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQzFCLHlC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RSxvREFBc0IsQ0FBQyxTQUFTO29CQUNqRCxPQUFPLEVBQUUsV0FBVztpQkFDckI7Z0JBQ0Q7b0JBQ0UsSUFBSSxFQUFFLE1BQU07b0JBQ1osV0FBVyxFQUFFLGdEQUFrQixDQUFDLFFBQVE7b0JBQ3hDLGVBQWUsRUFBRSxvREFBc0IsQ0FBQyxTQUFTO29CQUNqRCxPQUFPLEVBQUUsV0FBVztpQkFDckI7YUFBQztTQUNMLENBQUM7UUFDRixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUVuQyxDQUFDO0lBQ00saUNBQVMsR0FBaEIsVUFBaUIsS0FBSztRQUNwQixlQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakIsQ0FBQztJQWpwQ1UsYUFBYTtRQVR6QixnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLE1BQU07WUFDaEIsU0FBUyxFQUFFLENBQUUsOEJBQWEsRUFBRSx5Q0FBcUIsRUFBRSw0QkFBWSxFQUFFLHVDQUFvQixFQUFFLGtDQUFlLEVBQUUsNkNBQXVCLEVBQUUsa0NBQWUsRUFBRSw0QkFBWSxDQUFDO1lBQy9KLDJFQUEyRTtZQUMzRSxpREFBaUQ7WUFDakQsV0FBVyxFQUFFLHNCQUFzQjtZQUNuQyxTQUFTLEVBQUMsQ0FBQyw0QkFBNEIsQ0FBQztTQUMzQyxDQUFDO3lDQTJEeUIsOEJBQWE7WUFDTCx5Q0FBcUI7WUFDOUIsNEJBQVk7WUFDSix1Q0FBb0I7WUFDekIsa0NBQWU7WUFDUCw2Q0FBdUI7WUFDL0Isa0NBQWU7WUFDekIsdUJBQWM7WUFDYix5QkFBZ0I7WUFDUixpQkFBYztZQUN4QixhQUFNO1lBQ04sV0FBSTtZQUNJLDRCQUFZO09BckV6QixhQUFhLENBa3BDekI7SUFBRCxvQkFBQztDQUFBLEFBbHBDRCxJQWtwQ0M7QUFscENZLHNDQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIE5nWm9uZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgKiBhcyBkaWFsb2dzIGZyb20gXCJ1aS9kaWFsb2dzXCI7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvdWkvcGFnZVwiO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUgfSBmcm9tIFwiQGFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQgeyBSb3V0ZXJFeHRlbnNpb25zIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgTG9jYXRpb24gYXMgTG9jYXRpb25Db21tb24gfSBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uXCI7XG5pbXBvcnQgeyBvcGVuVXJsIH0gZnJvbSBcInV0aWxzL3V0aWxzXCI7XG5cbmltcG9ydCB7IFVzZXIgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3VzZXIvdXNlclwiO1xuaW1wb3J0IHsgTG9jYXRpb24gfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2xvY2F0aW9uL2xvY2F0aW9uXCI7XG5pbXBvcnQgeyBDb250cmFjdCB9IGZyb20gXCIuLi8uLi9zaGFyZWQvY29udHJhY3QvY29udHJhY3RcIjtcblxuLy8gaW1wb3J0IHsgTG9jYXRpb25TZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9sb2NhdGlvbi9sb2NhdGlvbi5zZXJ2aWNlXCI7XG4vLyBpbXBvcnQgeyBMb2NhdGlvbkRhdGFiYXNlU2VydmljZSB9IGZyb20gJy4uLy4uL3NoYXJlZC9sb2NhdGlvbi9sb2NhdGlvbi5kYi5zZXJ2aWNlJztcbmltcG9ydCB7IFZpc2l0U2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvdmlzaXQvdmlzaXQuc2VydmljZVwiO1xuaW1wb3J0IHsgVmlzaXREYXRhYmFzZVNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3Zpc2l0L3Zpc2l0LmRiLnNlcnZpY2VcIjtcbmltcG9ydCB7IEludGVyZXN0U2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvaW50ZXJlc3QvaW50ZXJlc3Quc2VydmljZVwiO1xuaW1wb3J0IHsgSW50ZXJlc3REYXRhYmFzZVNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2ludGVyZXN0L2ludGVyZXN0LmRiLnNlcnZpY2VcIjtcbmltcG9ydCB7IEJlYWNvblNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2JlYWNvbi9iZWFjb24uc2VydmljZVwiO1xuaW1wb3J0IHsgQmVhY29uRGF0YWJhc2VTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9iZWFjb24vYmVhY29uLmRiLnNlcnZpY2VcIjtcbmltcG9ydCB7IENvbnRyYWN0U2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvY29udHJhY3QvY29udHJhY3Quc2VydmljZVwiO1xuXG5pbXBvcnQgeyBTaGVsZiwgUHJvZHVjdCwgUHJvZHVjdHNCeVJlbWFyayB9IGZyb20gXCIuLi8uLi9zaGFyZWQvc2hlbGYvc2hlbGZcIjtcbmltcG9ydCB7IFNoZWxmU2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvc2hlbGYvc2hlbGYuc2VydmljZVwiO1xuXG4vLyBpbXBvcnQgeyBDRkFsZXJ0RGlhbG9nSGVscGVyIH0gZnJvbSBcIi4uLy4uL2hlbHBlcnMvY2ZhbGVydGRpYWxvZy1oZWxwZXJcIjtcbmltcG9ydCB7XG4gIENGQWxlcnREaWFsb2csXG4gIERpYWxvZ09wdGlvbnMsXG4gIENGQWxlcnRBY3Rpb25BbGlnbm1lbnQsXG4gIENGQWxlcnRBY3Rpb25TdHlsZSxcbiAgQ0ZBbGVydFN0eWxlXG59IGZyb20gXCJuYXRpdmVzY3JpcHQtY2ZhbGVydC1kaWFsb2dcIjtcbmxldCBjZmFsZXJ0RGlhbG9nID0gbmV3IENGQWxlcnREaWFsb2coKTtcblxuaW1wb3J0ICogYXMgYXBwbGljYXRpb24gZnJvbSAnYXBwbGljYXRpb24nO1xuaW1wb3J0IHsgQW5kcm9pZEFwcGxpY2F0aW9uLCBBbmRyb2lkQWN0aXZpdHlCYWNrUHJlc3NlZEV2ZW50RGF0YSB9IGZyb20gXCJhcHBsaWNhdGlvblwiO1xuaW1wb3J0IHsgaXNBbmRyb2lkIH0gZnJvbSBcInBsYXRmb3JtXCI7XG5pbXBvcnQgeyBCZWFjb24gfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2JlYWNvbi9iZWFjb25cIjtcbmltcG9ydCB7IFZpc2l0IH0gZnJvbSBcIi4uLy4uL3NoYXJlZC92aXNpdC92aXNpdFwiO1xuaW1wb3J0IHsgSW50ZXJlc3QgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2ludGVyZXN0L2ludGVyZXN0XCI7XG5cbmltcG9ydCAqIGFzIFRvYXN0IGZyb20gJ25hdGl2ZXNjcmlwdC10b2FzdCc7XG5cblxuLy8gaW1wb3J0IHsgc3RvcmFnZSB9IGZyb20gXCIuLi8uLi91dGlscy9sb2NhbFwiO1xudmFyIGFwcFNldHRpbmdzID0gcmVxdWlyZShcImFwcGxpY2F0aW9uLXNldHRpbmdzXCIpO1xuXG4vLyBlc3RpbW90ZSBiZWFjb25zXG52YXIgRXN0aW1vdGUgPSByZXF1aXJlKFwibmF0aXZlc2NyaXB0LWVzdGltb3RlLXNka1wiKTtcbmltcG9ydCAqIGFzIFBlcm1pc3Npb25zIGZyb20gXCJuYXRpdmVzY3JpcHQtcGVybWlzc2lvbnNcIjtcbmRlY2xhcmUgdmFyIGFuZHJvaWQ6IGFueTtcbiBcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwibWFpblwiLFxuICAgIHByb3ZpZGVyczogWyBCZWFjb25TZXJ2aWNlLCBCZWFjb25EYXRhYmFzZVNlcnZpY2UsIFZpc2l0U2VydmljZSwgVmlzaXREYXRhYmFzZVNlcnZpY2UsIEludGVyZXN0U2VydmljZSwgSW50ZXJlc3REYXRhYmFzZVNlcnZpY2UsIENvbnRyYWN0U2VydmljZSwgU2hlbGZTZXJ2aWNlXSxcbiAgICAvLyBwcm92aWRlcnM6IFtMb2NhdGlvblNlcnZpY2UsIExvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlLCBDb250cmFjdFNlcnZpY2VdLCBcbiAgICAvLyBwcm92aWRlcnM6IFtMb2NhdGlvblNlcnZpY2UsIENvbnRyYWN0U2VydmljZV0sXG4gICAgdGVtcGxhdGVVcmw6IFwicGFnZXMvbWFpbi9tYWluLmh0bWxcIixcbiAgICBzdHlsZVVybHM6W1wicGFnZXMvbWFpbi9tYWluLWNvbW1vbi5jc3NcIl0gXG59KVxuXG5leHBvcnQgY2xhc3MgTWFpbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdHtcblxuICAvLyBwcml2YXRlIHZhcmlhYmxlc1xuICBwcml2YXRlIF9jdXJyZW50X2xvY2F0aW9uOiBMb2NhdGlvbjtcbiAgcHJpdmF0ZSBsb2NhdGlvbl9pZDogc3RyaW5nO1xuICAvLyBwcml2YXRlIF9hbGxfbG9jYXRpb25zOiBBcnJheTxMb2NhdGlvbj47XG4gIHByaXZhdGUgX25hbWUgPSBcImNhcmxvc1wiO1xuICBwcml2YXRlIF9jb250cmFjdDogQ29udHJhY3Q7XG4gIC8vIHByaXZhdGUgX2xvY2F0aW9uX2RhdGFiYXNlOiBhbnk7XG4gIHByaXZhdGUgX2xvY2F0aW9uc19pbl9kYjogQXJyYXk8TG9jYXRpb24+O1xuICAvLyBwcml2YXRlIF9sb2NhdGlvbl9pZDogbnVtYmVyO1xuICBwcml2YXRlIF93YXRjaF9sb2NhdGlvbl9pZDogYW55O1xuICBwcml2YXRlIF9jdXN0b21lcl9pZDogbnVtYmVyO1xuXG4gIC8vIHB1YmxpYyB2YXJpYWJsZXNcbiAgcHVibGljIHRpdGxlOiBzdHJpbmc7XG5cbiAgLy8gYWxlcnRcbiAgLy8gcHVibGljIGNmYWxlcnREaWFsb2dIZWxwZXI6ICBDRkFsZXJ0RGlhbG9nSGVscGVyO1xuICBwcml2YXRlIGNmYWxlcnREaWFsb2c6IENGQWxlcnREaWFsb2c7XG5cbiAgLy8gYnV0dG9uIGZsYWdzXG4gIC8vIHB1YmxpYyBpbkxvY2F0aW9uID0gZmFsc2U7XG4gIHB1YmxpYyBpc0N1cnJlbnRMb2NhdGlvbiA9IGZhbHNlO1xuICBwdWJsaWMgaXNBbGxMb2NhdGlvbnMgPSBmYWxzZTtcbiAgcHVibGljIGlzQnVzeSA9IGZhbHNlO1xuICBwdWJsaWMgY2FuQ29udHJhY3QgPSBmYWxzZTtcbiAgcHVibGljIGhhc0NvbnRyYWN0ID0gZmFsc2U7XG4gIHB1YmxpYyBleHBpcmF0aW9uVGV4dCA9IFwiXCI7XG4gIHB1YmxpYyBhdFN0b3JlID0gXCJAU3RyZWV0XCI7XG4gIHB1YmxpYyBzaGVsZkluZm8gPSBmYWxzZTtcbiAgcHVibGljIHNoZWxmSW5mb1NlZW4gPSBbXTtcbiAgLy8gcHVibGljIGNvbnRhaW5lcjogU2hlbGY7XG4gIC8vIHB1YmxpYyBjb250YWluZXJQcm9kdWN0czogUHJvZHVjdFtdO1xuICBwdWJsaWMgY29udGFpbmVyUHJvZHVjdHNSOiBQcm9kdWN0W107XG4gIHB1YmxpYyBjb250YWluZXJQcm9kdWN0c086IFByb2R1Y3RbXTtcbiAgLy8gcHVibGljIHByb2R1Y3RzQnlSZW1hcmtMaXN0OiBQcm9kdWN0c0J5UmVtYXJrW107XG4gIC8vIHB1YmxpYyByZW1hcmtzID0gW107XG4gIHB1YmxpYyBzdG9yZUljb25zID0gW1xuICAgIHtcImljb25cIjpTdHJpbmcuZnJvbUNoYXJDb2RlKDB4ZjA4NSksXCJjb2xvclwiOlwicmVkXCJ9LFxuICAgIHtcImljb25cIjpTdHJpbmcuZnJvbUNoYXJDb2RlKDB4ZjA4YiksXCJjb2xvclwiOlwiYmx1ZVwifVxuICBdO1xuXG4gIC8vIEJlYWNvbiB2YXJpYWJsZVxuICBwdWJsaWMgZXN0aW1vdGU6IGFueTtcbiAgcHVibGljIG9wdGlvbnM6IGFueTtcbiAgcHVibGljIGN1cnJlbnRCZWFjb25zOiBBcnJheTxCZWFjb24+O1xuICBwdWJsaWMgcGVybWlzc2lvbnM6IGFueTtcblxuICAvLyBJY29uc1xuICBwdWJsaWMgZ2VhcnNJY29uID0gU3RyaW5nLmZyb21DaGFyQ29kZSgweGYwODUpO1xuICBwdWJsaWMgbG9nb3V0SWNvbiA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMHhmMDhiKTtcbiAgcHVibGljIGhhbmRzaGFrZUljb24gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4ZjJiNSk7XG4gIFxuICBjb25zdHJ1Y3RvcihcbiAgICAvLyBwcml2YXRlIGxvY2F0aW9uU2VydmljZTogTG9jYXRpb25TZXJ2aWNlLFxuICAgIC8vIHByaXZhdGUgbG9jYXRpb25EYXRhYmFzZVNlcnZpY2U6IExvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlLFxuICAgIHByaXZhdGUgYmVhY29uU2VydmljZTogQmVhY29uU2VydmljZSxcbiAgICBwcml2YXRlIGJlYWNvbkRhdGFiYXNlU2VydmljZTogQmVhY29uRGF0YWJhc2VTZXJ2aWNlLFxuICAgIHByaXZhdGUgdmlzaXRTZXJ2aWNlOiBWaXNpdFNlcnZpY2UsXG4gICAgcHJpdmF0ZSB2aXNpdERhdGFiYXNlU2VydmljZTogVmlzaXREYXRhYmFzZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBpbnRlcmVzdFNlcnZpY2U6IEludGVyZXN0U2VydmljZSxcbiAgICBwcml2YXRlIGludGVyZXN0RGF0YWJhc2VTZXJ2aWNlOiBJbnRlcmVzdERhdGFiYXNlU2VydmljZSxcbiAgICBwcml2YXRlIGNvbnRyYWN0U2VydmljZTogQ29udHJhY3RTZXJ2aWNlLFxuICAgIHByaXZhdGUgcm91dGU6IEFjdGl2YXRlZFJvdXRlLFxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXJFeHRlbnNpb25zLFxuICAgIHByaXZhdGUgbG9jYXRpb25Db21tb246IExvY2F0aW9uQ29tbW9uLFxuICAgIHByaXZhdGUgem9uZTogTmdab25lLFxuICAgIHByaXZhdGUgcGFnZTogUGFnZSxcbiAgICBwcml2YXRlIHNoZWxmU2VydmljZTogU2hlbGZTZXJ2aWNlLFxuICAgIC8vIHByaXZhdGUgY2ZhbGVydERpYWxvZzogQ0ZBbGVydERpYWxvZ1xuICApe1xuICAgICAgY29uc29sZS5sb2coXCJNYWluIENvbnN0cnVjdG9yXCIpO1xuICAgICAgLy8gdGhpcy5pc0J1c3kgPSB0cnVlO1xuICAgICAgdGhpcy5fY3VycmVudF9sb2NhdGlvbiA9IG51bGw7XG4gICAgICAvLyB0aGlzLl9hbGxfbG9jYXRpb25zID0gW107XG4gICAgICB0aGlzLl9sb2NhdGlvbnNfaW5fZGIgPSBbXTtcbiAgICAgIC8vIHRoaXMuX2xvY2F0aW9uX2RhdGFiYXNlID0gdGhpcy5sb2NhdGlvbkRhdGFiYXNlU2VydmljZS5nZXREYXRhYmFzZSgpO1xuXG4gICAgICAvLyBCZWFjb25zIGluc3RhbmNlIFxuICAgICAgLy8gdGhpcy5lc3RpbW90ZSA9IG5ldyBFc3RpbW90ZShvcHRpb25zKTtcbiAgICAgIHRoaXMuY3VycmVudEJlYWNvbnMgPSBbXTtcbiAgICAgIC8vIHRoaXMucGVybWlzc2lvbnMgPSBuZXcgUGVybWlzc2lvbnMoKTtcblxuICAgICAgLy8gdGhpcy5jZmFsZXJ0RGlhbG9nSGVscGVyID0gbmV3IENGQWxlcnREaWFsb2dIZWxwZXIoKTtcbiAgICAgIHRoaXMuY2ZhbGVydERpYWxvZyA9IG5ldyBDRkFsZXJ0RGlhbG9nKCk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBjb25zb2xlLmxvZyhcIk1haW4gb24gSW5pdFwiKTtcblxuICAgIC8vIFJldHVybiB0byBsb2dpbiBpZiBhcHAgc2V0dGluZ3MgYXJlIG5vdCBzZXRcbiAgICBpZiAoIWFwcFNldHRpbmdzLmhhc0tleShcInVzZXJfbmFtZVwiKSB8fCAhYXBwU2V0dGluZ3MuaGFzS2V5KFwidXNlcl9wYXNzd29yZFwiKSl7XG4gICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvXCJdKSwgeyBjbGVhckhpc3Rvcnk6IHRydWUgfTtcbiAgICB9XG5cbiAgICAvLyBpZiAoaXNBbmRyb2lkKSB7XG4gICAgLy8gICBhcHBsaWNhdGlvbi5hbmRyb2lkLm9uKEFuZHJvaWRBcHBsaWNhdGlvbi5hY3Rpdml0eUJhY2tQcmVzc2VkRXZlbnQsIChkYXRhOiBBbmRyb2lkQWN0aXZpdHlCYWNrUHJlc3NlZEV2ZW50RGF0YSkgPT4ge1xuICAgIC8vICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvXCJdKSwgeyBjbGVhckhpc3Rvcnk6IHRydWUgfTtcbiAgICAvLyAgICAgLy8gdGhpcy5sb2dvdXQoKTtcbiAgICAvLyAgIH0pO1xuICAgIC8vIH1cblxuICAgIHRoaXMudGl0bGUgPSBcIldlbGNvbWUgXCIrIGFwcFNldHRpbmdzLmdldFN0cmluZyhcInVzZXJfbmFtZVwiKTsgICAgXG5cbiAgICB0cnl7XG4gICAgICB0aGlzLl9jdXN0b21lcl9pZCA9IGFwcFNldHRpbmdzLmdldE51bWJlcihcInVzZXJfaWRcIik7XG4gICAgICBjb25zb2xlLmxvZyhcInRyeWluZyBjdXN0OiBcIit0aGlzLl9jdXN0b21lcl9pZCk7XG4gICAgfWNhdGNoKGUpe1xuICAgICAgdGhpcy5fY3VzdG9tZXJfaWQgPSAwO1xuICAgIH0gICAgICBcbiAgICAgIFxuXG4gICAgLy8gQmVhY29ucyBwcm9jZXNzXG4gICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgcmVnaW9uIDogJ1Byb2dyZXNzJywgLy8gb3B0aW9uYWxcbiAgICAgIGNhbGxiYWNrIDogYmVhY29ucyA9PiB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQmVhY29uczogXCIrYmVhY29ucylcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJBbW91bnQgb2YgQmVhY29ucyBpbiByYW5nZTogXCIrYmVhY29ucy5sZW5ndGgpXG4gICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiQW1vdW50IG9mIEJlYWNvbnMgaW4gcmFuZ2U6IFwiK2JlYWNvbnMubGVuZ3RoKTtcbiAgICAgICAgICBpZihiZWFjb25zLmxlbmd0aD4wKXtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEJlYWNvbnMgPSBbXTtcbiAgICAgICAgICAgIGJlYWNvbnMuZm9yRWFjaChiZWFjb24gPT4ge1xuICAgICAgICAgICAgICBpZihiZWFjb24ubWFqb3Ipe1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGxldCBiID1uZXcgQmVhY29uKGJlYWNvbi5tYWpvci50b1N0cmluZygpLGJlYWNvbi5taW5vci50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkJlYWNvbiBpZGVudGlmaWNhdG9yIFwiK2IuaWRlbnRpZmljYXRvcik7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50QmVhY29ucy5wdXNoKGIpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEJlYWNvbnMgPSBbXTtcbiAgICAgICAgICB9XG5cblxuICAgICAgICAgIC8vIENoZWNrIGZvciBhY3RpdmUgY29udHJhY3RzXG4gICAgICAgICAgY29uc29sZS5sb2coXCIrKysrKysrKysrKysrKysrKysrKysrKysrXCIpO1xuICAgICAgICAgIHRoaXMudmVyaWZ5Q29udHJhY3QoKTtcblxuXG4gICAgICAgICAgLy8gQ2hlY2sgaWYgdXNlciBpcyBpbiBzdG9yZSBvciBqdXN0IHBhc3NpbmcgYnlcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqKioqKioqKioqKipcIik7XG4gICAgICAgICAgdGhpcy52ZXJpZnlWaXNpdCgpO1xuXG4gICAgICAgICAgY29uc29sZS5sb2coXCIuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXCIpO1xuICAgICAgICAgIGlmKHR5cGVvZiB0aGlzLl9jb250cmFjdCAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgdGhpcy5fY29udHJhY3Qub3B0aW9uc1snc2hlbGZfaW5mbyddICE9PSBcInVuZGVmaW5lZFwiICYmIHRoaXMuX2NvbnRyYWN0Lm9wdGlvbnNbJ3NoZWxmX2luZm8nXSl7XG4gICAgICAgICAgICB0aGlzLnZlcmlmeVNoZWxmSW5mbygpO1xuICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGhpcy5zaGVsZkluZm9TZWVuID0gW107XG4gICAgICAgICAgfVxuXG5cbiAgICAgICAgICAvLyBDaGVjayBpZiBiZWhhdmlvdXIgdHJhY2tpbmcgaXMgZW5hYmxlZCBhbmQgdHJhY2tcbiAgICAgICAgICBpZiggdHlwZW9mIHRoaXMuX2NvbnRyYWN0ICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiB0aGlzLl9jb250cmFjdC5vcHRpb25zWydiZWhhdmlvdXJfdHJhY2tpbmcnXSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0aGlzLl9jb250cmFjdC5vcHRpb25zWydiZWhhdmlvdXJfdHJhY2tpbmcnXSl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgICAgICB0aGlzLnZlcmlmeUJlaGF2aW9yKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIFxuICAgICAgfVxuICAgIH1cbiAgICBcblxuICAgIHRoaXMuZXN0aW1vdGUgPSBuZXcgRXN0aW1vdGUodGhpcy5vcHRpb25zKTtcblxuICAgIGlmKGlzQW5kcm9pZCl7XG4gICAgICBjb25zb2xlLmxvZyhcIkl0IGlzIEFuZHJvaWRcIik7XG4gICAgICBQZXJtaXNzaW9ucy5yZXF1ZXN0UGVybWlzc2lvbnMoW1xuICAgICAgICBhbmRyb2lkLk1hbmlmZXN0LnBlcm1pc3Npb24uQUNDRVNTX0NPQVJTRV9MT0NBVElPTixcbiAgICAgICAgYW5kcm9pZC5NYW5pZmVzdC5wZXJtaXNzaW9uLkFDQ0VTU19GSU5FX0xPQ0FUSU9OLFxuICAgICAgICBhbmRyb2lkLk1hbmlmZXN0LnBlcm1pc3Npb24uQkxVRVRPT1RILFxuICAgICAgICBhbmRyb2lkLk1hbmlmZXN0LnBlcm1pc3Npb24uQkxVRVRPT1RIX0FETUlOXSwgXCJQZXJtaXNzaW9ucyBvZiBTdXJ0cmFkZVwiKVxuICAgICAgLnRoZW4oKCk9PntcbiAgICAgICAgY29uc29sZS5sb2coXCJQZXJtaXNzaW9ucyBncmFudGVkXCIpO1xuICAgICAgICB0aGlzLmVzdGltb3RlLnN0YXJ0UmFuZ2luZygpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlN0YXJ0IHJhbmdpbmdcIik7XG4gICAgICB9KS5jYXRjaCgoZXJyb3IpPT57XG4gICAgICAgIGFsZXJ0KFwiRXJyb3IgZ2V0dGluZyBwZXJtaXNzaW9uczogXCIrZXJyb3IubWVzc2FnZSk7XG4gICAgICB9KTtcbiAgICB9ZWxzZXtcbiAgICAgIGNvbnNvbGUubG9nKFwiSXQgaXMgaU9TXCIpO1xuICAgICAgdGhpcy5lc3RpbW90ZS5zdGFydFJhbmdpbmcoKTtcbiAgICAgIGNvbnNvbGUubG9nKFwiU3RhcnQgcmFuZ2luZ1wiKTtcbiAgICB9XG5cbiAgICAvLyBMb2NhdGlvbiByZWZhY3RvclxuICAgIC8vIENyZWF0ZXMgREIgaWYgbm90IGV4aXN0XG4gICAgLy8gdGhpcy5sb2NhdGlvbkRhdGFiYXNlU2VydmljZS5jcmVhdGVUYWJsZSgpO1xuXG4gICAgLy9VcGRhdGVzIHRoZSBsb2NhdGlvbnMgREIsIHRoaXMgc2hvdWxkIG5vdCBiZSBkb25lIGV2ZXJ5IHRpbWUsIGJ1dCByYXRoZXIgb25jZSBldmVyeSBkYXlcbiAgICAvLyBpZih0aGlzLmlzTG9jYXRpb25EYXRhYmFzZUVtcHR5KCkpe1xuICAgIC8vICAgdGhpcy51cGRhdGVMb2NhdGlvbkRhdGFiYXNlKCk7XG4gICAgLy8gfVxuXG4gICAgLy8gRXh0cmFjdHMgbG9jYXRpb25zIGZyb20gREJcbiAgICAvLyB0aGlzLl9sb2NhdGlvbnNfaW5fZGIgPSB0aGlzLmxvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlLnNlbGVjdEFsbExvY2F0aW9ucygpO1xuICAgIC8vIC8vIFN0YXJ0IHdhdGNoaW5nIGZvciBsb2NhdGlvblxuICAgIC8vIC8vIHRoaXMuX3dhdGNoX2xvY2F0aW9uX2lkID0gdGhpcy5sb2NhdGlvblNlcnZpY2Uuc3RhcnRXYXRjaGluZ0xvY2F0aW9uKCk7XG5cblxuICAgIC8vIENyZWF0ZXMgREIgaWYgbm90IGV4aXN0XG4gICAgLy8gdGhpcy5iZWFjb25EYXRhYmFzZVNlcnZpY2UuZHJvcFRhYmxlKCk7XG4gICAgdGhpcy5iZWFjb25EYXRhYmFzZVNlcnZpY2UuY3JlYXRlVGFibGUoKTtcbiAgICB0aGlzLnZpc2l0RGF0YWJhc2VTZXJ2aWNlLmNyZWF0ZVRhYmxlKCk7XG4gICAgdGhpcy5pbnRlcmVzdERhdGFiYXNlU2VydmljZS5jcmVhdGVUYWJsZSgpO1xuXG4gICAgLy9VcGRhdGVzIHRoZSBEQiwgdGhpcyBzaG91bGQgbm90IGJlIGRvbmUgZXZlcnkgdGltZSwgYnV0IHJhdGhlciBvbmNlIGV2ZXJ5IGRheVxuICAgIGlmKHRoaXMuaXNCZWFjb25EYXRhYmFzZUVtcHR5KCkpe1xuICAgICAgY29uc29sZS5sb2coXCJMb2NhbCBEQiBpcyBlbXB0eS5cIik7XG4gICAgICB0aGlzLnVwZGF0ZUJlYWNvbkRhdGFiYXNlKCk7XG4gICAgfWVsc2V7XG4gICAgICAvLyBEZWxldGU6IG5leHQgbGluZSBzaG91bGQgYmUgdXNlZCBvbmx5IHBlcmlvZGljYWxseS5cbiAgICAgIC8vIHRoaXMudXBkYXRlQmVhY29uRGF0YWJhc2UoKTtcbiAgICAgIGNvbnNvbGUubG9nKFwiTG9jYWwgREIgaGFzIGRhdGEuXCIpO1xuICAgIH1cblxuICAgIHRoaXMucGFnZS5vbignbmF2aWdhdGluZ0Zyb20nLCAoZGF0YSkgPT4ge1xuICAgICAgLy8gcnVuIGRlc3Ryb3kgY29kZVxuICAgICAgLy8gKG5vdGU6IHRoaXMgd2lsbCBydW4gd2hlbiB5b3UgZWl0aGVyIG1vdmUgZm9yd2FyZCB0byBhIG5ldyBwYWdlIG9yIGJhY2sgdG8gdGhlIHByZXZpb3VzIHBhZ2UpXG4gICAgICAvLyBCZWFjb25zIHN0b3BcbiAgICAgIHRoaXMuZXN0aW1vdGUuc3RvcFJhbmdpbmcoKTtcbiAgICAgIGNvbnNvbGUubG9nKFwiU3RvcCByYW5naW5nXCIpO1xuICAgIH0pO1xuXG4gIH1cblxuICBwdWJsaWMgbmdPbkRlc3Ryb3koKSB7XG4gICAgLy9DYWxsZWQgb25jZSwgYmVmb3JlIHRoZSBpbnN0YW5jZSBpcyBkZXN0cm95ZWQuXG4gICAgLy8gTG9jYXRpb24gcmVmYWN0b3JcbiAgICAvLyB0aGlzLmxvY2F0aW9uU2VydmljZS5zdG9wV2F0Y2hpbmdMb2NhdGlvbih0aGlzLl93YXRjaF9sb2NhdGlvbl9pZClcblxuICAgIC8vIC8vIEJlYWNvbnMgc3RvcFxuICAgIC8vIHRoaXMuZXN0aW1vdGUuc3RvcFJhbmdpbmcoKTtcbiAgICAvLyBjb25zb2xlLmxvZyhcIlN0b3AgcmFuZ2luZ1wiKTtcblxuICAgIC8vIHRoaXMudmVyaWZ5VmlzaXQoKTtcbiAgICAvLyB0aGlzLnZlcmlmeUJlaGF2aW9yKCk7XG4gICAgXG4gIH1cblxuICBwdWJsaWMgY29udHJhY3RTZXR0aW5ncygpe1xuICAgIC8vIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9jb250cmFjdC1jcmVhdGUvXCIrdGhpcy5fY3VycmVudF9sb2NhdGlvbi5pZCtcIi8xXCJdLCB7XG4gICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL2NvbnRyYWN0LWNyZWF0ZVwiLHRoaXMubG9jYXRpb25faWQsMV0sIHtcbiAgICAgIC8vIGFuaW1hdGlvbjogdHJ1ZSxcbiAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICBuYW1lOiBcInNsaWRlTGVmdFwiLFxuICAgICAgICAgIGR1cmF0aW9uOiAyMDAsXG4gICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBjcmVhdGVDb250cmFjdCgpe1xuXG4gICAgbGV0IHN0b3JlcyA9IHRoaXMubmVhcmJ5U3RvcmVzKCk7XG4gICAgbGV0IHN0b3JlX25hbWVzID0gW107XG4gICAgLy8gbGV0IGxvY2F0aW9uX2lkcyA9IFtdO1xuXG4gICAgc3RvcmVzLmZvckVhY2goc3RvcmUgPT4geyBcbiAgICAgIHN0b3JlX25hbWVzLnB1c2goc3RvcmUubmFtZSk7XG4gICAgICAvLyBsb2NhdGlvbl9pZHMucHVzaChzdG9yZS5sb2NhdGlvbl9pZCk7XG4gICAgIH0pO1xuXG4gICAgZGlhbG9ncy5hY3Rpb24oe1xuICAgICAgbWVzc2FnZTogXCJTZWxlY3QgU3RvcmVcIixcbiAgICAgIGNhbmNlbEJ1dHRvblRleHQ6IFwiQ2FuY2VsXCIsXG4gICAgICBhY3Rpb25zOiBzdG9yZV9uYW1lc1xuICAgIH0pLnRoZW4obmFtZSA9PiB7XG4gICAgICBzdG9yZXMuZm9yRWFjaChzdG9yZSA9PiB7IFxuICAgICAgICBpZihzdG9yZS5uYW1lID09IG5hbWUpe1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiR29pbmcgdG8gY3JlYXRlIGNvbnRyYWN0LlwiKTtcbiAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvY29udHJhY3QtY3JlYXRlXCIsc3RvcmUubG9jYXRpb25faWQsMF0sIHtcbiAgICAgICAgICAgIC8vIGFuaW1hdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlTGVmdFwiLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAyMDAsXG4gICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgIH0pO1xuICAgIH0pO1xuICAgIFxuICB9XG5cbiAgcHVibGljIGxvZ291dCgpe1xuICAgIGFwcFNldHRpbmdzLnJlbW92ZShcInVzZXJfbmFtZVwiKTtcbiAgICBhcHBTZXR0aW5ncy5yZW1vdmUoXCJ1c2VyX3Bhc3N3b3JkXCIpO1xuXG4gICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL1wiXSwgeyBjbGVhckhpc3Rvcnk6IHRydWUgfSk7XG4gIH1cblxuICAvLyBMb2NhdGlvbiByZWZhY3RvclxuICAvLyB2ZXJpZnlDb250cmFjdCgpe1xuICAvLyAgIHRoaXMuaXNCdXN5ID0gdHJ1ZTtcbiAgLy8gICB0aGlzLmxvY2F0aW9uU2VydmljZS5nZXRDdXJyZW50TG9jYXRpb24oKVxuICAvLyAgICAgLnRoZW4oKGxvY2F0aW9uOiBMb2NhdGlvbikgPT4ge1xuICAvLyAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAvLyAgICAgICBpZihsb2NhdGlvbiAhPSB1bmRlZmluZWQpe1xuICAvLyAgICAgICAgIHRoaXMuX2N1cnJlbnRfbG9jYXRpb24gPSBsb2NhdGlvbjtcbiAgLy8gICAgICAgICB0aGlzLmlzQ3VycmVudExvY2F0aW9uID0gdHJ1ZTtcblxuICAvLyAgICAgICAgIGNvbnNvbGUubG9nKFwiZ290dGVuIGxvY2F0aW9uLCBsYXQ6IFwiK2xvY2F0aW9uLmxhdCtcIiwgbG5nOiBcIitsb2NhdGlvbi5sbmcpO1xuICAgICAgICBcbiAgLy8gICAgICAgICB0aGlzLl9sb2NhdGlvbnNfaW5fZGIuZm9yRWFjaChsb2NhdGlvbiA9PntcbiAgICAgICAgXG4gIC8vICAgICAgICAgICBpZiAoKGxvY2F0aW9uLm5lX2xhdCA+PSB0aGlzLl9jdXJyZW50X2xvY2F0aW9uLmxhdCAmJiBsb2NhdGlvbi5uZV9sbmcgPj0gdGhpcy5fY3VycmVudF9sb2NhdGlvbi5sbmcpIFxuICAvLyAgICAgICAgICAgICAmJiAobG9jYXRpb24uc3dfbGF0IDw9IHRoaXMuX2N1cnJlbnRfbG9jYXRpb24ubGF0ICYmIGxvY2F0aW9uLnN3X2xuZyA8PSB0aGlzLl9jdXJyZW50X2xvY2F0aW9uLmxuZykgKXtcbiAgLy8gICAgICAgICAgICAgICB0aGlzLmNhbkNvbnRyYWN0ID0gdHJ1ZTtcbiAgLy8gICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImluIGxvY2F0aW9uOiBcIisgbG9jYXRpb24ubmFtZSk7XG4gIC8vICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudF9sb2NhdGlvbiA9IGxvY2F0aW9uO1xuXG4gIC8vICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb29raW5nIGZvciBhIGNvbnRyYWN0IGJldHdlZW4gbG9jYXRpb246IFwiKyB0aGlzLl9jdXJyZW50X2xvY2F0aW9uLmlkK1wiIGFuZCBjdXN0b21lciBcIiArdGhpcy5fY3VzdG9tZXJfaWQpO1xuICAvLyAgICAgICAgICAgICAgIHRoaXMuY29udHJhY3RTZXJ2aWNlLmdldEFjdGl2ZUNvbnRyYWN0KHRoaXMuX2N1cnJlbnRfbG9jYXRpb24uaWQsIHRoaXMuX2N1c3RvbWVyX2lkKVxuICAvLyAgICAgICAgICAgICAgICAgLnN1YnNjcmliZShyZXNwb25zZUNvbnRyYWN0ID0+IHtcbiAgLy8gICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ5b3UgaGF2ZSBhIGNvbnRyYWN0IC0tMi4xLCBzdGF0dXM6IFwiK3Jlc3BvbnNlQ29udHJhY3Quc3RhdHVzKTtcbiAgLy8gICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ5b3UgaGF2ZSBhIGNvbnRyYWN0IC0tMi4xLCBtZXNzYWdlOiBcIityZXNwb25zZUNvbnRyYWN0Lm1lc3NhZ2UpO1xuICAvLyAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3BvbnNlQ29udHJhY3QubWVzc2FnZSl7XG4gIC8vICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ5b3UgaGF2ZSBhIGNvbnRyYWN0OiBcIityZXNwb25zZUNvbnRyYWN0LnN0YXR1cyk7XG4gIC8vICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29udHJhY3QgPSByZXNwb25zZUNvbnRyYWN0O1xuICAvLyAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FuQ29udHJhY3QgPSBmYWxzZTtcbiAgLy8gICAgICAgICAgICAgICAgICAgICB0aGlzLmhhc0NvbnRyYWN0ID0gdHJ1ZTtcbiAgLy8gICAgICAgICAgICAgICAgICAgfVxuICAvLyAgICAgICAgICAgICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAvLyAgICAgICAgICAgICAgICAgfSxlcnJvciA9PiB7XG4gIC8vICAgICAgICAgICAgICAgICAgIGlmIChlcnJvci5zdGF0dXMgPT0gNDA0KXtcbiAgICAgICAgICAgICAgICAgICAgICBcbiAgLy8gICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbkNvbnRyYWN0ID0gdHJ1ZTtcbiAgLy8gICAgICAgICAgICAgICAgICAgICB0aGlzLmhhc0NvbnRyYWN0ID0gZmFsc2U7XG4gIC8vICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAvLyAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgZ2V0dGluZyBhY3RpdmUgY29udHJhY3QgaW5mb3JtYXRpb246IFwiK2Vycm9yKTtcbiAgLy8gICAgICAgICAgICAgICAgICAgfVxuICAvLyAgICAgICAgICAgICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBcbiAgLy8gICAgICAgICAgICAgICAgIH0pO1xuICAvLyAgICAgICAgICAgICB9XG4gIC8vICAgICAgICAgfSk7XG4gIC8vICAgICAgIH1cbiAgLy8gICAgICAgZWxzZXtcbiAgLy8gICAgICAgICB0aHJvdyBcIkxvY2F0aW9uIG5vdCBmb3VuZFwiO1xuICAvLyAgICAgICB9IFxuICAvLyAgICAgfVxuICAvLyAgICAgKS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgLy8gICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgLy8gICAgICAgYWxlcnQoZXJyb3IpXG4gIC8vICAgICB9KTtcbiAgLy8gfVxuXG4gIG5lYXJieVN0b3Jlcygpe1xuICAgIGNvbnNvbGUubG9nKFwiQ2hlY2tpbmcgbmVhcmJ5IHN0b3Jlcy4uXCIpO1xuICAgIGxldCBzdG9yZXM6IEFycmF5PEJlYWNvbj4gPSBbXTtcbiAgICAvLyB0aGlzLmJlYWNvbkRhdGFiYXNlU2VydmljZS5zZWxlY3RBbGxCZWFjb25zKFwid2hlcmUgcm9sZT1zdG9yZVwiKS5mb3JFYWNoKHN0b3JlREI9PntcbiAgICB0aGlzLmJlYWNvbkRhdGFiYXNlU2VydmljZS5zZWxlY3RCZWFjb25zKFwic3RvcmVcIikuZm9yRWFjaChzdG9yZURCPT57XG4gICAgICAvLyBjb25zb2xlLmxvZyhcInN0b3JlREIgaWRlbjogXCIrc3RvcmVEQi5pZGVudGlmaWNhdG9yKTtcbiAgICAgIHRoaXMuY3VycmVudEJlYWNvbnMuZm9yRWFjaChiZWFjb25DdXJyZW50PT57XG4gICAgICAgIGNvbnNvbGUubG9nKFwiYmVhY29uQ3VycmVudCBpZGVuOiBcIitiZWFjb25DdXJyZW50LmlkZW50aWZpY2F0b3IpO1xuICAgICAgICBpZihzdG9yZURCLmlkZW50aWZpY2F0b3I9PWJlYWNvbkN1cnJlbnQuaWRlbnRpZmljYXRvcil7XG4gICAgICAgICAgc3RvcmVzLnB1c2goc3RvcmVEQik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgICAgXG4gICAgcmV0dXJuIHN0b3JlcztcbiAgfVxuXG4gIG5lYXJieUl0ZW1zKCl7XG4gICAgbGV0IGl0ZW1zOiBBcnJheTxCZWFjb24+ID0gW107XG4gICAgdGhpcy5iZWFjb25EYXRhYmFzZVNlcnZpY2Uuc2VsZWN0QmVhY29ucyhcIml0ZW1cIiwgdGhpcy5sb2NhdGlvbl9pZCkuZm9yRWFjaChpdGVtREI9PntcbiAgICAgIHRoaXMuY3VycmVudEJlYWNvbnMuZm9yRWFjaChiZWFjb25DdXJyZW50PT57XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiYmVhY29uIGRiOiBcIitpdGVtREIuaWRlbnRpZmljYXRvcik7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiYmVhY29uIGN1cnJlbnQ6IFwiK2JlYWNvbkN1cnJlbnQuaWRlbnRpZmljYXRvcik7XG4gICAgICAgIGlmKGl0ZW1EQi5pZGVudGlmaWNhdG9yPT1iZWFjb25DdXJyZW50LmlkZW50aWZpY2F0b3Ipe1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiTmVhcmJ5IGl0ZW06IFwiK2l0ZW1EQi5uYW1lKTtcbiAgICAgICAgICBpdGVtcy5wdXNoKGl0ZW1EQik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgICAgXG4gICAgcmV0dXJuIGl0ZW1zO1xuICB9XG4gIGRhdGVGb3JtYXR0ZXIoZGF0ZTogRGF0ZSl7XG4gICAgcmV0dXJuIGRhdGUuZ2V0RnVsbFllYXIoKStcIi1cIitkYXRlLmdldE1vbnRoKCkrXCItXCIrZGF0ZS5nZXREYXRlKCkrXCIgXCIrZGF0ZS5nZXRIb3VycygpK1wiOlwiK2RhdGUuZ2V0TWludXRlcygpK1wiOlwiK2RhdGUuZ2V0U2Vjb25kcygpXG4gIH1cblxuICB2ZXJpZnlTaGVsZkluZm8oKXtcbiAgICAvLyBjb25zb2xlLmxvZyhcIlZlcmlmeWluZyBzaGVsZiBpbmZvLi5cIik7XG4gICAgbGV0IG5lYXJieUl0ZW1zID0gdGhpcy5uZWFyYnlJdGVtcygpO1xuICAgIC8vIGNvbnNvbGUubG9nKFwiU2hlbGZzIG5lYXJieTogXCIrbmVhcmJ5SXRlbXMubGVuZ3RoKTtcbiAgICBpZiAobmVhcmJ5SXRlbXMubGVuZ3RoPjApe1xuICAgICAgXG4gICAgICAvLyBjb25zb2xlLmxvZyhcIlNoZWxmcyBzZWVuOiBcIit0aGlzLnNoZWxmSW5mb1NlZW4gKTtcbiAgICAgIG5lYXJieUl0ZW1zLmZvckVhY2goaXRlbT0+e1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlNoZWxmOiBcIitpdGVtLmlkZW50aWZpY2F0b3IpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlNoZWxmIGluZGV4OiBcIit0aGlzLnNoZWxmSW5mb1NlZW4uaW5kZXhPZihpdGVtLmlkZW50aWZpY2F0b3IpKTtcbiAgICAgICAgaWYgKHRoaXMuc2hlbGZJbmZvU2Vlbi5pbmRleE9mKGl0ZW0uaWRlbnRpZmljYXRvcik9PS0xKXtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlNoZWxmIGluZm8gYXZhaWxhYmxlIVwiKTtcbiAgICAgICAgICBcbiAgICAgICAgICB0aGlzLnNoZWxmSW5mb1NlZW4ucHVzaChpdGVtLmlkZW50aWZpY2F0b3IpO1xuXG4gICAgICAgICAgLy8gaWYgKHRoaXMuY2ZhbGVydERpYWxvZ0hlbHBlci5zaG93Qm90dG9tU2hlZXQoaXRlbS5pZGVudGlmaWNhdG9yKSl7XG4gICAgICAgICAgLy8gICBjb25zb2xlLmxvZyhcIkRpc3BsYXlpbmcgc2hlbGYgaW5mbyFcIik7XG4gICAgICAgICAgLy8gICBhbGVydChcIkdvaW5nIHRvIFNoZWxmIGluZm8hXCIpO1xuICAgICAgICAgIC8vIH1cbiAgICAgICAgICB0aGlzLnNob3dCb3R0b21TaGVldChpdGVtLmlkZW50aWZpY2F0b3IpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICB2ZXJpZnlWaXNpdCgpe1xuICAgIGxldCBuZWFyYnlTdG9yZXMgPSB0aGlzLm5lYXJieVN0b3JlcygpO1xuICAgIGNvbnNvbGUubG9nKFwiTmVhcmJ5IHN0b3JlczogXCIrbmVhcmJ5U3RvcmVzLmxlbmd0aClcbiAgICBpZiAobmVhcmJ5U3RvcmVzLmxlbmd0aD4wKXtcbiAgICAgIG5lYXJieVN0b3Jlcy5mb3JFYWNoKHN0b3JlPT57XG4gICAgICAgIGNvbnNvbGUubG9nKFwiU3RvcmUgaWRlbnRpZmljYXRvcjogXCIrc3RvcmUuaWRlbnRpZmljYXRvcik7XG4gICAgICAgIGxldCB2aXNpdCAgPSB0aGlzLnZpc2l0RGF0YWJhc2VTZXJ2aWNlLnNlbGVjdFZpc2l0QnlCZWFjb24oc3RvcmUuaWRlbnRpZmljYXRvcik7XG4gICAgICAgIFxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInZpc2l0IGlkOiBcIit2aXNpdCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwidmlzaXQuaWQ6IFwiK3Zpc2l0LmlkKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJ2aXNpdFswXTogXCIrdmlzaXRbMF0pO1xuICAgICAgICAvLyBWZXJpZnkgaWYgdmlzaXQgaXMgYmVpbmcgY3JlYXRlZFxuICAgICAgICBpZiAodmlzaXQgIT0gbnVsbCl7XG5cbiAgICAgICAgICB0aGlzLnZlcmlmeVN0b3JlSXRlbXMoc3RvcmUuaWRlbnRpZmljYXRvcik7XG5cbiAgICAgICAgICB0aGlzLmF0U3RvcmUgPSBcIkBcIitzdG9yZS5uYW1lO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwidmlzaXQgY29uc3RydWN0b3IgbmFtZTogXCIrdmlzaXQuY29uc3RydWN0b3IubmFtZSk7XG5cbiAgICAgICAgICBsZXQgc3RhcnQgPSBuZXcgRGF0ZSh2aXNpdC5zdGFydCk7XG4gICAgICAgICAgbGV0IGVuZCA9IG5ldyBEYXRlKHZpc2l0LmVuZCk7XG4gICAgICAgICAgbGV0IGR1cmF0aW9uID0gZW5kLmdldFRpbWUoKSAtIHN0YXJ0LmdldFRpbWUoKTtcbiAgICAgICAgICBsZXQgc2luY2VMYXN0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSBlbmQuZ2V0VGltZSgpO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwidmlzaXQgdHlwZW9mOiBcIit0eXBlb2YgdmlzaXQpO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwic3RhcnQgeGEuOiBcIisodmlzaXQuc3RhcnQpKTtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInN0YXJ0OiBcIisoc3RhcnQuZ2V0VGltZSgpKSk7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coXCJzdGFydDogXCIrKHN0YXJ0LnRvRGF0ZVN0cmluZygpKSk7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coXCJzdGFydDogXCIrKHN0YXJ0LnRvU3RyaW5nKCkpKTtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInN0YXJ0OiBcIisodGhpcy5kYXRlRm9ybWF0dGVyKHN0YXJ0KSkpO1xuICAgICAgICAgIC8vIC8vIGNvbnNvbGUubG9nKFwiZW5kOiBcIisgZW5kLmdldFRpbWUoKSk7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coJ3Zpc2l0IGR1cmF0aW9uOiAnK2R1cmF0aW9uKTtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZygndmlzaXQgc2luY2VMYXN0OiAnK3NpbmNlTGFzdCk7XG5cbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlZpc2l0IHBvc3QgdGVzdCBpZDogXCIrdmlzaXQuaWQpO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVmlzaXQgcG9zdCB0ZXN0IGJlYWNvbjogXCIrdmlzaXQuYmVhY29uKTtcbiAgICAgICAgICAvLyB0aGlzLnZpc2l0U2VydmljZS5jcmVhdGVWaXNpdCh2aXNpdCkuc3Vic2NyaWJlKHJlc3BvbnNlID0+IHsgXG4gICAgICAgICAgLy8gICAvLyB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICAgIC8vICAgVG9hc3QubWFrZVRleHQoXCJWaXNpdCBTZW50IVwiKS5zaG93KCk7XG4gICAgICAgICAgLy8gfSxlcnJvciA9PiB7XG4gICAgICAgICAgLy8gICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICAgIC8vICAgYWxlcnQoXCJFcnJvciBjcmVhdGluZyB0aGUgY29udHJhY3Q6IFwiK2Vycm9yKTtcbiAgICAgICAgICAvLyAgIC8vIHRocm93IG5ldyBFcnJvcihlcnJvcik7XG4gICAgICAgICAgLy8gfSk7XG5cblxuICAgICAgICAgIC8vIGlmIGxhc3QgcmVhZGluZyBvZiBzdG9yZSB3YXMgbGVzcyB0aGFuIDIwIHNlY29uZHMgYWdvXG4gICAgICAgICAgaWYoc2luY2VMYXN0IDwgNTkwMDApeyAvLyB1cGRhdGUgZW5kIGRhdGUgdG8gY3VycmVudFxuICAgICAgICAgICAgLy8gdGhpcy52aXNpdERhdGFiYXNlU2VydmljZS51cGRhdGVWaXNpdCh2aXNpdFswXSx2aXNpdFsxXSwgIHZpc2l0WzJdICwgdmlzaXRbM10gLG5ldyBEYXRlKCksIHZpc2l0WzVdICwgdmlzaXRbNl0gLCB2aXNpdFs3XSk7XG4gICAgICAgICAgICB0aGlzLnZpc2l0RGF0YWJhc2VTZXJ2aWNlLnVwZGF0ZVZpc2l0KHZpc2l0KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidmlzaXQgJ2VuZCcgdXBkYXRlZFwiKTtcbiAgICAgICAgICB9ZWxzZXsvLyBpZiBsYXN0IHJlYWRpbmcgb2Ygc3RvcmUgd2FzIG1vcmUgdGhhbiAyMCBzZWNvbmRzIGFnb1xuICAgICAgICAgICAgaWYoZHVyYXRpb24gPiA2MDAwMCl7IC8vIGlmIHJlYWRpbmdzIGxhc3RlZCBtb3JlIHRoYW4gMyBtaW51dGVzICwgc2VuZCByZWNvcmQuLiAxIG1pblxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNlbmRpbmcgdmlzaXQgYTogXCIrdmlzaXQpXG4gICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQWN0dWFsIGltcGxlbWVudGF0aW9uIHBlbmRpbmcuLlwiKTtcbiAgICAgICAgICAgICAgdGhpcy52aXNpdFNlcnZpY2UuY3JlYXRlVmlzaXQodmlzaXQpLnN1YnNjcmliZShyZXNwb25zZSA9PiB7IFxuICAgICAgICAgICAgICAgICAgLy8gdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiVmlzaXQgU2VudCFcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgIH0sZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3Igc2VuZGluZyB0aGUgdmlzaXQ6IFwiK2Vycm9yKTtcbiAgICAgICAgICAgICAgICAgIC8vIHRocm93IG5ldyBFcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJHb29kYnllIGZyb20gXCIrc3RvcmUubmFtZSkuc2hvdygpO1xuXG4gICAgICAgICAgICAgIHRoaXMudmVyaWZ5SW50ZXJlc3QoKTtcbiAgICAgICAgICAgICAgLy8gbGV0IGludGVyZXN0cyA9IHRoaXMuaW50ZXJlc3REYXRhYmFzZVNlcnZpY2Uuc2VsZWN0SW50ZXJlc3RzKCk7XG5cbiAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJob3cgbWFueSBpbnRlcnN0cyB0byBmaW5pc2g6IFwiK2ludGVyZXN0cy5sZW5ndGgpO1xuICAgICAgICAgICAgICAvLyAvLyBpZiB0aGVyZSBpcyBhbiBpbnRlcmVzdCBcbiAgICAgICAgICAgICAgLy8gaWYgKGludGVyZXN0cy5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgICAgLy8gICAgIGludGVyZXN0cy5mb3JFYWNoKGludGVyZXN0ID0+e1xuICAgICAgICAgICAgICAvLyAgICAgbGV0IHN0YXJ0ID0gbmV3IERhdGUoaW50ZXJlc3Quc3RhcnQpO1xuICAgICAgICAgICAgICAvLyAgICAgbGV0IGVuZCA9IG5ldyBEYXRlKGludGVyZXN0LmVuZCk7XG4gICAgICAgICAgICAgIC8vICAgICBsZXQgZHVyYXRpb24gPSBlbmQuZ2V0VGltZSgpIC0gc3RhcnQuZ2V0VGltZSgpO1xuICAgICAgICAgICAgICAvLyAgICAgbGV0IHNpbmNlTGFzdCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gZW5kLmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwiSW50ZXJlc3QgeGQuOiBcIitpbnRlcmVzdC5iZWFjb24rXCIsIHNpbmNlTGFzdDogXCIrc2luY2VMYXN0K1wiLCBkdXJhdGlvbjogXCIrZHVyYXRpb24pO1xuICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIC8vICAgICAvLyBpZiBkdXJhdGlvbiAgPiAxIG1pbnV0ZSB0aGVuIHNlbmQgaW50ZXJlc3RcbiAgICAgICAgICAgICAgLy8gICAgIGlmKCBkdXJhdGlvbiA+IDYwMDAwKXtcbiAgICAgICAgICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhcIlNlbmRpbmcgaW50ZXJlc3QgYiBlLjogXCIraW50ZXJlc3QuYmVhY29uKVxuICAgICAgICAgICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKFwiQWN0dWFsIGltcGxlbWVudGF0aW9uIHBlbmRpbmcuLiB3b3JrIGluIHByb2dyZXNzLi5cIik7XG4gICAgICAgICAgICAgIC8vICAgICAgICAgdGhpcy5pbnRlcmVzdFNlcnZpY2UuY3JlYXRlSW50ZXJlc3QoaW50ZXJlc3QpLnN1YnNjcmliZShyZXNwb25zZSA9PiB7IFxuICAgICAgICAgICAgICAvLyAgICAgICAgICAgLy8gdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgICAgLy8gICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiSW50ZXJlc3QgU2VudCFcIikuc2hvdygpO1xuICAgICAgICAgICAgICAvLyAgICAgICAgIH0sZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAvLyAgICAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgICAgLy8gICAgICAgICAgIGFsZXJ0KFwiRXJyb3Igc2VuZGluZyB0aGUgaW50ZXJlc3Q6IFwiK2Vycm9yKTtcbiAgICAgICAgICAgICAgLy8gICAgICAgICAgIC8vIHRocm93IG5ldyBFcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgIC8vICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgLy8gICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkludGVyZXN0IHN0b3JlZC5cIikuc2hvdygpO1xuICAgICAgICAgICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKFwiSW50ZXJlc3Qgc3RvcmVkLlwiKVxuXG4gICAgICAgICAgICAgIC8vICAgICAgICAgLy8gZmluaXNoZWRJbnRlcmVzdHMucHVzaChpbnRlcmVzdCk7XG4gICAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhcIkRlbGV0aW5nIGludGVyZXN0IGR1ZSB0byBleHBpcmluZyBjb250cmFjdCBmLjogXCIraW50ZXJlc3QuYmVhY29uKTtcbiAgICAgICAgICAgICAgLy8gICAgIHRoaXMuaW50ZXJlc3REYXRhYmFzZVNlcnZpY2UuZGVsZXRlSW50ZXJlc3QoaW50ZXJlc3QuaWQpO1xuICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIC8vICAgICB9KTtcbiAgICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ29udHJhY3QgaW5mby4uXCIpO1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInRoaXMuX2NvbnRyYWN0OiBcIit0aGlzLl9jb250cmFjdCk7XG4gICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwidGhpcy5fY29udHJhY3Qub3B0aW9uczogXCIrdGhpcy5fY29udHJhY3Qub3B0aW9ucyk7XG4gICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwidGhpcy5fY29udHJhY3Qub3B0aW9uc1snZXhwaXJlX21ldGhvZCddOiBcIit0aGlzLl9jb250cmFjdC5vcHRpb25zWydleHBpcmVfbWV0aG9kJ10pO1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgaWYoIHR5cGVvZiB0aGlzLl9jb250cmFjdCAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgdGhpcy5fY29udHJhY3Qub3B0aW9uc1snZXhwaXJlX21ldGhvZCddICE9PSBcInVuZGVmaW5lZFwiICYmIHRoaXMuX2NvbnRyYWN0Lm9wdGlvbnNbJ2V4cGlyZV9tZXRob2QnXSA9PSAnbG9jYXRpb24nKXtcbiAgICAgICAgICAgICAgICAvLyBleHBpcmUgY29udHJhY3QgaWYgbG9jYXRpb24gb25cbiAgICAgICAgICAgICAgICB0aGlzLmlzQnVzeSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250cmFjdFNlcnZpY2UuZXhwaXJlQ29udHJhY3QodGhpcy5fY29udHJhY3QubG9jYXRpb25faWQsdGhpcy5fY29udHJhY3QuY3VzdG9tZXJfaWQpXG4gICAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKHJlc3BvbnNlQ29udHJhY3QgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAvLyBhbGVydChcIkNvbnRyYWN0IGV4cGlyZWQgc3VjY2VzZnVsbHkhXCIpO1xuICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkNvbnRyYWN0IGV4cGlyZWQgc3VjY2VzZnVsbHkhXCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgIH0sZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGluIGNvbnRyYWN0XCIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3Iuc3RhdHVzICE9IDQwNCl7XG4gICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBleHBpcmluZyB0aGUgY29udHJhY3Q6IFwiK2Vycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICB9IFxuICAgICAgICAgICAgLy8gZGVsZXRlIHJlY29yZFxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJEZWxldGluZyB2aXNpdCBkdWUgdG8gbGVzcyB0aGFuIDU5IHNlY29uZHM6IFwiK3Zpc2l0LmlkKTtcbiAgICAgICAgICAgIHRoaXMudmlzaXREYXRhYmFzZVNlcnZpY2UuZGVsZXRlVmlzaXQodmlzaXQuaWQpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgXG4gICAgICAgICAgfVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkNyZWF0aW5nIG5ldyB2aXNpdFwiKVxuICAgICAgICAgIGxldCB2aXNpdE9iaiA9IG5ldyBWaXNpdCh0aGlzLl9jdXN0b21lcl9pZCwgc3RvcmUuaWRlbnRpZmljYXRvcik7XG4gICAgICAgICAgdmlzaXRPYmoua2V5d29yZHM9c3RvcmUua2V5d29yZHM7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJ2aXNpdE9iaiBjb25zdHJ1Y3RvciBuYW1lOiBcIisgdmlzaXRPYmouY29uc3RydWN0b3IubmFtZSk7XG5cbiAgICAgICAgICB0aGlzLnZpc2l0RGF0YWJhc2VTZXJ2aWNlLmluc2VydFZpc2l0KHZpc2l0T2JqKTtcbiAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIldlbGNvbWUgdG8gXCIrc3RvcmUubmFtZSkuc2hvdygpO1xuICAgICAgICAgIHRoaXMuYXRTdG9yZSA9IFwiQFwiK3N0b3JlLm5hbWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1lbHNle1xuICAgICAgLy8gUmV0cml2ZSBhbGwgdmlzaXRzIChzaG91bGQgYmUgbWF4IDEpXG4gICAgICBsZXQgdmlzaXRzID0gdGhpcy52aXNpdERhdGFiYXNlU2VydmljZS5zZWxlY3RWaXNpdHMoKTtcblxuICAgICAgY29uc29sZS5sb2coXCJob3cgbWFueSB2aXNpdHM6IFwiK3Zpc2l0cy5sZW5ndGgpO1xuICAgICAgLy8gaWYgdGhlcmUgaXMgYW4gdmlzaXQgXG4gICAgICBpZiAodmlzaXRzLmxlbmd0aCA+IDApe1xuICAgICAgICB2aXNpdHMuZm9yRWFjaCh2aXNpdCA9PntcbiAgICAgICAgICBsZXQgc3RhcnQgPSBuZXcgRGF0ZSh2aXNpdC5zdGFydCk7XG4gICAgICAgICAgbGV0IGVuZCA9IG5ldyBEYXRlKHZpc2l0LmVuZCk7XG4gICAgICAgICAgbGV0IGR1cmF0aW9uID0gZW5kLmdldFRpbWUoKSAtIHN0YXJ0LmdldFRpbWUoKTtcbiAgICAgICAgICBsZXQgc2luY2VMYXN0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSBlbmQuZ2V0VGltZSgpO1xuXG4gICAgICAgICAgY29uc29sZS5sb2coXCJ2aXNpdCAuOiBcIit2aXNpdC5pZCk7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJzdGFydCB4LjogXCIrc3RhcnQuZ2V0VGltZSgpKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcImVuZCB4LjogXCIrZW5kLmdldFRpbWUoKSk7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJzaW5jZUxhc3QgeWIuOiBcIisgc2luY2VMYXN0KTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcImR1cmF0aW9uIHljLjogXCIrIGR1cmF0aW9uKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIlZpc2l0IHhnLjogXCIrdmlzaXQuYmVhY29uK1wiLCBzaW5jZUxhc3Q6IFwiK3NpbmNlTGFzdCtcIiwgZHVyYXRpb246IFwiK2R1cmF0aW9uKTtcbiAgICAgICAgICAvLyBpZiBzaW5jZUxhc3QgPiA2MCBzZWNvbmRzIDwtIHRoaXMgaXMgY3J1Y2lhbCBmb3Iga25vd2luZyBpZiBpdCBpcyBhd2F5XG4gICAgICAgICAgaWYoc2luY2VMYXN0ID4gNjAwMDApe1xuICAgICAgICAgICAgLy8gaWYgZHVyYXRpb24gID4gMSBtaW51dGUgdGhlbiBzZW5kIHZpc2l0XG4gICAgICAgICAgICBpZiggZHVyYXRpb24gPiA2MDAwMCl7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyB2aXNpdCBiIC46IFwiK3Zpc2l0KVxuICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkFjdHVhbCBpbXBsZW1lbnRhdGlvbiBwZW5kaW5nLi5cIik7XG4gICAgICAgICAgICAgIHRoaXMudmlzaXRTZXJ2aWNlLmNyZWF0ZVZpc2l0KHZpc2l0KS5zdWJzY3JpYmUocmVzcG9uc2UgPT4geyBcbiAgICAgICAgICAgICAgICAgIC8vIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIlZpc2l0IFNlbnQhXCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICB9LGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICBhbGVydChcIkVycm9yIHNlbmRpbmcgdGhlIHZpc2l0OiBcIitlcnJvcik7XG4gICAgICAgICAgICAgICAgICAvLyB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgICAgICAgdGhpcy5hdFN0b3JlID0gXCJcIjtcbiAgICAgICAgICAgICAgdGhpcy5jb250YWluZXJQcm9kdWN0c08gPSBbXTtcbiAgICAgICAgICAgICAgdGhpcy5jb250YWluZXJQcm9kdWN0c1IgPSBbXTtcblxuICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkdvb2RieWUhXCIpLnNob3coKTtcblxuICAgICAgICAgICAgICAvLyBTZW5kIGZpbmlzaGVkIGludGVyZXN0c1xuICAgICAgICAgICAgICAvLyBsZXQgZmluaXNoZWRJbnRlcmVzdHMgPSB0aGlzLmludGVyZXN0RGF0YWJhc2VTZXJ2aWNlLmZpbmlzaEludGVyZXN0cygpOyBcbiAgICAgICAgICAgICAgLy8gaWYgKGZpbmlzaGVkSW50ZXJlc3RzLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgICAvLyAgIGZpbmlzaGVkSW50ZXJlc3RzLmZvckVhY2goaW50ZXJlc3Q9PntcbiAgICAgICAgICAgICAgLy8gICAgIC8vIHNlbmQgaW50ZXJlc3RcbiAgICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyBpbnRlcmVzdCBmcm9tIGZpbmlzaCBpbnRlcmVzdDogXCIraW50ZXJlc3QuYmVhY29uKTtcbiAgICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwiQWN0dWFsIGltcGxlbWVudGF0aW9uIHBlbmRpbmcuLlwiKTtcblxuICAgICAgICAgICAgICAvLyAgICAgVG9hc3QubWFrZVRleHQoXCJJbnRlcmVzdCBzdG9yZWQuXCIpLnNob3coKTtcbiAgICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwiSW50ZXJlc3Qgc3RvcmVkLlwiKVxuICAgICAgICAgICAgICAvLyAgIH0pO1xuICAgICAgICAgICAgICAvLyB9XG5cblxuICAgICAgICAgICAgICB0aGlzLnZlcmlmeUludGVyZXN0KCk7XG4gICAgICAgICAgICAgIC8vIFJldHJpdmUgYWxsIGludGVyZXN0cyAoc2hvdWxkIGJlIG1heCAxKVxuICAgICAgICAgICAgICAvLyBsZXQgaW50ZXJlc3RzID0gdGhpcy5pbnRlcmVzdERhdGFiYXNlU2VydmljZS5zZWxlY3RJbnRlcmVzdHMoKTtcblxuICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImhvdyBtYW55IGludGVyc3RzIHRvIGZpbmlzaDogXCIraW50ZXJlc3RzLmxlbmd0aCk7XG4gICAgICAgICAgICAgIC8vIC8vIGlmIHRoZXJlIGlzIGFuIGludGVyZXN0IFxuICAgICAgICAgICAgICAvLyBpZiAoaW50ZXJlc3RzLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgICAvLyAgICAgaW50ZXJlc3RzLmZvckVhY2goaW50ZXJlc3QgPT57XG4gICAgICAgICAgICAgIC8vICAgICBsZXQgc3RhcnQgPSBuZXcgRGF0ZShpbnRlcmVzdC5zdGFydCk7XG4gICAgICAgICAgICAgIC8vICAgICBsZXQgZW5kID0gbmV3IERhdGUoaW50ZXJlc3QuZW5kKTtcbiAgICAgICAgICAgICAgLy8gICAgIGxldCBkdXJhdGlvbiA9IGVuZC5nZXRUaW1lKCkgLSBzdGFydC5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgIC8vICAgICBsZXQgc2luY2VMYXN0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSBlbmQuZ2V0VGltZSgpO1xuICAgICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coXCJJbnRlcmVzdCB4Zy46IFwiK2ludGVyZXN0LmJlYWNvbitcIiwgc2luY2VMYXN0OiBcIitzaW5jZUxhc3QrXCIsIGR1cmF0aW9uOiBcIitkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgLy8gICAgIC8vIGlmIGR1cmF0aW9uICA+IDEgbWludXRlIHRoZW4gc2VuZCBpbnRlcmVzdFxuICAgICAgICAgICAgICAvLyAgICAgaWYoIGR1cmF0aW9uID4gNjAwMDApe1xuICAgICAgICAgICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyBpbnRlcmVzdCBiIGguOiBcIitpbnRlcmVzdC5iZWFjb24pXG4gICAgICAgICAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2coXCJBY3R1YWwgaW1wbGVtZW50YXRpb24gcGVuZGluZy4uIHdvcmsgaW4gcHJvZ3Jlc3MuLlwiKTtcbiAgICAgICAgICAgICAgLy8gICAgICAgICB0aGlzLmludGVyZXN0U2VydmljZS5jcmVhdGVJbnRlcmVzdChpbnRlcmVzdCkuc3Vic2NyaWJlKHJlc3BvbnNlID0+IHsgXG4gICAgICAgICAgICAgIC8vICAgICAgICAgICAvLyB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgICAvLyAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJJbnRlcmVzdCBTZW50IVwiKS5zaG93KCk7XG4gICAgICAgICAgICAgIC8vICAgICAgICAgfSxlcnJvciA9PiB7XG4gICAgICAgICAgICAgIC8vICAgICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgICAvLyAgICAgICAgICAgYWxlcnQoXCJFcnJvciBzZW5kaW5nIHRoZSBpbnRlcmVzdDogXCIrZXJyb3IpO1xuICAgICAgICAgICAgICAvLyAgICAgICAgICAgLy8gdGhyb3cgbmV3IEVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgLy8gICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAvLyAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiSW50ZXJlc3Qgc3RvcmVkLlwiKS5zaG93KCk7XG4gICAgICAgICAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2coXCJJbnRlcmVzdCBzdG9yZWQuXCIpXG5cbiAgICAgICAgICAgICAgLy8gICAgICAgICAvLyBmaW5pc2hlZEludGVyZXN0cy5wdXNoKGludGVyZXN0KTtcbiAgICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwiRGVsZXRpbmcgaW50ZXJlc3QgZHVlIHRvIGV4cGlyaW5nIGNvbnRyYWN0IGkuOiBcIitpbnRlcmVzdC5iZWFjb24pO1xuICAgICAgICAgICAgICAvLyAgICAgdGhpcy5pbnRlcmVzdERhdGFiYXNlU2VydmljZS5kZWxldGVJbnRlcmVzdChpbnRlcmVzdC5pZCk7XG4gICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgLy8gICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgLy8gfVxuXG5cbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDb250cmFjdCBpbmZvLi5cIik7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidGhpcy5fY29udHJhY3Q6IFwiK3RoaXMuX2NvbnRyYWN0KTtcbiAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ0aGlzLl9jb250cmFjdC5vcHRpb25zOiBcIit0aGlzLl9jb250cmFjdC5vcHRpb25zKTtcbiAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ0aGlzLl9jb250cmFjdC5vcHRpb25zWydleHBpcmVfbWV0aG9kJ106IFwiK3RoaXMuX2NvbnRyYWN0Lm9wdGlvbnNbJ2V4cGlyZV9tZXRob2QnXSk7XG5cbiAgICAgICAgICAgICAgaWYoIHR5cGVvZiB0aGlzLl9jb250cmFjdCAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgdGhpcy5fY29udHJhY3Qub3B0aW9uc1snZXhwaXJlX21ldGhvZCddICE9PSBcInVuZGVmaW5lZFwiICYmIHRoaXMuX2NvbnRyYWN0Lm9wdGlvbnNbJ2V4cGlyZV9tZXRob2QnXSA9PSAnbG9jYXRpb24nKXtcbiAgICAgICAgICAgICAgICAvLyBleHBpcmUgY29udHJhY3QgaWYgbG9jYXRpb24gb25cbiAgICAgICAgICAgICAgICB0aGlzLmlzQnVzeSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250cmFjdFNlcnZpY2UuZXhwaXJlQ29udHJhY3QodGhpcy5fY29udHJhY3QubG9jYXRpb25faWQsdGhpcy5fY29udHJhY3QuY3VzdG9tZXJfaWQpXG4gICAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKHJlc3BvbnNlQ29udHJhY3QgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAvLyBhbGVydChcIkNvbnRyYWN0IGV4cGlyZWQgc3VjY2VzZnVsbHkhXCIpO1xuICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkNvbnRyYWN0IGV4cGlyZWQgc3VjY2VzZnVsbHkhXCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgIH0sZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGluIGNvbnRyYWN0XCIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3Iuc3RhdHVzICE9IDQwNCl7XG4gICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBleHBpcmluZyB0aGUgY29udHJhY3Q6IFwiK2Vycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJEZWxldGluZyB2aXNpdCBkdWUgdG8gbW9yZSB0aGFuIDEgbWludXRlIGF3YXkgZC46IFwiK3Zpc2l0LmlkKTtcbiAgICAgICAgICAgIHRoaXMudmlzaXREYXRhYmFzZVNlcnZpY2UuZGVsZXRlVmlzaXQodmlzaXQuaWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHZlcmlmeVN0b3JlSXRlbXMoYmVhY29uKXtcbiAgICAvLyBhbGVydChcIlN0b3JlOiBcIitiZWFjb24pO1xuICAgIHRoaXMuc2hlbGZTZXJ2aWNlLmdldFNoZWxmKGJlYWNvbilcbiAgICAgICAgLnN1YnNjcmliZShyZXNwb25zZVNoZWxmID0+IHtcbiAgICAgICAgICBpZiAoIXJlc3BvbnNlU2hlbGYubWVzc2FnZSl7XG4gICAgICAgICAgICAvLyB0aGlzLmNvbnRhaW5lciA9IG5ldyBTaGVsZihyZXNwb25zZVNoZWxmLmNvZGUsIHJlc3BvbnNlU2hlbGYuYmVhY29uKTtcbiAgICAgICAgICAgIC8vIHRoaXMuY29udGFpbmVyLmtleXdvcmRzID0gcmVzcG9uc2VTaGVsZi5rZXl3b3JkcztcblxuICAgICAgICAgICAgbGV0IHByb2R1Y3RzUiA9IFtdO1xuICAgICAgICAgICAgbGV0IHByb2R1Y3RzTyA9IFtdO1xuXG4gICAgICAgICAgICByZXNwb25zZVNoZWxmLnByb2R1Y3RzLmZvckVhY2gocHJvZHVjdCA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHByb2R1Y3RPYmogPSBuZXcgUHJvZHVjdChwcm9kdWN0LmNvZGUsIHByb2R1Y3QubmFtZSxwcm9kdWN0LmRlc2NyaXB0aW9uKTtcbiAgICAgICAgICAgICAgICBwcm9kdWN0T2JqLmtleXdvcmRzID0gcHJvZHVjdC5rZXl3b3JkcztcbiAgICAgICAgICAgICAgICBwcm9kdWN0T2JqLmltYWdlID0gcHJvZHVjdC5pbWFnZTtcbiAgICAgICAgICAgICAgICBwcm9kdWN0T2JqLnZpZGVvID0gcHJvZHVjdC52aWRlbztcbiAgICAgICAgICAgICAgICBwcm9kdWN0T2JqLnJlbWFyayA9IHByb2R1Y3QucmVtYXJrO1xuICAgICAgICAgICAgICAgIC8vIHByb2R1Y3RzLnB1c2gocHJvZHVjdE9iaik7XG5cbiAgICAgICAgICAgICAgICBpZiAocHJvZHVjdC5yZW1hcmsgPT0gJ29mZmVyJyl7XG4gICAgICAgICAgICAgICAgICBwcm9kdWN0c08ucHVzaChwcm9kdWN0KTtcbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgIHByb2R1Y3RzUi5wdXNoKHByb2R1Y3QpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGlmKHRoaXMucmVtYXJrcy5pbmRleE9mKHByb2R1Y3QucmVtYXJrKT09LTEpe1xuICAgICAgICAgICAgICAgIC8vICAgdGhpcy5yZW1hcmtzLnB1c2gocHJvZHVjdC5yZW1hcmspO1xuICAgICAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgICAgIC8vIGlmICh0aGlzLnJlbWFya3MuaW5kZXhPZihwcm9kdWN0LnJlbWFyayk9PS0xKXtcbiAgICAgICAgICAgICAgICAvLyAgIHRoaXMucmVtYXJrcy5wdXNoKHByb2R1Y3QucmVtYXJrKTtcblxuICAgICAgICAgICAgICAgIC8vICAgdGhpcy5wcm9kdWN0c0J5UmVtYXJrTGlzdC5wdXNoKCBuZXcgUHJvZHVjdHNCeVJlbWFyayhwcm9kdWN0LnJlbWFyaykpO1xuICAgICAgICAgICAgICAgIC8vICAgdGhpcy5wcm9kdWN0c0J5UmVtYXJrTGlzdC5pbmRleE9mXG5cbiAgICAgICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgICAgICAvLyBpZih0aGlzLnByb2R1Y3RzQnlSZW1hcmtMaXN0LilcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyB0aGlzLmNvbnRhaW5lci5wcm9kdWN0cyA9IHByb2R1Y3RzO1xuICAgICAgICAgICAgLy8gdGhpcy5jb250YWluZXJQcm9kdWN0cyA9IHByb2R1Y3RzO1xuICAgICAgICAgICAgLy8gdGhpcy5wcm9kdWN0c0J5UmVtYXJrTGlzdC5wdXNoKClcbiAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lclByb2R1Y3RzTyA9IHByb2R1Y3RzTztcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyUHJvZHVjdHNSID0gcHJvZHVjdHNSO1xuICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwifn5+fn5+fn5+fn5+fn5+flwiKVxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJjb2RlOiBcIit0aGlzLnNoZWxmLmNvZGUpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJiZWFjb246IFwiK3RoaXMuc2hlbGYuYmVhY29uKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwia2V3b3Jkc1wiK3RoaXMuc2hlbGYua2V5d29yZHMpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJwcm9kdWN0czogXCIrdGhpcy5zaGVsZi5wcm9kdWN0cy5sZW5ndGgpO1xuICAgICAgICAgICAgLy8gdGhpcy5zaGVsZi5wcm9kdWN0cy5mb3JFYWNoKHByb2R1Y3QgPT4ge1xuICAgICAgICAgICAgLy8gICBjb25zb2xlLmxvZyhcImNvZGU6IFwiK3Byb2R1Y3QuY29kZSk7XG4gICAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKFwibmFtZTogXCIrcHJvZHVjdC5uYW1lKTtcbiAgICAgICAgICAgIC8vICAgY29uc29sZS5sb2coXCJkZXNjcmlwdGlvbjogXCIrcHJvZHVjdC5kZXNjcmlwdGlvbik7XG4gICAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKFwia2V5d29yZHM6IFwiK3Byb2R1Y3Qua2V5d29yZHMpO1xuICAgICAgICAgICAgLy8gICBjb25zb2xlLmxvZyhcImltYWdlOiBcIitwcm9kdWN0LmltYWdlKTtcbiAgICAgICAgICAgIC8vICAgY29uc29sZS5sb2coXCJ2aWRlbzogXCIrcHJvZHVjdC52aWRlbyk7XG4gICAgICAgICAgICAvLyB9KTtcblxuICAgICAgICAgICAgLy8gdGhpcy5zaGVsZlRpdGxlID0gdGhpcy5zaGVsZi5jb2RlO1xuXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIn4gfiB+IH4gfiB+IH4gfiB+XCIpXG5cbiAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibWVzc2FnZTpcIityZXNwb25zZVNoZWxmLm1lc3NhZ2UpO1xuICAgICAgICAgICAgLy8gYWxlcnQoXCJDb250cmFjdCBleHBpcmVkLlwiKTtcbiAgICAgICAgICAgIC8vIHRoaXMuZ29NYWluKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LGVycm9yID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGluIHNoZWxmIGNvbXBvbmVudFwiKTtcbiAgICAgICAgICBpZiAoZXJyb3Iuc3RhdHVzID09IDQwMSl7XG4gICAgICAgICAgICBhbGVydChcIk5vIGF2YWlsYWJsZSBpbmZvcm1hdGlvbiBmb3IgdGhpcyBTaGVsZi5cIik7XG4gICAgICAgICAgfWVsc2UgaWYgKGVycm9yLnN0YXR1cyAhPSA0MDQpe1xuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBnZXR0aW5nIHNoZWxmIGJ5IGJlYWNvbiBpbmZvcm1hdGlvbjogXCIrZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyB0aGlzLmdvTWFpbigpO1xuICAgICAgICB9KTtcbiAgfVxuXG4gIHZlcmlmeUJlaGF2aW9yKCl7XG4gICAgbGV0IG5lYXJieUl0ZW1zID0gdGhpcy5uZWFyYnlJdGVtcygpO1xuICAgIGNvbnNvbGUubG9nKFwiTmVhcmJ5IGl0ZW1zOiBcIituZWFyYnlJdGVtcy5sZW5ndGgpXG5cbiAgICBpZiAobmVhcmJ5SXRlbXMubGVuZ3RoPjApe1xuICAgICAgbmVhcmJ5SXRlbXMuZm9yRWFjaChpdGVtPT57XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQmVhY29uIGlkZW50aWZpY2F0b3I6IFwiK2l0ZW0uaWRlbnRpZmljYXRvcik7XG4gICAgICAgIGxldCBpbnRlcmVzdDogSW50ZXJlc3QgID0gdGhpcy5pbnRlcmVzdERhdGFiYXNlU2VydmljZS5zZWxlY3RJbnRlcmVzdEJ5QmVhY29uKGl0ZW0uaWRlbnRpZmljYXRvcik7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiaW50ZXJlc3QgbGVuOiBcIisgaW50ZXJlc3QuKVxuICAgICAgICAvLyBWZXJpZnkgaWYgaW50ZXJlc3QgaXMgYmVpbmcgY3JlYXRlZFxuICAgICAgICBpZiAoaW50ZXJlc3QgIT0gbnVsbCl7XG4gICAgICAgICAgbGV0IHN0YXJ0ID0gbmV3IERhdGUoaW50ZXJlc3Quc3RhcnQpO1xuICAgICAgICAgIGxldCBlbmQgPSBuZXcgRGF0ZShpbnRlcmVzdC5lbmQpO1xuICAgICAgICAgIGxldCBkdXJhdGlvbiA9IGVuZC5nZXRUaW1lKCkgLSBzdGFydC5nZXRUaW1lKCk7XG4gICAgICAgICAgbGV0IHNpbmNlTGFzdCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gZW5kLmdldFRpbWUoKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcImludGVyZXN0IHR5cGU6IFwiKyB0eXBlb2YgaW50ZXJlc3QpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW50ZXJlc3QgY29uc3RydWN0b3IgbmFtZTogXCIrIGludGVyZXN0LmNvbnN0cnVjdG9yLm5hbWUpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW50ZXJlc3QgaW5zdGFuY2Ugb2YgSW50ZXJlc3Q6IFwiKyAoaW50ZXJlc3QgaW5zdGFuY2VvZiBJbnRlcmVzdCkpO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwic3RhcnQ6IFwiKyhzdGFydC5nZXRUaW1lKCkpKTtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImVuZDogXCIrIGVuZC5nZXRUaW1lKCkpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdpbnRlcmVzdCBkdXJhdGlvbjogJytkdXJhdGlvbik7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2ludGVyZXN0IHNpbmNlTGFzdDogJytzaW5jZUxhc3QpO1xuICAgICAgICAgIC8vIGlmIGxhc3QgcmVhZGluZyBvZiBpdGVtIHdhcyBsZXNzIHRoYW4gMjAgc2Vjb25kcyBhZ29cbiAgICAgICAgICBpZihzaW5jZUxhc3QgPCA1OTAwMCl7IC8vIHVwZGF0ZSBlbmQgZGF0ZSB0byBjdXJyZW50XG4gICAgICAgICAgICAvLyB0aGlzLmludGVyZXN0RGF0YWJhc2VTZXJ2aWNlLnVwZGF0ZUludGVyZXN0KGludGVyZXN0WzBdLGludGVyZXN0WzFdLCAgaW50ZXJlc3RbMl0gLCBpbnRlcmVzdFszXSAsbmV3IERhdGUoKSwgaW50ZXJlc3RbNV0gLCBpbnRlcmVzdFs2XSAsIGludGVyZXN0WzddKTtcbiAgICAgICAgICAgIHRoaXMuaW50ZXJlc3REYXRhYmFzZVNlcnZpY2UudXBkYXRlSW50ZXJlc3QoaW50ZXJlc3QpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbnRlcmVzdCAnZW5kJyB1cGRhdGVkXCIpO1xuICAgICAgICAgIH1lbHNley8vIGlmIGxhc3QgcmVhZGluZyBvZiBpdGVtIHdhcyBtb3JlIHRoYW4gMjAgc2Vjb25kcyBhZ29cbiAgICAgICAgICAgIGlmKGR1cmF0aW9uID4gNjAwMDApeyAvLyBpZiByZWFkaW5ncyBsYXN0ZWQgbW9yZSB0aGFuIDYwIHNlY29uZHMsIHNlbmQgcmVjb3JkXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyBpbnRlcmVzdCBhIDogXCIraW50ZXJlc3QpXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQWN0dWFsIGltcGxlbWVudGF0aW9uIHBlbmRpbmcuLiB3b3JrIGluIHByb2dyZXNzLi5cIik7XG4gICAgICAgICAgICAgIHRoaXMuaW50ZXJlc3RTZXJ2aWNlLmNyZWF0ZUludGVyZXN0KGludGVyZXN0KS5zdWJzY3JpYmUocmVzcG9uc2UgPT4geyBcbiAgICAgICAgICAgICAgICAvLyB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiSW50ZXJlc3QgU2VudCFcIikuc2hvdygpO1xuICAgICAgICAgICAgICB9LGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3Igc2VuZGluZyB0aGUgaW50ZXJlc3Q6IFwiK2Vycm9yKTtcbiAgICAgICAgICAgICAgICAvLyB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJJbnRlcmVzdCBzdG9yZWQuXCIpLnNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGRlbGV0ZSByZWNvcmRcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRGVsZXRpbmcgaW50ZXJlc3QgZHVlIHRvIGxlc3MgdGhhbiAyMCBzZWNvbmRzOiBcIitpbnRlcmVzdC5pZCk7XG4gICAgICAgICAgICB0aGlzLmludGVyZXN0RGF0YWJhc2VTZXJ2aWNlLmRlbGV0ZUludGVyZXN0KGludGVyZXN0LmlkKTtcbiAgICAgICAgICBcbiAgICAgICAgICB9XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ3JlYXRpbmcgbmV3IGludGVyZXN0XCIpXG4gICAgICAgICAgbGV0IGludGVyZXN0T2JqID0gbmV3IEludGVyZXN0KHRoaXMuX2N1c3RvbWVyX2lkLCBpdGVtLmlkZW50aWZpY2F0b3IpO1xuICAgICAgICAgIGludGVyZXN0T2JqLmtleXdvcmRzPWl0ZW0ua2V5d29yZHM7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJjSWQgdW5kZTogXCIrdGhpcy5fY3VzdG9tZXJfaWQpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiaUlkIHVuZGU6IFwiK2l0ZW0uaWRlbnRpZmljYXRvcik7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJpbnRlcmVzdE9iaiBjb25zdHJ1Y3RvciBuYW1lOiBcIisgaW50ZXJlc3RPYmouY29uc3RydWN0b3IubmFtZSlcbiAgICAgICAgICB0aGlzLmludGVyZXN0RGF0YWJhc2VTZXJ2aWNlLmluc2VydEludGVyZXN0KGludGVyZXN0T2JqKTtcbiAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIlJlY29yZGluZyBpbnRlcmVzdC5cIikuc2hvdygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9ZWxzZXtcbiAgICAgIHRoaXMudmVyaWZ5SW50ZXJlc3QoKTtcbiAgICAgIC8vIC8vIFJldHJpdmUgYWxsIGludGVyZXN0cyAoc2hvdWxkIGJlIG1heCAxKVxuICAgICAgLy8gbGV0IGludGVyZXN0cyA9IHRoaXMuaW50ZXJlc3REYXRhYmFzZVNlcnZpY2Uuc2VsZWN0SW50ZXJlc3RzKCk7XG5cbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiaG93IG1hbnkgaW50ZXJzdHM6IFwiK2ludGVyZXN0cy5sZW5ndGgpO1xuICAgICAgLy8gLy8gaWYgdGhlcmUgaXMgYW4gaW50ZXJlc3QgXG4gICAgICAvLyBpZiAoaW50ZXJlc3RzLmxlbmd0aCA+IDApe1xuICAgICAgLy8gICBpbnRlcmVzdHMuZm9yRWFjaChpbnRlcmVzdCA9PntcbiAgICAgIC8vICAgICBsZXQgc3RhcnQgPSBuZXcgRGF0ZShpbnRlcmVzdC5zdGFydCk7XG4gICAgICAvLyAgICAgbGV0IGVuZCA9IG5ldyBEYXRlKGludGVyZXN0LmVuZCk7XG4gICAgICAvLyAgICAgbGV0IGR1cmF0aW9uID0gZW5kLmdldFRpbWUoKSAtIHN0YXJ0LmdldFRpbWUoKTtcbiAgICAgIC8vICAgICBsZXQgc2luY2VMYXN0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSBlbmQuZ2V0VGltZSgpO1xuICAgICAgLy8gICAgIC8vIGlmIHNpbmNlTGFzdCA+IDYwIHNlY29uZHMgPC0gdGhpcyBpcyBjcnVjaWFsIGZvciBrbm93aW5nIGlmIGl0IGlzIGF3YXlcbiAgICAgIC8vICAgICBjb25zb2xlLmxvZyhcIkludGVyZXN0IHhhLjogXCIraW50ZXJlc3QuYmVhY29uK1wiLCBzaW5jZUxhc3Q6IFwiK3NpbmNlTGFzdCtcIiwgZHVyYXRpb246IFwiK2R1cmF0aW9uKTtcbiAgICAgIC8vICAgICBpZihzaW5jZUxhc3QgPiA2MDAwMCl7XG4gICAgICAvLyAgICAgICAvLyBpZiBkdXJhdGlvbiAgPiAxIG1pbnV0ZSB0aGVuIHNlbmQgaW50ZXJlc3RcbiAgICAgIC8vICAgICAgIGlmKCBkdXJhdGlvbiA+IDYwMDAwKXtcbiAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2coXCJTZW5kaW5nIGludGVyZXN0IGIgYi46IFwiK2ludGVyZXN0LmJlYWNvbilcbiAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2coXCJBY3R1YWwgaW1wbGVtZW50YXRpb24gcGVuZGluZy4uIHdvcmsgaW4gcHJvZ3Jlc3MuLlwiKTtcbiAgICAgIC8vICAgICAgICAgdGhpcy5pbnRlcmVzdFNlcnZpY2UuY3JlYXRlSW50ZXJlc3QoaW50ZXJlc3QpLnN1YnNjcmliZShyZXNwb25zZSA9PiB7IFxuICAgICAgLy8gICAgICAgICAgIC8vIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAvLyAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJJbnRlcmVzdCBTZW50IVwiKS5zaG93KCk7XG4gICAgICAvLyAgICAgICAgIH0sZXJyb3IgPT4ge1xuICAgICAgLy8gICAgICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAvLyAgICAgICAgICAgYWxlcnQoXCJFcnJvciBzZW5kaW5nIHRoZSBpbnRlcmVzdDogXCIrZXJyb3IpO1xuICAgICAgLy8gICAgICAgICAgIC8vIHRocm93IG5ldyBFcnJvcihlcnJvcik7XG4gICAgICAvLyAgICAgICAgIH0pO1xuICAgICAgLy8gICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkludGVyZXN0IHN0b3JlZC5cIikuc2hvdygpO1xuICAgICAgLy8gICAgICAgfVxuICAgICAgLy8gICAgICAgY29uc29sZS5sb2coXCJEZWxldGluZyBpbnRlcmVzdCBkdWUgdG8gbW9yZSB0aGFuIDEgbWludXRlIGF3YXkgYy46IFwiK2ludGVyZXN0LmlkKTtcbiAgICAgIC8vICAgICAgIHRoaXMuaW50ZXJlc3REYXRhYmFzZVNlcnZpY2UuZGVsZXRlSW50ZXJlc3QoaW50ZXJlc3QuaWQpO1xuICAgICAgLy8gICAgIH1cbiAgICAgIC8vICAgfSk7XG4gICAgICAvLyB9XG4gICAgfVxuICB9XG5cbiAgdmVyaWZ5SW50ZXJlc3QoKXtcbiAgICAvLyBSZXRyaXZlIGFsbCBpbnRlcmVzdHMgKHNob3VsZCBiZSBtYXggMSlcbiAgICBsZXQgaW50ZXJlc3RzID0gdGhpcy5pbnRlcmVzdERhdGFiYXNlU2VydmljZS5zZWxlY3RJbnRlcmVzdHMoKTtcblxuICAgIGNvbnNvbGUubG9nKFwiaG93IG1hbnkgaW50ZXJzdHM6IFwiK2ludGVyZXN0cy5sZW5ndGgpO1xuICAgIC8vIGlmIHRoZXJlIGlzIGFuIGludGVyZXN0IFxuICAgIGlmIChpbnRlcmVzdHMubGVuZ3RoID4gMCl7XG4gICAgICBpbnRlcmVzdHMuZm9yRWFjaChpbnRlcmVzdCA9PntcbiAgICAgICAgbGV0IHN0YXJ0ID0gbmV3IERhdGUoaW50ZXJlc3Quc3RhcnQpO1xuICAgICAgICBsZXQgZW5kID0gbmV3IERhdGUoaW50ZXJlc3QuZW5kKTtcbiAgICAgICAgbGV0IGR1cmF0aW9uID0gZW5kLmdldFRpbWUoKSAtIHN0YXJ0LmdldFRpbWUoKTtcbiAgICAgICAgbGV0IHNpbmNlTGFzdCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gZW5kLmdldFRpbWUoKTtcbiAgICAgICAgLy8gaWYgc2luY2VMYXN0ID4gNjAgc2Vjb25kcyA8LSB0aGlzIGlzIGNydWNpYWwgZm9yIGtub3dpbmcgaWYgaXQgaXMgYXdheVxuICAgICAgICBjb25zb2xlLmxvZyhcIkludGVyZXN0IHhhLjogXCIraW50ZXJlc3QuYmVhY29uK1wiLCBzaW5jZUxhc3Q6IFwiK3NpbmNlTGFzdCtcIiwgZHVyYXRpb246IFwiK2R1cmF0aW9uKTtcbiAgICAgICAgaWYoc2luY2VMYXN0ID4gNjAwMDApe1xuICAgICAgICAgIC8vIGlmIGR1cmF0aW9uICA+IDEgbWludXRlIHRoZW4gc2VuZCBpbnRlcmVzdFxuICAgICAgICAgIGlmKCBkdXJhdGlvbiA+IDYwMDAwKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyBpbnRlcmVzdCBiIGIuOiBcIitpbnRlcmVzdC5iZWFjb24pXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkFjdHVhbCBpbXBsZW1lbnRhdGlvbiBwZW5kaW5nLi4gd29yayBpbiBwcm9ncmVzcy4uXCIpO1xuICAgICAgICAgICAgdGhpcy5pbnRlcmVzdFNlcnZpY2UuY3JlYXRlSW50ZXJlc3QoaW50ZXJlc3QpLnN1YnNjcmliZShyZXNwb25zZSA9PiB7IFxuICAgICAgICAgICAgICAvLyB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkludGVyZXN0IFNlbnQhXCIpLnNob3coKTtcbiAgICAgICAgICAgIH0sZXJyb3IgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgICBhbGVydChcIkVycm9yIHNlbmRpbmcgdGhlIGludGVyZXN0OiBcIitlcnJvcik7XG4gICAgICAgICAgICAgIC8vIHRocm93IG5ldyBFcnJvcihlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiSW50ZXJlc3Qgc3RvcmVkLlwiKS5zaG93KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiRGVsZXRpbmcgaW50ZXJlc3QgZHVlIHRvIG1vcmUgdGhhbiAxIG1pbnV0ZSBhd2F5IGMuOiBcIitpbnRlcmVzdC5pZCk7XG4gICAgICAgICAgdGhpcy5pbnRlcmVzdERhdGFiYXNlU2VydmljZS5kZWxldGVJbnRlcmVzdChpbnRlcmVzdC5pZCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gIFxuICB9XG5cbiAgdmVyaWZ5Q29udHJhY3QyKCl7XG4gICAgY29uc29sZS5sb2coXCJWZXJpZnlpbmcgY29udHJhY3RzLi5cIik7XG4gICAgLy8gdGhpcy5pc0J1c3kgPSB0cnVlO1xuICAgIGxldCBuZWFyYnlTdG9yZXMgPSB0aGlzLm5lYXJieVN0b3JlcygpO1xuICAgIGNvbnNvbGUubG9nKFwiTmVhcmJ5IHN0b3JlczogXCIrbmVhcmJ5U3RvcmVzLmxlbmd0aClcbiAgICBpZiAobmVhcmJ5U3RvcmVzLmxlbmd0aD4wKXtcbiAgICAgIG5lYXJieVN0b3Jlcy5mb3JFYWNoKHN0b3JlID0+IHtcbiAgICAgICAgdGhpcy5jb250cmFjdFNlcnZpY2UuZ2V0QWN0aXZlQ29udHJhY3QoIHRoaXMuX2N1c3RvbWVyX2lkICxwYXJzZUludChzdG9yZS5sb2NhdGlvbl9pZCkpXG4gICAgICAgIC5zdWJzY3JpYmUocmVzcG9uc2VDb250cmFjdCA9PiB7XG4gICAgICAgICAgaWYgKCFyZXNwb25zZUNvbnRyYWN0Lm1lc3NhZ2Upe1xuICAgICAgICAgICAgdGhpcy5fY29udHJhY3QgPSByZXNwb25zZUNvbnRyYWN0O1xuICAgICAgICAgICAgdGhpcy5jYW5Db250cmFjdCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5oYXNDb250cmFjdCA9IHRydWU7XG4gICAgICAgICAgICBpZiAodGhpcy5fY29udHJhY3Qub3B0aW9uc1snZXhwaXJlX21ldGhvZCddPT1cImxvY2F0aW9uXCIpe1xuICAgICAgICAgICAgICB0aGlzLmV4cGlyYXRpb25UZXh0ID0gXCJFeHBpcmVzIGxlYXZpbmcgdGhlIHN0b3JlLlwiO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgIGxldCBkdCA9IG5ldyBEYXRlKHRoaXMuX2NvbnRyYWN0LmV4cGlyZSk7XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICB0aGlzLmV4cGlyYXRpb25UZXh0ID0gXCJFeHBpcmVzIGF0OiBcIitkdC5nZXREYXRlKCkrXCIvXCIrZHQuZ2V0TW9udGgoKStcIi9cIitkdC5nZXRGdWxsWWVhcigpK1wiIFwiK2R0LmdldEhvdXJzKCkrXCI6XCIrZHQuZ2V0TWludXRlcygpK1wiOlwiK2R0LmdldFNlY29uZHMoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX2NvbnRyYWN0Lm9wdGlvbnNbJ3NoZWxmX2luZm8nXT09XCJ0cnVlXCIpe1xuICAgICAgICAgICAgICB0aGlzLnNoZWxmSW5mbyA9IHRydWU7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgdGhpcy5zaGVsZkluZm8gPSBmYWxzZTsgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMubG9jYXRpb25faWQgPSBzdG9yZS5sb2NhdGlvbl9pZDtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQWN0aXZlIGNvbnRyYWN0LlwiKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgfSxlcnJvciA9PiB7XG4gICAgICAgICAgaWYgKGVycm9yLnN0YXR1cyA9PSA0MDQpe1xuICAgICAgICAgICAgdGhpcy5jYW5Db250cmFjdCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmhhc0NvbnRyYWN0ID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnNoZWxmSW5mbyA9IGZhbHNlO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJObyBhY3RpdmUgQ29udHJhY3RzLlwiKTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJWaXNpdHMgYW5kIGludGVyZXN0cyB0byBzZW5kP1wiKTtcblxuICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBnZXR0aW5nIGFjdGl2ZSBjb250cmFjdCBpbmZvcm1hdGlvbjogXCIrZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlOyAgXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfWVsc2V7XG4gICAgICBjb25zb2xlLmxvZyhcImFib3V0IHRvIHZlcmlmeSBjb250cmFjdCB3aXRob3V0IHN0b3JlL2xvY2F0aW9uXCIpO1xuICAgICAgY29uc29sZS5sb2coXCJjdXN0OiBcIit0aGlzLl9jdXN0b21lcl9pZCk7XG4gICAgICB0aGlzLmNvbnRyYWN0U2VydmljZS5nZXRBY3RpdmVDb250cmFjdCggdGhpcy5fY3VzdG9tZXJfaWQgKVxuICAgICAgICAuc3Vic2NyaWJlKHJlc3BvbnNlQ29udHJhY3QgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwibWVzc2FnZT8gXCIrcmVzcG9uc2VDb250cmFjdCk7XG4gICAgICAgICAgaWYgKCFyZXNwb25zZUNvbnRyYWN0Lm1lc3NhZ2Upe1xuICAgICAgICAgICAgdGhpcy5fY29udHJhY3QgPSByZXNwb25zZUNvbnRyYWN0O1xuICAgICAgICAgICAgdGhpcy5jYW5Db250cmFjdCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5oYXNDb250cmFjdCA9IHRydWU7XG4gICAgICAgICAgICBpZiAodGhpcy5fY29udHJhY3Qub3B0aW9uc1snZXhwaXJlX21ldGhvZCddPT1cImxvY2F0aW9uXCIpe1xuICAgICAgICAgICAgICB0aGlzLmV4cGlyYXRpb25UZXh0ID0gXCJFeHBpcmVzIGxlYXZpbmcgdGhlIHN0b3JlLlwiO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgIGxldCBkdCA9IG5ldyBEYXRlKHRoaXMuX2NvbnRyYWN0LmV4cGlyZSk7XG4gICAgICAgICAgICAgIHRoaXMuZXhwaXJhdGlvblRleHQgPSBcIkV4cGlyZXMgYXQ6IFwiK2R0LmdldERhdGUoKStcIi9cIitkdC5nZXRNb250aCgpK1wiL1wiK2R0LmdldEZ1bGxZZWFyKCkrXCIgXCIrZHQuZ2V0SG91cnMoKStcIjpcIitkdC5nZXRNaW51dGVzKCkrXCI6XCIrZHQuZ2V0U2Vjb25kcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuX2NvbnRyYWN0Lm9wdGlvbnNbJ3NoZWxmX2luZm8nXT09XCJ0cnVlXCIpe1xuICAgICAgICAgICAgICB0aGlzLnNoZWxmSW5mbyA9IHRydWU7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgdGhpcy5zaGVsZkluZm8gPSBmYWxzZTsgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmxvY2F0aW9uX2lkID0gcmVzcG9uc2VDb250cmFjdC5sb2NhdGlvbl9pZDtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQWN0aXZlIGNvbnRyYWN0LlwiKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY29udHJhY3QgYnV0IG5vIG1lc3NhZ2VcIilcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgfSxlcnJvciA9PiB7XG4gICAgICAgICAgaWYgKGVycm9yLnN0YXR1cyA9PSA0MDQpe1xuICAgICAgICAgICAgdGhpcy5jYW5Db250cmFjdCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmhhc0NvbnRyYWN0ID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnNoZWxmSW5mbyA9IGZhbHNlO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJObyBhY3RpdmUgQ29udHJhY3RzLlwiKTtcbiAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgZ2V0dGluZyBhY3RpdmUgY29udHJhY3QgaW5mb3JtYXRpb246IFwiK2Vycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTsgIFxuICAgICAgICB9KTtcbiAgICB9XG4gIH1cbiAgdmVyaWZ5Q29udHJhY3QoKXtcbiAgICBjb25zb2xlLmxvZyhcIk5ldyB2ZXJpZmljYXRpb24gb2YgY29udHJhY3RzLi5cIik7XG4gICAgdGhpcy5jb250cmFjdFNlcnZpY2UuZ2V0QWN0aXZlQ29udHJhY3QoIHRoaXMuX2N1c3RvbWVyX2lkIClcbiAgICAgICAgLnN1YnNjcmliZShyZXNwb25zZUNvbnRyYWN0ID0+IHtcbiAgICAgICAgICBpZiAoIXJlc3BvbnNlQ29udHJhY3QubWVzc2FnZSl7XG4gICAgICAgICAgICB0aGlzLl9jb250cmFjdCA9IHJlc3BvbnNlQ29udHJhY3Q7XG4gICAgICAgICAgICB0aGlzLmNhbkNvbnRyYWN0ID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmhhc0NvbnRyYWN0ID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jb250cmFjdC5vcHRpb25zWydleHBpcmVfbWV0aG9kJ109PVwibG9jYXRpb25cIil7XG4gICAgICAgICAgICAgIHRoaXMuZXhwaXJhdGlvblRleHQgPSBcIkV4cGlyZXMgbGVhdmluZyB0aGUgc3RvcmUuXCI7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgbGV0IGR0ID0gbmV3IERhdGUodGhpcy5fY29udHJhY3QuZXhwaXJlKTtcbiAgICAgICAgICAgICAgdGhpcy5leHBpcmF0aW9uVGV4dCA9IFwiRXhwaXJlcyBhdDogXCIrZHQuZ2V0RGF0ZSgpK1wiL1wiK2R0LmdldE1vbnRoKCkrXCIvXCIrZHQuZ2V0RnVsbFllYXIoKStcIiBcIitkdC5nZXRIb3VycygpK1wiOlwiK2R0LmdldE1pbnV0ZXMoKStcIjpcIitkdC5nZXRTZWNvbmRzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5fY29udHJhY3Qub3B0aW9uc1snc2hlbGZfaW5mbyddPT1cInRydWVcIil7XG4gICAgICAgICAgICAgIHRoaXMuc2hlbGZJbmZvID0gdHJ1ZTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICB0aGlzLnNoZWxmSW5mbyA9IGZhbHNlOyBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubG9jYXRpb25faWQgPSByZXNwb25zZUNvbnRyYWN0LmxvY2F0aW9uX2lkO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJBY3RpdmUgY29udHJhY3QuXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJjb250cmFjdCBidXQgbm8gbWVzc2FnZVwiKVxuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICB9LGVycm9yID0+IHtcbiAgICAgICAgICBpZiAoZXJyb3Iuc3RhdHVzID09IDQwNCl7XG4gICAgICAgICAgICB0aGlzLmNhbkNvbnRyYWN0ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuaGFzQ29udHJhY3QgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuc2hlbGZJbmZvID0gZmFsc2U7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vIGFjdGl2ZSBDb250cmFjdHMuXCIpO1xuICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBnZXR0aW5nIGFjdGl2ZSBjb250cmFjdCBpbmZvcm1hdGlvbjogXCIrZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlOyAgXG4gICAgICAgIH0pO1xuICB9XG5cbiAgLy8gTG9jYXRpb24gcmVmYWN0b3JcbiAgLy8gcHJpdmF0ZSBnZXRDdXJyZW50TG9jYXRpb24oKXtcbiAgLy8gICAvLyBUT0RPIGdldCBvd24gY29vcmRlbmF0ZXNcbiAgLy8gICB0aGlzLmlzQnVzeSA9IHRydWU7XG4gIC8vICAgdGhpcy5sb2NhdGlvblNlcnZpY2UuZ2V0Q3VycmVudExvY2F0aW9uKClcbiAgLy8gICAgIC50aGVuKChsb2NhdGlvbjogTG9jYXRpb24pID0+IHtcbiAgLy8gICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgLy8gICAgICAgaWYobG9jYXRpb24gIT0gdW5kZWZpbmVkKXtcbiAgLy8gICAgICAgICB0aGlzLl9jdXJyZW50X2xvY2F0aW9uID0gbG9jYXRpb247XG4gIC8vICAgICAgICAgdGhpcy5pc0N1cnJlbnRMb2NhdGlvbiA9IHRydWU7XG4gIC8vICAgICAgIH1cbiAgLy8gICAgICAgZWxzZXtcbiAgLy8gICAgICAgICB0aHJvdyBcIkxvY2F0aW9uIG5vdCBmb3VuZFwiO1xuICAvLyAgICAgICB9IFxuICAvLyAgICAgfVxuICAvLyAgICAgKS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgLy8gICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgLy8gICAgICAgYWxlcnQoZXJyb3IpXG4gIC8vICAgICB9KTtcbiAgLy8gfVxuXG5cbiAgLy8gTUVUSE9EUyBPTkxZIEZPUiBURVNUSU5HIERBVEFCQVNFXG4gIHB1YmxpYyBzaG93TG9jYXRpb25zSW5EYXRhYmFzZSgpIHsgXG4gICAgdGhpcy5fbG9jYXRpb25zX2luX2RiLmZvckVhY2gobG9jYXRpb24gPT4ge1xuICAgICAgYWxlcnQoXCJMb2NhdGlvbjogXCIrbG9jYXRpb24ubmFtZSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBMb2NhdGlvbiByZWZhY3RvclxuICAvLyBwdWJsaWMgaXNMb2NhdGlvbkRhdGFiYXNlRW1wdHkoKXtcbiAgLy8gICBsZXQgZW1wdHkgPSB0cnVlO1xuICAvLyAgIC8vIGNvbnNvbGUubG9nKFwiVGVzdDEuNlwiKTtcbiAgLy8gICAvLyBjb25zb2xlLmxvZyhcIlRlc3QxLjcsIGxlbmd0aDogXCIrdGhpcy5sb2NhdGlvbkRhdGFiYXNlU2VydmljZS5zZWxlY3RBbGxMb2NhdGlvbnMoKS5sZW5ndGgpO1xuICAvLyAgIGlmICh0aGlzLmxvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlLnNlbGVjdEFsbExvY2F0aW9ucygpLmxlbmd0aCA+IDApe1xuICAvLyAgICAgY29uc29sZS5sb2coXCJEYXRhYmFzZSBlbXB0eVwiKTtcbiAgLy8gICAgIGVtcHR5ID0gZmFsc2U7XG4gIC8vICAgfVxuICAvLyAgIHJldHVybiBlbXB0eTtcbiAgLy8gfVxuXG4gIC8vIExvY2F0aW9uIHJlZmFjdG9yXG4gIC8vIHB1YmxpYyB1cGRhdGVMb2NhdGlvbkRhdGFiYXNlKCl7XG4gIC8vICAgLy8gYWxlcnQoXCJ1cGRhdGluZyBsb2NhdGlvbnMgZGIuLlwiKVxuICAvLyAgIC8vIERyb3BzIERCIGlmICBleGlzdFxuICAvLyAgIHRoaXMubG9jYXRpb25EYXRhYmFzZVNlcnZpY2UuZHJvcFRhYmxlKCk7XG4gIC8vICAgLy8gQ3JlYXRlcyBEQiBpZiBub3QgZXhpc3RcbiAgLy8gICB0aGlzLmxvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlLmNyZWF0ZVRhYmxlKCk7XG5cbiAgLy8gICB0aGlzLmlzQnVzeSA9IHRydWU7XG4gIC8vICAgdGhpcy5sb2NhdGlvblNlcnZpY2UuZ2V0TG9jYXRpb25zKClcbiAgLy8gICAgIC5zdWJzY3JpYmUocmVzcG9uc2UgPT4ge1xuICAvLyAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICBcbiAgLy8gICAgICAgcmVzcG9uc2UuZm9yRWFjaChsb2NhdGlvbiA9PiB7XG4gIC8vICAgICAgICAgLy8gY29uc29sZS5sb2coXCJsb2NhdGlvbiBuYW1lOiBcIisgbG9jYXRpb24ubmFtZSk7XG4gIC8vICAgICAgICAgdGhpcy5sb2NhdGlvbkRhdGFiYXNlU2VydmljZS5pbnNlcnRMb2NhdGlvbihsb2NhdGlvbik7XG5cbiAgLy8gICAgICAgfSk7XG4gIC8vICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9tYWluXCJdKTsgIFxuICAvLyAgICAgfSxlcnJvciA9PiB7XG4gIC8vICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gIC8vICAgICAgIGFsZXJ0KGVycm9yKTtcbiAgLy8gICAgIH0pO1xuICAvLyB9XG5cbiAgcHVibGljIGlzQmVhY29uRGF0YWJhc2VFbXB0eSgpe1xuICAgIGxldCBlbXB0eSA9IHRydWU7XG4gICAgLy8gY29uc29sZS5sb2coXCJUZXN0MS42XCIpO1xuICAgIC8vIGNvbnNvbGUubG9nKFwiVGVzdDEuNywgbGVuZ3RoOiBcIit0aGlzLmxvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlLnNlbGVjdEFsbExvY2F0aW9ucygpLmxlbmd0aCk7XG4gICAgaWYgKHRoaXMuYmVhY29uRGF0YWJhc2VTZXJ2aWNlLnNlbGVjdEJlYWNvbnMoXCJhbGxcIikubGVuZ3RoID4gMCl7XG4gICAgICBlbXB0eSA9IGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBlbXB0eTtcbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVCZWFjb25EYXRhYmFzZSgpe1xuICAgIC8vIGFsZXJ0KFwidXBkYXRpbmcgbG9jYXRpb25zIGRiLi5cIilcbiAgICAvLyBEcm9wcyBEQiBpZiAgZXhpc3RcbiAgICB0aGlzLmJlYWNvbkRhdGFiYXNlU2VydmljZS5kcm9wVGFibGUoKTtcbiAgICAvLyBDcmVhdGVzIERCIGlmIG5vdCBleGlzdFxuICAgIHRoaXMuYmVhY29uRGF0YWJhc2VTZXJ2aWNlLmNyZWF0ZVRhYmxlKCk7XG4gICAgY29uc29sZS5sb2coXCJMb2NhbCBEQiBjcmVhdGVkLCBubyBlcnJvcnMgc28gZmFyLi5cIik7XG4gICAgdGhpcy5pc0J1c3kgPSB0cnVlO1xuICAgIHRoaXMuYmVhY29uU2VydmljZS5nZXRCZWFjb25zKClcbiAgICAgIC5zdWJzY3JpYmUocmVzcG9uc2UgPT4ge1xuICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICBcbiAgICAgICAgcmVzcG9uc2UuZm9yRWFjaChiZWFjb24gPT4ge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwibG9jYXRpb24gbmFtZTogXCIrIGxvY2F0aW9uLm5hbWUpO1xuICAgICAgICAgIHRoaXMuYmVhY29uRGF0YWJhc2VTZXJ2aWNlLmluc2VydEJlYWNvbihiZWFjb24pO1xuXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkxvY2FsIERCIHVwZGF0ZWQuXCIpO1xuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvXCJdLCB7IGNsZWFySGlzdG9yeTogdHJ1ZSB9KTtcbiAgICAgIH0sZXJyb3IgPT4ge1xuICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICBhbGVydChlcnJvcik7XG4gICAgICB9KTtcbiAgfVxuXG4gIHNob3dCb3R0b21TaGVldChiZWFjb246c3RyaW5nLCB0aXRsZTpzdHJpbmcgPSBcIllvdXIgc2VsZWN0aW9uOlwiKTogdm9pZCB7XG5cbiAgICBjb25zdCBvblNlbGVjdGlvbiA9IHJlc3BvbnNlID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKFwiVGhlIHJlc3BvbnNlIGZvciBzaGVsZiB3YXM6IFwiK3Jlc3BvbnNlKTtcbiAgICAgIGlmIChyZXNwb25zZSA9PSBcIk9rYXlcIil7XG4gICAgICAgIC8vIGFsZXJ0KHtcbiAgICAgICAgLy8gICB0aXRsZTogdGl0bGUsXG4gICAgICAgIC8vICAgbWVzc2FnZTogcmVzcG9uc2UsXG4gICAgICAgIC8vICAgb2tCdXR0b25UZXh0OiBcIkdvXCJcbiAgICAgICAgLy8gfSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiR29pbmcgdG8gc2hlbGYtaW5mb1wiKTtcbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL3NoZWxmLWluZm9cIixiZWFjb25dLCB7XG4gICAgICAgICAgLy8gYW5pbWF0aW9uOiB0cnVlLFxuICAgICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZUxlZnRcIixcbiAgICAgICAgICAgICAgZHVyYXRpb246IDIwMCxcbiAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgXG4gICAgfTtcblxuICAgIGNvbnN0IG9wdGlvbnM6IERpYWxvZ09wdGlvbnMgPSB7XG4gICAgICBkaWFsb2dTdHlsZTogQ0ZBbGVydFN0eWxlLkJPVFRPTV9TSEVFVCxcbiAgICAgIHRpdGxlOiBcIkluZm9ybWF0aW9uIGF2YWlsYWJsZSFcIixcbiAgICAgIG1lc3NhZ2U6IFwiV291bGQgeW91IGxpa2UgdG8ga25vdyBtb3JlIGFib3V0IFwiK2JlYWNvbitcIj9cIixcbiAgICAgIGJ1dHRvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHRleHQ6IFwiT2theVwiLFxuICAgICAgICAgIGJ1dHRvblN0eWxlOiBDRkFsZXJ0QWN0aW9uU3R5bGUuUE9TSVRJVkUsXG4gICAgICAgICAgYnV0dG9uQWxpZ25tZW50OiBDRkFsZXJ0QWN0aW9uQWxpZ25tZW50LkpVU1RJRklFRCxcbiAgICAgICAgICBvbkNsaWNrOiBvblNlbGVjdGlvblxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdGV4dDogXCJOb3BlXCIsXG4gICAgICAgICAgYnV0dG9uU3R5bGU6IENGQWxlcnRBY3Rpb25TdHlsZS5ORUdBVElWRSxcbiAgICAgICAgICBidXR0b25BbGlnbm1lbnQ6IENGQWxlcnRBY3Rpb25BbGlnbm1lbnQuSlVTVElGSUVELFxuICAgICAgICAgIG9uQ2xpY2s6IG9uU2VsZWN0aW9uXG4gICAgICAgIH1dXG4gICAgfTtcbiAgICB0aGlzLmNmYWxlcnREaWFsb2cuc2hvdyhvcHRpb25zKTtcblxuICB9XG4gIHB1YmxpYyBwbGF5VmlkZW8odmlkZW8pe1xuICAgIG9wZW5VcmwodmlkZW8pO1xuICB9XG59Il19