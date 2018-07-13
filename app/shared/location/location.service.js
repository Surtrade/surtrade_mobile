"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Rx_1 = require("rxjs/Rx");
var nativescript_geolocation_1 = require("nativescript-geolocation");
// import { LocationDatabaseService } from '../../shared/location/location.db.service';
var config_1 = require("../config");
var location_1 = require("./location");
var appSettings = require("application-settings");
var LocationService = /** @class */ (function () {
    // Temporal use of a locations list in memory
    // private _locationList: Array<Location>;
    function LocationService(http) {
        this.http = http;
        // this._location_database = this.locationDatabaseService.getDatabase();
        // console.log("Constructing location..");
        this._location = new location_1.Location(0.0, 0.0);
        // console.log("Constructing location lat: "+this._location.lat);
    }
    LocationService.prototype.enableLocation = function () {
        // console.log("Enabling location services.");
        if (!nativescript_geolocation_1.isEnabled()) {
            nativescript_geolocation_1.enableLocationRequest();
        }
    };
    LocationService.prototype.getCurrentLocation = function () {
        var _this = this;
        console.log("Before enabling");
        this.enableLocation();
        console.log("After enabling");
        // return getCurrentLocation({desiredAccuracy: 3, updateDistance: 10, maximumAge: 5000, timeout: 5000})
        return nativescript_geolocation_1.getCurrentLocation({ timeout: 5000 })
            .then(function (loc) {
            console.log("-------Current Latitude is: " + loc.latitude);
            console.log("-------Current Longitud is: " + loc.longitude);
            return new location_1.Location(loc.latitude, loc.longitude);
        }, function (error) {
            console.log("Error :( .." + error);
            _this.handleErrors(error);
        });
    };
    LocationService.prototype.getWatchedLocation = function () {
        return this._location;
    };
    LocationService.prototype.startWatchingLocation = function () {
        // let location;
        return nativescript_geolocation_1.watchLocation(function (loc) {
            if (loc) {
                console.log("Received location lat: " + loc.latitude);
                appSettings.setString("latitud", loc.latitude.toString());
                appSettings.setString("longitud", loc.longitude.toString());
                // this._location = new Location(loc.latitude, loc.longitude);
                // this._location.lat = loc.latitude;
                // this._location.lng = loc.longitude;
            }
        }, function (e) {
            console.log("Error: " + e.message);
        }, { desiredAccuracy: 3, updateDistance: 10, minimumUpdateTime: 1000 * 20 }); // Should update every 20 seconds according to Googe documentation. Not verified.
    };
    LocationService.prototype.stopWatchingLocation = function (watchId) {
        if (watchId) {
            nativescript_geolocation_1.clearWatch(watchId);
            return true;
        }
        return false;
    };
    // this method calls the API and receives a list of all locations
    LocationService.prototype.getLocations = function () {
        var headers = new http_1.Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + config_1.Config.token);
        return this.http.get(config_1.Config.apiUrl + "locations", {
            headers: headers
        })
            .map(function (res) { return res.json(); })
            .map(function (data) {
            var locationList = new Array();
            data.forEach(function (location) {
                var loc = new location_1.Location(location.geolocation.location.lat, location.geolocation.location.lng);
                loc.address = location.address;
                loc.name = location.name;
                loc.id = location.id;
                loc.ne_lat = location.geolocation.bounds.northeast.lat;
                loc.ne_lng = location.geolocation.bounds.northeast.lng;
                loc.sw_lat = location.geolocation.bounds.southwest.lat;
                loc.sw_lng = location.geolocation.bounds.southwest.lng;
                locationList.push(loc);
            });
            return locationList;
        })
            .catch(this.handleErrors);
    };
    // public isUserInLocation(){
    //   var inLocation = new Location(0,0);
    //   inLocation.id = 0;
    //   return this.getCurrentLocation()
    //     .then((currentLocation: Location) => {
    //       if(currentLocation != undefined){
    //         this.locationDatabaseService.query("locations").forEach(location =>{
    //           if ((location.ne_lat >= currentLocation.lat && location.ne_lng >= currentLocation.lng) 
    //             && (location.sw_lat <= currentLocation.lat && location.sw_lng <= currentLocation.lng) ){
    //               inLocation = location;
    //             }
    //         });
    //       }
    //       else{
    //         throw "Location not found";
    //       } 
    //       return inLocation;
    //     });
    //   // return inLocation;
    // }
    // public updateLocationDatabase(){
    //   // Delete existing database
    //   // try{
    //   //   this._location_database.deleteDatabase();
    //   // }catch(e){
    //   //   this.handleErrors(e);
    //   // }   
    //   let headers = new Headers();
    //   headers.append("Content-Type", "application/json");
    //   headers.append("Authorization", "Bearer " + Config.token);
    //   return this.http.get(Config.apiUrl + "locations", {
    //     headers: headers
    //   })
    //   .map(res => res.json())
    //   .map(data => {
    //     let locationList = [];
    //     console.log("Response from API with locations.. "+ data.length);
    //     data.forEach((location) => {
    //       let loc = new Location(location.geolocation.location.lat,location.geolocation.location.lng);
    //       loc.address = location.address;
    //       loc.name = location.name;
    //       loc.id = location.id;
    //       loc.ne_lat = location.geolocation.bounds.northeast.lat;
    //       loc.ne_lng = location.geolocation.bounds.northeast.lng;
    //       loc.sw_lat = location.geolocation.bounds.southwest.lat;
    //       loc.sw_lng = location.geolocation.bounds.southwest.lng;
    //       let document_location = this._location_database.createDocument(loc);
    //       console.log("Location created: "+document_location);
    //     });
    //     console.log("Locations in DB: "+this._location_database)
    //     return "Success";
    //   })
    //   .catch(this.handleErrors);
    // }
    LocationService.prototype.handleErrors = function (error) {
        // var err = new Error(error)
        console.log("Error in Location Service: " + error);
        console.log("Type of error: " + error.type);
        // return Promise.reject(error);
        return Rx_1.Observable.throw(error);
        // throw error;
        // return error;
    };
    LocationService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http])
    ], LocationService);
    return LocationService;
}());
exports.LocationService = LocationService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYXRpb24uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxvY2F0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkM7QUFDM0Msc0NBQXdEO0FBQ3hELDhCQUFxQztBQUNyQyxxRUFBcUk7QUFDckksdUZBQXVGO0FBRXZGLG9DQUFtQztBQUNuQyx1Q0FBc0M7QUFFdEMsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFHbEQ7SUFLRSw2Q0FBNkM7SUFDN0MsMENBQTBDO0lBRTFDLHlCQUNVLElBQVU7UUFBVixTQUFJLEdBQUosSUFBSSxDQUFNO1FBR2xCLHdFQUF3RTtRQUN4RSwwQ0FBMEM7UUFDMUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLG1CQUFRLENBQUMsR0FBRyxFQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZDLGlFQUFpRTtJQUNuRSxDQUFDO0lBRUQsd0NBQWMsR0FBZDtRQUNFLDhDQUE4QztRQUM5QyxFQUFFLENBQUMsQ0FBQyxDQUFDLG9DQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDZixnREFBcUIsRUFBRSxDQUFDO1FBQzVCLENBQUM7SUFDSCxDQUFDO0lBRUQsNENBQWtCLEdBQWxCO1FBQUEsaUJBY0M7UUFiQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDL0IsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUM5Qix1R0FBdUc7UUFDdkcsTUFBTSxDQUFDLDZDQUFrQixDQUFDLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQyxDQUFDO2FBQ3ZDLElBQUksQ0FBQyxVQUFDLEdBQUc7WUFDTixPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMzRCxPQUFPLENBQUMsR0FBRyxDQUFDLDhC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O0lBQzVCLG1CQUFtQjtJQUNuQiw2QkFBNkI7SUFDN0IsdUVBQXVFO0lBQ3ZFLG1DQUFtQztJQUNuQyxxR0FBcUc7SUFDckcsd0NBQXdDO0lBQ3hDLGtDQUFrQztJQUNsQyw4QkFBOEI7SUFDOUIsZ0VBQWdFO0lBQ2hFLGdFQUFnRTtJQUNoRSxnRUFBZ0U7SUFDaEUsZ0VBQWdFO0lBRWhFLDZFQUE2RTtJQUM3RSw2REFBNkQ7SUFHN0QsVUFBVTtJQUNWLCtEQUErRDtJQUUvRCx3QkFBd0I7SUFDeEIsT0FBTztJQUNQLCtCQUErQjtJQUUvQixJQUFJO0lBRUosc0NBQVksR0FBWixVQUFhLEtBQWU7UUFDMUIsNkJBQTZCO1FBQzdCLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEdBQUMsS0FBSyxDQUFDLENBQUM7UUFDakQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsR0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUMsZ0NBQWdDO1FBQ2hDLE1BQU0sQ0FBQyxlQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9CLGVBQWU7UUFDZixnQkFBZ0I7SUFDbEIsQ0FBQztJQS9LVSxlQUFlO1FBRDNCLGlCQUFVLEVBQUU7eUNBVUssV0FBSTtPQVRULGVBQWUsQ0FnTDNCO0lBQUQsc0JBQUM7Q0FBQSxBQWhMRCxJQWdMQztBQWhMWSwwQ0FBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgSHR0cCwgSGVhZGVycywgUmVzcG9uc2UgfSBmcm9tIFwiQGFuZ3VsYXIvaHR0cFwiO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gXCJyeGpzL1J4XCI7XG5pbXBvcnQgeyBpc0VuYWJsZWQsIGVuYWJsZUxvY2F0aW9uUmVxdWVzdCwgZ2V0Q3VycmVudExvY2F0aW9uLCB3YXRjaExvY2F0aW9uLCBkaXN0YW5jZSwgY2xlYXJXYXRjaCB9IGZyb20gXCJuYXRpdmVzY3JpcHQtZ2VvbG9jYXRpb25cIjtcbi8vIGltcG9ydCB7IExvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2hhcmVkL2xvY2F0aW9uL2xvY2F0aW9uLmRiLnNlcnZpY2UnO1xuXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi4vY29uZmlnXCI7XG5pbXBvcnQgeyBMb2NhdGlvbiB9IGZyb20gXCIuL2xvY2F0aW9uXCI7XG5cbnZhciBhcHBTZXR0aW5ncyA9IHJlcXVpcmUoXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiKTtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIExvY2F0aW9uU2VydmljZSB7XG5cbiAgcHVibGljIF9sb2NhdGlvbjogTG9jYXRpb247XG4gIHB1YmxpYyBfbG9jYXRpb25fZGF0YWJhc2U6IGFueTtcblxuICAvLyBUZW1wb3JhbCB1c2Ugb2YgYSBsb2NhdGlvbnMgbGlzdCBpbiBtZW1vcnlcbiAgLy8gcHJpdmF0ZSBfbG9jYXRpb25MaXN0OiBBcnJheTxMb2NhdGlvbj47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBodHRwOiBIdHRwLCBcbiAgICAvLyBwcml2YXRlIGxvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlOiBMb2NhdGlvbkRhdGFiYXNlU2VydmljZVxuICApe1xuICAgIC8vIHRoaXMuX2xvY2F0aW9uX2RhdGFiYXNlID0gdGhpcy5sb2NhdGlvbkRhdGFiYXNlU2VydmljZS5nZXREYXRhYmFzZSgpO1xuICAgIC8vIGNvbnNvbGUubG9nKFwiQ29uc3RydWN0aW5nIGxvY2F0aW9uLi5cIik7XG4gICAgdGhpcy5fbG9jYXRpb24gPSBuZXcgTG9jYXRpb24oMC4wLDAuMCk7XG4gICAgLy8gY29uc29sZS5sb2coXCJDb25zdHJ1Y3RpbmcgbG9jYXRpb24gbGF0OiBcIit0aGlzLl9sb2NhdGlvbi5sYXQpO1xuICB9XG5cbiAgZW5hYmxlTG9jYXRpb24oKSB7XG4gICAgLy8gY29uc29sZS5sb2coXCJFbmFibGluZyBsb2NhdGlvbiBzZXJ2aWNlcy5cIik7XG4gICAgaWYgKCFpc0VuYWJsZWQoKSkge1xuICAgICAgICBlbmFibGVMb2NhdGlvblJlcXVlc3QoKTtcbiAgICB9XG4gIH1cbiAgXG4gIGdldEN1cnJlbnRMb2NhdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZyhcIkJlZm9yZSBlbmFibGluZ1wiKTtcbiAgICB0aGlzLmVuYWJsZUxvY2F0aW9uKCk7XG4gICAgY29uc29sZS5sb2coXCJBZnRlciBlbmFibGluZ1wiKTtcbiAgICAvLyByZXR1cm4gZ2V0Q3VycmVudExvY2F0aW9uKHtkZXNpcmVkQWNjdXJhY3k6IDMsIHVwZGF0ZURpc3RhbmNlOiAxMCwgbWF4aW11bUFnZTogNTAwMCwgdGltZW91dDogNTAwMH0pXG4gICAgcmV0dXJuIGdldEN1cnJlbnRMb2NhdGlvbih7dGltZW91dDogNTAwMH0pXG4gICAgICAudGhlbigobG9jKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCItLS0tLS0tQ3VycmVudCBMYXRpdHVkZSBpczogXCIgKyBsb2MubGF0aXR1ZGUpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tLUN1cnJlbnQgTG9uZ2l0dWQgaXM6IFwiICsgbG9jLmxvbmdpdHVkZSk7XG4gICAgICAgICAgcmV0dXJuIG5ldyBMb2NhdGlvbihsb2MubGF0aXR1ZGUsIGxvYy5sb25naXR1ZGUpOyAgICAgICBcbiAgICAgIH0sKGVycm9yKT0+e1xuICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIDooIC4uXCIrZXJyb3IpO1xuICAgICAgICB0aGlzLmhhbmRsZUVycm9ycyhlcnJvcik7XG4gICAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRXYXRjaGVkTG9jYXRpb24oKXtcbiAgICByZXR1cm4gdGhpcy5fbG9jYXRpb247XG4gIH1cblxuICBwdWJsaWMgc3RhcnRXYXRjaGluZ0xvY2F0aW9uKCl7XG4gICAgLy8gbGV0IGxvY2F0aW9uO1xuICAgIHJldHVybiB3YXRjaExvY2F0aW9uKFxuICAgICAgZnVuY3Rpb24gKGxvYykge1xuICAgICAgICAgIGlmIChsb2MpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZWNlaXZlZCBsb2NhdGlvbiBsYXQ6IFwiICsgbG9jLmxhdGl0dWRlKTtcbiAgICAgICAgICAgICAgYXBwU2V0dGluZ3Muc2V0U3RyaW5nKFwibGF0aXR1ZFwiLGxvYy5sYXRpdHVkZS50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgYXBwU2V0dGluZ3Muc2V0U3RyaW5nKFwibG9uZ2l0dWRcIixsb2MubG9uZ2l0dWRlLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAvLyB0aGlzLl9sb2NhdGlvbiA9IG5ldyBMb2NhdGlvbihsb2MubGF0aXR1ZGUsIGxvYy5sb25naXR1ZGUpO1xuICAgICAgICAgICAgICAvLyB0aGlzLl9sb2NhdGlvbi5sYXQgPSBsb2MubGF0aXR1ZGU7XG4gICAgICAgICAgICAgIC8vIHRoaXMuX2xvY2F0aW9uLmxuZyA9IGxvYy5sb25naXR1ZGU7XG4gICAgICAgICAgfVxuICAgICAgfSwgXG4gICAgICBmdW5jdGlvbihlKXtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yOiBcIiArIGUubWVzc2FnZSk7XG4gICAgICB9LCBcbiAgICAgIHtkZXNpcmVkQWNjdXJhY3k6IDMsIHVwZGF0ZURpc3RhbmNlOiAxMCwgbWluaW11bVVwZGF0ZVRpbWUgOiAxMDAwICogMjB9XG4gICAgICApOyAvLyBTaG91bGQgdXBkYXRlIGV2ZXJ5IDIwIHNlY29uZHMgYWNjb3JkaW5nIHRvIEdvb2dlIGRvY3VtZW50YXRpb24uIE5vdCB2ZXJpZmllZC5cbiAgfVxuXG4gIHB1YmxpYyBzdG9wV2F0Y2hpbmdMb2NhdGlvbih3YXRjaElkKXtcbiAgICBpZiAod2F0Y2hJZCkge1xuICAgICAgICBjbGVhcldhdGNoKHdhdGNoSWQpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gdGhpcyBtZXRob2QgY2FsbHMgdGhlIEFQSSBhbmQgcmVjZWl2ZXMgYSBsaXN0IG9mIGFsbCBsb2NhdGlvbnNcbiAgZ2V0TG9jYXRpb25zKCl7XG4gICAgbGV0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuICAgIGhlYWRlcnMuYXBwZW5kKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICBoZWFkZXJzLmFwcGVuZChcIkF1dGhvcml6YXRpb25cIiwgXCJCZWFyZXIgXCIgKyBDb25maWcudG9rZW4pO1xuXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoQ29uZmlnLmFwaVVybCArIFwibG9jYXRpb25zXCIsIHtcbiAgICAgIGhlYWRlcnM6IGhlYWRlcnNcbiAgICB9KVxuICAgIC5tYXAocmVzID0+IHJlcy5qc29uKCkpXG4gICAgLm1hcChkYXRhID0+IHtcbiAgICAgIGxldCBsb2NhdGlvbkxpc3QgPSBuZXcgQXJyYXk8TG9jYXRpb24+KCk7XG4gICAgICBkYXRhLmZvckVhY2goKGxvY2F0aW9uKSA9PiB7XG4gICAgICAgIGxldCBsb2MgPSBuZXcgTG9jYXRpb24obG9jYXRpb24uZ2VvbG9jYXRpb24ubG9jYXRpb24ubGF0LGxvY2F0aW9uLmdlb2xvY2F0aW9uLmxvY2F0aW9uLmxuZyk7XG4gICAgICAgIGxvYy5hZGRyZXNzID0gbG9jYXRpb24uYWRkcmVzcztcbiAgICAgICAgbG9jLm5hbWUgPSBsb2NhdGlvbi5uYW1lO1xuICAgICAgICBsb2MuaWQgPSBsb2NhdGlvbi5pZDtcbiAgICAgICAgbG9jLm5lX2xhdCA9IGxvY2F0aW9uLmdlb2xvY2F0aW9uLmJvdW5kcy5ub3J0aGVhc3QubGF0O1xuICAgICAgICBsb2MubmVfbG5nID0gbG9jYXRpb24uZ2VvbG9jYXRpb24uYm91bmRzLm5vcnRoZWFzdC5sbmc7XG4gICAgICAgIGxvYy5zd19sYXQgPSBsb2NhdGlvbi5nZW9sb2NhdGlvbi5ib3VuZHMuc291dGh3ZXN0LmxhdDtcbiAgICAgICAgbG9jLnN3X2xuZyA9IGxvY2F0aW9uLmdlb2xvY2F0aW9uLmJvdW5kcy5zb3V0aHdlc3QubG5nO1xuICAgICAgICBsb2NhdGlvbkxpc3QucHVzaChsb2MpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gbG9jYXRpb25MaXN0O1xuICAgIH0pXG4gICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3JzKTtcbiAgfVxuXG4gIC8vIHB1YmxpYyBpc1VzZXJJbkxvY2F0aW9uKCl7XG4gIC8vICAgdmFyIGluTG9jYXRpb24gPSBuZXcgTG9jYXRpb24oMCwwKTtcbiAgLy8gICBpbkxvY2F0aW9uLmlkID0gMDtcblxuICAvLyAgIHJldHVybiB0aGlzLmdldEN1cnJlbnRMb2NhdGlvbigpXG4gIC8vICAgICAudGhlbigoY3VycmVudExvY2F0aW9uOiBMb2NhdGlvbikgPT4ge1xuICAvLyAgICAgICBpZihjdXJyZW50TG9jYXRpb24gIT0gdW5kZWZpbmVkKXtcbiAgLy8gICAgICAgICB0aGlzLmxvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlLnF1ZXJ5KFwibG9jYXRpb25zXCIpLmZvckVhY2gobG9jYXRpb24gPT57XG4gIC8vICAgICAgICAgICBpZiAoKGxvY2F0aW9uLm5lX2xhdCA+PSBjdXJyZW50TG9jYXRpb24ubGF0ICYmIGxvY2F0aW9uLm5lX2xuZyA+PSBjdXJyZW50TG9jYXRpb24ubG5nKSBcbiAgLy8gICAgICAgICAgICAgJiYgKGxvY2F0aW9uLnN3X2xhdCA8PSBjdXJyZW50TG9jYXRpb24ubGF0ICYmIGxvY2F0aW9uLnN3X2xuZyA8PSBjdXJyZW50TG9jYXRpb24ubG5nKSApe1xuICAvLyAgICAgICAgICAgICAgIGluTG9jYXRpb24gPSBsb2NhdGlvbjtcbiAgLy8gICAgICAgICAgICAgfVxuICAvLyAgICAgICAgIH0pO1xuICAvLyAgICAgICB9XG4gIC8vICAgICAgIGVsc2V7XG4gIC8vICAgICAgICAgdGhyb3cgXCJMb2NhdGlvbiBub3QgZm91bmRcIjtcbiAgLy8gICAgICAgfSBcbiAgLy8gICAgICAgcmV0dXJuIGluTG9jYXRpb247XG4gIC8vICAgICB9KTtcblxuICAvLyAgIC8vIHJldHVybiBpbkxvY2F0aW9uO1xuICAvLyB9XG5cbiAgLy8gcHVibGljIHVwZGF0ZUxvY2F0aW9uRGF0YWJhc2UoKXtcblxuICAvLyAgIC8vIERlbGV0ZSBleGlzdGluZyBkYXRhYmFzZVxuICAvLyAgIC8vIHRyeXtcbiAgLy8gICAvLyAgIHRoaXMuX2xvY2F0aW9uX2RhdGFiYXNlLmRlbGV0ZURhdGFiYXNlKCk7XG4gIC8vICAgLy8gfWNhdGNoKGUpe1xuICAvLyAgIC8vICAgdGhpcy5oYW5kbGVFcnJvcnMoZSk7XG4gIC8vICAgLy8gfSAgIFxuXG4gIC8vICAgbGV0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuICAvLyAgIGhlYWRlcnMuYXBwZW5kKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgLy8gICBoZWFkZXJzLmFwcGVuZChcIkF1dGhvcml6YXRpb25cIiwgXCJCZWFyZXIgXCIgKyBDb25maWcudG9rZW4pO1xuXG4gIC8vICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoQ29uZmlnLmFwaVVybCArIFwibG9jYXRpb25zXCIsIHtcbiAgLy8gICAgIGhlYWRlcnM6IGhlYWRlcnNcbiAgLy8gICB9KVxuICAvLyAgIC5tYXAocmVzID0+IHJlcy5qc29uKCkpXG4gIC8vICAgLm1hcChkYXRhID0+IHtcbiAgLy8gICAgIGxldCBsb2NhdGlvbkxpc3QgPSBbXTtcbiAgLy8gICAgIGNvbnNvbGUubG9nKFwiUmVzcG9uc2UgZnJvbSBBUEkgd2l0aCBsb2NhdGlvbnMuLiBcIisgZGF0YS5sZW5ndGgpO1xuICAvLyAgICAgZGF0YS5mb3JFYWNoKChsb2NhdGlvbikgPT4ge1xuICAvLyAgICAgICBsZXQgbG9jID0gbmV3IExvY2F0aW9uKGxvY2F0aW9uLmdlb2xvY2F0aW9uLmxvY2F0aW9uLmxhdCxsb2NhdGlvbi5nZW9sb2NhdGlvbi5sb2NhdGlvbi5sbmcpO1xuICAvLyAgICAgICBsb2MuYWRkcmVzcyA9IGxvY2F0aW9uLmFkZHJlc3M7XG4gIC8vICAgICAgIGxvYy5uYW1lID0gbG9jYXRpb24ubmFtZTtcbiAgLy8gICAgICAgbG9jLmlkID0gbG9jYXRpb24uaWQ7XG4gIC8vICAgICAgIGxvYy5uZV9sYXQgPSBsb2NhdGlvbi5nZW9sb2NhdGlvbi5ib3VuZHMubm9ydGhlYXN0LmxhdDtcbiAgLy8gICAgICAgbG9jLm5lX2xuZyA9IGxvY2F0aW9uLmdlb2xvY2F0aW9uLmJvdW5kcy5ub3J0aGVhc3QubG5nO1xuICAvLyAgICAgICBsb2Muc3dfbGF0ID0gbG9jYXRpb24uZ2VvbG9jYXRpb24uYm91bmRzLnNvdXRod2VzdC5sYXQ7XG4gIC8vICAgICAgIGxvYy5zd19sbmcgPSBsb2NhdGlvbi5nZW9sb2NhdGlvbi5ib3VuZHMuc291dGh3ZXN0LmxuZztcblxuICAvLyAgICAgICBsZXQgZG9jdW1lbnRfbG9jYXRpb24gPSB0aGlzLl9sb2NhdGlvbl9kYXRhYmFzZS5jcmVhdGVEb2N1bWVudChsb2MpO1xuICAvLyAgICAgICBjb25zb2xlLmxvZyhcIkxvY2F0aW9uIGNyZWF0ZWQ6IFwiK2RvY3VtZW50X2xvY2F0aW9uKTtcblxuICAgICAgICBcbiAgLy8gICAgIH0pO1xuICAvLyAgICAgY29uc29sZS5sb2coXCJMb2NhdGlvbnMgaW4gREI6IFwiK3RoaXMuX2xvY2F0aW9uX2RhdGFiYXNlKVxuXG4gIC8vICAgICByZXR1cm4gXCJTdWNjZXNzXCI7XG4gIC8vICAgfSlcbiAgLy8gICAuY2F0Y2godGhpcy5oYW5kbGVFcnJvcnMpO1xuXG4gIC8vIH1cblxuICBoYW5kbGVFcnJvcnMoZXJyb3I6IFJlc3BvbnNlLCkge1xuICAgIC8vIHZhciBlcnIgPSBuZXcgRXJyb3IoZXJyb3IpXG4gICAgY29uc29sZS5sb2coXCJFcnJvciBpbiBMb2NhdGlvbiBTZXJ2aWNlOiBcIitlcnJvcik7XG4gICAgY29uc29sZS5sb2coXCJUeXBlIG9mIGVycm9yOiBcIitlcnJvci50eXBlKTtcbiAgICAvLyByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICAgIHJldHVybiBPYnNlcnZhYmxlLnRocm93KGVycm9yKTtcbiAgICAvLyB0aHJvdyBlcnJvcjtcbiAgICAvLyByZXR1cm4gZXJyb3I7XG4gIH1cbn0iXX0=