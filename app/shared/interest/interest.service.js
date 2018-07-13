"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Rx_1 = require("rxjs/Rx");
var config_1 = require("../config");
var interest_1 = require("./interest");
var appSettings = require("application-settings");
var InterestService = (function () {
    function InterestService(http) {
        this.http = http;
        console.log("In Interest Service Constructor");
    }
    // this method calls the API and receives a list of all interests
    InterestService.prototype.getInterests = function (type) {
        if (type === void 0) { type = 'all'; }
        var headers = new http_1.Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + config_1.Config.token);
        return this.http.get(config_1.Config.apiUrl + "interests", {
            headers: headers
        })
            .map(function (res) { return res.json(); })
            .map(function (data) {
            var interestList = new Array();
            data.forEach(function (interest) {
                var interestObj = new interest_1.Interest(interest.customer_id, interest.beacon, interest.start, interest.end);
                interestObj.id = interest.id;
                interestObj.active = interest.active;
                interestObj.keywords = interest.keywords;
                interestObj.creating = interest.creating;
                interestList.push(interestObj);
            });
            return interestList;
        })
            .catch(this.handleErrors);
    };
    InterestService.prototype.dateFormatter = function (date) {
        return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    };
    InterestService.prototype.createInterest = function (interest) {
        var headers = new http_1.Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + config_1.Config.token);
        console.log("creating interest: " + typeof interest);
        console.log("creating interest for beacon: " + interest.beacon);
        console.log("creating interest for beacon []: " + interest[2]);
        console.log("formatted end: " + this.dateFormatter(new Date(interest.end)));
        var data = {
            customer_id: interest.customer_id,
            beacon: interest.beacon,
            start: this.dateFormatter(new Date(interest.start)),
            end: this.dateFormatter(new Date(interest.end)),
            creating: interest.creating,
            active: interest.active,
            keywords: interest.keywords
        };
        return this.http.post(config_1.Config.apiUrl + "interests", JSON.stringify(data), { headers: headers })
            .catch(this.handleErrors);
    };
    InterestService.prototype.handleErrors = function (error) {
        // var err = new Error(error)
        console.log("Error in Interest Service: " + error);
        console.log("Type of error: " + error.type);
        // return Promise.reject(error);
        return Rx_1.Observable.throw(error);
        // throw error;
        // return error;
    };
    InterestService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http])
    ], InterestService);
    return InterestService;
}());
exports.InterestService = InterestService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJlc3Quc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVyZXN0LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkM7QUFDM0Msc0NBQXdEO0FBQ3hELDhCQUFxQztBQUVyQyxvQ0FBbUM7QUFDbkMsdUNBQXNDO0FBRXRDLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBR2xEO0lBRUUseUJBQ1UsSUFBVTtRQUFWLFNBQUksR0FBSixJQUFJLENBQU07UUFFbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFHRCxpRUFBaUU7SUFDakUsc0NBQVksR0FBWixVQUFhLElBQVU7UUFBVixxQkFBQSxFQUFBLFlBQVU7UUFDckIsSUFBSSxPQUFPLEdBQUcsSUFBSSxjQUFPLEVBQUUsQ0FBQztRQUM1QixPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQ25ELE9BQU8sQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLFNBQVMsR0FBRyxlQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFMUQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGVBQU0sQ0FBQyxNQUFNLEdBQUcsV0FBVyxFQUFFO1lBQ2hELE9BQU8sRUFBRSxPQUFPO1NBQ2pCLENBQUM7YUFDRCxHQUFHLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQVYsQ0FBVSxDQUFDO2FBQ3RCLEdBQUcsQ0FBQyxVQUFBLElBQUk7WUFDUCxJQUFJLFlBQVksR0FBRyxJQUFJLEtBQUssRUFBWSxDQUFDO1lBQ3pDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxRQUFRO2dCQUNwQixJQUFJLFdBQVcsR0FBRyxJQUFJLG1CQUFRLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxRQUFRLENB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LEdBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFDLGdDQUFnQztRQUNoQyxNQUFNLENBQUMsZUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMvQixlQUFlO1FBQ2YsZ0JBQWdCO0lBQ2xCLENBQUM7SUE3RVUsZUFBZTtRQUQzQixpQkFBVSxFQUFFO3lDQUlLLFdBQUk7T0FIVCxlQUFlLENBOEUzQjtJQUFELHNCQUFDO0NBQUEsQUE5RUQsSUE4RUM7QUE5RVksMENBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IEh0dHAsIEhlYWRlcnMsIFJlc3BvbnNlIH0gZnJvbSBcIkBhbmd1bGFyL2h0dHBcIjtcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tIFwicnhqcy9SeFwiO1xuXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi4vY29uZmlnXCI7XG5pbXBvcnQgeyBJbnRlcmVzdCB9IGZyb20gXCIuL2ludGVyZXN0XCI7XG5cbnZhciBhcHBTZXR0aW5ncyA9IHJlcXVpcmUoXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiKTtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEludGVyZXN0U2VydmljZSB7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBodHRwOiBIdHRwLCBcbiAgKXtcbiAgICBjb25zb2xlLmxvZyhcIkluIEludGVyZXN0IFNlcnZpY2UgQ29uc3RydWN0b3JcIik7XG4gIH1cbiAgXG5cbiAgLy8gdGhpcyBtZXRob2QgY2FsbHMgdGhlIEFQSSBhbmQgcmVjZWl2ZXMgYSBsaXN0IG9mIGFsbCBpbnRlcmVzdHNcbiAgZ2V0SW50ZXJlc3RzKHR5cGU9J2FsbCcpe1xuICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcbiAgICBoZWFkZXJzLmFwcGVuZChcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgaGVhZGVycy5hcHBlbmQoXCJBdXRob3JpemF0aW9uXCIsIFwiQmVhcmVyIFwiICsgQ29uZmlnLnRva2VuKTtcblxuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KENvbmZpZy5hcGlVcmwgKyBcImludGVyZXN0c1wiLCB7XG4gICAgICBoZWFkZXJzOiBoZWFkZXJzXG4gICAgfSlcbiAgICAubWFwKHJlcyA9PiByZXMuanNvbigpKVxuICAgIC5tYXAoZGF0YSA9PiB7XG4gICAgICBsZXQgaW50ZXJlc3RMaXN0ID0gbmV3IEFycmF5PEludGVyZXN0PigpO1xuICAgICAgZGF0YS5mb3JFYWNoKChpbnRlcmVzdCkgPT4ge1xuICAgICAgICBsZXQgaW50ZXJlc3RPYmogPSBuZXcgSW50ZXJlc3QoaW50ZXJlc3QuY3VzdG9tZXJfaWQsIGludGVyZXN0LmJlYWNvbiwgaW50ZXJlc3Quc3RhcnQsIGludGVyZXN0LmVuZCk7XG4gICAgICAgIGludGVyZXN0T2JqLmlkID0gaW50ZXJlc3QuaWQ7XG4gICAgICAgIGludGVyZXN0T2JqLmFjdGl2ZSA9IGludGVyZXN0LmFjdGl2ZTtcbiAgICAgICAgaW50ZXJlc3RPYmoua2V5d29yZHMgPSBpbnRlcmVzdC5rZXl3b3JkcztcbiAgICAgICAgaW50ZXJlc3RPYmouY3JlYXRpbmcgPSBpbnRlcmVzdC5jcmVhdGluZztcbiAgICAgICAgXG4gICAgICAgIGludGVyZXN0TGlzdC5wdXNoKGludGVyZXN0T2JqKTtcbiAgICAgICAgXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBpbnRlcmVzdExpc3Q7XG4gICAgfSlcbiAgICAuY2F0Y2godGhpcy5oYW5kbGVFcnJvcnMpO1xuICB9XG5cbiAgZGF0ZUZvcm1hdHRlcihkYXRlOiBEYXRlKXtcbiAgICByZXR1cm4gZGF0ZS5nZXRGdWxsWWVhcigpK1wiLVwiK2RhdGUuZ2V0TW9udGgoKStcIi1cIitkYXRlLmdldERhdGUoKStcIiBcIitkYXRlLmdldEhvdXJzKCkrXCI6XCIrZGF0ZS5nZXRNaW51dGVzKCkrXCI6XCIrZGF0ZS5nZXRTZWNvbmRzKClcbiAgfVxuXG4gIGNyZWF0ZUludGVyZXN0KGludGVyZXN0OiBJbnRlcmVzdCl7XG4gICAgbGV0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuICAgIGhlYWRlcnMuYXBwZW5kKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICBoZWFkZXJzLmFwcGVuZChcIkF1dGhvcml6YXRpb25cIiwgXCJCZWFyZXIgXCIgKyBDb25maWcudG9rZW4pO1xuICAgIFxuICAgIGNvbnNvbGUubG9nKFwiY3JlYXRpbmcgaW50ZXJlc3Q6IFwiK3R5cGVvZiBpbnRlcmVzdCk7XG4gICAgY29uc29sZS5sb2coXCJjcmVhdGluZyBpbnRlcmVzdCBmb3IgYmVhY29uOiBcIitpbnRlcmVzdC5iZWFjb24pO1xuICAgIGNvbnNvbGUubG9nKFwiY3JlYXRpbmcgaW50ZXJlc3QgZm9yIGJlYWNvbiBbXTogXCIraW50ZXJlc3RbMl0pO1xuICAgIGNvbnNvbGUubG9nKFwiZm9ybWF0dGVkIGVuZDogXCIrdGhpcy5kYXRlRm9ybWF0dGVyKG5ldyBEYXRlKGludGVyZXN0LmVuZCkpKTtcblxuICAgIGxldCBkYXRhID0ge1xuICAgICAgY3VzdG9tZXJfaWQ6IGludGVyZXN0LmN1c3RvbWVyX2lkLFxuICAgICAgYmVhY29uOiBpbnRlcmVzdC5iZWFjb24sXG4gICAgICBzdGFydDogdGhpcy5kYXRlRm9ybWF0dGVyKG5ldyBEYXRlKGludGVyZXN0LnN0YXJ0KSksXG4gICAgICBlbmQ6IHRoaXMuZGF0ZUZvcm1hdHRlcihuZXcgRGF0ZShpbnRlcmVzdC5lbmQpKSxcbiAgICAgIGNyZWF0aW5nOiBpbnRlcmVzdC5jcmVhdGluZyxcbiAgICAgIGFjdGl2ZTogaW50ZXJlc3QuYWN0aXZlLFxuICAgICAga2V5d29yZHM6IGludGVyZXN0LmtleXdvcmRzXG4gICAgfTtcblxuXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KFxuICAgICAgQ29uZmlnLmFwaVVybCArIFwiaW50ZXJlc3RzXCIsXG4gICAgICBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgIHsgaGVhZGVyczogaGVhZGVycyB9XG4gICAgKVxuICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9ycyk7XG4gIH1cblxuICBoYW5kbGVFcnJvcnMoZXJyb3I6IFJlc3BvbnNlLCkge1xuICAgIC8vIHZhciBlcnIgPSBuZXcgRXJyb3IoZXJyb3IpXG4gICAgY29uc29sZS5sb2coXCJFcnJvciBpbiBJbnRlcmVzdCBTZXJ2aWNlOiBcIitlcnJvcik7XG4gICAgY29uc29sZS5sb2coXCJUeXBlIG9mIGVycm9yOiBcIitlcnJvci50eXBlKTtcbiAgICAvLyByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICAgIHJldHVybiBPYnNlcnZhYmxlLnRocm93KGVycm9yKTtcbiAgICAvLyB0aHJvdyBlcnJvcjtcbiAgICAvLyByZXR1cm4gZXJyb3I7XG4gIH1cbn0iXX0=