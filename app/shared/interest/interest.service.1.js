"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Rx_1 = require("rxjs/Rx");
var config_1 = require("../config");
var interest_1 = require("./interest");
var appSettings = require("application-settings");
var InterestService = /** @class */ (function () {
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
    InterestService.prototype.createInterst = function (interest) {
        var headers = new http_1.Headers();
        headers.append("Content-Type", "application/json");
        // console.log("url: "+Config.apiUrl + "auth/register");
        // console.log("JSON: "+ JSON.stringify({
        //     username: user.username,
        //     password: user.password,
        //     email: user.username,
        //     name: user.username,
        //     role: "Customer"
        //   }));
        return this.http.post(config_1.Config.apiUrl + "interests", JSON.stringify({
            customer_id: interest.customer_id,
            beacon: interest.beacon,
            start: interest.start,
            end: interest.end,
            creating: interest.creating,
            active: interest.active,
            keywords: interest.keywords
        }), { headers: headers })
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJlc3Quc2VydmljZS4xLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZXJlc3Quc2VydmljZS4xLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTJDO0FBQzNDLHNDQUF3RDtBQUN4RCw4QkFBcUM7QUFFckMsb0NBQW1DO0FBQ25DLHVDQUFzQztBQUV0QyxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUdsRDtJQUVFLHlCQUNVLElBQVU7UUFBVixTQUFJLEdBQUosSUFBSSxDQUFNO1FBRWxCLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUNBQWlDLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBR0QsaUVBQWlFO0lBQ2pFLHNDQUFZLEdBQVosVUFBYSxJQUFVO1FBQVYscUJBQUEsRUFBQSxZQUFVO1FBQ3JCLElBQUksT0FBTyxHQUFHLElBQUksY0FBTyxFQUFFLENBQUM7UUFDNUIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUNuRCxPQUFPLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxTQUFTLEdBQUcsZUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTFELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxlQUFNLENBQUMsTUFBTSxHQUFHLFdBQVcsRUFBRTtZQUNoRCxPQUFPLEVBQUUsT0FBTztTQUNqQixDQUFDO2FBQ0QsR0FBRyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFWLENBQVUsQ0FBQzthQUN0QixHQUFHLENBQUMsVUFBQSxJQUFJO1lBQ1AsSUFBSSxZQUFZLEdBQUcsSUFBSSxLQUFLLEVBQVksQ0FBQztZQUN6QyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsUUFBUTtnQkFDcEIsSUFBSSxXQUFXLEdBQUcsSUFBSSxtQkFBUSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDcEcsV0FBVyxDQUFDLEVBQUUsR0FBRyxRQUFRLENBQUMsRUFBRSxDQUFDO2dCQUM3QixXQUFXLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7Z0JBQ3JDLFdBQVcsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQztnQkFDekMsV0FBVyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDO2dCQUV6QyxZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBRWpDLENBQUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLFlBQVksQ0FBQztRQUN0QixDQUFDLENBQUM7YUFDRCxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCx1Q0FBYSxHQUFiLFVBQWMsUUFBa0I7UUFDOUIsSUFBSSxPQUFPLEdBQUcsSUFBSSxjQUFPLEVBQUUsQ0FBQztRQUM1QixPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBRW5ELHdEQUF3RDtRQUN4RCx5Q0FBeUM7UUFDekMsK0JBQStCO1FBQy9CLCtCQUErQjtRQUMvQiw0QkFBNEI7UUFDNUIsMkJBQTJCO1FBQzNCLHVCQUF1QjtRQUN2QixTQUFTO1FBRVQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUNuQixlQUFNLENBQUMsTUFBTSxHQUFHLFdBQVcsRUFDM0IsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUNiLFdBQVcsRUFBRSxRQUFRLENBQUMsV0FBVztZQUNqQyxNQUFNLEVBQUUsUUFBUSxDQUFDLE1BQU07WUFDdkIsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLO1lBQ3JCLEdBQUcsRUFBRSxRQUFRLENBQUMsR0FBRztZQUNqQixRQUFRLEVBQUUsUUFBUSxDQUFDLFFBQVE7WUFDM0IsTUFBTSxFQUFFLFFBQVEsQ0FBQyxNQUFNO1lBQ3ZCLFFBQVEsRUFBRSxRQUFRLENBQUMsUUFBUTtTQUM1QixDQUFDLEVBQ0YsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQ3JCO2FBQ0EsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsc0NBQVksR0FBWixVQUFhLEtBQWU7UUFDMUIsNkJBQTZCO1FBQzdCLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEdBQUMsS0FBSyxDQUFDLENBQUM7UUFDakQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsR0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUMsZ0NBQWdDO1FBQ2hDLE1BQU0sQ0FBQyxlQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9CLGVBQWU7UUFDZixnQkFBZ0I7SUFDbEIsQ0FBQztJQXpFVSxlQUFlO1FBRDNCLGlCQUFVLEVBQUU7eUNBSUssV0FBSTtPQUhULGVBQWUsQ0EwRTNCO0lBQUQsc0JBQUM7Q0FBQSxBQTFFRCxJQTBFQztBQTFFWSwwQ0FBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgSHR0cCwgSGVhZGVycywgUmVzcG9uc2UgfSBmcm9tIFwiQGFuZ3VsYXIvaHR0cFwiO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gXCJyeGpzL1J4XCI7XG5cbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuLi9jb25maWdcIjtcbmltcG9ydCB7IEludGVyZXN0IH0gZnJvbSBcIi4vaW50ZXJlc3RcIjtcblxudmFyIGFwcFNldHRpbmdzID0gcmVxdWlyZShcImFwcGxpY2F0aW9uLXNldHRpbmdzXCIpO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSW50ZXJlc3RTZXJ2aWNlIHtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGh0dHA6IEh0dHAsIFxuICApe1xuICAgIGNvbnNvbGUubG9nKFwiSW4gSW50ZXJlc3QgU2VydmljZSBDb25zdHJ1Y3RvclwiKTtcbiAgfVxuICBcblxuICAvLyB0aGlzIG1ldGhvZCBjYWxscyB0aGUgQVBJIGFuZCByZWNlaXZlcyBhIGxpc3Qgb2YgYWxsIGludGVyZXN0c1xuICBnZXRJbnRlcmVzdHModHlwZT0nYWxsJyl7XG4gICAgbGV0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuICAgIGhlYWRlcnMuYXBwZW5kKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICBoZWFkZXJzLmFwcGVuZChcIkF1dGhvcml6YXRpb25cIiwgXCJCZWFyZXIgXCIgKyBDb25maWcudG9rZW4pO1xuXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoQ29uZmlnLmFwaVVybCArIFwiaW50ZXJlc3RzXCIsIHtcbiAgICAgIGhlYWRlcnM6IGhlYWRlcnNcbiAgICB9KVxuICAgIC5tYXAocmVzID0+IHJlcy5qc29uKCkpXG4gICAgLm1hcChkYXRhID0+IHtcbiAgICAgIGxldCBpbnRlcmVzdExpc3QgPSBuZXcgQXJyYXk8SW50ZXJlc3Q+KCk7XG4gICAgICBkYXRhLmZvckVhY2goKGludGVyZXN0KSA9PiB7XG4gICAgICAgIGxldCBpbnRlcmVzdE9iaiA9IG5ldyBJbnRlcmVzdChpbnRlcmVzdC5jdXN0b21lcl9pZCwgaW50ZXJlc3QuYmVhY29uLCBpbnRlcmVzdC5zdGFydCwgaW50ZXJlc3QuZW5kKTtcbiAgICAgICAgaW50ZXJlc3RPYmouaWQgPSBpbnRlcmVzdC5pZDtcbiAgICAgICAgaW50ZXJlc3RPYmouYWN0aXZlID0gaW50ZXJlc3QuYWN0aXZlO1xuICAgICAgICBpbnRlcmVzdE9iai5rZXl3b3JkcyA9IGludGVyZXN0LmtleXdvcmRzO1xuICAgICAgICBpbnRlcmVzdE9iai5jcmVhdGluZyA9IGludGVyZXN0LmNyZWF0aW5nO1xuICAgICAgICBcbiAgICAgICAgaW50ZXJlc3RMaXN0LnB1c2goaW50ZXJlc3RPYmopO1xuICAgICAgICBcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGludGVyZXN0TGlzdDtcbiAgICB9KVxuICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9ycyk7XG4gIH1cblxuICBjcmVhdGVJbnRlcnN0KGludGVyZXN0OiBJbnRlcmVzdCl7XG4gICAgbGV0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuICAgIGhlYWRlcnMuYXBwZW5kKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcblxuICAgIC8vIGNvbnNvbGUubG9nKFwidXJsOiBcIitDb25maWcuYXBpVXJsICsgXCJhdXRoL3JlZ2lzdGVyXCIpO1xuICAgIC8vIGNvbnNvbGUubG9nKFwiSlNPTjogXCIrIEpTT04uc3RyaW5naWZ5KHtcbiAgICAvLyAgICAgdXNlcm5hbWU6IHVzZXIudXNlcm5hbWUsXG4gICAgLy8gICAgIHBhc3N3b3JkOiB1c2VyLnBhc3N3b3JkLFxuICAgIC8vICAgICBlbWFpbDogdXNlci51c2VybmFtZSxcbiAgICAvLyAgICAgbmFtZTogdXNlci51c2VybmFtZSxcbiAgICAvLyAgICAgcm9sZTogXCJDdXN0b21lclwiXG4gICAgLy8gICB9KSk7XG5cbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QoXG4gICAgICBDb25maWcuYXBpVXJsICsgXCJpbnRlcmVzdHNcIixcbiAgICAgIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgY3VzdG9tZXJfaWQ6IGludGVyZXN0LmN1c3RvbWVyX2lkLFxuICAgICAgICBiZWFjb246IGludGVyZXN0LmJlYWNvbixcbiAgICAgICAgc3RhcnQ6IGludGVyZXN0LnN0YXJ0LFxuICAgICAgICBlbmQ6IGludGVyZXN0LmVuZCxcbiAgICAgICAgY3JlYXRpbmc6IGludGVyZXN0LmNyZWF0aW5nLFxuICAgICAgICBhY3RpdmU6IGludGVyZXN0LmFjdGl2ZSxcbiAgICAgICAga2V5d29yZHM6IGludGVyZXN0LmtleXdvcmRzXG4gICAgICB9KSxcbiAgICAgIHsgaGVhZGVyczogaGVhZGVycyB9XG4gICAgKVxuICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9ycyk7XG4gIH1cblxuICBoYW5kbGVFcnJvcnMoZXJyb3I6IFJlc3BvbnNlLCkge1xuICAgIC8vIHZhciBlcnIgPSBuZXcgRXJyb3IoZXJyb3IpXG4gICAgY29uc29sZS5sb2coXCJFcnJvciBpbiBJbnRlcmVzdCBTZXJ2aWNlOiBcIitlcnJvcik7XG4gICAgY29uc29sZS5sb2coXCJUeXBlIG9mIGVycm9yOiBcIitlcnJvci50eXBlKTtcbiAgICAvLyByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICAgIHJldHVybiBPYnNlcnZhYmxlLnRocm93KGVycm9yKTtcbiAgICAvLyB0aHJvdyBlcnJvcjtcbiAgICAvLyByZXR1cm4gZXJyb3I7XG4gIH1cbn0iXX0=