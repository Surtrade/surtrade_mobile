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
var beacon_service_1 = require("../../shared/beacon/beacon.service");
var beacon_db_service_1 = require("../../shared/beacon/beacon.db.service");
var contract_service_1 = require("../../shared/contract/contract.service");
var application = require("application");
var application_1 = require("application");
var platform_1 = require("platform");
var beacon_1 = require("../../shared/beacon/beacon");
// import { storage } from "../../utils/local";
var appSettings = require("application-settings");
// estimote beacons
var Estimote = require("nativescript-estimote-sdk");
var Permissions = require("nativescript-permissions");
var MainComponent = (function () {
    function MainComponent(
        // private locationService: LocationService,
        // private locationDatabaseService: LocationDatabaseService,
        beaconService, beaconDatabaseService, contractService, route, router, locationCommon, zone, page) {
        this.beaconService = beaconService;
        this.beaconDatabaseService = beaconDatabaseService;
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
    MainComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log("Main on Init");
        // Return to login if app settings are not set
        if (!appSettings.hasKey("user_name") || !appSettings.hasKey("user_password")) {
            this.router.navigate(["/"]), { clearHistory: true };
        }
        if (platform_1.isAndroid) {
            application.android.on(application_1.AndroidApplication.activityBackPressedEvent, function (data) {
                _this.router.navigate(["/"]), { clearHistory: true };
                // this.logout();
            });
        }
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
                console.log("Amount of Beacons in range: " + beacons.length);
                _this.zone.run(function () {
                    // console.log("Amount of Beacons in range: "+beacons.count)
                    if (beacons.length > 0) {
                        _this.currentBeacons = [];
                        beacons.forEach(function (beacon) {
                            if (beacon.major) {
                                var b = new beacon_1.Beacon(beacon.major.toString(), beacon.minor.toString());
                                // console.log("Beacon identificator "+b.identificator);
                                _this.currentBeacons.push(b);
                            }
                        });
                        // Check for active contracts
                        _this.verifyContract();
                        console.log("+++++++++++++++++++++++++");
                        // Check for nearby item beacons
                        _this.verifyBehavior();
                        console.log("-------------------------");
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
        //Updates the DB, this should not be done every time, but rather once every day
        if (this.isBeaconDatabaseEmpty()) {
            console.log("Local DB is empty.");
            this.updateBeaconDatabase();
        }
        else {
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
        var stores = [];
        // this.beaconDatabaseService.selectAllBeacons("where role=store").forEach(storeDB=>{
        this.beaconDatabaseService.selectBeacons("store").forEach(function (storeDB) {
            // console.log("storeDB iden: "+storeDB.identificator);
            _this.currentBeacons.forEach(function (beaconCurrent) {
                // console.log("beaconCurrent iden: "+beaconCurrent.identificator);
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
    MainComponent.prototype.verifyBehavior = function () {
        var nearbyItems = this.nearbyItems();
        console.log("Nearby items: " + nearbyItems.length);
    };
    MainComponent.prototype.verifyContract = function () {
        var _this = this;
        console.log("Verifying contracts..");
        this.isBusy = true;
        var nearbyStores = this.nearbyStores();
        console.log("Nearby stores: " + nearbyStores.length);
        if (nearbyStores.length > 0) {
            nearbyStores.forEach(function (store) {
                _this.contractService.getActiveContract(store.location_id, _this._customer_id)
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
            providers: [beacon_service_1.BeaconService, beacon_db_service_1.BeaconDatabaseService, contract_service_1.ContractService],
            // providers: [LocationService, LocationDatabaseService, ContractService],
            // providers: [LocationService, ContractService],
            templateUrl: "pages/main/main.html",
            styleUrls: ["pages/main/main-common.css"]
        }),
        __metadata("design:paramtypes", [beacon_service_1.BeaconService,
            beacon_db_service_1.BeaconDatabaseService,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYWluLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUEwRDtBQUMxRCxvQ0FBc0M7QUFDdEMsaURBQWdEO0FBQ2hELDBDQUFpRDtBQUNqRCxzREFBK0Q7QUFDL0QsMENBQTZEO0FBTTdELDRFQUE0RTtBQUM1RSx1RkFBdUY7QUFDdkYscUVBQW1FO0FBQ25FLDJFQUE4RTtBQUM5RSwyRUFBeUU7QUFFekUseUNBQTJDO0FBQzNDLDJDQUFzRjtBQUN0RixxQ0FBcUM7QUFDckMscURBQW9EO0FBRXBELCtDQUErQztBQUMvQyxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUVsRCxtQkFBbUI7QUFDbkIsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFDcEQsc0RBQXdEO0FBWXhEO0lBb0NFO1FBQ0UsNENBQTRDO1FBQzVDLDREQUE0RDtRQUNwRCxhQUE0QixFQUM1QixxQkFBNEMsRUFDNUMsZUFBZ0MsRUFDaEMsS0FBcUIsRUFDckIsTUFBd0IsRUFDeEIsY0FBOEIsRUFDOUIsSUFBWSxFQUNaLElBQVU7UUFQVixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QiwwQkFBcUIsR0FBckIscUJBQXFCLENBQXVCO1FBQzVDLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUNoQyxVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQUNyQixXQUFNLEdBQU4sTUFBTSxDQUFrQjtRQUN4QixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFDOUIsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUNaLFNBQUksR0FBSixJQUFJLENBQU07UUF6Q3BCLDJDQUEyQztRQUNuQyxVQUFLLEdBQUcsUUFBUSxDQUFDO1FBV3pCLGVBQWU7UUFDZiw2QkFBNkI7UUFDdEIsc0JBQWlCLEdBQUcsS0FBSyxDQUFDO1FBQzFCLG1CQUFjLEdBQUcs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LENBQUMsVUFBVSxFQUFFO2FBQzVCLFNBQVMsQ0FBQyxVQUFBLFFBQVE7WUFDakIsS0FBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7WUFFcEIsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFBLE1BQU07Z0JBQ3JCLGlEQUFpRDtnQkFDakQsS0FBSSxDQUFDLHFCQUFxQixDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUVsRCxDQUFDLENBQUMsQ0FBQztZQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUNqQyxLQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDdEQsQ0FBQyxFQUFDLFVBQUEsS0FBSztZQUNMLEtBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1lBQ3BCLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNmLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQWhkVSxhQUFhO1FBVHpCLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsTUFBTTtZQUNoQixTQUFTLEVBQUUsQ0FBQyw4QkFBYSxFQUFFLHlDQUFxQixFQUFFLGtDQUFlLENBQUM7WUFDbEUsMEVBQTBFO1lBQzFFLGlEQUFpRDtZQUNqRCxXQUFXLEVBQUUsc0JBQXNCO1lBQ25DLFNBQVMsRUFBQyxDQUFDLDRCQUE0QixDQUFDO1NBQzNDLENBQUM7eUNBeUN5Qiw4QkFBYTtZQUNMLHlDQUFxQjtZQUMzQixrQ0FBZTtZQUN6Qix1QkFBYztZQUNiLHlCQUFnQjtZQUNSLGlCQUFjO1lBQ3hCLGFBQU07WUFDTixXQUFJO09BOUNULGFBQWEsQ0FpZHpCO0lBQUQsb0JBQUM7Q0FBQSxBQWpkRCxJQWlkQztBQWpkWSxzQ0FBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBOZ1pvbmUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0ICogYXMgZGlhbG9ncyBmcm9tIFwidWkvZGlhbG9nc1wiO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3VpL3BhZ2VcIjtcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlIH0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgUm91dGVyRXh0ZW5zaW9ucyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXJcIjtcbmltcG9ydCB7IExvY2F0aW9uIGFzIExvY2F0aW9uQ29tbW9uIH0gZnJvbSBcIkBhbmd1bGFyL2NvbW1vblwiO1xuXG5pbXBvcnQgeyBVc2VyIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC91c2VyL3VzZXJcIjtcbmltcG9ydCB7IExvY2F0aW9uIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9sb2NhdGlvbi9sb2NhdGlvblwiO1xuaW1wb3J0IHsgQ29udHJhY3QgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2NvbnRyYWN0L2NvbnRyYWN0XCI7XG5cbi8vIGltcG9ydCB7IExvY2F0aW9uU2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvbG9jYXRpb24vbG9jYXRpb24uc2VydmljZVwiO1xuLy8gaW1wb3J0IHsgTG9jYXRpb25EYXRhYmFzZVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zaGFyZWQvbG9jYXRpb24vbG9jYXRpb24uZGIuc2VydmljZSc7XG5pbXBvcnQgeyBCZWFjb25TZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9iZWFjb24vYmVhY29uLnNlcnZpY2VcIjtcbmltcG9ydCB7IEJlYWNvbkRhdGFiYXNlU2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvYmVhY29uL2JlYWNvbi5kYi5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBDb250cmFjdFNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2NvbnRyYWN0L2NvbnRyYWN0LnNlcnZpY2VcIjtcblxuaW1wb3J0ICogYXMgYXBwbGljYXRpb24gZnJvbSAnYXBwbGljYXRpb24nO1xuaW1wb3J0IHsgQW5kcm9pZEFwcGxpY2F0aW9uLCBBbmRyb2lkQWN0aXZpdHlCYWNrUHJlc3NlZEV2ZW50RGF0YSB9IGZyb20gXCJhcHBsaWNhdGlvblwiO1xuaW1wb3J0IHsgaXNBbmRyb2lkIH0gZnJvbSBcInBsYXRmb3JtXCI7XG5pbXBvcnQgeyBCZWFjb24gfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2JlYWNvbi9iZWFjb25cIjtcblxuLy8gaW1wb3J0IHsgc3RvcmFnZSB9IGZyb20gXCIuLi8uLi91dGlscy9sb2NhbFwiO1xudmFyIGFwcFNldHRpbmdzID0gcmVxdWlyZShcImFwcGxpY2F0aW9uLXNldHRpbmdzXCIpO1xuXG4vLyBlc3RpbW90ZSBiZWFjb25zXG52YXIgRXN0aW1vdGUgPSByZXF1aXJlKFwibmF0aXZlc2NyaXB0LWVzdGltb3RlLXNka1wiKTtcbmltcG9ydCAqIGFzIFBlcm1pc3Npb25zIGZyb20gXCJuYXRpdmVzY3JpcHQtcGVybWlzc2lvbnNcIjtcbmRlY2xhcmUgdmFyIGFuZHJvaWQ6IGFueTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwibWFpblwiLFxuICAgIHByb3ZpZGVyczogW0JlYWNvblNlcnZpY2UsIEJlYWNvbkRhdGFiYXNlU2VydmljZSwgQ29udHJhY3RTZXJ2aWNlXSxcbiAgICAvLyBwcm92aWRlcnM6IFtMb2NhdGlvblNlcnZpY2UsIExvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlLCBDb250cmFjdFNlcnZpY2VdLFxuICAgIC8vIHByb3ZpZGVyczogW0xvY2F0aW9uU2VydmljZSwgQ29udHJhY3RTZXJ2aWNlXSxcbiAgICB0ZW1wbGF0ZVVybDogXCJwYWdlcy9tYWluL21haW4uaHRtbFwiLFxuICAgIHN0eWxlVXJsczpbXCJwYWdlcy9tYWluL21haW4tY29tbW9uLmNzc1wiXSBcbn0pXG5cbmV4cG9ydCBjbGFzcyBNYWluQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0e1xuXG4gIC8vIHByaXZhdGUgdmFyaWFibGVzXG4gIHByaXZhdGUgX2N1cnJlbnRfbG9jYXRpb246IExvY2F0aW9uO1xuICBwcml2YXRlIGxvY2F0aW9uX2lkOiBzdHJpbmc7XG4gIC8vIHByaXZhdGUgX2FsbF9sb2NhdGlvbnM6IEFycmF5PExvY2F0aW9uPjtcbiAgcHJpdmF0ZSBfbmFtZSA9IFwiY2FybG9zXCI7XG4gIHByaXZhdGUgX2NvbnRyYWN0OiBDb250cmFjdDtcbiAgLy8gcHJpdmF0ZSBfbG9jYXRpb25fZGF0YWJhc2U6IGFueTtcbiAgcHJpdmF0ZSBfbG9jYXRpb25zX2luX2RiOiBBcnJheTxMb2NhdGlvbj47XG4gIC8vIHByaXZhdGUgX2xvY2F0aW9uX2lkOiBudW1iZXI7XG4gIHByaXZhdGUgX3dhdGNoX2xvY2F0aW9uX2lkOiBhbnk7XG4gIHByaXZhdGUgX2N1c3RvbWVyX2lkOiBudW1iZXI7XG5cbiAgLy8gcHVibGljIHZhcmlhYmxlc1xuICBwdWJsaWMgdGl0bGU6IHN0cmluZztcblxuICAvLyBidXR0b24gZmxhZ3NcbiAgLy8gcHVibGljIGluTG9jYXRpb24gPSBmYWxzZTtcbiAgcHVibGljIGlzQ3VycmVudExvY2F0aW9uID0gZmFsc2U7XG4gIHB1YmxpYyBpc0FsbExvY2F0aW9ucyA9IGZhbHNlO1xuICBwdWJsaWMgaXNCdXN5ID0gZmFsc2U7XG4gIHB1YmxpYyBjYW5Db250cmFjdCA9IGZhbHNlO1xuICBwdWJsaWMgaGFzQ29udHJhY3QgPSBmYWxzZTtcblxuICAvLyBCZWFjb24gdmFyaWFibGVcbiAgcHVibGljIGVzdGltb3RlOiBhbnk7XG4gIHB1YmxpYyBvcHRpb25zOiBhbnk7XG4gIHB1YmxpYyBjdXJyZW50QmVhY29uczogQXJyYXk8QmVhY29uPjtcbiAgcHVibGljIHBlcm1pc3Npb25zOiBhbnk7XG5cbiAgLy8gSWNvbnNcbiAgcHVibGljIGdlYXJzSWNvbiA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMHhmMDg1KTtcbiAgcHVibGljIGxvZ291dEljb24gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4ZjA4Yik7XG4gIHB1YmxpYyBoYW5kc2hha2VJY29uID0gU3RyaW5nLmZyb21DaGFyQ29kZSgweGYyYjUpO1xuICBcbiAgY29uc3RydWN0b3IoXG4gICAgLy8gcHJpdmF0ZSBsb2NhdGlvblNlcnZpY2U6IExvY2F0aW9uU2VydmljZSxcbiAgICAvLyBwcml2YXRlIGxvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlOiBMb2NhdGlvbkRhdGFiYXNlU2VydmljZSxcbiAgICBwcml2YXRlIGJlYWNvblNlcnZpY2U6IEJlYWNvblNlcnZpY2UsXG4gICAgcHJpdmF0ZSBiZWFjb25EYXRhYmFzZVNlcnZpY2U6IEJlYWNvbkRhdGFiYXNlU2VydmljZSxcbiAgICBwcml2YXRlIGNvbnRyYWN0U2VydmljZTogQ29udHJhY3RTZXJ2aWNlLFxuICAgIHByaXZhdGUgcm91dGU6IEFjdGl2YXRlZFJvdXRlLFxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXJFeHRlbnNpb25zLFxuICAgIHByaXZhdGUgbG9jYXRpb25Db21tb246IExvY2F0aW9uQ29tbW9uLFxuICAgIHByaXZhdGUgem9uZTogTmdab25lLFxuICAgIHByaXZhdGUgcGFnZTogUGFnZVxuICApe1xuICAgICAgY29uc29sZS5sb2coXCJNYWluIENvbnN0cnVjdG9yXCIpO1xuICAgICAgdGhpcy5pc0J1c3kgPSB0cnVlO1xuICAgICAgdGhpcy5fY3VycmVudF9sb2NhdGlvbiA9IG51bGw7XG4gICAgICAvLyB0aGlzLl9hbGxfbG9jYXRpb25zID0gW107XG4gICAgICB0aGlzLl9sb2NhdGlvbnNfaW5fZGIgPSBbXTtcbiAgICAgIC8vIHRoaXMuX2xvY2F0aW9uX2RhdGFiYXNlID0gdGhpcy5sb2NhdGlvbkRhdGFiYXNlU2VydmljZS5nZXREYXRhYmFzZSgpO1xuXG4gICAgICAvLyBCZWFjb25zIGluc3RhbmNlIFxuICAgICAgLy8gdGhpcy5lc3RpbW90ZSA9IG5ldyBFc3RpbW90ZShvcHRpb25zKTtcbiAgICAgIHRoaXMuY3VycmVudEJlYWNvbnMgPSBbXTtcbiAgICAgIC8vIHRoaXMucGVybWlzc2lvbnMgPSBuZXcgUGVybWlzc2lvbnMoKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGNvbnNvbGUubG9nKFwiTWFpbiBvbiBJbml0XCIpO1xuXG4gICAgLy8gUmV0dXJuIHRvIGxvZ2luIGlmIGFwcCBzZXR0aW5ncyBhcmUgbm90IHNldFxuICAgIGlmICghYXBwU2V0dGluZ3MuaGFzS2V5KFwidXNlcl9uYW1lXCIpIHx8ICFhcHBTZXR0aW5ncy5oYXNLZXkoXCJ1c2VyX3Bhc3N3b3JkXCIpKXtcbiAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9cIl0pLCB7IGNsZWFySGlzdG9yeTogdHJ1ZSB9O1xuICAgIH1cblxuICAgIGlmIChpc0FuZHJvaWQpIHtcbiAgICAgIGFwcGxpY2F0aW9uLmFuZHJvaWQub24oQW5kcm9pZEFwcGxpY2F0aW9uLmFjdGl2aXR5QmFja1ByZXNzZWRFdmVudCwgKGRhdGE6IEFuZHJvaWRBY3Rpdml0eUJhY2tQcmVzc2VkRXZlbnREYXRhKSA9PiB7XG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9cIl0pLCB7IGNsZWFySGlzdG9yeTogdHJ1ZSB9O1xuICAgICAgICAvLyB0aGlzLmxvZ291dCgpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy50aXRsZSA9IFwiV2VsY29tZSBcIisgYXBwU2V0dGluZ3MuZ2V0U3RyaW5nKFwidXNlcl9uYW1lXCIpOyAgICBcblxuICAgIHRyeXtcbiAgICAgIHRoaXMuX2N1c3RvbWVyX2lkID0gYXBwU2V0dGluZ3MuZ2V0TnVtYmVyKFwidXNlcl9pZFwiKTtcbiAgICAgIGNvbnNvbGUubG9nKFwidHJ5aW5nIGN1c3Q6IFwiK3RoaXMuX2N1c3RvbWVyX2lkKTtcbiAgICB9Y2F0Y2goZSl7XG4gICAgICB0aGlzLl9jdXN0b21lcl9pZCA9IDA7XG4gICAgfSAgICAgIFxuICAgICAgXG5cbiAgICAvLyBCZWFjb25zIHByb2Nlc3NcbiAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICByZWdpb24gOiAnUHJvZ3Jlc3MnLCAvLyBvcHRpb25hbFxuICAgICAgY2FsbGJhY2sgOiBiZWFjb25zID0+IHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJCZWFjb25zOiBcIitiZWFjb25zKVxuICAgICAgICBjb25zb2xlLmxvZyhcIkFtb3VudCBvZiBCZWFjb25zIGluIHJhbmdlOiBcIitiZWFjb25zLmxlbmd0aClcbiAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coXCJBbW91bnQgb2YgQmVhY29ucyBpbiByYW5nZTogXCIrYmVhY29ucy5jb3VudClcbiAgICAgICAgICBpZihiZWFjb25zLmxlbmd0aD4wKXtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEJlYWNvbnMgPSBbXTtcbiAgICAgICAgICAgIGJlYWNvbnMuZm9yRWFjaChiZWFjb24gPT4ge1xuICAgICAgICAgICAgICBpZihiZWFjb24ubWFqb3Ipe1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGxldCBiID1uZXcgQmVhY29uKGJlYWNvbi5tYWpvci50b1N0cmluZygpLGJlYWNvbi5taW5vci50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkJlYWNvbiBpZGVudGlmaWNhdG9yIFwiK2IuaWRlbnRpZmljYXRvcik7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50QmVhY29ucy5wdXNoKGIpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIGFjdGl2ZSBjb250cmFjdHNcbiAgICAgICAgICAgIHRoaXMudmVyaWZ5Q29udHJhY3QoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiKysrKysrKysrKysrKysrKysrKysrKysrK1wiKVxuICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIG5lYXJieSBpdGVtIGJlYWNvbnNcbiAgICAgICAgICAgIHRoaXMudmVyaWZ5QmVoYXZpb3IoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgXG4gICAgICB9XG4gICAgfVxuICAgIFxuXG4gICAgdGhpcy5lc3RpbW90ZSA9IG5ldyBFc3RpbW90ZSh0aGlzLm9wdGlvbnMpO1xuXG4gICAgaWYoaXNBbmRyb2lkKXtcbiAgICAgIGNvbnNvbGUubG9nKFwiSXQgaXMgQW5kcm9pZFwiKTtcbiAgICAgIFBlcm1pc3Npb25zLnJlcXVlc3RQZXJtaXNzaW9ucyhbXG4gICAgICAgIGFuZHJvaWQuTWFuaWZlc3QucGVybWlzc2lvbi5BQ0NFU1NfQ09BUlNFX0xPQ0FUSU9OLFxuICAgICAgICBhbmRyb2lkLk1hbmlmZXN0LnBlcm1pc3Npb24uQUNDRVNTX0ZJTkVfTE9DQVRJT04sXG4gICAgICAgIGFuZHJvaWQuTWFuaWZlc3QucGVybWlzc2lvbi5CTFVFVE9PVEgsXG4gICAgICAgIGFuZHJvaWQuTWFuaWZlc3QucGVybWlzc2lvbi5CTFVFVE9PVEhfQURNSU5dLCBcIlBlcm1pc3Npb25zIG9mIFN1cnRyYWRlXCIpXG4gICAgICAudGhlbigoKT0+e1xuICAgICAgICBjb25zb2xlLmxvZyhcIlBlcm1pc3Npb25zIGdyYW50ZWRcIik7XG4gICAgICAgIHRoaXMuZXN0aW1vdGUuc3RhcnRSYW5naW5nKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiU3RhcnQgcmFuZ2luZ1wiKTtcbiAgICAgIH0pLmNhdGNoKChlcnJvcik9PntcbiAgICAgICAgYWxlcnQoXCJFcnJvciBnZXR0aW5nIHBlcm1pc3Npb25zOiBcIitlcnJvci5tZXNzYWdlKTtcbiAgICAgIH0pO1xuICAgIH1lbHNle1xuICAgICAgY29uc29sZS5sb2coXCJJdCBpcyBpT1NcIik7XG4gICAgICB0aGlzLmVzdGltb3RlLnN0YXJ0UmFuZ2luZygpO1xuICAgICAgY29uc29sZS5sb2coXCJTdGFydCByYW5naW5nXCIpO1xuICAgIH1cblxuICAgIC8vIExvY2F0aW9uIHJlZmFjdG9yXG4gICAgLy8gQ3JlYXRlcyBEQiBpZiBub3QgZXhpc3RcbiAgICAvLyB0aGlzLmxvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlLmNyZWF0ZVRhYmxlKCk7XG5cbiAgICAvL1VwZGF0ZXMgdGhlIGxvY2F0aW9ucyBEQiwgdGhpcyBzaG91bGQgbm90IGJlIGRvbmUgZXZlcnkgdGltZSwgYnV0IHJhdGhlciBvbmNlIGV2ZXJ5IGRheVxuICAgIC8vIGlmKHRoaXMuaXNMb2NhdGlvbkRhdGFiYXNlRW1wdHkoKSl7XG4gICAgLy8gICB0aGlzLnVwZGF0ZUxvY2F0aW9uRGF0YWJhc2UoKTtcbiAgICAvLyB9XG5cbiAgICAvLyBFeHRyYWN0cyBsb2NhdGlvbnMgZnJvbSBEQlxuICAgIC8vIHRoaXMuX2xvY2F0aW9uc19pbl9kYiA9IHRoaXMubG9jYXRpb25EYXRhYmFzZVNlcnZpY2Uuc2VsZWN0QWxsTG9jYXRpb25zKCk7XG4gICAgLy8gLy8gU3RhcnQgd2F0Y2hpbmcgZm9yIGxvY2F0aW9uXG4gICAgLy8gLy8gdGhpcy5fd2F0Y2hfbG9jYXRpb25faWQgPSB0aGlzLmxvY2F0aW9uU2VydmljZS5zdGFydFdhdGNoaW5nTG9jYXRpb24oKTtcblxuXG4gICAgLy8gQ3JlYXRlcyBEQiBpZiBub3QgZXhpc3RcbiAgICAvLyB0aGlzLmJlYWNvbkRhdGFiYXNlU2VydmljZS5kcm9wVGFibGUoKTtcbiAgICB0aGlzLmJlYWNvbkRhdGFiYXNlU2VydmljZS5jcmVhdGVUYWJsZSgpO1xuXG4gICAgLy9VcGRhdGVzIHRoZSBEQiwgdGhpcyBzaG91bGQgbm90IGJlIGRvbmUgZXZlcnkgdGltZSwgYnV0IHJhdGhlciBvbmNlIGV2ZXJ5IGRheVxuICAgIGlmKHRoaXMuaXNCZWFjb25EYXRhYmFzZUVtcHR5KCkpe1xuICAgICAgY29uc29sZS5sb2coXCJMb2NhbCBEQiBpcyBlbXB0eS5cIik7XG4gICAgICB0aGlzLnVwZGF0ZUJlYWNvbkRhdGFiYXNlKCk7XG4gICAgfWVsc2V7XG4gICAgICBjb25zb2xlLmxvZyhcIkxvY2FsIERCIGhhcyBkYXRhLlwiKTtcbiAgICB9XG5cbiAgICB0aGlzLnBhZ2Uub24oJ25hdmlnYXRpbmdGcm9tJywgKGRhdGEpID0+IHtcbiAgICAgIC8vIHJ1biBkZXN0cm95IGNvZGVcbiAgICAgIC8vIChub3RlOiB0aGlzIHdpbGwgcnVuIHdoZW4geW91IGVpdGhlciBtb3ZlIGZvcndhcmQgdG8gYSBuZXcgcGFnZSBvciBiYWNrIHRvIHRoZSBwcmV2aW91cyBwYWdlKVxuICAgICAgLy8gQmVhY29ucyBzdG9wXG4gICAgICB0aGlzLmVzdGltb3RlLnN0b3BSYW5naW5nKCk7XG4gICAgICBjb25zb2xlLmxvZyhcIlN0b3AgcmFuZ2luZ1wiKTtcbiAgICB9KTtcblxuICB9XG5cbiAgcHVibGljIG5nT25EZXN0cm95KCkge1xuICAgIC8vQ2FsbGVkIG9uY2UsIGJlZm9yZSB0aGUgaW5zdGFuY2UgaXMgZGVzdHJveWVkLlxuICAgIC8vIExvY2F0aW9uIHJlZmFjdG9yXG4gICAgLy8gdGhpcy5sb2NhdGlvblNlcnZpY2Uuc3RvcFdhdGNoaW5nTG9jYXRpb24odGhpcy5fd2F0Y2hfbG9jYXRpb25faWQpXG5cbiAgICAvLyAvLyBCZWFjb25zIHN0b3BcbiAgICAvLyB0aGlzLmVzdGltb3RlLnN0b3BSYW5naW5nKCk7XG4gICAgLy8gY29uc29sZS5sb2coXCJTdG9wIHJhbmdpbmdcIik7XG4gIH1cblxuICBwdWJsaWMgY29udHJhY3RTZXR0aW5ncygpe1xuICAgIC8vIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9jb250cmFjdGNyZWF0ZS9cIit0aGlzLl9jdXJyZW50X2xvY2F0aW9uLmlkK1wiLzFcIl0sIHtcbiAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvY29udHJhY3RjcmVhdGVcIix0aGlzLmxvY2F0aW9uX2lkLDFdLCB7XG4gICAgICAvLyBhbmltYXRpb246IHRydWUsXG4gICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgbmFtZTogXCJzbGlkZUxlZnRcIixcbiAgICAgICAgICBkdXJhdGlvbjogMjAwLFxuICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgY3JlYXRlQ29udHJhY3QoKXtcblxuICAgIGxldCBzdG9yZXMgPSB0aGlzLm5lYXJieVN0b3JlcygpO1xuICAgIGxldCBzdG9yZV9uYW1lcyA9IFtdO1xuICAgIC8vIGxldCBsb2NhdGlvbl9pZHMgPSBbXTtcblxuICAgIHN0b3Jlcy5mb3JFYWNoKHN0b3JlID0+IHsgXG4gICAgICBzdG9yZV9uYW1lcy5wdXNoKHN0b3JlLm5hbWUpO1xuICAgICAgLy8gbG9jYXRpb25faWRzLnB1c2goc3RvcmUubG9jYXRpb25faWQpO1xuICAgICB9KTtcblxuICAgIGRpYWxvZ3MuYWN0aW9uKHtcbiAgICAgIG1lc3NhZ2U6IFwiU2VsZWN0IFN0b3JlXCIsXG4gICAgICBjYW5jZWxCdXR0b25UZXh0OiBcIkNhbmNlbFwiLFxuICAgICAgYWN0aW9uczogc3RvcmVfbmFtZXNcbiAgICB9KS50aGVuKG5hbWUgPT4ge1xuICAgICAgc3RvcmVzLmZvckVhY2goc3RvcmUgPT4geyBcbiAgICAgICAgaWYoc3RvcmUubmFtZSA9PSBuYW1lKXtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkdvaW5nIHRvIGNyZWF0ZSBjb250cmFjdC5cIik7XG4gICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL2NvbnRyYWN0Y3JlYXRlXCIsc3RvcmUubG9jYXRpb25faWQsMF0sIHtcbiAgICAgICAgICAgIC8vIGFuaW1hdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlTGVmdFwiLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAyMDAsXG4gICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgIH0pO1xuICAgIH0pO1xuICAgIFxuICB9XG5cbiAgcHVibGljIGxvZ291dCgpe1xuICAgIGFwcFNldHRpbmdzLnJlbW92ZShcInVzZXJfbmFtZVwiKTtcbiAgICBhcHBTZXR0aW5ncy5yZW1vdmUoXCJ1c2VyX3Bhc3N3b3JkXCIpO1xuXG4gICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL1wiXSwgeyBjbGVhckhpc3Rvcnk6IHRydWUgfSk7XG4gIH1cblxuICAvLyBMb2NhdGlvbiByZWZhY3RvclxuICAvLyB2ZXJpZnlDb250cmFjdCgpe1xuICAvLyAgIHRoaXMuaXNCdXN5ID0gdHJ1ZTtcbiAgLy8gICB0aGlzLmxvY2F0aW9uU2VydmljZS5nZXRDdXJyZW50TG9jYXRpb24oKVxuICAvLyAgICAgLnRoZW4oKGxvY2F0aW9uOiBMb2NhdGlvbikgPT4ge1xuICAvLyAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAvLyAgICAgICBpZihsb2NhdGlvbiAhPSB1bmRlZmluZWQpe1xuICAvLyAgICAgICAgIHRoaXMuX2N1cnJlbnRfbG9jYXRpb24gPSBsb2NhdGlvbjtcbiAgLy8gICAgICAgICB0aGlzLmlzQ3VycmVudExvY2F0aW9uID0gdHJ1ZTtcblxuICAvLyAgICAgICAgIGNvbnNvbGUubG9nKFwiZ290dGVuIGxvY2F0aW9uLCBsYXQ6IFwiK2xvY2F0aW9uLmxhdCtcIiwgbG5nOiBcIitsb2NhdGlvbi5sbmcpO1xuICAgICAgICBcbiAgLy8gICAgICAgICB0aGlzLl9sb2NhdGlvbnNfaW5fZGIuZm9yRWFjaChsb2NhdGlvbiA9PntcbiAgICAgICAgXG4gIC8vICAgICAgICAgICBpZiAoKGxvY2F0aW9uLm5lX2xhdCA+PSB0aGlzLl9jdXJyZW50X2xvY2F0aW9uLmxhdCAmJiBsb2NhdGlvbi5uZV9sbmcgPj0gdGhpcy5fY3VycmVudF9sb2NhdGlvbi5sbmcpIFxuICAvLyAgICAgICAgICAgICAmJiAobG9jYXRpb24uc3dfbGF0IDw9IHRoaXMuX2N1cnJlbnRfbG9jYXRpb24ubGF0ICYmIGxvY2F0aW9uLnN3X2xuZyA8PSB0aGlzLl9jdXJyZW50X2xvY2F0aW9uLmxuZykgKXtcbiAgLy8gICAgICAgICAgICAgICB0aGlzLmNhbkNvbnRyYWN0ID0gdHJ1ZTtcbiAgLy8gICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImluIGxvY2F0aW9uOiBcIisgbG9jYXRpb24ubmFtZSk7XG4gIC8vICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudF9sb2NhdGlvbiA9IGxvY2F0aW9uO1xuXG4gIC8vICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb29raW5nIGZvciBhIGNvbnRyYWN0IGJldHdlZW4gbG9jYXRpb246IFwiKyB0aGlzLl9jdXJyZW50X2xvY2F0aW9uLmlkK1wiIGFuZCBjdXN0b21lciBcIiArdGhpcy5fY3VzdG9tZXJfaWQpO1xuICAvLyAgICAgICAgICAgICAgIHRoaXMuY29udHJhY3RTZXJ2aWNlLmdldEFjdGl2ZUNvbnRyYWN0KHRoaXMuX2N1cnJlbnRfbG9jYXRpb24uaWQsIHRoaXMuX2N1c3RvbWVyX2lkKVxuICAvLyAgICAgICAgICAgICAgICAgLnN1YnNjcmliZShyZXNwb25zZUNvbnRyYWN0ID0+IHtcbiAgLy8gICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ5b3UgaGF2ZSBhIGNvbnRyYWN0IC0tMi4xLCBzdGF0dXM6IFwiK3Jlc3BvbnNlQ29udHJhY3Quc3RhdHVzKTtcbiAgLy8gICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ5b3UgaGF2ZSBhIGNvbnRyYWN0IC0tMi4xLCBtZXNzYWdlOiBcIityZXNwb25zZUNvbnRyYWN0Lm1lc3NhZ2UpO1xuICAvLyAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3BvbnNlQ29udHJhY3QubWVzc2FnZSl7XG4gIC8vICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ5b3UgaGF2ZSBhIGNvbnRyYWN0OiBcIityZXNwb25zZUNvbnRyYWN0LnN0YXR1cyk7XG4gIC8vICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29udHJhY3QgPSByZXNwb25zZUNvbnRyYWN0O1xuICAvLyAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FuQ29udHJhY3QgPSBmYWxzZTtcbiAgLy8gICAgICAgICAgICAgICAgICAgICB0aGlzLmhhc0NvbnRyYWN0ID0gdHJ1ZTtcbiAgLy8gICAgICAgICAgICAgICAgICAgfVxuICAvLyAgICAgICAgICAgICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAvLyAgICAgICAgICAgICAgICAgfSxlcnJvciA9PiB7XG4gIC8vICAgICAgICAgICAgICAgICAgIGlmIChlcnJvci5zdGF0dXMgPT0gNDA0KXtcbiAgICAgICAgICAgICAgICAgICAgICBcbiAgLy8gICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbkNvbnRyYWN0ID0gdHJ1ZTtcbiAgLy8gICAgICAgICAgICAgICAgICAgICB0aGlzLmhhc0NvbnRyYWN0ID0gZmFsc2U7XG4gIC8vICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAvLyAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgZ2V0dGluZyBhY3RpdmUgY29udHJhY3QgaW5mb3JtYXRpb246IFwiK2Vycm9yKTtcbiAgLy8gICAgICAgICAgICAgICAgICAgfVxuICAvLyAgICAgICAgICAgICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBcbiAgLy8gICAgICAgICAgICAgICAgIH0pO1xuICAvLyAgICAgICAgICAgICB9XG4gIC8vICAgICAgICAgfSk7XG4gIC8vICAgICAgIH1cbiAgLy8gICAgICAgZWxzZXtcbiAgLy8gICAgICAgICB0aHJvdyBcIkxvY2F0aW9uIG5vdCBmb3VuZFwiO1xuICAvLyAgICAgICB9IFxuICAvLyAgICAgfVxuICAvLyAgICAgKS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgLy8gICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgLy8gICAgICAgYWxlcnQoZXJyb3IpXG4gIC8vICAgICB9KTtcbiAgLy8gfVxuXG4gIG5lYXJieVN0b3Jlcygpe1xuICAgIGxldCBzdG9yZXM6IEFycmF5PEJlYWNvbj4gPSBbXTtcbiAgICAvLyB0aGlzLmJlYWNvbkRhdGFiYXNlU2VydmljZS5zZWxlY3RBbGxCZWFjb25zKFwid2hlcmUgcm9sZT1zdG9yZVwiKS5mb3JFYWNoKHN0b3JlREI9PntcbiAgICB0aGlzLmJlYWNvbkRhdGFiYXNlU2VydmljZS5zZWxlY3RCZWFjb25zKFwic3RvcmVcIikuZm9yRWFjaChzdG9yZURCPT57XG4gICAgICAvLyBjb25zb2xlLmxvZyhcInN0b3JlREIgaWRlbjogXCIrc3RvcmVEQi5pZGVudGlmaWNhdG9yKTtcbiAgICAgIHRoaXMuY3VycmVudEJlYWNvbnMuZm9yRWFjaChiZWFjb25DdXJyZW50PT57XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiYmVhY29uQ3VycmVudCBpZGVuOiBcIitiZWFjb25DdXJyZW50LmlkZW50aWZpY2F0b3IpO1xuICAgICAgICBpZihzdG9yZURCLmlkZW50aWZpY2F0b3I9PWJlYWNvbkN1cnJlbnQuaWRlbnRpZmljYXRvcil7XG4gICAgICAgICAgc3RvcmVzLnB1c2goc3RvcmVEQik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgICAgXG4gICAgcmV0dXJuIHN0b3JlcztcbiAgfVxuXG4gIG5lYXJieUl0ZW1zKCl7XG4gICAgbGV0IGl0ZW1zOiBBcnJheTxCZWFjb24+ID0gW107XG4gICAgdGhpcy5iZWFjb25EYXRhYmFzZVNlcnZpY2Uuc2VsZWN0QmVhY29ucyhcIml0ZW1cIiwgdGhpcy5sb2NhdGlvbl9pZCkuZm9yRWFjaChpdGVtREI9PntcbiAgICAgIHRoaXMuY3VycmVudEJlYWNvbnMuZm9yRWFjaChiZWFjb25DdXJyZW50PT57XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiYmVhY29uIGRiOiBcIitpdGVtREIuaWRlbnRpZmljYXRvcik7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiYmVhY29uIGN1cnJlbnQ6IFwiK2JlYWNvbkN1cnJlbnQuaWRlbnRpZmljYXRvcik7XG4gICAgICAgIGlmKGl0ZW1EQi5pZGVudGlmaWNhdG9yPT1iZWFjb25DdXJyZW50LmlkZW50aWZpY2F0b3Ipe1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiTmVhcmJ5IGl0ZW06IFwiK2l0ZW1EQi5uYW1lKTtcbiAgICAgICAgICBpdGVtcy5wdXNoKGl0ZW1EQik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgICAgXG4gICAgcmV0dXJuIGl0ZW1zO1xuICB9XG5cbiAgdmVyaWZ5QmVoYXZpb3IoKXtcbiAgICBsZXQgbmVhcmJ5SXRlbXMgPSB0aGlzLm5lYXJieUl0ZW1zKCk7XG4gICAgY29uc29sZS5sb2coXCJOZWFyYnkgaXRlbXM6IFwiK25lYXJieUl0ZW1zLmxlbmd0aClcbiAgfVxuXG4gIHZlcmlmeUNvbnRyYWN0KCl7XG4gICAgY29uc29sZS5sb2coXCJWZXJpZnlpbmcgY29udHJhY3RzLi5cIik7XG4gICAgdGhpcy5pc0J1c3kgPSB0cnVlO1xuICAgIGxldCBuZWFyYnlTdG9yZXMgPSB0aGlzLm5lYXJieVN0b3JlcygpO1xuICAgIGNvbnNvbGUubG9nKFwiTmVhcmJ5IHN0b3JlczogXCIrbmVhcmJ5U3RvcmVzLmxlbmd0aClcbiAgICBpZiAobmVhcmJ5U3RvcmVzLmxlbmd0aD4wKXtcbiAgICAgIG5lYXJieVN0b3Jlcy5mb3JFYWNoKHN0b3JlID0+IHtcbiAgICAgICAgdGhpcy5jb250cmFjdFNlcnZpY2UuZ2V0QWN0aXZlQ29udHJhY3Qoc3RvcmUubG9jYXRpb25faWQsIHRoaXMuX2N1c3RvbWVyX2lkKVxuICAgICAgICAuc3Vic2NyaWJlKHJlc3BvbnNlQ29udHJhY3QgPT4ge1xuICAgICAgICAgIGlmICghcmVzcG9uc2VDb250cmFjdC5tZXNzYWdlKXtcbiAgICAgICAgICAgIHRoaXMuX2NvbnRyYWN0ID0gcmVzcG9uc2VDb250cmFjdDtcbiAgICAgICAgICAgIHRoaXMuY2FuQ29udHJhY3QgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuaGFzQ29udHJhY3QgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5sb2NhdGlvbl9pZCA9IHN0b3JlLmxvY2F0aW9uX2lkO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJBY3RpdmUgY29udHJhY3QuXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICB9LGVycm9yID0+IHtcbiAgICAgICAgICBpZiAoZXJyb3Iuc3RhdHVzID09IDQwNCl7XG4gICAgICAgICAgICB0aGlzLmNhbkNvbnRyYWN0ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuaGFzQ29udHJhY3QgPSBmYWxzZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm8gYWN0aXZlIENvbnRyYWN0cy5cIik7XG4gICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBhbGVydChcIkVycm9yIGdldHRpbmcgYWN0aXZlIGNvbnRyYWN0IGluZm9ybWF0aW9uOiBcIitlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7ICBcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9IFxuICB9XG5cbiAgLy8gTG9jYXRpb24gcmVmYWN0b3JcbiAgLy8gcHJpdmF0ZSBnZXRDdXJyZW50TG9jYXRpb24oKXtcbiAgLy8gICAvLyBUT0RPIGdldCBvd24gY29vcmRlbmF0ZXNcbiAgLy8gICB0aGlzLmlzQnVzeSA9IHRydWU7XG4gIC8vICAgdGhpcy5sb2NhdGlvblNlcnZpY2UuZ2V0Q3VycmVudExvY2F0aW9uKClcbiAgLy8gICAgIC50aGVuKChsb2NhdGlvbjogTG9jYXRpb24pID0+IHtcbiAgLy8gICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgLy8gICAgICAgaWYobG9jYXRpb24gIT0gdW5kZWZpbmVkKXtcbiAgLy8gICAgICAgICB0aGlzLl9jdXJyZW50X2xvY2F0aW9uID0gbG9jYXRpb247XG4gIC8vICAgICAgICAgdGhpcy5pc0N1cnJlbnRMb2NhdGlvbiA9IHRydWU7XG4gIC8vICAgICAgIH1cbiAgLy8gICAgICAgZWxzZXtcbiAgLy8gICAgICAgICB0aHJvdyBcIkxvY2F0aW9uIG5vdCBmb3VuZFwiO1xuICAvLyAgICAgICB9IFxuICAvLyAgICAgfVxuICAvLyAgICAgKS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgLy8gICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgLy8gICAgICAgYWxlcnQoZXJyb3IpXG4gIC8vICAgICB9KTtcbiAgLy8gfVxuXG5cbiAgLy8gTUVUSE9EUyBPTkxZIEZPUiBURVNUSU5HIERBVEFCQVNFXG4gIHB1YmxpYyBzaG93TG9jYXRpb25zSW5EYXRhYmFzZSgpIHsgXG4gICAgdGhpcy5fbG9jYXRpb25zX2luX2RiLmZvckVhY2gobG9jYXRpb24gPT4ge1xuICAgICAgYWxlcnQoXCJMb2NhdGlvbjogXCIrbG9jYXRpb24ubmFtZSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBMb2NhdGlvbiByZWZhY3RvclxuICAvLyBwdWJsaWMgaXNMb2NhdGlvbkRhdGFiYXNlRW1wdHkoKXtcbiAgLy8gICBsZXQgZW1wdHkgPSB0cnVlO1xuICAvLyAgIC8vIGNvbnNvbGUubG9nKFwiVGVzdDEuNlwiKTtcbiAgLy8gICAvLyBjb25zb2xlLmxvZyhcIlRlc3QxLjcsIGxlbmd0aDogXCIrdGhpcy5sb2NhdGlvbkRhdGFiYXNlU2VydmljZS5zZWxlY3RBbGxMb2NhdGlvbnMoKS5sZW5ndGgpO1xuICAvLyAgIGlmICh0aGlzLmxvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlLnNlbGVjdEFsbExvY2F0aW9ucygpLmxlbmd0aCA+IDApe1xuICAvLyAgICAgY29uc29sZS5sb2coXCJEYXRhYmFzZSBlbXB0eVwiKTtcbiAgLy8gICAgIGVtcHR5ID0gZmFsc2U7XG4gIC8vICAgfVxuICAvLyAgIHJldHVybiBlbXB0eTtcbiAgLy8gfVxuXG4gIC8vIExvY2F0aW9uIHJlZmFjdG9yXG4gIC8vIHB1YmxpYyB1cGRhdGVMb2NhdGlvbkRhdGFiYXNlKCl7XG4gIC8vICAgLy8gYWxlcnQoXCJ1cGRhdGluZyBsb2NhdGlvbnMgZGIuLlwiKVxuICAvLyAgIC8vIERyb3BzIERCIGlmICBleGlzdFxuICAvLyAgIHRoaXMubG9jYXRpb25EYXRhYmFzZVNlcnZpY2UuZHJvcFRhYmxlKCk7XG4gIC8vICAgLy8gQ3JlYXRlcyBEQiBpZiBub3QgZXhpc3RcbiAgLy8gICB0aGlzLmxvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlLmNyZWF0ZVRhYmxlKCk7XG5cbiAgLy8gICB0aGlzLmlzQnVzeSA9IHRydWU7XG4gIC8vICAgdGhpcy5sb2NhdGlvblNlcnZpY2UuZ2V0TG9jYXRpb25zKClcbiAgLy8gICAgIC5zdWJzY3JpYmUocmVzcG9uc2UgPT4ge1xuICAvLyAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICBcbiAgLy8gICAgICAgcmVzcG9uc2UuZm9yRWFjaChsb2NhdGlvbiA9PiB7XG4gIC8vICAgICAgICAgLy8gY29uc29sZS5sb2coXCJsb2NhdGlvbiBuYW1lOiBcIisgbG9jYXRpb24ubmFtZSk7XG4gIC8vICAgICAgICAgdGhpcy5sb2NhdGlvbkRhdGFiYXNlU2VydmljZS5pbnNlcnRMb2NhdGlvbihsb2NhdGlvbik7XG5cbiAgLy8gICAgICAgfSk7XG4gIC8vICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9tYWluXCJdKTsgIFxuICAvLyAgICAgfSxlcnJvciA9PiB7XG4gIC8vICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gIC8vICAgICAgIGFsZXJ0KGVycm9yKTtcbiAgLy8gICAgIH0pO1xuICAvLyB9XG5cbiAgcHVibGljIGlzQmVhY29uRGF0YWJhc2VFbXB0eSgpe1xuICAgIGxldCBlbXB0eSA9IHRydWU7XG4gICAgLy8gY29uc29sZS5sb2coXCJUZXN0MS42XCIpO1xuICAgIC8vIGNvbnNvbGUubG9nKFwiVGVzdDEuNywgbGVuZ3RoOiBcIit0aGlzLmxvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlLnNlbGVjdEFsbExvY2F0aW9ucygpLmxlbmd0aCk7XG4gICAgaWYgKHRoaXMuYmVhY29uRGF0YWJhc2VTZXJ2aWNlLnNlbGVjdEJlYWNvbnMoXCJhbGxcIikubGVuZ3RoID4gMCl7XG4gICAgICBlbXB0eSA9IGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBlbXB0eTtcbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVCZWFjb25EYXRhYmFzZSgpe1xuICAgIC8vIGFsZXJ0KFwidXBkYXRpbmcgbG9jYXRpb25zIGRiLi5cIilcbiAgICAvLyBEcm9wcyBEQiBpZiAgZXhpc3RcbiAgICB0aGlzLmJlYWNvbkRhdGFiYXNlU2VydmljZS5kcm9wVGFibGUoKTtcbiAgICAvLyBDcmVhdGVzIERCIGlmIG5vdCBleGlzdFxuICAgIHRoaXMuYmVhY29uRGF0YWJhc2VTZXJ2aWNlLmNyZWF0ZVRhYmxlKCk7XG4gICAgY29uc29sZS5sb2coXCJMb2NhbCBEQiBjcmVhdGVkLCBubyBlcnJvcnMgc28gZmFyLi5cIik7XG4gICAgdGhpcy5pc0J1c3kgPSB0cnVlO1xuICAgIHRoaXMuYmVhY29uU2VydmljZS5nZXRCZWFjb25zKClcbiAgICAgIC5zdWJzY3JpYmUocmVzcG9uc2UgPT4ge1xuICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICBcbiAgICAgICAgcmVzcG9uc2UuZm9yRWFjaChiZWFjb24gPT4ge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwibG9jYXRpb24gbmFtZTogXCIrIGxvY2F0aW9uLm5hbWUpO1xuICAgICAgICAgIHRoaXMuYmVhY29uRGF0YWJhc2VTZXJ2aWNlLmluc2VydEJlYWNvbihiZWFjb24pO1xuXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkxvY2FsIERCIHVwZGF0ZWQuXCIpO1xuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvXCJdLCB7IGNsZWFySGlzdG9yeTogdHJ1ZSB9KTtcbiAgICAgIH0sZXJyb3IgPT4ge1xuICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICBhbGVydChlcnJvcik7XG4gICAgICB9KTtcbiAgfVxufSJdfQ==