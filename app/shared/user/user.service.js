"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Rx_1 = require("rxjs/Rx");
require("rxjs/add/operator/do");
require("rxjs/add/operator/map");
var config_1 = require("../config");
var UserService = (function () {
    function UserService(http) {
        this.http = http;
    }
    UserService.prototype.register = function (user) {
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
        return this.http.post(config_1.Config.apiUrl + "auth/register", JSON.stringify({
            username: user.username,
            password: user.password,
            email: user.username,
            name: user.username,
            role: "Customer"
        }), { headers: headers })
            .catch(this.handleErrors);
    };
    UserService.prototype.login = function (user) {
        var headers = new http_1.Headers();
        headers.append("Content-Type", "application/json");
        console.log("Login in to: " + config_1.Config.apiUrl + "auth/login");
        return this.http.post(config_1.Config.apiUrl + "auth/login", 
        // "http://174.138.48.44:5000/auth/login",
        JSON.stringify({
            username: user.username,
            password: user.password
        }), { headers: headers })
            .map(function (response) { return response.json(); })
            .do(function (data) {
            // alert("user: "+user.username+", pass: "+user.password);
            // console.log("user: "+user.username+", pass: "+user.password);
            config_1.Config.token = data.access_token;
        })
            .catch(this.handleErrors);
    };
    UserService.prototype.getRecommendations = function (customer_id, location_id) {
        var headers = new http_1.Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + config_1.Config.token);
        return this.http.post(config_1.Config.apiUrl + "customers/recommendations", JSON.stringify({
            "customer_id": customer_id,
            "location_id": location_id
        }), { headers: headers })
            .map(function (response) { return response.json(); })
            .map(function (data) {
            return data;
        })
            .catch(this.handleErrors);
    };
    UserService.prototype.handleErrors = function (error) {
        console.log("Error in User Service. " + error.toString());
        return Rx_1.Observable.throw(error);
    };
    UserService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http])
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTJDO0FBQzNDLHNDQUF3RDtBQUN4RCw4QkFBcUM7QUFDckMsZ0NBQThCO0FBQzlCLGlDQUErQjtBQUcvQixvQ0FBbUM7QUFLbkM7SUFDRSxxQkFBb0IsSUFBVTtRQUFWLFNBQUksR0FBSixJQUFJLENBQU07SUFBRyxDQUFDO0lBRWxDLDhCQUFRLEdBQVIsVUFBUyxJQUFVO1FBQ2pCLElBQUksT0FBTyxHQUFHLElBQUksY0FBTyxFQUFFLENBQUM7UUFDNUIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUVuRCx3REFBd0Q7UUFDeEQseUNBQXlDO1FBQ3pDLCtCQUErQjtRQUMvQiwrQkFBK0I7UUFDL0IsNEJBQTRCO1FBQzVCLDJCQUEyQjtRQUMzQix1QkFBdUI7UUFDdkIsU0FBUztRQUVULE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FDbkIsZUFBTSxDQUFDLE1BQU0sR0FBRyxlQUFlLEVBQy9CLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDYixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDdkIsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO1lBQ3ZCLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUTtZQUNwQixJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDbkIsSUFBSSxFQUFFLFVBQVU7U0FDakIsQ0FBQyxFQUNGLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUNyQjthQUNBLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVELDJCQUFLLEdBQUwsVUFBTSxJQUFVO1FBQ2QsSUFBSSxPQUFPLEdBQUcsSUFBSSxjQUFPLEVBQUUsQ0FBQztRQUM1QixPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBR25ELE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxHQUFDLGVBQU0sQ0FBQyxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUM7UUFDMUQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUNuQixlQUFNLENBQUMsTUFBTSxHQUFHLFlBQVk7UUFDNUIsMENBQTBDO1FBQzFDLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDYixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDdkIsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO1NBQ3hCLENBQUMsRUFDRixFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FDckI7YUFDQSxHQUFHLENBQUMsVUFBQSxRQUFRLElBQUksT0FBQSxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQWYsQ0FBZSxDQUFDO2FBQ2hDLEVBQUUsQ0FBQyxVQUFBLElBQUk7WUFDTiwwREFBMEQ7WUFDMUQsZ0VBQWdFO1lBRWhFLGVBQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUNuQyxDQUFDLENBQUM7YUFDRCxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCx3Q0FBa0IsR0FBbEIsVUFBbUIsV0FBbUIsRUFBRSxXQUFtQjtRQUN6RCxJQUFJLE9BQU8sR0FBRyxJQUFJLGNBQU8sRUFBRSxDQUFDO1FBQzVCLE9BQU8sQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLGtCQUFrQixDQUFDLENBQUM7UUFDbkQsT0FBTyxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsU0FBUyxHQUFHLGVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUUxRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQ25CLGVBQU0sQ0FBQyxNQUFNLEdBQUcsMkJBQTJCLEVBQzNDLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDYixhQUFhLEVBQUUsV0FBVztZQUMxQixhQUFhLEVBQUUsV0FBVztTQUMzQixDQUFDLEVBQ0YsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQ3JCO2FBQ0EsR0FBRyxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFmLENBQWUsQ0FBQzthQUNoQyxHQUFHLENBQUMsVUFBQSxJQUFJO1lBRVAsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNkLENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVELGtDQUFZLEdBQVosVUFBYSxLQUFlO1FBQzFCLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLEdBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDeEQsTUFBTSxDQUFDLGVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakMsQ0FBQztJQS9FVSxXQUFXO1FBRHZCLGlCQUFVLEVBQUU7eUNBRWUsV0FBSTtPQURuQixXQUFXLENBa0Z2QjtJQUFELGtCQUFDO0NBQUEsQUFsRkQsSUFrRkM7QUFsRlksa0NBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IEh0dHAsIEhlYWRlcnMsIFJlc3BvbnNlIH0gZnJvbSBcIkBhbmd1bGFyL2h0dHBcIjtcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tIFwicnhqcy9SeFwiO1xuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci9kbyc7XG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL21hcCc7XG5cbmltcG9ydCB7IFVzZXIgfSBmcm9tIFwiLi91c2VyXCI7XG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi4vY29uZmlnXCI7XG5cblxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgVXNlclNlcnZpY2Uge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHApIHt9XG5cbiAgcmVnaXN0ZXIodXNlcjogVXNlcikge1xuICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcbiAgICBoZWFkZXJzLmFwcGVuZChcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XG5cbiAgICAvLyBjb25zb2xlLmxvZyhcInVybDogXCIrQ29uZmlnLmFwaVVybCArIFwiYXV0aC9yZWdpc3RlclwiKTtcbiAgICAvLyBjb25zb2xlLmxvZyhcIkpTT046IFwiKyBKU09OLnN0cmluZ2lmeSh7XG4gICAgLy8gICAgIHVzZXJuYW1lOiB1c2VyLnVzZXJuYW1lLFxuICAgIC8vICAgICBwYXNzd29yZDogdXNlci5wYXNzd29yZCxcbiAgICAvLyAgICAgZW1haWw6IHVzZXIudXNlcm5hbWUsXG4gICAgLy8gICAgIG5hbWU6IHVzZXIudXNlcm5hbWUsXG4gICAgLy8gICAgIHJvbGU6IFwiQ3VzdG9tZXJcIlxuICAgIC8vICAgfSkpO1xuXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KFxuICAgICAgQ29uZmlnLmFwaVVybCArIFwiYXV0aC9yZWdpc3RlclwiLFxuICAgICAgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICB1c2VybmFtZTogdXNlci51c2VybmFtZSxcbiAgICAgICAgcGFzc3dvcmQ6IHVzZXIucGFzc3dvcmQsXG4gICAgICAgIGVtYWlsOiB1c2VyLnVzZXJuYW1lLFxuICAgICAgICBuYW1lOiB1c2VyLnVzZXJuYW1lLFxuICAgICAgICByb2xlOiBcIkN1c3RvbWVyXCJcbiAgICAgIH0pLFxuICAgICAgeyBoZWFkZXJzOiBoZWFkZXJzIH1cbiAgICApXG4gICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3JzKTtcbiAgfVxuXG4gIGxvZ2luKHVzZXI6IFVzZXIpIHtcbiAgICBsZXQgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XG4gICAgaGVhZGVycy5hcHBlbmQoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgIFxuICAgIFxuICAgIGNvbnNvbGUubG9nKFwiTG9naW4gaW4gdG86IFwiK0NvbmZpZy5hcGlVcmwgKyBcImF1dGgvbG9naW5cIik7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KFxuICAgICAgQ29uZmlnLmFwaVVybCArIFwiYXV0aC9sb2dpblwiLFxuICAgICAgLy8gXCJodHRwOi8vMTc0LjEzOC40OC40NDo1MDAwL2F1dGgvbG9naW5cIixcbiAgICAgIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgdXNlcm5hbWU6IHVzZXIudXNlcm5hbWUsXG4gICAgICAgIHBhc3N3b3JkOiB1c2VyLnBhc3N3b3JkXG4gICAgICB9KSxcbiAgICAgIHsgaGVhZGVyczogaGVhZGVycyB9XG4gICAgKVxuICAgIC5tYXAocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgIC5kbyhkYXRhID0+IHtcbiAgICAgIC8vIGFsZXJ0KFwidXNlcjogXCIrdXNlci51c2VybmFtZStcIiwgcGFzczogXCIrdXNlci5wYXNzd29yZCk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhcInVzZXI6IFwiK3VzZXIudXNlcm5hbWUrXCIsIHBhc3M6IFwiK3VzZXIucGFzc3dvcmQpO1xuXG4gICAgICBDb25maWcudG9rZW4gPSBkYXRhLmFjY2Vzc190b2tlbjtcbiAgICB9KVxuICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9ycyk7XG4gIH1cblxuICBnZXRSZWNvbW1lbmRhdGlvbnMoY3VzdG9tZXJfaWQ6IE51bWJlciwgbG9jYXRpb25faWQ6IE51bWJlcil7XG4gICAgbGV0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuICAgIGhlYWRlcnMuYXBwZW5kKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICBoZWFkZXJzLmFwcGVuZChcIkF1dGhvcml6YXRpb25cIiwgXCJCZWFyZXIgXCIgKyBDb25maWcudG9rZW4pO1xuXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KFxuICAgICAgQ29uZmlnLmFwaVVybCArIFwiY3VzdG9tZXJzL3JlY29tbWVuZGF0aW9uc1wiLFxuICAgICAgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBcImN1c3RvbWVyX2lkXCI6IGN1c3RvbWVyX2lkLFxuICAgICAgICBcImxvY2F0aW9uX2lkXCI6IGxvY2F0aW9uX2lkXG4gICAgICB9KSxcbiAgICAgIHsgaGVhZGVyczogaGVhZGVycyB9XG4gICAgKVxuICAgIC5tYXAocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgIC5tYXAoZGF0YSA9PiB7XG4gICAgICBcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH0pXG4gICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3JzKTtcbiAgfVxuXG4gIGhhbmRsZUVycm9ycyhlcnJvcjogUmVzcG9uc2UpIHtcbiAgICBjb25zb2xlLmxvZyhcIkVycm9yIGluIFVzZXIgU2VydmljZS4gXCIrZXJyb3IudG9TdHJpbmcoKSk7XG4gICAgcmV0dXJuIE9ic2VydmFibGUudGhyb3coZXJyb3IpO1xuICB9XG5cbiAgXG59Il19