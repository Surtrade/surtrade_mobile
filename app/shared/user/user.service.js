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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTJDO0FBQzNDLHNDQUF3RDtBQUN4RCw4QkFBcUM7QUFDckMsZ0NBQThCO0FBQzlCLGlDQUErQjtBQUcvQixvQ0FBbUM7QUFLbkM7SUFDRSxxQkFBb0IsSUFBVTtRQUFWLFNBQUksR0FBSixJQUFJLENBQU07SUFBRyxDQUFDO0lBRWxDLDhCQUFRLEdBQVIsVUFBUyxJQUFVO1FBQ2pCLElBQUksT0FBTyxHQUFHLElBQUksY0FBTyxFQUFFLENBQUM7UUFDNUIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUVuRCx3REFBd0Q7UUFDeEQseUNBQXlDO1FBQ3pDLCtCQUErQjtRQUMvQiwrQkFBK0I7UUFDL0IsNEJBQTRCO1FBQzVCLDJCQUEyQjtRQUMzQix1QkFBdUI7UUFDdkIsU0FBUztRQUVULE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FDbkIsZUFBTSxDQUFDLE1BQU0sR0FBRyxlQUFlLEVBQy9CLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDYixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDdkIsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO1lBQ3ZCLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUTtZQUNwQixJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDbkIsSUFBSSxFQUFFLFVBQVU7U0FDakIsQ0FBQyxFQUNGLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUNyQjthQUNBLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVELDJCQUFLLEdBQUwsVUFBTSxJQUFVO1FBQ2QsSUFBSSxPQUFPLEdBQUcsSUFBSSxjQUFPLEVBQUUsQ0FBQztRQUM1QixPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBSW5ELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FDbkIsZUFBTSxDQUFDLE1BQU0sR0FBRyxZQUFZO1FBQzVCLDBDQUEwQztRQUMxQyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ2IsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO1lBQ3ZCLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtTQUN4QixDQUFDLEVBQ0YsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQ3JCO2FBQ0EsR0FBRyxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFmLENBQWUsQ0FBQzthQUNoQyxFQUFFLENBQUMsVUFBQSxJQUFJO1lBQ04sMERBQTBEO1lBQzFELGdFQUFnRTtZQUVoRSxlQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDbkMsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsd0NBQWtCLEdBQWxCLFVBQW1CLFdBQW1CLEVBQUUsV0FBbUI7UUFDekQsSUFBSSxPQUFPLEdBQUcsSUFBSSxjQUFPLEVBQUUsQ0FBQztRQUM1QixPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQ25ELE9BQU8sQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLFNBQVMsR0FBRyxlQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFMUQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUNuQixlQUFNLENBQUMsTUFBTSxHQUFHLDJCQUEyQixFQUMzQyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ2IsYUFBYSxFQUFFLFdBQVc7WUFDMUIsYUFBYSxFQUFFLFdBQVc7U0FDM0IsQ0FBQyxFQUNGLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUNyQjthQUNBLEdBQUcsQ0FBQyxVQUFBLFFBQVEsSUFBSSxPQUFBLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBZixDQUFlLENBQUM7YUFDaEMsR0FBRyxDQUFDLFVBQUEsSUFBSTtZQUVQLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDZCxDQUFDLENBQUM7YUFDRCxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCxrQ0FBWSxHQUFaLFVBQWEsS0FBZTtRQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixHQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ3hELE1BQU0sQ0FBQyxlQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUEvRVUsV0FBVztRQUR2QixpQkFBVSxFQUFFO3lDQUVlLFdBQUk7T0FEbkIsV0FBVyxDQWtGdkI7SUFBRCxrQkFBQztDQUFBLEFBbEZELElBa0ZDO0FBbEZZLGtDQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBIdHRwLCBIZWFkZXJzLCBSZXNwb25zZSB9IGZyb20gXCJAYW5ndWxhci9odHRwXCI7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSBcInJ4anMvUnhcIjtcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvZG8nO1xuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci9tYXAnO1xuXG5pbXBvcnQgeyBVc2VyIH0gZnJvbSBcIi4vdXNlclwiO1xuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4uL2NvbmZpZ1wiO1xuXG5cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFVzZXJTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwKSB7fVxuXG4gIHJlZ2lzdGVyKHVzZXI6IFVzZXIpIHtcbiAgICBsZXQgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XG4gICAgaGVhZGVycy5hcHBlbmQoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuXG4gICAgLy8gY29uc29sZS5sb2coXCJ1cmw6IFwiK0NvbmZpZy5hcGlVcmwgKyBcImF1dGgvcmVnaXN0ZXJcIik7XG4gICAgLy8gY29uc29sZS5sb2coXCJKU09OOiBcIisgSlNPTi5zdHJpbmdpZnkoe1xuICAgIC8vICAgICB1c2VybmFtZTogdXNlci51c2VybmFtZSxcbiAgICAvLyAgICAgcGFzc3dvcmQ6IHVzZXIucGFzc3dvcmQsXG4gICAgLy8gICAgIGVtYWlsOiB1c2VyLnVzZXJuYW1lLFxuICAgIC8vICAgICBuYW1lOiB1c2VyLnVzZXJuYW1lLFxuICAgIC8vICAgICByb2xlOiBcIkN1c3RvbWVyXCJcbiAgICAvLyAgIH0pKTtcblxuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChcbiAgICAgIENvbmZpZy5hcGlVcmwgKyBcImF1dGgvcmVnaXN0ZXJcIixcbiAgICAgIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgdXNlcm5hbWU6IHVzZXIudXNlcm5hbWUsXG4gICAgICAgIHBhc3N3b3JkOiB1c2VyLnBhc3N3b3JkLFxuICAgICAgICBlbWFpbDogdXNlci51c2VybmFtZSxcbiAgICAgICAgbmFtZTogdXNlci51c2VybmFtZSxcbiAgICAgICAgcm9sZTogXCJDdXN0b21lclwiXG4gICAgICB9KSxcbiAgICAgIHsgaGVhZGVyczogaGVhZGVycyB9XG4gICAgKVxuICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9ycyk7XG4gIH1cblxuICBsb2dpbih1c2VyOiBVc2VyKSB7XG4gICAgbGV0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuICAgIGhlYWRlcnMuYXBwZW5kKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICBcbiAgICBcblxuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChcbiAgICAgIENvbmZpZy5hcGlVcmwgKyBcImF1dGgvbG9naW5cIixcbiAgICAgIC8vIFwiaHR0cDovLzE3NC4xMzguNDguNDQ6NTAwMC9hdXRoL2xvZ2luXCIsXG4gICAgICBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIHVzZXJuYW1lOiB1c2VyLnVzZXJuYW1lLFxuICAgICAgICBwYXNzd29yZDogdXNlci5wYXNzd29yZFxuICAgICAgfSksXG4gICAgICB7IGhlYWRlcnM6IGhlYWRlcnMgfVxuICAgIClcbiAgICAubWFwKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAuZG8oZGF0YSA9PiB7XG4gICAgICAvLyBhbGVydChcInVzZXI6IFwiK3VzZXIudXNlcm5hbWUrXCIsIHBhc3M6IFwiK3VzZXIucGFzc3dvcmQpO1xuICAgICAgLy8gY29uc29sZS5sb2coXCJ1c2VyOiBcIit1c2VyLnVzZXJuYW1lK1wiLCBwYXNzOiBcIit1c2VyLnBhc3N3b3JkKTtcblxuICAgICAgQ29uZmlnLnRva2VuID0gZGF0YS5hY2Nlc3NfdG9rZW47XG4gICAgfSlcbiAgICAuY2F0Y2godGhpcy5oYW5kbGVFcnJvcnMpO1xuICB9XG5cbiAgZ2V0UmVjb21tZW5kYXRpb25zKGN1c3RvbWVyX2lkOiBOdW1iZXIsIGxvY2F0aW9uX2lkOiBOdW1iZXIpe1xuICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcbiAgICBoZWFkZXJzLmFwcGVuZChcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgaGVhZGVycy5hcHBlbmQoXCJBdXRob3JpemF0aW9uXCIsIFwiQmVhcmVyIFwiICsgQ29uZmlnLnRva2VuKTtcblxuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChcbiAgICAgIENvbmZpZy5hcGlVcmwgKyBcImN1c3RvbWVycy9yZWNvbW1lbmRhdGlvbnNcIixcbiAgICAgIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgXCJjdXN0b21lcl9pZFwiOiBjdXN0b21lcl9pZCxcbiAgICAgICAgXCJsb2NhdGlvbl9pZFwiOiBsb2NhdGlvbl9pZFxuICAgICAgfSksXG4gICAgICB7IGhlYWRlcnM6IGhlYWRlcnMgfVxuICAgIClcbiAgICAubWFwKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAubWFwKGRhdGEgPT4ge1xuICAgICAgXG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9KVxuICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9ycyk7XG4gIH1cblxuICBoYW5kbGVFcnJvcnMoZXJyb3I6IFJlc3BvbnNlKSB7XG4gICAgY29uc29sZS5sb2coXCJFcnJvciBpbiBVc2VyIFNlcnZpY2UuIFwiK2Vycm9yLnRvU3RyaW5nKCkpO1xuICAgIHJldHVybiBPYnNlcnZhYmxlLnRocm93KGVycm9yKTtcbiAgfVxuXG4gIFxufSJdfQ==