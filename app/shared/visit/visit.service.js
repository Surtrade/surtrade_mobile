"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Rx_1 = require("rxjs/Rx");
var config_1 = require("../config");
var visit_1 = require("./visit");
var appSettings = require("application-settings");
var VisitService = (function () {
    function VisitService(http) {
        this.http = http;
        console.log("In Visit Service Constructor");
    }
    // this method calls the API and receives a list of all visits
    VisitService.prototype.getVisits = function (type) {
        if (type === void 0) { type = 'all'; }
        var headers = new http_1.Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + config_1.Config.token);
        return this.http.get(config_1.Config.apiUrl + "visits", {
            headers: headers
        })
            .map(function (res) { return res.json(); })
            .map(function (data) {
            var visitList = new Array();
            data.forEach(function (visit) {
                var visitObj = new visit_1.Visit(visit.customer_id, visit.beacon, visit.start, visit.end);
                visitObj.id = visit.id;
                visitObj.active = visit.active;
                visitObj.keywords = visit.keywords;
                visitObj.creating = visit.creating;
                visitList.push(visitObj);
            });
            return visitList;
        })
            .catch(this.handleErrors);
    };
    VisitService.prototype.dateFormatter = function (date) {
        return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    };
    VisitService.prototype.createVisit = function (visit) {
        var headers = new http_1.Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + config_1.Config.token);
        // console.log("url: "+Config.apiUrl + "auth/register");
        // console.log("JSON: "+ JSON.stringify({
        //     username: user.username,
        //     password: user.password,
        //     email: user.username,
        //     name: user.username,
        //     role: "Customer"
        //   }));
        console.log("creating visit for beacon: " + visit.beacon);
        console.log("formatted end: " + this.dateFormatter(new Date(visit.end)));
        var data = {
            customer_id: visit.customer_id,
            beacon: visit.beacon,
            start: this.dateFormatter(new Date(visit.start)),
            end: this.dateFormatter(new Date(visit.end)),
            creating: visit.creating,
            active: visit.active,
            keywords: visit.keywords
        };
        return this.http.post(config_1.Config.apiUrl + "visits", JSON.stringify(data), { headers: headers })
            .catch(this.handleErrors);
    };
    VisitService.prototype.handleErrors = function (error) {
        // var err = new Error(error)
        console.log("Error in Visit Service: " + error);
        console.log("Type of error: " + error.type);
        // return Promise.reject(error);
        return Rx_1.Observable.throw(error);
        // throw error;
        // return error;
    };
    VisitService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http])
    ], VisitService);
    return VisitService;
}());
exports.VisitService = VisitService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlzaXQuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInZpc2l0LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkM7QUFDM0Msc0NBQXdEO0FBQ3hELDhCQUFxQztBQUVyQyxvQ0FBbUM7QUFDbkMsaUNBQWdDO0FBRWhDLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBR2xEO0lBRUUsc0JBQ1UsSUFBVTtRQUFWLFNBQUksR0FBSixJQUFJLENBQU07UUFFbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFHRCw4REFBOEQ7SUFDOUQsZ0NBQVMsR0FBVCxVQUFVLElBQVU7UUFBVixxQkFBQSxFQUFBLFlBQVU7UUFDbEIsSUFBSSxPQUFPLEdBQUcsSUFBSSxjQUFPLEVBQUUsQ0FBQztRQUM1QixPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQ25ELE9BQU8sQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLFNBQVMsR0FBRyxlQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFMUQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGVBQU0sQ0FBQyxNQUFNLEdBQUcsUUFBUSxFQUFFO1lBQzdDLE9BQU8sRUFBRSxPQUFPO1NBQ2pCLENBQUM7YUFDRCxHQUFHLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQVYsQ0FBVSxDQUFDO2FBQ3RCLEdBQUcsQ0FBQyxVQUFBLElBQUk7WUFDUCxJQUFJLFNBQVMsR0FBRyxJQUFJLEtBQUssRUFBUyxDQUFDO1lBQ25DLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLO2dCQUNqQixJQUFJLFFBQVEsR0FBRyxJQUFJLGFBQUssQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxNQUFN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QzFDLGdDQUFnQztRQUNoQyxNQUFNLENBQUMsZUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMvQixlQUFlO1FBQ2YsZ0JBQWdCO0lBQ2xCLENBQUM7SUFwRlUsWUFBWTtRQUR4QixpQkFBVSxFQUFFO3lDQUlLLFdBQUk7T0FIVCxZQUFZLENBcUZ4QjtJQUFELG1CQUFDO0NBQUEsQUFyRkQsSUFxRkM7QUFyRlksb0NBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IEh0dHAsIEhlYWRlcnMsIFJlc3BvbnNlIH0gZnJvbSBcIkBhbmd1bGFyL2h0dHBcIjtcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tIFwicnhqcy9SeFwiO1xuXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi4vY29uZmlnXCI7XG5pbXBvcnQgeyBWaXNpdCB9IGZyb20gXCIuL3Zpc2l0XCI7XG5cbnZhciBhcHBTZXR0aW5ncyA9IHJlcXVpcmUoXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiKTtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFZpc2l0U2VydmljZSB7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBodHRwOiBIdHRwLCBcbiAgKXtcbiAgICBjb25zb2xlLmxvZyhcIkluIFZpc2l0IFNlcnZpY2UgQ29uc3RydWN0b3JcIik7XG4gIH1cbiAgXG5cbiAgLy8gdGhpcyBtZXRob2QgY2FsbHMgdGhlIEFQSSBhbmQgcmVjZWl2ZXMgYSBsaXN0IG9mIGFsbCB2aXNpdHNcbiAgZ2V0VmlzaXRzKHR5cGU9J2FsbCcpe1xuICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcbiAgICBoZWFkZXJzLmFwcGVuZChcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgaGVhZGVycy5hcHBlbmQoXCJBdXRob3JpemF0aW9uXCIsIFwiQmVhcmVyIFwiICsgQ29uZmlnLnRva2VuKTtcblxuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KENvbmZpZy5hcGlVcmwgKyBcInZpc2l0c1wiLCB7XG4gICAgICBoZWFkZXJzOiBoZWFkZXJzXG4gICAgfSlcbiAgICAubWFwKHJlcyA9PiByZXMuanNvbigpKVxuICAgIC5tYXAoZGF0YSA9PiB7XG4gICAgICBsZXQgdmlzaXRMaXN0ID0gbmV3IEFycmF5PFZpc2l0PigpO1xuICAgICAgZGF0YS5mb3JFYWNoKCh2aXNpdCkgPT4ge1xuICAgICAgICBsZXQgdmlzaXRPYmogPSBuZXcgVmlzaXQodmlzaXQuY3VzdG9tZXJfaWQsIHZpc2l0LmJlYWNvbiwgdmlzaXQuc3RhcnQsIHZpc2l0LmVuZCk7XG4gICAgICAgIHZpc2l0T2JqLmlkID0gdmlzaXQuaWQ7XG4gICAgICAgIHZpc2l0T2JqLmFjdGl2ZSA9IHZpc2l0LmFjdGl2ZTtcbiAgICAgICAgdmlzaXRPYmoua2V5d29yZHMgPSB2aXNpdC5rZXl3b3JkcztcbiAgICAgICAgdmlzaXRPYmouY3JlYXRpbmcgPSB2aXNpdC5jcmVhdGluZztcbiAgICAgICAgXG4gICAgICAgIHZpc2l0TGlzdC5wdXNoKHZpc2l0T2JqKTtcbiAgICAgICAgXG4gICAgICB9KTtcbiAgICAgIHJldHVybiB2aXNpdExpc3Q7XG4gICAgfSlcbiAgICAuY2F0Y2godGhpcy5oYW5kbGVFcnJvcnMpO1xuICB9XG5cbiAgZGF0ZUZvcm1hdHRlcihkYXRlOiBEYXRlKXtcbiAgICByZXR1cm4gZGF0ZS5nZXRGdWxsWWVhcigpK1wiLVwiK2RhdGUuZ2V0TW9udGgoKStcIi1cIitkYXRlLmdldERhdGUoKStcIiBcIitkYXRlLmdldEhvdXJzKCkrXCI6XCIrZGF0ZS5nZXRNaW51dGVzKCkrXCI6XCIrZGF0ZS5nZXRTZWNvbmRzKClcbiAgfVxuXG4gIGNyZWF0ZVZpc2l0KHZpc2l0OiBWaXNpdCl7XG4gICAgbGV0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuICAgIGhlYWRlcnMuYXBwZW5kKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICBoZWFkZXJzLmFwcGVuZChcIkF1dGhvcml6YXRpb25cIiwgXCJCZWFyZXIgXCIgKyBDb25maWcudG9rZW4pO1xuICAgIFxuICAgIC8vIGNvbnNvbGUubG9nKFwidXJsOiBcIitDb25maWcuYXBpVXJsICsgXCJhdXRoL3JlZ2lzdGVyXCIpO1xuICAgIC8vIGNvbnNvbGUubG9nKFwiSlNPTjogXCIrIEpTT04uc3RyaW5naWZ5KHtcbiAgICAvLyAgICAgdXNlcm5hbWU6IHVzZXIudXNlcm5hbWUsXG4gICAgLy8gICAgIHBhc3N3b3JkOiB1c2VyLnBhc3N3b3JkLFxuICAgIC8vICAgICBlbWFpbDogdXNlci51c2VybmFtZSxcbiAgICAvLyAgICAgbmFtZTogdXNlci51c2VybmFtZSxcbiAgICAvLyAgICAgcm9sZTogXCJDdXN0b21lclwiXG4gICAgLy8gICB9KSk7XG5cbiAgICBjb25zb2xlLmxvZyhcImNyZWF0aW5nIHZpc2l0IGZvciBiZWFjb246IFwiK3Zpc2l0LmJlYWNvbik7XG4gICAgY29uc29sZS5sb2coXCJmb3JtYXR0ZWQgZW5kOiBcIit0aGlzLmRhdGVGb3JtYXR0ZXIobmV3IERhdGUodmlzaXQuZW5kKSkpO1xuXG4gICAgbGV0IGRhdGEgPSB7XG4gICAgICBjdXN0b21lcl9pZDogdmlzaXQuY3VzdG9tZXJfaWQsXG4gICAgICBiZWFjb246IHZpc2l0LmJlYWNvbixcbiAgICAgIHN0YXJ0OiB0aGlzLmRhdGVGb3JtYXR0ZXIobmV3IERhdGUodmlzaXQuc3RhcnQpKSxcbiAgICAgIGVuZDogdGhpcy5kYXRlRm9ybWF0dGVyKG5ldyBEYXRlKHZpc2l0LmVuZCkpLFxuICAgICAgY3JlYXRpbmc6IHZpc2l0LmNyZWF0aW5nLFxuICAgICAgYWN0aXZlOiB2aXNpdC5hY3RpdmUsXG4gICAgICBrZXl3b3JkczogdmlzaXQua2V5d29yZHNcbiAgICB9O1xuXG5cbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QoXG4gICAgICBDb25maWcuYXBpVXJsICsgXCJ2aXNpdHNcIixcbiAgICAgIEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgeyBoZWFkZXJzOiBoZWFkZXJzIH1cbiAgICApXG4gICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3JzKTtcbiAgfVxuXG4gIGhhbmRsZUVycm9ycyhlcnJvcjogUmVzcG9uc2UsKSB7XG4gICAgLy8gdmFyIGVyciA9IG5ldyBFcnJvcihlcnJvcilcbiAgICBjb25zb2xlLmxvZyhcIkVycm9yIGluIFZpc2l0IFNlcnZpY2U6IFwiK2Vycm9yKTtcbiAgICBjb25zb2xlLmxvZyhcIlR5cGUgb2YgZXJyb3I6IFwiK2Vycm9yLnR5cGUpO1xuICAgIC8vIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgcmV0dXJuIE9ic2VydmFibGUudGhyb3coZXJyb3IpO1xuICAgIC8vIHRocm93IGVycm9yO1xuICAgIC8vIHJldHVybiBlcnJvcjtcbiAgfVxufSJdfQ==