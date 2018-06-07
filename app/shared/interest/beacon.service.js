"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Rx_1 = require("rxjs/Rx");
var config_1 = require("../config");
var beacon_1 = require("./beacon");
var appSettings = require("application-settings");
var BeaconService = (function () {
    function BeaconService(http) {
        this.http = http;
        console.log("In Beacon Service Constructor");
    }
    // this method calls the API and receives a list of all beacons
    BeaconService.prototype.getBeacons = function (type) {
        if (type === void 0) { type = 'all'; }
        var headers = new http_1.Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + config_1.Config.token);
        return this.http.get(config_1.Config.apiUrl + "beacons", {
            headers: headers
        })
            .map(function (res) { return res.json(); })
            .map(function (data) {
            var beaconList = new Array();
            data.forEach(function (beacon) {
                var beaconObj = new beacon_1.Beacon(beacon.major, beacon.minor);
                beaconObj.id = beacon.id;
                beaconObj.role = beacon.role;
                beaconObj.name = beacon.name;
                beaconObj.active = beacon.active;
                beaconObj.keywords = beacon.keywords;
                beaconObj.location_id = beacon.location_id;
                if (type == beacon.role.toString()) {
                    beaconList.push(beaconObj);
                }
                else if (type == 'all') {
                    beaconList.push(beaconObj);
                }
            });
            return beaconList;
        })
            .catch(this.handleErrors);
    };
    BeaconService.prototype.handleErrors = function (error) {
        // var err = new Error(error)
        console.log("Error in Beacon Service: " + error);
        console.log("Type of error: " + error.type);
        // return Promise.reject(error);
        return Rx_1.Observable.throw(error);
        // throw error;
        // return error;
    };
    BeaconService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http])
    ], BeaconService);
    return BeaconService;
}());
exports.BeaconService = BeaconService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVhY29uLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiZWFjb24uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUEyQztBQUMzQyxzQ0FBd0Q7QUFDeEQsOEJBQXFDO0FBRXJDLG9DQUFtQztBQUNuQyxtQ0FBa0M7QUFFbEMsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFHbEQ7SUFFRSx1QkFDVSxJQUFVO1FBQVYsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUVsQixPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUdELCtEQUErRDtJQUMvRCxrQ0FBVSxHQUFWLFVBQVcsSUFBVTtRQUFWLHFCQUFBLEVBQUEsWUFBVTtRQUNuQixJQUFJLE9BQU8sR0FBRyxJQUFJLGNBQU8sRUFBRSxDQUFDO1FBQzVCLE9BQU8sQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLGtCQUFrQixDQUFDLENBQUM7UUFDbkQsT0FBTyxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsU0FBUyxHQUFHLGVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUUxRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsZUFBTSxDQUFDLE1BQU0sR0FBRyxTQUFTLEVBQUU7WUFDOUMsT0FBTyxFQUFFLE9BQU87U0FDakIsQ0FBQzthQUNELEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBVixDQUFVLENBQUM7YUFDdEIsR0FBRyxDQUFDLFVBQUEsSUFBSTtZQUNQLElBQUksVUFBVSxHQUFHLElBQUksS0FBSyxFQUFVLENBQUM7WUFDckMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLE1BQU07Z0JBQ2xCLElBQUksU0FBUyxHQUFHLElBQUksZUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN2RCxTQUFTLENBQUMsRUFBRSxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUM7Z0JBQ3pCLFNBQVMsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDN0IsU0FBUyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUM3QixTQUFTLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQ2pDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztnQkFDckMsU0FBUyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO2dCQUUzQyxFQUFFLENBQUEsQ0FBQyxJQUFJLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBLENBQUM7b0JBQ2pDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQzdCLENBQUM7Z0JBQUEsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsQ0FBQSxDQUFDO29CQUN2QixVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUM3QixDQUFDO1lBRUgsQ0FBQyxDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsVUFBVSxDQUFDO1FBQ3BCLENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVELG9DQUFZLEdBQVosVUFBYSxLQUFlO1FBQzFCLDZCQUE2QjtRQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixHQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9DLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEdBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFDLGdDQUFnQztRQUNoQyxNQUFNLENBQUMsZUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMvQixlQUFlO1FBQ2YsZ0JBQWdCO0lBQ2xCLENBQUM7SUFsRFUsYUFBYTtRQUR6QixpQkFBVSxFQUFFO3lDQUlLLFdBQUk7T0FIVCxhQUFhLENBbUR6QjtJQUFELG9CQUFDO0NBQUEsQUFuREQsSUFtREM7QUFuRFksc0NBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IEh0dHAsIEhlYWRlcnMsIFJlc3BvbnNlIH0gZnJvbSBcIkBhbmd1bGFyL2h0dHBcIjtcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tIFwicnhqcy9SeFwiO1xuXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi4vY29uZmlnXCI7XG5pbXBvcnQgeyBCZWFjb24gfSBmcm9tIFwiLi9iZWFjb25cIjtcblxudmFyIGFwcFNldHRpbmdzID0gcmVxdWlyZShcImFwcGxpY2F0aW9uLXNldHRpbmdzXCIpO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQmVhY29uU2VydmljZSB7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBodHRwOiBIdHRwLCBcbiAgKXtcbiAgICBjb25zb2xlLmxvZyhcIkluIEJlYWNvbiBTZXJ2aWNlIENvbnN0cnVjdG9yXCIpO1xuICB9XG4gIFxuXG4gIC8vIHRoaXMgbWV0aG9kIGNhbGxzIHRoZSBBUEkgYW5kIHJlY2VpdmVzIGEgbGlzdCBvZiBhbGwgYmVhY29uc1xuICBnZXRCZWFjb25zKHR5cGU9J2FsbCcpe1xuICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcbiAgICBoZWFkZXJzLmFwcGVuZChcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgaGVhZGVycy5hcHBlbmQoXCJBdXRob3JpemF0aW9uXCIsIFwiQmVhcmVyIFwiICsgQ29uZmlnLnRva2VuKTtcblxuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KENvbmZpZy5hcGlVcmwgKyBcImJlYWNvbnNcIiwge1xuICAgICAgaGVhZGVyczogaGVhZGVyc1xuICAgIH0pXG4gICAgLm1hcChyZXMgPT4gcmVzLmpzb24oKSlcbiAgICAubWFwKGRhdGEgPT4ge1xuICAgICAgbGV0IGJlYWNvbkxpc3QgPSBuZXcgQXJyYXk8QmVhY29uPigpO1xuICAgICAgZGF0YS5mb3JFYWNoKChiZWFjb24pID0+IHtcbiAgICAgICAgbGV0IGJlYWNvbk9iaiA9IG5ldyBCZWFjb24oYmVhY29uLm1ham9yLCBiZWFjb24ubWlub3IpO1xuICAgICAgICBiZWFjb25PYmouaWQgPSBiZWFjb24uaWQ7XG4gICAgICAgIGJlYWNvbk9iai5yb2xlID0gYmVhY29uLnJvbGU7XG4gICAgICAgIGJlYWNvbk9iai5uYW1lID0gYmVhY29uLm5hbWU7XG4gICAgICAgIGJlYWNvbk9iai5hY3RpdmUgPSBiZWFjb24uYWN0aXZlO1xuICAgICAgICBiZWFjb25PYmoua2V5d29yZHMgPSBiZWFjb24ua2V5d29yZHM7XG4gICAgICAgIGJlYWNvbk9iai5sb2NhdGlvbl9pZCA9IGJlYWNvbi5sb2NhdGlvbl9pZDtcbiAgICAgICAgXG4gICAgICAgIGlmKHR5cGUgPT0gYmVhY29uLnJvbGUudG9TdHJpbmcoKSl7XG4gICAgICAgICAgYmVhY29uTGlzdC5wdXNoKGJlYWNvbk9iaik7XG4gICAgICAgIH1lbHNlIGlmICh0eXBlID09ICdhbGwnKXtcbiAgICAgICAgICBiZWFjb25MaXN0LnB1c2goYmVhY29uT2JqKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGJlYWNvbkxpc3Q7XG4gICAgfSlcbiAgICAuY2F0Y2godGhpcy5oYW5kbGVFcnJvcnMpO1xuICB9XG5cbiAgaGFuZGxlRXJyb3JzKGVycm9yOiBSZXNwb25zZSwpIHtcbiAgICAvLyB2YXIgZXJyID0gbmV3IEVycm9yKGVycm9yKVxuICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgaW4gQmVhY29uIFNlcnZpY2U6IFwiK2Vycm9yKTtcbiAgICBjb25zb2xlLmxvZyhcIlR5cGUgb2YgZXJyb3I6IFwiK2Vycm9yLnR5cGUpO1xuICAgIC8vIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgcmV0dXJuIE9ic2VydmFibGUudGhyb3coZXJyb3IpO1xuICAgIC8vIHRocm93IGVycm9yO1xuICAgIC8vIHJldHVybiBlcnJvcjtcbiAgfVxufSJdfQ==