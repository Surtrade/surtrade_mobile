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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJlc3Quc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVyZXN0LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkM7QUFDM0Msc0NBQXdEO0FBQ3hELDhCQUFxQztBQUVyQyxvQ0FBbUM7QUFDbkMsdUNBQXNDO0FBRXRDLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBR2xEO0lBRUUseUJBQ1UsSUFBVTtRQUFWLFNBQUksR0FBSixJQUFJLENBQU07UUFFbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFHRCxpRUFBaUU7SUFDakUsc0NBQVksR0FBWixVQUFhLElBQVU7UUFBVixxQkFBQSxFQUFBLFlBQVU7UUFDckIsSUFBSSxPQUFPLEdBQUcsSUFBSSxjQUFPLEVBQUUsQ0FBQztRQUM1QixPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQ25ELE9BQU8sQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLFNBQVMsR0FBRyxlQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFMUQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGVBQU0sQ0FBQyxNQUFNLEdBQUcsV0FBVyxFQUFFO1lBQ2hELE9BQU8sRUFBRSxPQUFPO1NBQ2pCLENBQUM7YUFDRCxHQUFHLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQVYsQ0FBVSxDQUFDO2FBQ3RCLEdBQUcsQ0FBQyxVQUFBLElBQUk7WUFDUCxJQUFJLFlBQVksR0FBRyxJQUFJLEtBQUssRUFBWSxDQUFDO1lBQ3pDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxRQUFRO2dCQUNwQixJQUFJLFdBQVcsR0FBRyxJQUFJLG1CQUFRLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNwRyxXQUFXLENBQUMsRUFBRSxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUM7Z0JBQzdCLFdBQVcsQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztnQkFDckMsV0FBVyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDO2dCQUN6QyxXQUFXLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUM7Z0JBRXpDLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFakMsQ0FBQyxDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsWUFBWSxDQUFDO1FBQ3RCLENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVELHVDQUFhLEdBQWIsVUFBYyxRQUFrQjtRQUM5QixJQUFJLE9BQU8sR0FBRyxJQUFJLGNBQU8sRUFBRSxDQUFDO1FBQzVCLE9BQU8sQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLGtCQUFrQixDQUFDLENBQUM7UUFFbkQsd0RBQXdEO1FBQ3hELHlDQUF5QztRQUN6QywrQkFBK0I7UUFDL0IsK0JBQStCO1FBQy9CLDRCQUE0QjtRQUM1QiwyQkFBMkI7UUFDM0IsdUJBQXVCO1FBQ3ZCLFNBQVM7UUFFVCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQ25CLGVBQU0sQ0FBQyxNQUFNLEdBQUcsV0FBVyxFQUMzQixJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ2IsV0FBVyxFQUFFLFFBQVEsQ0FBQyxXQUFXO1lBQ2pDLE1BQU0sRUFBRSxRQUFRLENBQUMsTUFBTTtZQUN2QixLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUs7WUFDckIsR0FBRyxFQUFFLFFBQVEsQ0FBQyxHQUFHO1lBQ2pCLFFBQVEsRUFBRSxRQUFRLENBQUMsUUFBUTtZQUMzQixNQUFNLEVBQUUsUUFBUSxDQUFDLE1BQU07WUFDdkIsUUFBUSxFQUFFLFFBQVEsQ0FBQyxRQUFRO1NBQzVCLENBQUMsRUFDRixFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FDckI7YUFDQSxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCxzQ0FBWSxHQUFaLFVBQWEsS0FBZTtRQUMxQiw2QkFBNkI7UUFDN0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsR0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqRCxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixHQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxQyxnQ0FBZ0M7UUFDaEMsTUFBTSxDQUFDLGVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDL0IsZUFBZTtRQUNmLGdCQUFnQjtJQUNsQixDQUFDO0lBekVVLGVBQWU7UUFEM0IsaUJBQVUsRUFBRTt5Q0FJSyxXQUFJO09BSFQsZUFBZSxDQTBFM0I7SUFBRCxzQkFBQztDQUFBLEFBMUVELElBMEVDO0FBMUVZLDBDQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBIdHRwLCBIZWFkZXJzLCBSZXNwb25zZSB9IGZyb20gXCJAYW5ndWxhci9odHRwXCI7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSBcInJ4anMvUnhcIjtcblxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4uL2NvbmZpZ1wiO1xuaW1wb3J0IHsgSW50ZXJlc3QgfSBmcm9tIFwiLi9pbnRlcmVzdFwiO1xuXG52YXIgYXBwU2V0dGluZ3MgPSByZXF1aXJlKFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIik7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBJbnRlcmVzdFNlcnZpY2Uge1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgaHR0cDogSHR0cCwgXG4gICl7XG4gICAgY29uc29sZS5sb2coXCJJbiBJbnRlcmVzdCBTZXJ2aWNlIENvbnN0cnVjdG9yXCIpO1xuICB9XG4gIFxuXG4gIC8vIHRoaXMgbWV0aG9kIGNhbGxzIHRoZSBBUEkgYW5kIHJlY2VpdmVzIGEgbGlzdCBvZiBhbGwgaW50ZXJlc3RzXG4gIGdldEludGVyZXN0cyh0eXBlPSdhbGwnKXtcbiAgICBsZXQgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XG4gICAgaGVhZGVycy5hcHBlbmQoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgIGhlYWRlcnMuYXBwZW5kKFwiQXV0aG9yaXphdGlvblwiLCBcIkJlYXJlciBcIiArIENvbmZpZy50b2tlbik7XG5cbiAgICByZXR1cm4gdGhpcy5odHRwLmdldChDb25maWcuYXBpVXJsICsgXCJpbnRlcmVzdHNcIiwge1xuICAgICAgaGVhZGVyczogaGVhZGVyc1xuICAgIH0pXG4gICAgLm1hcChyZXMgPT4gcmVzLmpzb24oKSlcbiAgICAubWFwKGRhdGEgPT4ge1xuICAgICAgbGV0IGludGVyZXN0TGlzdCA9IG5ldyBBcnJheTxJbnRlcmVzdD4oKTtcbiAgICAgIGRhdGEuZm9yRWFjaCgoaW50ZXJlc3QpID0+IHtcbiAgICAgICAgbGV0IGludGVyZXN0T2JqID0gbmV3IEludGVyZXN0KGludGVyZXN0LmN1c3RvbWVyX2lkLCBpbnRlcmVzdC5iZWFjb24sIGludGVyZXN0LnN0YXJ0LCBpbnRlcmVzdC5lbmQpO1xuICAgICAgICBpbnRlcmVzdE9iai5pZCA9IGludGVyZXN0LmlkO1xuICAgICAgICBpbnRlcmVzdE9iai5hY3RpdmUgPSBpbnRlcmVzdC5hY3RpdmU7XG4gICAgICAgIGludGVyZXN0T2JqLmtleXdvcmRzID0gaW50ZXJlc3Qua2V5d29yZHM7XG4gICAgICAgIGludGVyZXN0T2JqLmNyZWF0aW5nID0gaW50ZXJlc3QuY3JlYXRpbmc7XG4gICAgICAgIFxuICAgICAgICBpbnRlcmVzdExpc3QucHVzaChpbnRlcmVzdE9iaik7XG4gICAgICAgIFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gaW50ZXJlc3RMaXN0O1xuICAgIH0pXG4gICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3JzKTtcbiAgfVxuXG4gIGNyZWF0ZUludGVyc3QoaW50ZXJlc3Q6IEludGVyZXN0KXtcbiAgICBsZXQgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XG4gICAgaGVhZGVycy5hcHBlbmQoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuXG4gICAgLy8gY29uc29sZS5sb2coXCJ1cmw6IFwiK0NvbmZpZy5hcGlVcmwgKyBcImF1dGgvcmVnaXN0ZXJcIik7XG4gICAgLy8gY29uc29sZS5sb2coXCJKU09OOiBcIisgSlNPTi5zdHJpbmdpZnkoe1xuICAgIC8vICAgICB1c2VybmFtZTogdXNlci51c2VybmFtZSxcbiAgICAvLyAgICAgcGFzc3dvcmQ6IHVzZXIucGFzc3dvcmQsXG4gICAgLy8gICAgIGVtYWlsOiB1c2VyLnVzZXJuYW1lLFxuICAgIC8vICAgICBuYW1lOiB1c2VyLnVzZXJuYW1lLFxuICAgIC8vICAgICByb2xlOiBcIkN1c3RvbWVyXCJcbiAgICAvLyAgIH0pKTtcblxuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChcbiAgICAgIENvbmZpZy5hcGlVcmwgKyBcImludGVyZXN0c1wiLFxuICAgICAgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBjdXN0b21lcl9pZDogaW50ZXJlc3QuY3VzdG9tZXJfaWQsXG4gICAgICAgIGJlYWNvbjogaW50ZXJlc3QuYmVhY29uLFxuICAgICAgICBzdGFydDogaW50ZXJlc3Quc3RhcnQsXG4gICAgICAgIGVuZDogaW50ZXJlc3QuZW5kLFxuICAgICAgICBjcmVhdGluZzogaW50ZXJlc3QuY3JlYXRpbmcsXG4gICAgICAgIGFjdGl2ZTogaW50ZXJlc3QuYWN0aXZlLFxuICAgICAgICBrZXl3b3JkczogaW50ZXJlc3Qua2V5d29yZHNcbiAgICAgIH0pLFxuICAgICAgeyBoZWFkZXJzOiBoZWFkZXJzIH1cbiAgICApXG4gICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3JzKTtcbiAgfVxuXG4gIGhhbmRsZUVycm9ycyhlcnJvcjogUmVzcG9uc2UsKSB7XG4gICAgLy8gdmFyIGVyciA9IG5ldyBFcnJvcihlcnJvcilcbiAgICBjb25zb2xlLmxvZyhcIkVycm9yIGluIEludGVyZXN0IFNlcnZpY2U6IFwiK2Vycm9yKTtcbiAgICBjb25zb2xlLmxvZyhcIlR5cGUgb2YgZXJyb3I6IFwiK2Vycm9yLnR5cGUpO1xuICAgIC8vIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgcmV0dXJuIE9ic2VydmFibGUudGhyb3coZXJyb3IpO1xuICAgIC8vIHRocm93IGVycm9yO1xuICAgIC8vIHJldHVybiBlcnJvcjtcbiAgfVxufSJdfQ==