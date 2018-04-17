"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
var common_1 = require("@angular/common");
var location_service_1 = require("../../shared/location/location.service");
var location_db_service_1 = require("../../shared/location/location.db.service");
var contract_service_1 = require("../../shared/contract/contract.service");
var application = require("application");
var application_1 = require("application");
var platform_1 = require("platform");
// import { storage } from "../../utils/local";
var appSettings = require("application-settings");
var MainComponent = (function () {
    function MainComponent(locationService, locationDatabaseService, contractService, route, router, locationCommon) {
        this.locationService = locationService;
        this.locationDatabaseService = locationDatabaseService;
        this.contractService = contractService;
        this.route = route;
        this.router = router;
        this.locationCommon = locationCommon;
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
        this.isBusy = false;
        this._current_location = null;
        // this._all_locations = [];
        this._locations_in_db = [];
        // this._location_database = this.locationDatabaseService.getDatabase();
    }
    MainComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Return to login if app settings are not set
        if (!appSettings.hasKey("user_name") || !appSettings.hasKey("user_password")) {
            this.router.navigate(["/"]);
        }
        if (platform_1.isAndroid) {
            application.android.on(application_1.AndroidApplication.activityBackPressedEvent, function (data) {
                _this.router.navigate(["/"]);
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
        console.log("tried cust: " + this._customer_id);
        // Creates DB if not exist
        this.locationDatabaseService.createTable();
        //Updates the locations DB, this should not be done every time, but rather once every day
        // console.log("Test1");
        if (this.isLocationDatabaseEmpty()) {
            // console.log("Test1.5");
            this.updateLocationDatabase();
        }
        // Extracts locations from DB
        this._locations_in_db = this.locationDatabaseService.selectAllLocations();
        // Start watching for location
        // this._watch_location_id = this.locationService.startWatchingLocation();
        // Special OnInit proces for location
        this.verifyContract();
    };
    MainComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.locationService.stopWatchingLocation(this._watch_location_id);
        // if (this.locationService.stopWatchingLocation(this._watch_location_id))
        //   alert("Stoping watch.");
        // else
        //   alert("Could not stop watch or did not exit.")
    };
    MainComponent.prototype.contractSettings = function () {
        // this.router.navigate(["/contractcreate/"+this._current_location.id+"/1"], {
        this.router.navigate(["/contractcreate", this._current_location.id, 1], {
            // animation: true,
            transition: {
                name: "slideLeft",
                duration: 200,
                curve: "linear"
            }
        });
    };
    MainComponent.prototype.createContract = function () {
        this.router.navigate(["/contractcreate", this._current_location.id, 0], {
            // animation: true,
            transition: {
                name: "slideLeft",
                duration: 200,
                curve: "linear"
            }
        });
    };
    MainComponent.prototype.logout = function () {
        appSettings.remove("user_name");
        appSettings.remove("user_password");
        this.router.navigate(["/"]);
    };
    MainComponent.prototype.verifyContract = function () {
        var _this = this;
        this.isBusy = true;
        this.locationService.getCurrentLocation()
            .then(function (location) {
            _this.isBusy = false;
            if (location != undefined) {
                _this._current_location = location;
                _this.isCurrentLocation = true;
                console.log("gotten location, lat: " + location.lat + ", lng: " + location.lng);
                _this._locations_in_db.forEach(function (location) {
                    // console.log("location.ne_lat: "+location.ne_lat+" >= this._current_location.lat: "+this._current_location.lat);         
                    // console.log(location.ne_lat >= this._current_location.lat);
                    // console.log("location.ne_lng: "+location.ne_lng+" >= this._current_location.lng: "+this._current_location.lng);
                    // console.log(location.ne_lng >= this._current_location.lng);
                    // console.log("location.sw_lat: "+location.sw_lat+" <= this._current_location.lat: "+this._current_location.lat);
                    // console.log(location.sw_lat <= this._current_location.lat);
                    // console.log("location.sw_lng: "+location.sw_lng+" <= this._current_location.lng: "+this._current_location.lng);
                    // console.log(location.sw_lng <= this._current_location.lng);
                    if ((location.ne_lat >= _this._current_location.lat && location.ne_lng >= _this._current_location.lng)
                        && (location.sw_lat <= _this._current_location.lat && location.sw_lng <= _this._current_location.lng)) {
                        _this.canContract = true;
                        console.log("in location: " + location.name);
                        _this._current_location = location;
                        console.log("looking for a contract between location: " + _this._current_location.id + " and customer " + _this._customer_id);
                        _this.contractService.getActiveContract(_this._current_location.id, _this._customer_id)
                            .subscribe(function (responseContract) {
                            console.log("you have a contract --2.1, status: " + responseContract.status);
                            console.log("you have a contract --2.1, message: " + responseContract.message);
                            if (!responseContract.message) {
                                console.log("you have a contract: " + responseContract.status);
                                _this._contract = responseContract;
                                _this.canContract = false;
                                _this.hasContract = true;
                            }
                            _this.isBusy = false;
                        }, function (error) {
                            if (error.status == 404) {
                                _this.canContract = true;
                                _this.hasContract = false;
                            }
                            else {
                                alert("Error getting active contract information: " + error);
                            }
                            _this.isBusy = false;
                        });
                    }
                });
            }
            else {
                throw "Location not found";
            }
        }).catch(function (error) {
            _this.isBusy = false;
            alert(error);
        });
    };
    MainComponent.prototype.getCurrentLocation = function () {
        var _this = this;
        // TODO get own coordenates
        this.isBusy = true;
        this.locationService.getCurrentLocation()
            .then(function (location) {
            _this.isBusy = false;
            if (location != undefined) {
                _this._current_location = location;
                _this.isCurrentLocation = true;
            }
            else {
                throw "Location not found";
            }
        }).catch(function (error) {
            _this.isBusy = false;
            alert(error);
        });
    };
    // METHODS ONLY FOR TESTING DATABASE
    MainComponent.prototype.showLocationsInDatabase = function () {
        this._locations_in_db.forEach(function (location) {
            alert("Location: " + location.name);
        });
    };
    MainComponent.prototype.isLocationDatabaseEmpty = function () {
        var empty = true;
        // console.log("Test1.6");
        // console.log("Test1.7, length: "+this.locationDatabaseService.selectAllLocations().length);
        if (this.locationDatabaseService.selectAllLocations().length > 0) {
            empty = false;
        }
        return empty;
    };
    MainComponent.prototype.updateLocationDatabase = function () {
        var _this = this;
        // alert("updating locations db..")
        // Drops DB if  exist
        this.locationDatabaseService.dropTable();
        // Creates DB if not exist
        this.locationDatabaseService.createTable();
        this.isBusy = true;
        this.locationService.getLocations()
            .subscribe(function (response) {
            _this.isBusy = false;
            response.forEach(function (location) {
                // console.log("location name: "+ location.name);
                _this.locationDatabaseService.insertLocation(location);
            });
            _this.router.navigate(["/main"]);
        }, function (error) {
            _this.isBusy = false;
            alert(error);
        });
    };
    MainComponent = __decorate([
        core_1.Component({
            selector: "main",
            providers: [location_service_1.LocationService, location_db_service_1.LocationDatabaseService, contract_service_1.ContractService],
            // providers: [LocationService, ContractService],
            templateUrl: "pages/main/main.html",
            styleUrls: ["pages/main/main-common.css"]
        }),
        __metadata("design:paramtypes", [location_service_1.LocationService,
            location_db_service_1.LocationDatabaseService,
            contract_service_1.ContractService,
            router_1.ActivatedRoute,
            router_2.RouterExtensions,
            common_1.Location])
    ], MainComponent);
    return MainComponent;
}());
exports.MainComponent = MainComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYWluLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFrRDtBQUNsRCwwQ0FBaUQ7QUFDakQsc0RBQStEO0FBQy9ELDBDQUE2RDtBQU03RCwyRUFBeUU7QUFDekUsaUZBQW9GO0FBQ3BGLDJFQUF5RTtBQUV6RSx5Q0FBMkM7QUFDM0MsMkNBQXNGO0FBQ3RGLHFDQUFxQztBQUVyQywrQ0FBK0M7QUFDL0MsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFVbEQ7SUE2QkUsdUJBQ1UsZUFBZ0MsRUFDaEMsdUJBQWdELEVBQ2hELGVBQWdDLEVBQ2hDLEtBQXFCLEVBQ3JCLE1BQXdCLEVBQ3hCLGNBQThCO1FBTDlCLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUNoQyw0QkFBdUIsR0FBdkIsdUJBQXVCLENBQXlCO1FBQ2hELG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUNoQyxVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQUNyQixXQUFNLEdBQU4sTUFBTSxDQUFrQjtRQUN4QixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUEvQnhDLDJDQUEyQztRQUNuQyxVQUFLLEdBQUcsUUFBUSxDQUFDO1FBV3pCLGVBQWU7UUFDZiw2QkFBNkI7UUFDdEIsc0JBQWlCLEdBQUcsS0FBSyxDQUFDO1FBQzFCLG1CQUFjLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLFdBQU0sR0FBRyxLQUFLLENBQUM7UUFDZixnQkFBVyxHQUFHLEtBQUssQ0FBQztRQUNwQixnQkFBVyxHQUFHLEtBQUssQ0FBQztRQUUzQixRQUFRO1FBQ0QsY0FBUyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEMsZUFBVSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekMsa0JBQWEsR0FBRyxNQUFNLENBQUMsWUFBWSxD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Q0FBQyxZQUFZLEVBQUU7YUFDaEMsU0FBUyxDQUFDLFVBQUEsUUFBUTtZQUNqQixLQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztZQUVwQixRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsUUFBUTtnQkFDdkIsaURBQWlEO2dCQUNqRCxLQUFJLENBQUMsdUJBQXVCLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRXhELENBQUMsQ0FBQyxDQUFDO1lBQ0gsS0FBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLENBQUMsRUFBQyxVQUFBLEtBQUs7WUFDTCxLQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztZQUNwQixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDZixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUE5UFUsYUFBYTtRQVJ6QixnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLE1BQU07WUFDaEIsU0FBUyxFQUFFLENBQUMsa0NBQWUsRUFBRSw2Q0FBdUIsRUFBRSxrQ0FBZSxDQUFDO1lBQ3RFLGlEQUFpRDtZQUNqRCxXQUFXLEVBQUUsc0JBQXNCO1lBQ25DLFNBQVMsRUFBQyxDQUFDLDRCQUE0QixDQUFDO1NBQzNDLENBQUM7eUNBZ0MyQixrQ0FBZTtZQUNQLDZDQUF1QjtZQUMvQixrQ0FBZTtZQUN6Qix1QkFBYztZQUNiLHlCQUFnQjtZQUNSLGlCQUFjO09BbkM3QixhQUFhLENBK1B6QjtJQUFELG9CQUFDO0NBQUEsQUEvUEQsSUErUEM7QUEvUFksc0NBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcbmltcG9ydCB7IFJvdXRlckV4dGVuc2lvbnMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQgeyBMb2NhdGlvbiBhcyBMb2NhdGlvbkNvbW1vbiB9IGZyb20gXCJAYW5ndWxhci9jb21tb25cIjtcblxuaW1wb3J0IHsgVXNlciB9IGZyb20gXCIuLi8uLi9zaGFyZWQvdXNlci91c2VyXCI7XG5pbXBvcnQgeyBMb2NhdGlvbiB9IGZyb20gXCIuLi8uLi9zaGFyZWQvbG9jYXRpb24vbG9jYXRpb25cIjtcbmltcG9ydCB7IENvbnRyYWN0IH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9jb250cmFjdC9jb250cmFjdFwiO1xuXG5pbXBvcnQgeyBMb2NhdGlvblNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2xvY2F0aW9uL2xvY2F0aW9uLnNlcnZpY2VcIjtcbmltcG9ydCB7IExvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2hhcmVkL2xvY2F0aW9uL2xvY2F0aW9uLmRiLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29udHJhY3RTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9jb250cmFjdC9jb250cmFjdC5zZXJ2aWNlXCI7XG5cbmltcG9ydCAqIGFzIGFwcGxpY2F0aW9uIGZyb20gJ2FwcGxpY2F0aW9uJztcbmltcG9ydCB7IEFuZHJvaWRBcHBsaWNhdGlvbiwgQW5kcm9pZEFjdGl2aXR5QmFja1ByZXNzZWRFdmVudERhdGEgfSBmcm9tIFwiYXBwbGljYXRpb25cIjtcbmltcG9ydCB7IGlzQW5kcm9pZCB9IGZyb20gXCJwbGF0Zm9ybVwiO1xuXG4vLyBpbXBvcnQgeyBzdG9yYWdlIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2xvY2FsXCI7XG52YXIgYXBwU2V0dGluZ3MgPSByZXF1aXJlKFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIik7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiBcIm1haW5cIixcbiAgICBwcm92aWRlcnM6IFtMb2NhdGlvblNlcnZpY2UsIExvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlLCBDb250cmFjdFNlcnZpY2VdLFxuICAgIC8vIHByb3ZpZGVyczogW0xvY2F0aW9uU2VydmljZSwgQ29udHJhY3RTZXJ2aWNlXSxcbiAgICB0ZW1wbGF0ZVVybDogXCJwYWdlcy9tYWluL21haW4uaHRtbFwiLFxuICAgIHN0eWxlVXJsczpbXCJwYWdlcy9tYWluL21haW4tY29tbW9uLmNzc1wiXSBcbn0pXG5cbmV4cG9ydCBjbGFzcyBNYWluQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0e1xuXG4gIC8vIHByaXZhdGUgdmFyaWFibGVzXG4gIHByaXZhdGUgX2N1cnJlbnRfbG9jYXRpb246IExvY2F0aW9uO1xuICAvLyBwcml2YXRlIF9hbGxfbG9jYXRpb25zOiBBcnJheTxMb2NhdGlvbj47XG4gIHByaXZhdGUgX25hbWUgPSBcImNhcmxvc1wiO1xuICBwcml2YXRlIF9jb250cmFjdDogQ29udHJhY3Q7XG4gIC8vIHByaXZhdGUgX2xvY2F0aW9uX2RhdGFiYXNlOiBhbnk7XG4gIHByaXZhdGUgX2xvY2F0aW9uc19pbl9kYjogQXJyYXk8TG9jYXRpb24+O1xuICAvLyBwcml2YXRlIF9sb2NhdGlvbl9pZDogbnVtYmVyO1xuICBwcml2YXRlIF93YXRjaF9sb2NhdGlvbl9pZDogYW55O1xuICBwcml2YXRlIF9jdXN0b21lcl9pZDogbnVtYmVyO1xuXG4gIC8vIHB1YmxpYyB2YXJpYWJsZXNcbiAgcHVibGljIHRpdGxlOiBzdHJpbmc7XG5cbiAgLy8gYnV0dG9uIGZsYWdzXG4gIC8vIHB1YmxpYyBpbkxvY2F0aW9uID0gZmFsc2U7XG4gIHB1YmxpYyBpc0N1cnJlbnRMb2NhdGlvbiA9IGZhbHNlO1xuICBwdWJsaWMgaXNBbGxMb2NhdGlvbnMgPSBmYWxzZTtcbiAgcHVibGljIGlzQnVzeSA9IGZhbHNlO1xuICBwdWJsaWMgY2FuQ29udHJhY3QgPSBmYWxzZTtcbiAgcHVibGljIGhhc0NvbnRyYWN0ID0gZmFsc2U7XG5cbiAgLy8gSWNvbnNcbiAgcHVibGljIGdlYXJzSWNvbiA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMHhmMDg1KTtcbiAgcHVibGljIGxvZ291dEljb24gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4ZjA4Yik7XG4gIHB1YmxpYyBoYW5kc2hha2VJY29uID0gU3RyaW5nLmZyb21DaGFyQ29kZSgweGYyYjUpO1xuICBcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBsb2NhdGlvblNlcnZpY2U6IExvY2F0aW9uU2VydmljZSxcbiAgICBwcml2YXRlIGxvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlOiBMb2NhdGlvbkRhdGFiYXNlU2VydmljZSxcbiAgICBwcml2YXRlIGNvbnRyYWN0U2VydmljZTogQ29udHJhY3RTZXJ2aWNlLFxuICAgIHByaXZhdGUgcm91dGU6IEFjdGl2YXRlZFJvdXRlLFxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXJFeHRlbnNpb25zLFxuICAgIHByaXZhdGUgbG9jYXRpb25Db21tb246IExvY2F0aW9uQ29tbW9uKXtcbiAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICB0aGlzLl9jdXJyZW50X2xvY2F0aW9uID0gbnVsbDtcbiAgICAgIC8vIHRoaXMuX2FsbF9sb2NhdGlvbnMgPSBbXTtcbiAgICAgIHRoaXMuX2xvY2F0aW9uc19pbl9kYiA9IFtdO1xuICAgICAgLy8gdGhpcy5fbG9jYXRpb25fZGF0YWJhc2UgPSB0aGlzLmxvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlLmdldERhdGFiYXNlKCk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcblxuICAgIC8vIFJldHVybiB0byBsb2dpbiBpZiBhcHAgc2V0dGluZ3MgYXJlIG5vdCBzZXRcbiAgICBpZiAoIWFwcFNldHRpbmdzLmhhc0tleShcInVzZXJfbmFtZVwiKSB8fCAhYXBwU2V0dGluZ3MuaGFzS2V5KFwidXNlcl9wYXNzd29yZFwiKSl7XG4gICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvXCJdKTtcbiAgICB9XG5cbiAgICBpZiAoaXNBbmRyb2lkKSB7XG4gICAgICAgIGFwcGxpY2F0aW9uLmFuZHJvaWQub24oQW5kcm9pZEFwcGxpY2F0aW9uLmFjdGl2aXR5QmFja1ByZXNzZWRFdmVudCwgKGRhdGE6IEFuZHJvaWRBY3Rpdml0eUJhY2tQcmVzc2VkRXZlbnREYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL1wiXSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgdGhpcy50aXRsZSA9IFwiV2VsY29tZSBcIisgYXBwU2V0dGluZ3MuZ2V0U3RyaW5nKFwidXNlcl9uYW1lXCIpOyAgICBcblxuICAgIHRyeXtcbiAgICAgICAgdGhpcy5fY3VzdG9tZXJfaWQgPSBhcHBTZXR0aW5ncy5nZXROdW1iZXIoXCJ1c2VyX2lkXCIpO1xuICAgICAgICBjb25zb2xlLmxvZyhcInRyeWluZyBjdXN0OiBcIit0aGlzLl9jdXN0b21lcl9pZCk7XG4gICAgICB9Y2F0Y2goZSl7XG4gICAgICAgIHRoaXMuX2N1c3RvbWVyX2lkID0gMDtcbiAgICAgIH0gICAgICBcbiAgICBjb25zb2xlLmxvZyhcInRyaWVkIGN1c3Q6IFwiK3RoaXMuX2N1c3RvbWVyX2lkKTtcbiAgICAvLyBDcmVhdGVzIERCIGlmIG5vdCBleGlzdFxuICAgIHRoaXMubG9jYXRpb25EYXRhYmFzZVNlcnZpY2UuY3JlYXRlVGFibGUoKTtcblxuICAgIC8vVXBkYXRlcyB0aGUgbG9jYXRpb25zIERCLCB0aGlzIHNob3VsZCBub3QgYmUgZG9uZSBldmVyeSB0aW1lLCBidXQgcmF0aGVyIG9uY2UgZXZlcnkgZGF5XG4gICAgLy8gY29uc29sZS5sb2coXCJUZXN0MVwiKTtcbiAgICBpZih0aGlzLmlzTG9jYXRpb25EYXRhYmFzZUVtcHR5KCkpe1xuICAgICAgLy8gY29uc29sZS5sb2coXCJUZXN0MS41XCIpO1xuICAgICAgdGhpcy51cGRhdGVMb2NhdGlvbkRhdGFiYXNlKCk7XG4gICAgfVxuXG4gICAgLy8gRXh0cmFjdHMgbG9jYXRpb25zIGZyb20gREJcbiAgICB0aGlzLl9sb2NhdGlvbnNfaW5fZGIgPSB0aGlzLmxvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlLnNlbGVjdEFsbExvY2F0aW9ucygpO1xuXG4gICAgLy8gU3RhcnQgd2F0Y2hpbmcgZm9yIGxvY2F0aW9uXG4gICAgLy8gdGhpcy5fd2F0Y2hfbG9jYXRpb25faWQgPSB0aGlzLmxvY2F0aW9uU2VydmljZS5zdGFydFdhdGNoaW5nTG9jYXRpb24oKTtcbiAgICBcbiAgICAvLyBTcGVjaWFsIE9uSW5pdCBwcm9jZXMgZm9yIGxvY2F0aW9uXG4gICAgdGhpcy52ZXJpZnlDb250cmFjdCgpO1xuXG4gICAgXG4gIH1cblxuICBwdWJsaWMgbmdPbkRlc3Ryb3koKSB7XG4gICAgLy9DYWxsZWQgb25jZSwgYmVmb3JlIHRoZSBpbnN0YW5jZSBpcyBkZXN0cm95ZWQuXG4gICAgLy9BZGQgJ2ltcGxlbWVudHMgT25EZXN0cm95JyB0byB0aGUgY2xhc3MuXG4gICAgdGhpcy5sb2NhdGlvblNlcnZpY2Uuc3RvcFdhdGNoaW5nTG9jYXRpb24odGhpcy5fd2F0Y2hfbG9jYXRpb25faWQpXG4gICAgLy8gaWYgKHRoaXMubG9jYXRpb25TZXJ2aWNlLnN0b3BXYXRjaGluZ0xvY2F0aW9uKHRoaXMuX3dhdGNoX2xvY2F0aW9uX2lkKSlcbiAgICAvLyAgIGFsZXJ0KFwiU3RvcGluZyB3YXRjaC5cIik7XG4gICAgLy8gZWxzZVxuICAgIC8vICAgYWxlcnQoXCJDb3VsZCBub3Qgc3RvcCB3YXRjaCBvciBkaWQgbm90IGV4aXQuXCIpXG4gIH1cblxuICBcblxuICBwdWJsaWMgY29udHJhY3RTZXR0aW5ncygpe1xuICAgIC8vIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9jb250cmFjdGNyZWF0ZS9cIit0aGlzLl9jdXJyZW50X2xvY2F0aW9uLmlkK1wiLzFcIl0sIHtcbiAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvY29udHJhY3RjcmVhdGVcIix0aGlzLl9jdXJyZW50X2xvY2F0aW9uLmlkLDFdLCB7XG4gICAgICAvLyBhbmltYXRpb246IHRydWUsXG4gICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgbmFtZTogXCJzbGlkZUxlZnRcIixcbiAgICAgICAgICBkdXJhdGlvbjogMjAwLFxuICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgY3JlYXRlQ29udHJhY3QoKXtcbiAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvY29udHJhY3RjcmVhdGVcIix0aGlzLl9jdXJyZW50X2xvY2F0aW9uLmlkLDBdLCB7XG4gICAgICAvLyBhbmltYXRpb246IHRydWUsXG4gICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgbmFtZTogXCJzbGlkZUxlZnRcIixcbiAgICAgICAgICBkdXJhdGlvbjogMjAwLFxuICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgbG9nb3V0KCl7XG4gICAgYXBwU2V0dGluZ3MucmVtb3ZlKFwidXNlcl9uYW1lXCIpO1xuICAgIGFwcFNldHRpbmdzLnJlbW92ZShcInVzZXJfcGFzc3dvcmRcIik7XG5cbiAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvXCJdKTtcbiAgfVxuXG4gIHZlcmlmeUNvbnRyYWN0KCl7XG4gICAgdGhpcy5pc0J1c3kgPSB0cnVlO1xuICAgIHRoaXMubG9jYXRpb25TZXJ2aWNlLmdldEN1cnJlbnRMb2NhdGlvbigpXG4gICAgICAudGhlbigobG9jYXRpb246IExvY2F0aW9uKSA9PiB7XG4gICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgIGlmKGxvY2F0aW9uICE9IHVuZGVmaW5lZCl7XG4gICAgICAgICAgdGhpcy5fY3VycmVudF9sb2NhdGlvbiA9IGxvY2F0aW9uO1xuICAgICAgICAgIHRoaXMuaXNDdXJyZW50TG9jYXRpb24gPSB0cnVlO1xuXG4gICAgICAgICAgY29uc29sZS5sb2coXCJnb3R0ZW4gbG9jYXRpb24sIGxhdDogXCIrbG9jYXRpb24ubGF0K1wiLCBsbmc6IFwiK2xvY2F0aW9uLmxuZyk7XG4gICAgICAgIFxuICAgICAgICAgIHRoaXMuX2xvY2F0aW9uc19pbl9kYi5mb3JFYWNoKGxvY2F0aW9uID0+e1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJsb2NhdGlvbi5uZV9sYXQ6IFwiK2xvY2F0aW9uLm5lX2xhdCtcIiA+PSB0aGlzLl9jdXJyZW50X2xvY2F0aW9uLmxhdDogXCIrdGhpcy5fY3VycmVudF9sb2NhdGlvbi5sYXQpOyAgICAgICAgIFxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobG9jYXRpb24ubmVfbGF0ID49IHRoaXMuX2N1cnJlbnRfbG9jYXRpb24ubGF0KTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwibG9jYXRpb24ubmVfbG5nOiBcIitsb2NhdGlvbi5uZV9sbmcrXCIgPj0gdGhpcy5fY3VycmVudF9sb2NhdGlvbi5sbmc6IFwiK3RoaXMuX2N1cnJlbnRfbG9jYXRpb24ubG5nKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGxvY2F0aW9uLm5lX2xuZyA+PSB0aGlzLl9jdXJyZW50X2xvY2F0aW9uLmxuZyk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImxvY2F0aW9uLnN3X2xhdDogXCIrbG9jYXRpb24uc3dfbGF0K1wiIDw9IHRoaXMuX2N1cnJlbnRfbG9jYXRpb24ubGF0OiBcIit0aGlzLl9jdXJyZW50X2xvY2F0aW9uLmxhdCk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhsb2NhdGlvbi5zd19sYXQgPD0gdGhpcy5fY3VycmVudF9sb2NhdGlvbi5sYXQpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJsb2NhdGlvbi5zd19sbmc6IFwiK2xvY2F0aW9uLnN3X2xuZytcIiA8PSB0aGlzLl9jdXJyZW50X2xvY2F0aW9uLmxuZzogXCIrdGhpcy5fY3VycmVudF9sb2NhdGlvbi5sbmcpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobG9jYXRpb24uc3dfbG5nIDw9IHRoaXMuX2N1cnJlbnRfbG9jYXRpb24ubG5nKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKChsb2NhdGlvbi5uZV9sYXQgPj0gdGhpcy5fY3VycmVudF9sb2NhdGlvbi5sYXQgJiYgbG9jYXRpb24ubmVfbG5nID49IHRoaXMuX2N1cnJlbnRfbG9jYXRpb24ubG5nKSBcbiAgICAgICAgICAgICAgJiYgKGxvY2F0aW9uLnN3X2xhdCA8PSB0aGlzLl9jdXJyZW50X2xvY2F0aW9uLmxhdCAmJiBsb2NhdGlvbi5zd19sbmcgPD0gdGhpcy5fY3VycmVudF9sb2NhdGlvbi5sbmcpICl7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW5Db250cmFjdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbiBsb2NhdGlvbjogXCIrIGxvY2F0aW9uLm5hbWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRfbG9jYXRpb24gPSBsb2NhdGlvbjtcblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9va2luZyBmb3IgYSBjb250cmFjdCBiZXR3ZWVuIGxvY2F0aW9uOiBcIisgdGhpcy5fY3VycmVudF9sb2NhdGlvbi5pZCtcIiBhbmQgY3VzdG9tZXIgXCIgK3RoaXMuX2N1c3RvbWVyX2lkKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyYWN0U2VydmljZS5nZXRBY3RpdmVDb250cmFjdCh0aGlzLl9jdXJyZW50X2xvY2F0aW9uLmlkLCB0aGlzLl9jdXN0b21lcl9pZClcbiAgICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUocmVzcG9uc2VDb250cmFjdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwieW91IGhhdmUgYSBjb250cmFjdCAtLTIuMSwgc3RhdHVzOiBcIityZXNwb25zZUNvbnRyYWN0LnN0YXR1cyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwieW91IGhhdmUgYSBjb250cmFjdCAtLTIuMSwgbWVzc2FnZTogXCIrcmVzcG9uc2VDb250cmFjdC5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXNwb25zZUNvbnRyYWN0Lm1lc3NhZ2Upe1xuICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwieW91IGhhdmUgYSBjb250cmFjdDogXCIrcmVzcG9uc2VDb250cmFjdC5zdGF0dXMpO1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRyYWN0ID0gcmVzcG9uc2VDb250cmFjdDtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbkNvbnRyYWN0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYXNDb250cmFjdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIH0sZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3Iuc3RhdHVzID09IDQwNCl7XG4gICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW5Db250cmFjdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYXNDb250cmFjdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICBhbGVydChcIkVycm9yIGdldHRpbmcgYWN0aXZlIGNvbnRyYWN0IGluZm9ybWF0aW9uOiBcIitlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgdGhyb3cgXCJMb2NhdGlvbiBub3QgZm91bmRcIjtcbiAgICAgICAgfSBcbiAgICAgIH1cbiAgICAgICkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgIGFsZXJ0KGVycm9yKVxuICAgICAgfSk7XG4gIH1cblxuXG4gIHByaXZhdGUgZ2V0Q3VycmVudExvY2F0aW9uKCl7XG4gICAgLy8gVE9ETyBnZXQgb3duIGNvb3JkZW5hdGVzXG4gICAgdGhpcy5pc0J1c3kgPSB0cnVlO1xuICAgIHRoaXMubG9jYXRpb25TZXJ2aWNlLmdldEN1cnJlbnRMb2NhdGlvbigpXG4gICAgICAudGhlbigobG9jYXRpb246IExvY2F0aW9uKSA9PiB7XG4gICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgIGlmKGxvY2F0aW9uICE9IHVuZGVmaW5lZCl7XG4gICAgICAgICAgdGhpcy5fY3VycmVudF9sb2NhdGlvbiA9IGxvY2F0aW9uO1xuICAgICAgICAgIHRoaXMuaXNDdXJyZW50TG9jYXRpb24gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgdGhyb3cgXCJMb2NhdGlvbiBub3QgZm91bmRcIjtcbiAgICAgICAgfSBcbiAgICAgIH1cbiAgICAgICkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgIGFsZXJ0KGVycm9yKVxuICAgICAgfSk7XG4gIH1cblxuXG4gIC8vIE1FVEhPRFMgT05MWSBGT1IgVEVTVElORyBEQVRBQkFTRVxuICBwdWJsaWMgc2hvd0xvY2F0aW9uc0luRGF0YWJhc2UoKSB7IFxuICAgIHRoaXMuX2xvY2F0aW9uc19pbl9kYi5mb3JFYWNoKGxvY2F0aW9uID0+IHtcbiAgICAgIGFsZXJ0KFwiTG9jYXRpb246IFwiK2xvY2F0aW9uLm5hbWUpO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGlzTG9jYXRpb25EYXRhYmFzZUVtcHR5KCl7XG4gICAgbGV0IGVtcHR5ID0gdHJ1ZTtcbiAgICAvLyBjb25zb2xlLmxvZyhcIlRlc3QxLjZcIik7XG4gICAgLy8gY29uc29sZS5sb2coXCJUZXN0MS43LCBsZW5ndGg6IFwiK3RoaXMubG9jYXRpb25EYXRhYmFzZVNlcnZpY2Uuc2VsZWN0QWxsTG9jYXRpb25zKCkubGVuZ3RoKTtcbiAgICBpZiAodGhpcy5sb2NhdGlvbkRhdGFiYXNlU2VydmljZS5zZWxlY3RBbGxMb2NhdGlvbnMoKS5sZW5ndGggPiAwKXtcbiAgICAgIFxuICAgICAgZW1wdHkgPSBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIGVtcHR5O1xuICB9XG5cbiAgcHVibGljIHVwZGF0ZUxvY2F0aW9uRGF0YWJhc2UoKXtcbiAgICAvLyBhbGVydChcInVwZGF0aW5nIGxvY2F0aW9ucyBkYi4uXCIpXG4gICAgLy8gRHJvcHMgREIgaWYgIGV4aXN0XG4gICAgdGhpcy5sb2NhdGlvbkRhdGFiYXNlU2VydmljZS5kcm9wVGFibGUoKTtcbiAgICAvLyBDcmVhdGVzIERCIGlmIG5vdCBleGlzdFxuICAgIHRoaXMubG9jYXRpb25EYXRhYmFzZVNlcnZpY2UuY3JlYXRlVGFibGUoKTtcblxuICAgIHRoaXMuaXNCdXN5ID0gdHJ1ZTtcbiAgICB0aGlzLmxvY2F0aW9uU2VydmljZS5nZXRMb2NhdGlvbnMoKVxuICAgICAgLnN1YnNjcmliZShyZXNwb25zZSA9PiB7XG4gICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgIFxuICAgICAgICByZXNwb25zZS5mb3JFYWNoKGxvY2F0aW9uID0+IHtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImxvY2F0aW9uIG5hbWU6IFwiKyBsb2NhdGlvbi5uYW1lKTtcbiAgICAgICAgICB0aGlzLmxvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlLmluc2VydExvY2F0aW9uKGxvY2F0aW9uKTtcblxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL21haW5cIl0pOyAgXG4gICAgICB9LGVycm9yID0+IHtcbiAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgYWxlcnQoZXJyb3IpO1xuICAgICAgfSk7XG4gIH1cbn0iXX0=