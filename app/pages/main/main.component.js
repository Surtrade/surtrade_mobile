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
        this.isBusy = false;
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
            message: "Your message",
            cancelButtonText: "Cancel text",
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
    MainComponent.prototype.verifyContract = function () {
        var _this = this;
        console.log("Verifying contracts..");
        // this.isBusy = true;
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
        console.log("Locacl DB created, no errors so far..");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYWluLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUEwRDtBQUMxRCxvQ0FBc0M7QUFDdEMsaURBQWdEO0FBQ2hELDBDQUFpRDtBQUNqRCxzREFBK0Q7QUFDL0QsMENBQTZEO0FBTTdELDRFQUE0RTtBQUM1RSx1RkFBdUY7QUFDdkYscUVBQW1FO0FBQ25FLDJFQUE4RTtBQUM5RSwyRUFBeUU7QUFFekUseUNBQTJDO0FBQzNDLDJDQUFzRjtBQUN0RixxQ0FBcUM7QUFDckMscURBQW9EO0FBRXBELCtDQUErQztBQUMvQyxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUVsRCxtQkFBbUI7QUFDbkIsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFDcEQsc0RBQXdEO0FBWXhEO0lBb0NFO1FBQ0UsNENBQTRDO1FBQzVDLDREQUE0RDtRQUNwRCxhQUE0QixFQUM1QixxQkFBNEMsRUFDNUMsZUFBZ0MsRUFDaEMsS0FBcUIsRUFDckIsTUFBd0IsRUFDeEIsY0FBOEIsRUFDOUIsSUFBWSxFQUNaLElBQVU7UUFQVixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QiwwQkFBcUIsR0FBckIscUJBQXFCLENBQXVCO1FBQzVDLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUNoQyxVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQUNyQixXQUFNLEdBQU4sTUFBTSxDQUFrQjtRQUN4QixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFDOUIsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUNaLFNBQUksR0FBSixJQUFJLENBQU07UUF6Q3BCLDJDQUEyQztRQUNuQyxVQUFLLEdBQUcsUUFBUSxDQUFDO1FBV3pCLGVBQWU7UUFDZiw2QkFBNkI7UUFDdEIsc0JBQWlCLEdBQUcsS0FBSyxDQUFDO1FBQzFCLG1CQUFjLEdBQUcs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LGFBQU07WUFDTixXQUFJO09BOUNULGFBQWEsQ0FzYnpCO0lBQUQsb0JBQUM7Q0FBQSxBQXRiRCxJQXNiQztBQXRiWSxzQ0FBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBOZ1pvbmUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0ICogYXMgZGlhbG9ncyBmcm9tIFwidWkvZGlhbG9nc1wiO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3VpL3BhZ2VcIjtcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlIH0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgUm91dGVyRXh0ZW5zaW9ucyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXJcIjtcbmltcG9ydCB7IExvY2F0aW9uIGFzIExvY2F0aW9uQ29tbW9uIH0gZnJvbSBcIkBhbmd1bGFyL2NvbW1vblwiO1xuXG5pbXBvcnQgeyBVc2VyIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC91c2VyL3VzZXJcIjtcbmltcG9ydCB7IExvY2F0aW9uIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9sb2NhdGlvbi9sb2NhdGlvblwiO1xuaW1wb3J0IHsgQ29udHJhY3QgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2NvbnRyYWN0L2NvbnRyYWN0XCI7XG5cbi8vIGltcG9ydCB7IExvY2F0aW9uU2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvbG9jYXRpb24vbG9jYXRpb24uc2VydmljZVwiO1xuLy8gaW1wb3J0IHsgTG9jYXRpb25EYXRhYmFzZVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zaGFyZWQvbG9jYXRpb24vbG9jYXRpb24uZGIuc2VydmljZSc7XG5pbXBvcnQgeyBCZWFjb25TZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9iZWFjb24vYmVhY29uLnNlcnZpY2VcIjtcbmltcG9ydCB7IEJlYWNvbkRhdGFiYXNlU2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvYmVhY29uL2JlYWNvbi5kYi5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBDb250cmFjdFNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2NvbnRyYWN0L2NvbnRyYWN0LnNlcnZpY2VcIjtcblxuaW1wb3J0ICogYXMgYXBwbGljYXRpb24gZnJvbSAnYXBwbGljYXRpb24nO1xuaW1wb3J0IHsgQW5kcm9pZEFwcGxpY2F0aW9uLCBBbmRyb2lkQWN0aXZpdHlCYWNrUHJlc3NlZEV2ZW50RGF0YSB9IGZyb20gXCJhcHBsaWNhdGlvblwiO1xuaW1wb3J0IHsgaXNBbmRyb2lkIH0gZnJvbSBcInBsYXRmb3JtXCI7XG5pbXBvcnQgeyBCZWFjb24gfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2JlYWNvbi9iZWFjb25cIjtcblxuLy8gaW1wb3J0IHsgc3RvcmFnZSB9IGZyb20gXCIuLi8uLi91dGlscy9sb2NhbFwiO1xudmFyIGFwcFNldHRpbmdzID0gcmVxdWlyZShcImFwcGxpY2F0aW9uLXNldHRpbmdzXCIpO1xuXG4vLyBlc3RpbW90ZSBiZWFjb25zXG52YXIgRXN0aW1vdGUgPSByZXF1aXJlKFwibmF0aXZlc2NyaXB0LWVzdGltb3RlLXNka1wiKTtcbmltcG9ydCAqIGFzIFBlcm1pc3Npb25zIGZyb20gXCJuYXRpdmVzY3JpcHQtcGVybWlzc2lvbnNcIjtcbmRlY2xhcmUgdmFyIGFuZHJvaWQ6IGFueTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwibWFpblwiLFxuICAgIHByb3ZpZGVyczogW0JlYWNvblNlcnZpY2UsIEJlYWNvbkRhdGFiYXNlU2VydmljZSwgQ29udHJhY3RTZXJ2aWNlXSxcbiAgICAvLyBwcm92aWRlcnM6IFtMb2NhdGlvblNlcnZpY2UsIExvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlLCBDb250cmFjdFNlcnZpY2VdLFxuICAgIC8vIHByb3ZpZGVyczogW0xvY2F0aW9uU2VydmljZSwgQ29udHJhY3RTZXJ2aWNlXSxcbiAgICB0ZW1wbGF0ZVVybDogXCJwYWdlcy9tYWluL21haW4uaHRtbFwiLFxuICAgIHN0eWxlVXJsczpbXCJwYWdlcy9tYWluL21haW4tY29tbW9uLmNzc1wiXSBcbn0pXG5cbmV4cG9ydCBjbGFzcyBNYWluQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0e1xuXG4gIC8vIHByaXZhdGUgdmFyaWFibGVzXG4gIHByaXZhdGUgX2N1cnJlbnRfbG9jYXRpb246IExvY2F0aW9uO1xuICBwcml2YXRlIGxvY2F0aW9uX2lkOiBzdHJpbmc7XG4gIC8vIHByaXZhdGUgX2FsbF9sb2NhdGlvbnM6IEFycmF5PExvY2F0aW9uPjtcbiAgcHJpdmF0ZSBfbmFtZSA9IFwiY2FybG9zXCI7XG4gIHByaXZhdGUgX2NvbnRyYWN0OiBDb250cmFjdDtcbiAgLy8gcHJpdmF0ZSBfbG9jYXRpb25fZGF0YWJhc2U6IGFueTtcbiAgcHJpdmF0ZSBfbG9jYXRpb25zX2luX2RiOiBBcnJheTxMb2NhdGlvbj47XG4gIC8vIHByaXZhdGUgX2xvY2F0aW9uX2lkOiBudW1iZXI7XG4gIHByaXZhdGUgX3dhdGNoX2xvY2F0aW9uX2lkOiBhbnk7XG4gIHByaXZhdGUgX2N1c3RvbWVyX2lkOiBudW1iZXI7XG5cbiAgLy8gcHVibGljIHZhcmlhYmxlc1xuICBwdWJsaWMgdGl0bGU6IHN0cmluZztcblxuICAvLyBidXR0b24gZmxhZ3NcbiAgLy8gcHVibGljIGluTG9jYXRpb24gPSBmYWxzZTtcbiAgcHVibGljIGlzQ3VycmVudExvY2F0aW9uID0gZmFsc2U7XG4gIHB1YmxpYyBpc0FsbExvY2F0aW9ucyA9IGZhbHNlO1xuICBwdWJsaWMgaXNCdXN5ID0gZmFsc2U7XG4gIHB1YmxpYyBjYW5Db250cmFjdCA9IGZhbHNlO1xuICBwdWJsaWMgaGFzQ29udHJhY3QgPSBmYWxzZTtcblxuICAvLyBCZWFjb24gdmFyaWFibGVcbiAgcHVibGljIGVzdGltb3RlOiBhbnk7XG4gIHB1YmxpYyBvcHRpb25zOiBhbnk7XG4gIHB1YmxpYyBjdXJyZW50QmVhY29uczogQXJyYXk8QmVhY29uPjtcbiAgcHVibGljIHBlcm1pc3Npb25zOiBhbnk7XG5cbiAgLy8gSWNvbnNcbiAgcHVibGljIGdlYXJzSWNvbiA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMHhmMDg1KTtcbiAgcHVibGljIGxvZ291dEljb24gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4ZjA4Yik7XG4gIHB1YmxpYyBoYW5kc2hha2VJY29uID0gU3RyaW5nLmZyb21DaGFyQ29kZSgweGYyYjUpO1xuICBcbiAgY29uc3RydWN0b3IoXG4gICAgLy8gcHJpdmF0ZSBsb2NhdGlvblNlcnZpY2U6IExvY2F0aW9uU2VydmljZSxcbiAgICAvLyBwcml2YXRlIGxvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlOiBMb2NhdGlvbkRhdGFiYXNlU2VydmljZSxcbiAgICBwcml2YXRlIGJlYWNvblNlcnZpY2U6IEJlYWNvblNlcnZpY2UsXG4gICAgcHJpdmF0ZSBiZWFjb25EYXRhYmFzZVNlcnZpY2U6IEJlYWNvbkRhdGFiYXNlU2VydmljZSxcbiAgICBwcml2YXRlIGNvbnRyYWN0U2VydmljZTogQ29udHJhY3RTZXJ2aWNlLFxuICAgIHByaXZhdGUgcm91dGU6IEFjdGl2YXRlZFJvdXRlLFxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXJFeHRlbnNpb25zLFxuICAgIHByaXZhdGUgbG9jYXRpb25Db21tb246IExvY2F0aW9uQ29tbW9uLFxuICAgIHByaXZhdGUgem9uZTogTmdab25lLFxuICAgIHByaXZhdGUgcGFnZTogUGFnZVxuICApe1xuICAgICAgY29uc29sZS5sb2coXCJNYWluIENvbnN0cnVjdG9yXCIpO1xuICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgIHRoaXMuX2N1cnJlbnRfbG9jYXRpb24gPSBudWxsO1xuICAgICAgLy8gdGhpcy5fYWxsX2xvY2F0aW9ucyA9IFtdO1xuICAgICAgdGhpcy5fbG9jYXRpb25zX2luX2RiID0gW107XG4gICAgICAvLyB0aGlzLl9sb2NhdGlvbl9kYXRhYmFzZSA9IHRoaXMubG9jYXRpb25EYXRhYmFzZVNlcnZpY2UuZ2V0RGF0YWJhc2UoKTtcblxuICAgICAgLy8gQmVhY29ucyBpbnN0YW5jZSBcbiAgICAgIC8vIHRoaXMuZXN0aW1vdGUgPSBuZXcgRXN0aW1vdGUob3B0aW9ucyk7XG4gICAgICB0aGlzLmN1cnJlbnRCZWFjb25zID0gW107XG4gICAgICAvLyB0aGlzLnBlcm1pc3Npb25zID0gbmV3IFBlcm1pc3Npb25zKCk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBjb25zb2xlLmxvZyhcIk1haW4gb24gSW5pdFwiKTtcblxuICAgIC8vIFJldHVybiB0byBsb2dpbiBpZiBhcHAgc2V0dGluZ3MgYXJlIG5vdCBzZXRcbiAgICBpZiAoIWFwcFNldHRpbmdzLmhhc0tleShcInVzZXJfbmFtZVwiKSB8fCAhYXBwU2V0dGluZ3MuaGFzS2V5KFwidXNlcl9wYXNzd29yZFwiKSl7XG4gICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvXCJdKSwgeyBjbGVhckhpc3Rvcnk6IHRydWUgfTtcbiAgICB9XG5cbiAgICBpZiAoaXNBbmRyb2lkKSB7XG4gICAgICBhcHBsaWNhdGlvbi5hbmRyb2lkLm9uKEFuZHJvaWRBcHBsaWNhdGlvbi5hY3Rpdml0eUJhY2tQcmVzc2VkRXZlbnQsIChkYXRhOiBBbmRyb2lkQWN0aXZpdHlCYWNrUHJlc3NlZEV2ZW50RGF0YSkgPT4ge1xuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvXCJdKSwgeyBjbGVhckhpc3Rvcnk6IHRydWUgfTtcbiAgICAgICAgLy8gdGhpcy5sb2dvdXQoKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMudGl0bGUgPSBcIldlbGNvbWUgXCIrIGFwcFNldHRpbmdzLmdldFN0cmluZyhcInVzZXJfbmFtZVwiKTsgICAgXG5cbiAgICB0cnl7XG4gICAgICB0aGlzLl9jdXN0b21lcl9pZCA9IGFwcFNldHRpbmdzLmdldE51bWJlcihcInVzZXJfaWRcIik7XG4gICAgICBjb25zb2xlLmxvZyhcInRyeWluZyBjdXN0OiBcIit0aGlzLl9jdXN0b21lcl9pZCk7XG4gICAgfWNhdGNoKGUpe1xuICAgICAgdGhpcy5fY3VzdG9tZXJfaWQgPSAwO1xuICAgIH0gICAgICBcbiAgICAgIFxuICAgIC8vIEJlYWNvbnMgcHJvY2Vzc1xuICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgIHJlZ2lvbiA6ICdQcm9ncmVzcycsIC8vIG9wdGlvbmFsXG4gICAgICBjYWxsYmFjayA6IGJlYWNvbnMgPT4ge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkJlYWNvbnM6IFwiK2JlYWNvbnMpXG4gICAgICAgIGNvbnNvbGUubG9nKFwiQW1vdW50IG9mIEJlYWNvbnMgaW4gcmFuZ2U6IFwiK2JlYWNvbnMubGVuZ3RoKVxuICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkFtb3VudCBvZiBCZWFjb25zIGluIHJhbmdlOiBcIitiZWFjb25zLmNvdW50KVxuICAgICAgICAgIGlmKGJlYWNvbnMubGVuZ3RoPjApe1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50QmVhY29ucyA9IFtdO1xuICAgICAgICAgICAgYmVhY29ucy5mb3JFYWNoKGJlYWNvbiA9PiB7XG4gICAgICAgICAgICAgIGlmKGJlYWNvbi5tYWpvcil7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgbGV0IGIgPW5ldyBCZWFjb24oYmVhY29uLm1ham9yLnRvU3RyaW5nKCksYmVhY29uLm1pbm9yLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQmVhY29uIGlkZW50aWZpY2F0b3IgXCIrYi5pZGVudGlmaWNhdG9yKTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRCZWFjb25zLnB1c2goYik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBDaGVjayBmb3IgYWN0aXZlIGNvbnRyYWN0c1xuICAgICAgICAgICAgdGhpcy52ZXJpZnlDb250cmFjdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5lc3RpbW90ZSA9IG5ldyBFc3RpbW90ZSh0aGlzLm9wdGlvbnMpO1xuXG4gICAgaWYoaXNBbmRyb2lkKXtcbiAgICAgIGNvbnNvbGUubG9nKFwiSXQgaXMgQW5kcm9pZFwiKTtcbiAgICAgIFBlcm1pc3Npb25zLnJlcXVlc3RQZXJtaXNzaW9ucyhbXG4gICAgICAgIGFuZHJvaWQuTWFuaWZlc3QucGVybWlzc2lvbi5BQ0NFU1NfQ09BUlNFX0xPQ0FUSU9OLFxuICAgICAgICBhbmRyb2lkLk1hbmlmZXN0LnBlcm1pc3Npb24uQUNDRVNTX0ZJTkVfTE9DQVRJT04sXG4gICAgICAgIGFuZHJvaWQuTWFuaWZlc3QucGVybWlzc2lvbi5CTFVFVE9PVEgsXG4gICAgICAgIGFuZHJvaWQuTWFuaWZlc3QucGVybWlzc2lvbi5CTFVFVE9PVEhfQURNSU5dLCBcIlBlcm1pc3Npb25zIG9mIFN1cnRyYWRlXCIpXG4gICAgICAudGhlbigoKT0+e1xuICAgICAgICBjb25zb2xlLmxvZyhcIlBlcm1pc3Npb25zIGdyYW50ZWRcIik7XG4gICAgICAgIHRoaXMuZXN0aW1vdGUuc3RhcnRSYW5naW5nKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiU3RhcnQgcmFuZ2luZ1wiKTtcbiAgICAgIH0pLmNhdGNoKChlcnJvcik9PntcbiAgICAgICAgYWxlcnQoXCJFcnJvciBnZXR0aW5nIHBlcm1pc3Npb25zOiBcIitlcnJvci5tZXNzYWdlKTtcbiAgICAgIH0pO1xuICAgIH1lbHNle1xuICAgICAgY29uc29sZS5sb2coXCJJdCBpcyBpT1NcIik7XG4gICAgICB0aGlzLmVzdGltb3RlLnN0YXJ0UmFuZ2luZygpO1xuICAgICAgY29uc29sZS5sb2coXCJTdGFydCByYW5naW5nXCIpO1xuICAgIH1cblxuICAgIC8vIExvY2F0aW9uIHJlZmFjdG9yXG4gICAgLy8gQ3JlYXRlcyBEQiBpZiBub3QgZXhpc3RcbiAgICAvLyB0aGlzLmxvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlLmNyZWF0ZVRhYmxlKCk7XG5cbiAgICAvL1VwZGF0ZXMgdGhlIGxvY2F0aW9ucyBEQiwgdGhpcyBzaG91bGQgbm90IGJlIGRvbmUgZXZlcnkgdGltZSwgYnV0IHJhdGhlciBvbmNlIGV2ZXJ5IGRheVxuICAgIC8vIGlmKHRoaXMuaXNMb2NhdGlvbkRhdGFiYXNlRW1wdHkoKSl7XG4gICAgLy8gICB0aGlzLnVwZGF0ZUxvY2F0aW9uRGF0YWJhc2UoKTtcbiAgICAvLyB9XG5cbiAgICAvLyBFeHRyYWN0cyBsb2NhdGlvbnMgZnJvbSBEQlxuICAgIC8vIHRoaXMuX2xvY2F0aW9uc19pbl9kYiA9IHRoaXMubG9jYXRpb25EYXRhYmFzZVNlcnZpY2Uuc2VsZWN0QWxsTG9jYXRpb25zKCk7XG4gICAgLy8gLy8gU3RhcnQgd2F0Y2hpbmcgZm9yIGxvY2F0aW9uXG4gICAgLy8gLy8gdGhpcy5fd2F0Y2hfbG9jYXRpb25faWQgPSB0aGlzLmxvY2F0aW9uU2VydmljZS5zdGFydFdhdGNoaW5nTG9jYXRpb24oKTtcblxuXG4gICAgLy8gQ3JlYXRlcyBEQiBpZiBub3QgZXhpc3RcbiAgICAvLyB0aGlzLmJlYWNvbkRhdGFiYXNlU2VydmljZS5kcm9wVGFibGUoKTtcbiAgICB0aGlzLmJlYWNvbkRhdGFiYXNlU2VydmljZS5jcmVhdGVUYWJsZSgpO1xuXG4gICAgLy9VcGRhdGVzIHRoZSBEQiwgdGhpcyBzaG91bGQgbm90IGJlIGRvbmUgZXZlcnkgdGltZSwgYnV0IHJhdGhlciBvbmNlIGV2ZXJ5IGRheVxuICAgIGlmKHRoaXMuaXNCZWFjb25EYXRhYmFzZUVtcHR5KCkpe1xuICAgICAgY29uc29sZS5sb2coXCJMb2NhbCBEQiBpcyBlbXB0eS5cIik7XG4gICAgICB0aGlzLnVwZGF0ZUJlYWNvbkRhdGFiYXNlKCk7XG4gICAgfWVsc2V7XG4gICAgICBjb25zb2xlLmxvZyhcIkxvY2FsIERCIGhhcyBkYXRhLlwiKTtcbiAgICB9XG5cbiAgICB0aGlzLnBhZ2Uub24oJ25hdmlnYXRpbmdGcm9tJywgKGRhdGEpID0+IHtcbiAgICAgIC8vIHJ1biBkZXN0cm95IGNvZGVcbiAgICAgIC8vIChub3RlOiB0aGlzIHdpbGwgcnVuIHdoZW4geW91IGVpdGhlciBtb3ZlIGZvcndhcmQgdG8gYSBuZXcgcGFnZSBvciBiYWNrIHRvIHRoZSBwcmV2aW91cyBwYWdlKVxuICAgICAgLy8gQmVhY29ucyBzdG9wXG4gICAgICB0aGlzLmVzdGltb3RlLnN0b3BSYW5naW5nKCk7XG4gICAgICBjb25zb2xlLmxvZyhcIlN0b3AgcmFuZ2luZ1wiKTtcbiAgICB9KTtcblxuICB9XG5cbiAgcHVibGljIG5nT25EZXN0cm95KCkge1xuICAgIC8vQ2FsbGVkIG9uY2UsIGJlZm9yZSB0aGUgaW5zdGFuY2UgaXMgZGVzdHJveWVkLlxuICAgIC8vIExvY2F0aW9uIHJlZmFjdG9yXG4gICAgLy8gdGhpcy5sb2NhdGlvblNlcnZpY2Uuc3RvcFdhdGNoaW5nTG9jYXRpb24odGhpcy5fd2F0Y2hfbG9jYXRpb25faWQpXG5cbiAgICAvLyAvLyBCZWFjb25zIHN0b3BcbiAgICAvLyB0aGlzLmVzdGltb3RlLnN0b3BSYW5naW5nKCk7XG4gICAgLy8gY29uc29sZS5sb2coXCJTdG9wIHJhbmdpbmdcIik7XG4gIH1cblxuICBwdWJsaWMgY29udHJhY3RTZXR0aW5ncygpe1xuICAgIC8vIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9jb250cmFjdGNyZWF0ZS9cIit0aGlzLl9jdXJyZW50X2xvY2F0aW9uLmlkK1wiLzFcIl0sIHtcbiAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvY29udHJhY3RjcmVhdGVcIix0aGlzLmxvY2F0aW9uX2lkLDFdLCB7XG4gICAgICAvLyBhbmltYXRpb246IHRydWUsXG4gICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgbmFtZTogXCJzbGlkZUxlZnRcIixcbiAgICAgICAgICBkdXJhdGlvbjogMjAwLFxuICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgY3JlYXRlQ29udHJhY3QoKXtcblxuICAgIGxldCBzdG9yZXMgPSB0aGlzLm5lYXJieVN0b3JlcygpO1xuICAgIGxldCBzdG9yZV9uYW1lcyA9IFtdO1xuICAgIC8vIGxldCBsb2NhdGlvbl9pZHMgPSBbXTtcblxuICAgIHN0b3Jlcy5mb3JFYWNoKHN0b3JlID0+IHsgXG4gICAgICBzdG9yZV9uYW1lcy5wdXNoKHN0b3JlLm5hbWUpO1xuICAgICAgLy8gbG9jYXRpb25faWRzLnB1c2goc3RvcmUubG9jYXRpb25faWQpO1xuICAgICB9KTtcblxuICAgIGRpYWxvZ3MuYWN0aW9uKHtcbiAgICAgIG1lc3NhZ2U6IFwiWW91ciBtZXNzYWdlXCIsXG4gICAgICBjYW5jZWxCdXR0b25UZXh0OiBcIkNhbmNlbCB0ZXh0XCIsXG4gICAgICBhY3Rpb25zOiBzdG9yZV9uYW1lc1xuICAgIH0pLnRoZW4obmFtZSA9PiB7XG4gICAgICBzdG9yZXMuZm9yRWFjaChzdG9yZSA9PiB7IFxuICAgICAgICBpZihzdG9yZS5uYW1lID09IG5hbWUpe1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiR29pbmcgdG8gY3JlYXRlIGNvbnRyYWN0LlwiKTtcbiAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvY29udHJhY3RjcmVhdGVcIixzdG9yZS5sb2NhdGlvbl9pZCwwXSwge1xuICAgICAgICAgICAgLy8gYW5pbWF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xuICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVMZWZ0XCIsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDIwMCxcbiAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgfSk7XG4gICAgfSk7XG4gICAgXG4gIH1cblxuICBwdWJsaWMgbG9nb3V0KCl7XG4gICAgYXBwU2V0dGluZ3MucmVtb3ZlKFwidXNlcl9uYW1lXCIpO1xuICAgIGFwcFNldHRpbmdzLnJlbW92ZShcInVzZXJfcGFzc3dvcmRcIik7XG5cbiAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvXCJdLCB7IGNsZWFySGlzdG9yeTogdHJ1ZSB9KTtcbiAgfVxuXG4gIC8vIExvY2F0aW9uIHJlZmFjdG9yXG4gIC8vIHZlcmlmeUNvbnRyYWN0KCl7XG4gIC8vICAgdGhpcy5pc0J1c3kgPSB0cnVlO1xuICAvLyAgIHRoaXMubG9jYXRpb25TZXJ2aWNlLmdldEN1cnJlbnRMb2NhdGlvbigpXG4gIC8vICAgICAudGhlbigobG9jYXRpb246IExvY2F0aW9uKSA9PiB7XG4gIC8vICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gIC8vICAgICAgIGlmKGxvY2F0aW9uICE9IHVuZGVmaW5lZCl7XG4gIC8vICAgICAgICAgdGhpcy5fY3VycmVudF9sb2NhdGlvbiA9IGxvY2F0aW9uO1xuICAvLyAgICAgICAgIHRoaXMuaXNDdXJyZW50TG9jYXRpb24gPSB0cnVlO1xuXG4gIC8vICAgICAgICAgY29uc29sZS5sb2coXCJnb3R0ZW4gbG9jYXRpb24sIGxhdDogXCIrbG9jYXRpb24ubGF0K1wiLCBsbmc6IFwiK2xvY2F0aW9uLmxuZyk7XG4gICAgICAgIFxuICAvLyAgICAgICAgIHRoaXMuX2xvY2F0aW9uc19pbl9kYi5mb3JFYWNoKGxvY2F0aW9uID0+e1xuICAgICAgICBcbiAgLy8gICAgICAgICAgIGlmICgobG9jYXRpb24ubmVfbGF0ID49IHRoaXMuX2N1cnJlbnRfbG9jYXRpb24ubGF0ICYmIGxvY2F0aW9uLm5lX2xuZyA+PSB0aGlzLl9jdXJyZW50X2xvY2F0aW9uLmxuZykgXG4gIC8vICAgICAgICAgICAgICYmIChsb2NhdGlvbi5zd19sYXQgPD0gdGhpcy5fY3VycmVudF9sb2NhdGlvbi5sYXQgJiYgbG9jYXRpb24uc3dfbG5nIDw9IHRoaXMuX2N1cnJlbnRfbG9jYXRpb24ubG5nKSApe1xuICAvLyAgICAgICAgICAgICAgIHRoaXMuY2FuQ29udHJhY3QgPSB0cnVlO1xuICAvLyAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW4gbG9jYXRpb246IFwiKyBsb2NhdGlvbi5uYW1lKTtcbiAgLy8gICAgICAgICAgICAgICB0aGlzLl9jdXJyZW50X2xvY2F0aW9uID0gbG9jYXRpb247XG5cbiAgLy8gICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvb2tpbmcgZm9yIGEgY29udHJhY3QgYmV0d2VlbiBsb2NhdGlvbjogXCIrIHRoaXMuX2N1cnJlbnRfbG9jYXRpb24uaWQrXCIgYW5kIGN1c3RvbWVyIFwiICt0aGlzLl9jdXN0b21lcl9pZCk7XG4gIC8vICAgICAgICAgICAgICAgdGhpcy5jb250cmFjdFNlcnZpY2UuZ2V0QWN0aXZlQ29udHJhY3QodGhpcy5fY3VycmVudF9sb2NhdGlvbi5pZCwgdGhpcy5fY3VzdG9tZXJfaWQpXG4gIC8vICAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKHJlc3BvbnNlQ29udHJhY3QgPT4ge1xuICAvLyAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInlvdSBoYXZlIGEgY29udHJhY3QgLS0yLjEsIHN0YXR1czogXCIrcmVzcG9uc2VDb250cmFjdC5zdGF0dXMpO1xuICAvLyAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInlvdSBoYXZlIGEgY29udHJhY3QgLS0yLjEsIG1lc3NhZ2U6IFwiK3Jlc3BvbnNlQ29udHJhY3QubWVzc2FnZSk7XG4gIC8vICAgICAgICAgICAgICAgICAgIGlmICghcmVzcG9uc2VDb250cmFjdC5tZXNzYWdlKXtcbiAgLy8gICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInlvdSBoYXZlIGEgY29udHJhY3Q6IFwiK3Jlc3BvbnNlQ29udHJhY3Quc3RhdHVzKTtcbiAgLy8gICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb250cmFjdCA9IHJlc3BvbnNlQ29udHJhY3Q7XG4gIC8vICAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW5Db250cmFjdCA9IGZhbHNlO1xuICAvLyAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFzQ29udHJhY3QgPSB0cnVlO1xuICAvLyAgICAgICAgICAgICAgICAgICB9XG4gIC8vICAgICAgICAgICAgICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gIC8vICAgICAgICAgICAgICAgICB9LGVycm9yID0+IHtcbiAgLy8gICAgICAgICAgICAgICAgICAgaWYgKGVycm9yLnN0YXR1cyA9PSA0MDQpe1xuICAgICAgICAgICAgICAgICAgICAgIFxuICAvLyAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FuQ29udHJhY3QgPSB0cnVlO1xuICAvLyAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFzQ29udHJhY3QgPSBmYWxzZTtcbiAgLy8gICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gIC8vICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBnZXR0aW5nIGFjdGl2ZSBjb250cmFjdCBpbmZvcm1hdGlvbjogXCIrZXJyb3IpO1xuICAvLyAgICAgICAgICAgICAgICAgICB9XG4gIC8vICAgICAgICAgICAgICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIFxuICAvLyAgICAgICAgICAgICAgICAgfSk7XG4gIC8vICAgICAgICAgICAgIH1cbiAgLy8gICAgICAgICB9KTtcbiAgLy8gICAgICAgfVxuICAvLyAgICAgICBlbHNle1xuICAvLyAgICAgICAgIHRocm93IFwiTG9jYXRpb24gbm90IGZvdW5kXCI7XG4gIC8vICAgICAgIH0gXG4gIC8vICAgICB9XG4gIC8vICAgICApLmNhdGNoKChlcnJvcikgPT4ge1xuICAvLyAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAvLyAgICAgICBhbGVydChlcnJvcilcbiAgLy8gICAgIH0pO1xuICAvLyB9XG5cbiAgbmVhcmJ5U3RvcmVzKCl7XG4gICAgbGV0IHN0b3JlczogQXJyYXk8QmVhY29uPiA9IFtdO1xuICAgIC8vIHRoaXMuYmVhY29uRGF0YWJhc2VTZXJ2aWNlLnNlbGVjdEFsbEJlYWNvbnMoXCJ3aGVyZSByb2xlPXN0b3JlXCIpLmZvckVhY2goc3RvcmVEQj0+e1xuICAgIHRoaXMuYmVhY29uRGF0YWJhc2VTZXJ2aWNlLnNlbGVjdEJlYWNvbnMoXCJzdG9yZVwiKS5mb3JFYWNoKHN0b3JlREI9PntcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwic3RvcmVEQiBpZGVuOiBcIitzdG9yZURCLmlkZW50aWZpY2F0b3IpO1xuICAgICAgdGhpcy5jdXJyZW50QmVhY29ucy5mb3JFYWNoKGJlYWNvbkN1cnJlbnQ9PntcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJiZWFjb25DdXJyZW50IGlkZW46IFwiK2JlYWNvbkN1cnJlbnQuaWRlbnRpZmljYXRvcik7XG4gICAgICAgIGlmKHN0b3JlREIuaWRlbnRpZmljYXRvcj09YmVhY29uQ3VycmVudC5pZGVudGlmaWNhdG9yKXtcbiAgICAgICAgICBzdG9yZXMucHVzaChzdG9yZURCKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgICBcbiAgICByZXR1cm4gc3RvcmVzO1xuICB9XG5cbiAgdmVyaWZ5Q29udHJhY3QoKXtcbiAgICBjb25zb2xlLmxvZyhcIlZlcmlmeWluZyBjb250cmFjdHMuLlwiKTtcbiAgICAvLyB0aGlzLmlzQnVzeSA9IHRydWU7XG4gICAgbGV0IG5lYXJieVN0b3JlcyA9IHRoaXMubmVhcmJ5U3RvcmVzKCk7XG4gICAgY29uc29sZS5sb2coXCJOZWFyYnkgc3RvcmVzOiBcIituZWFyYnlTdG9yZXMubGVuZ3RoKVxuICAgIGlmIChuZWFyYnlTdG9yZXMubGVuZ3RoPjApe1xuICAgICAgbmVhcmJ5U3RvcmVzLmZvckVhY2goc3RvcmUgPT4ge1xuICAgICAgICB0aGlzLmNvbnRyYWN0U2VydmljZS5nZXRBY3RpdmVDb250cmFjdChzdG9yZS5sb2NhdGlvbl9pZCwgdGhpcy5fY3VzdG9tZXJfaWQpXG4gICAgICAgIC5zdWJzY3JpYmUocmVzcG9uc2VDb250cmFjdCA9PiB7XG4gICAgICAgICAgaWYgKCFyZXNwb25zZUNvbnRyYWN0Lm1lc3NhZ2Upe1xuICAgICAgICAgICAgdGhpcy5fY29udHJhY3QgPSByZXNwb25zZUNvbnRyYWN0O1xuICAgICAgICAgICAgdGhpcy5jYW5Db250cmFjdCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5oYXNDb250cmFjdCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmxvY2F0aW9uX2lkID0gc3RvcmUubG9jYXRpb25faWQ7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkFjdGl2ZSBjb250cmFjdC5cIik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgIH0sZXJyb3IgPT4ge1xuICAgICAgICAgIGlmIChlcnJvci5zdGF0dXMgPT0gNDA0KXtcbiAgICAgICAgICAgIHRoaXMuY2FuQ29udHJhY3QgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5oYXNDb250cmFjdCA9IGZhbHNlO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJObyBhY3RpdmUgQ29udHJhY3RzLlwiKTtcbiAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgZ2V0dGluZyBhY3RpdmUgY29udHJhY3QgaW5mb3JtYXRpb246IFwiK2Vycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTsgIFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0gXG4gIH1cblxuICAvLyBMb2NhdGlvbiByZWZhY3RvclxuICAvLyBwcml2YXRlIGdldEN1cnJlbnRMb2NhdGlvbigpe1xuICAvLyAgIC8vIFRPRE8gZ2V0IG93biBjb29yZGVuYXRlc1xuICAvLyAgIHRoaXMuaXNCdXN5ID0gdHJ1ZTtcbiAgLy8gICB0aGlzLmxvY2F0aW9uU2VydmljZS5nZXRDdXJyZW50TG9jYXRpb24oKVxuICAvLyAgICAgLnRoZW4oKGxvY2F0aW9uOiBMb2NhdGlvbikgPT4ge1xuICAvLyAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAvLyAgICAgICBpZihsb2NhdGlvbiAhPSB1bmRlZmluZWQpe1xuICAvLyAgICAgICAgIHRoaXMuX2N1cnJlbnRfbG9jYXRpb24gPSBsb2NhdGlvbjtcbiAgLy8gICAgICAgICB0aGlzLmlzQ3VycmVudExvY2F0aW9uID0gdHJ1ZTtcbiAgLy8gICAgICAgfVxuICAvLyAgICAgICBlbHNle1xuICAvLyAgICAgICAgIHRocm93IFwiTG9jYXRpb24gbm90IGZvdW5kXCI7XG4gIC8vICAgICAgIH0gXG4gIC8vICAgICB9XG4gIC8vICAgICApLmNhdGNoKChlcnJvcikgPT4ge1xuICAvLyAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAvLyAgICAgICBhbGVydChlcnJvcilcbiAgLy8gICAgIH0pO1xuICAvLyB9XG5cblxuICAvLyBNRVRIT0RTIE9OTFkgRk9SIFRFU1RJTkcgREFUQUJBU0VcbiAgcHVibGljIHNob3dMb2NhdGlvbnNJbkRhdGFiYXNlKCkgeyBcbiAgICB0aGlzLl9sb2NhdGlvbnNfaW5fZGIuZm9yRWFjaChsb2NhdGlvbiA9PiB7XG4gICAgICBhbGVydChcIkxvY2F0aW9uOiBcIitsb2NhdGlvbi5uYW1lKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIExvY2F0aW9uIHJlZmFjdG9yXG4gIC8vIHB1YmxpYyBpc0xvY2F0aW9uRGF0YWJhc2VFbXB0eSgpe1xuICAvLyAgIGxldCBlbXB0eSA9IHRydWU7XG4gIC8vICAgLy8gY29uc29sZS5sb2coXCJUZXN0MS42XCIpO1xuICAvLyAgIC8vIGNvbnNvbGUubG9nKFwiVGVzdDEuNywgbGVuZ3RoOiBcIit0aGlzLmxvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlLnNlbGVjdEFsbExvY2F0aW9ucygpLmxlbmd0aCk7XG4gIC8vICAgaWYgKHRoaXMubG9jYXRpb25EYXRhYmFzZVNlcnZpY2Uuc2VsZWN0QWxsTG9jYXRpb25zKCkubGVuZ3RoID4gMCl7XG4gIC8vICAgICBjb25zb2xlLmxvZyhcIkRhdGFiYXNlIGVtcHR5XCIpO1xuICAvLyAgICAgZW1wdHkgPSBmYWxzZTtcbiAgLy8gICB9XG4gIC8vICAgcmV0dXJuIGVtcHR5O1xuICAvLyB9XG5cbiAgLy8gTG9jYXRpb24gcmVmYWN0b3JcbiAgLy8gcHVibGljIHVwZGF0ZUxvY2F0aW9uRGF0YWJhc2UoKXtcbiAgLy8gICAvLyBhbGVydChcInVwZGF0aW5nIGxvY2F0aW9ucyBkYi4uXCIpXG4gIC8vICAgLy8gRHJvcHMgREIgaWYgIGV4aXN0XG4gIC8vICAgdGhpcy5sb2NhdGlvbkRhdGFiYXNlU2VydmljZS5kcm9wVGFibGUoKTtcbiAgLy8gICAvLyBDcmVhdGVzIERCIGlmIG5vdCBleGlzdFxuICAvLyAgIHRoaXMubG9jYXRpb25EYXRhYmFzZVNlcnZpY2UuY3JlYXRlVGFibGUoKTtcblxuICAvLyAgIHRoaXMuaXNCdXN5ID0gdHJ1ZTtcbiAgLy8gICB0aGlzLmxvY2F0aW9uU2VydmljZS5nZXRMb2NhdGlvbnMoKVxuICAvLyAgICAgLnN1YnNjcmliZShyZXNwb25zZSA9PiB7XG4gIC8vICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgIFxuICAvLyAgICAgICByZXNwb25zZS5mb3JFYWNoKGxvY2F0aW9uID0+IHtcbiAgLy8gICAgICAgICAvLyBjb25zb2xlLmxvZyhcImxvY2F0aW9uIG5hbWU6IFwiKyBsb2NhdGlvbi5uYW1lKTtcbiAgLy8gICAgICAgICB0aGlzLmxvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlLmluc2VydExvY2F0aW9uKGxvY2F0aW9uKTtcblxuICAvLyAgICAgICB9KTtcbiAgLy8gICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL21haW5cIl0pOyAgXG4gIC8vICAgICB9LGVycm9yID0+IHtcbiAgLy8gICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgLy8gICAgICAgYWxlcnQoZXJyb3IpO1xuICAvLyAgICAgfSk7XG4gIC8vIH1cblxuICBwdWJsaWMgaXNCZWFjb25EYXRhYmFzZUVtcHR5KCl7XG4gICAgbGV0IGVtcHR5ID0gdHJ1ZTtcbiAgICAvLyBjb25zb2xlLmxvZyhcIlRlc3QxLjZcIik7XG4gICAgLy8gY29uc29sZS5sb2coXCJUZXN0MS43LCBsZW5ndGg6IFwiK3RoaXMubG9jYXRpb25EYXRhYmFzZVNlcnZpY2Uuc2VsZWN0QWxsTG9jYXRpb25zKCkubGVuZ3RoKTtcbiAgICBpZiAodGhpcy5iZWFjb25EYXRhYmFzZVNlcnZpY2Uuc2VsZWN0QmVhY29ucyhcImFsbFwiKS5sZW5ndGggPiAwKXtcbiAgICAgIGVtcHR5ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVtcHR5O1xuICB9XG5cbiAgcHVibGljIHVwZGF0ZUJlYWNvbkRhdGFiYXNlKCl7XG4gICAgLy8gYWxlcnQoXCJ1cGRhdGluZyBsb2NhdGlvbnMgZGIuLlwiKVxuICAgIC8vIERyb3BzIERCIGlmICBleGlzdFxuICAgIHRoaXMuYmVhY29uRGF0YWJhc2VTZXJ2aWNlLmRyb3BUYWJsZSgpO1xuICAgIC8vIENyZWF0ZXMgREIgaWYgbm90IGV4aXN0XG4gICAgdGhpcy5iZWFjb25EYXRhYmFzZVNlcnZpY2UuY3JlYXRlVGFibGUoKTtcbiAgICBjb25zb2xlLmxvZyhcIkxvY2FjbCBEQiBjcmVhdGVkLCBubyBlcnJvcnMgc28gZmFyLi5cIik7XG4gICAgdGhpcy5pc0J1c3kgPSB0cnVlO1xuICAgIHRoaXMuYmVhY29uU2VydmljZS5nZXRCZWFjb25zKClcbiAgICAgIC5zdWJzY3JpYmUocmVzcG9uc2UgPT4ge1xuICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICBcbiAgICAgICAgcmVzcG9uc2UuZm9yRWFjaChiZWFjb24gPT4ge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwibG9jYXRpb24gbmFtZTogXCIrIGxvY2F0aW9uLm5hbWUpO1xuICAgICAgICAgIHRoaXMuYmVhY29uRGF0YWJhc2VTZXJ2aWNlLmluc2VydEJlYWNvbihiZWFjb24pO1xuXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkxvY2FsIERCIHVwZGF0ZWQuXCIpO1xuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvXCJdLCB7IGNsZWFySGlzdG9yeTogdHJ1ZSB9KTtcbiAgICAgIH0sZXJyb3IgPT4ge1xuICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICBhbGVydChlcnJvcik7XG4gICAgICB9KTtcbiAgfVxufSJdfQ==