"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Rx_1 = require("rxjs/Rx");
// import { isEnabled, enableLocationRequest, getCurrentLocation, watchLocation, distance, clearWatch } from "nativescript-geolocation";
var config_1 = require("../config");
var user_1 = require("../user/user");
var ContractService = (function () {
    function ContractService(http) {
        this.http = http;
    }
    ContractService.prototype.getContract = function (location_id) {
        var headers = new http_1.Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + config_1.Config.token);
        return this.http.get(config_1.Config.apiUrl + "contracts/" + location_id, {
            headers: headers
        })
            .map(function (res) { return res.json(); })
            .catch(this.handleErrors);
    };
    ContractService.prototype.getActiveContract = function (location_id, customer_id) {
        var headers = new http_1.Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + config_1.Config.token);
        // console.log("customer: "+ customer_id+", loc: "+location_id);
        return this.http.post(config_1.Config.apiUrl + "contracts/active", JSON.stringify({
            "customer_id": customer_id,
            "location_id": location_id
        }), { headers: headers })
            .map(function (res) { return res.json()[0]; })
            .catch(this.handleErrors);
    };
    ContractService.prototype.createContract = function (contractData) {
        var headers = new http_1.Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + config_1.Config.token);
        // console.log("Attempting to create a contract.");
        // console.log("in Contract service");
        // console.log("Contract data expire: "+ contractData.expire);
        // console.log("Contract data options expire_method: "+ contractData.options.toString());
        // console.log("contract data: "+JSON.stringify(contractData));
        return this.http.post(config_1.Config.apiUrl + "contracts", JSON.stringify(contractData), { headers: headers })
            .map(function (response) { return response.json(); })
            .catch(this.handleErrors);
    };
    ContractService.prototype.getCustomersWithContract = function (location_id) {
        var headers = new http_1.Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + config_1.Config.token);
        return this.http.get(config_1.Config.apiUrl + "contracts/customers/" + location_id, {
            headers: headers
        })
            .map(function (res) { return res.json(); })
            .map(function (data) {
            var customerList = new Array();
            data.forEach(function (customer) {
                var cust = new user_1.User();
                cust.id = customer.customer_id;
                cust.name = customer.customer_name;
                cust.username = customer.customer_username;
                cust.email = customer.customer_email;
                customerList.push(cust);
            });
            return customerList;
        })
            .catch(this.handleErrors);
    };
    ContractService.prototype.expireContract = function (location_id, customer_id) {
        var headers = new http_1.Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + config_1.Config.token);
        return this.http.post(config_1.Config.apiUrl + "contracts/expire", JSON.stringify({
            "customer_id": customer_id,
            "location_id": location_id
        }), { headers: headers })
            .map(function (res) { return res.json()[0]; })
            .catch(this.handleErrors);
    };
    ContractService.prototype.handleErrors = function (error) {
        // console.log("Error in Contract Service: "+error);
        // console.log("Error status: "+error.status);
        return Rx_1.Observable.throw(error);
    };
    ContractService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http])
    ], ContractService);
    return ContractService;
}());
exports.ContractService = ContractService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJhY3Quc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbnRyYWN0LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkM7QUFDM0Msc0NBQXdEO0FBQ3hELDhCQUFxQztBQUNyQyx3SUFBd0k7QUFFeEksb0NBQW1DO0FBRW5DLHFDQUFvQztBQUdwQztJQUNFLHlCQUFvQixJQUFVO1FBQVYsU0FBSSxHQUFKLElBQUksQ0FBTTtJQUFFLENBQUM7SUFJakMscUNBQVcsR0FBWCxVQUFZLFdBQVc7UUFDckIsSUFBSSxPQUFPLEdBQUcsSUFBSSxjQUFPLEVBQUUsQ0FBQztRQUM1QixPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQ25ELE9BQU8sQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLFNBQVMsR0FBRyxlQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFMUQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGVBQU0sQ0FBQyxNQUFNLEdBQUcsWUFBWSxHQUFDLFdBQVcsRUFBRTtZQUM3RCxPQUFPLEVBQUUsT0FBTztTQUNqQixDQUFDO2FBQ0QsR0FBRyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFWLENBQVUsQ0FBQzthQUN0QixLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCwyQ0FBaUIsR0FBakIsVUFBa0IsV0FBVyxFQUFFLFdBQVc7UUFDeEMsSUFBSSxPQUFPLEdBQUcsSUFBSSxjQUFPLEVBQUUsQ0FBQztRQUM1QixPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQ25ELE9BQU8sQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLFNBQVMsR0FBRyxlQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFMUQsZ0VBQWdF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QUM1QixPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQ25ELE9BQU8sQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLFNBQVMsR0FBRyxlQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFMUQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUNuQixlQUFNLENBQUMsTUFBTSxHQUFHLGtCQUFrQixFQUNsQyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ2IsYUFBYSxFQUFFLFdBQVc7WUFDMUIsYUFBYSxFQUFFLFdBQVc7U0FDM0IsQ0FBQyxFQUNGLEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBQyxDQUFDO2FBQ2xCLEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBYixDQUFhLENBQUM7YUFDekIsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsc0NBQVksR0FBWixVQUFhLEtBQWU7UUFDMUIsb0RBQW9EO1FBQ3BELDhDQUE4QztRQUM5QyxNQUFNLENBQUMsZUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBbkdVLGVBQWU7UUFEM0IsaUJBQVUsRUFBRTt5Q0FFZSxXQUFJO09BRG5CLGVBQWUsQ0FvRzNCO0lBQUQsc0JBQUM7Q0FBQSxBQXBHRCxJQW9HQztBQXBHWSwwQ0FBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgSHR0cCwgSGVhZGVycywgUmVzcG9uc2UgfSBmcm9tIFwiQGFuZ3VsYXIvaHR0cFwiO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gXCJyeGpzL1J4XCI7XG4vLyBpbXBvcnQgeyBpc0VuYWJsZWQsIGVuYWJsZUxvY2F0aW9uUmVxdWVzdCwgZ2V0Q3VycmVudExvY2F0aW9uLCB3YXRjaExvY2F0aW9uLCBkaXN0YW5jZSwgY2xlYXJXYXRjaCB9IGZyb20gXCJuYXRpdmVzY3JpcHQtZ2VvbG9jYXRpb25cIjtcblxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4uL2NvbmZpZ1wiO1xuaW1wb3J0IHsgQ29udHJhY3QgfSBmcm9tIFwiLi9jb250cmFjdFwiO1xuaW1wb3J0IHsgVXNlciB9IGZyb20gXCIuLi91c2VyL3VzZXJcIjtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENvbnRyYWN0U2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cCl7fVxuXG4gIHByaXZhdGUgX2NvbnRyYWN0OiBDb250cmFjdDtcblxuICBnZXRDb250cmFjdChsb2NhdGlvbl9pZCl7XG4gICAgbGV0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuICAgIGhlYWRlcnMuYXBwZW5kKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICBoZWFkZXJzLmFwcGVuZChcIkF1dGhvcml6YXRpb25cIiwgXCJCZWFyZXIgXCIgKyBDb25maWcudG9rZW4pO1xuXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoQ29uZmlnLmFwaVVybCArIFwiY29udHJhY3RzL1wiK2xvY2F0aW9uX2lkLCB7XG4gICAgICBoZWFkZXJzOiBoZWFkZXJzXG4gICAgfSlcbiAgICAubWFwKHJlcyA9PiByZXMuanNvbigpKVxuICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9ycyk7XG4gIH1cblxuICBnZXRBY3RpdmVDb250cmFjdChsb2NhdGlvbl9pZCwgY3VzdG9tZXJfaWQpe1xuICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcbiAgICBoZWFkZXJzLmFwcGVuZChcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgaGVhZGVycy5hcHBlbmQoXCJBdXRob3JpemF0aW9uXCIsIFwiQmVhcmVyIFwiICsgQ29uZmlnLnRva2VuKTtcblxuICAgIC8vIGNvbnNvbGUubG9nKFwiY3VzdG9tZXI6IFwiKyBjdXN0b21lcl9pZCtcIiwgbG9jOiBcIitsb2NhdGlvbl9pZCk7XG5cbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QoXG4gICAgICBDb25maWcuYXBpVXJsICsgXCJjb250cmFjdHMvYWN0aXZlXCIsIFxuICAgICAgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBcImN1c3RvbWVyX2lkXCI6IGN1c3RvbWVyX2lkLFxuICAgICAgICBcImxvY2F0aW9uX2lkXCI6IGxvY2F0aW9uX2lkXG4gICAgICB9KSxcbiAgICAgIHtoZWFkZXJzOiBoZWFkZXJzfSlcbiAgICAgIC5tYXAocmVzID0+IHJlcy5qc29uKClbMF0pXG4gICAgICAuY2F0Y2godGhpcy5oYW5kbGVFcnJvcnMpO1xuICB9XG5cbiAgY3JlYXRlQ29udHJhY3QoY29udHJhY3REYXRhKXtcbiAgICBsZXQgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XG4gICAgaGVhZGVycy5hcHBlbmQoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgIGhlYWRlcnMuYXBwZW5kKFwiQXV0aG9yaXphdGlvblwiLCBcIkJlYXJlciBcIiArIENvbmZpZy50b2tlbik7XG4gICAgLy8gY29uc29sZS5sb2coXCJBdHRlbXB0aW5nIHRvIGNyZWF0ZSBhIGNvbnRyYWN0LlwiKTtcbiAgICAvLyBjb25zb2xlLmxvZyhcImluIENvbnRyYWN0IHNlcnZpY2VcIik7XG4gICAgLy8gY29uc29sZS5sb2coXCJDb250cmFjdCBkYXRhIGV4cGlyZTogXCIrIGNvbnRyYWN0RGF0YS5leHBpcmUpO1xuICAgIC8vIGNvbnNvbGUubG9nKFwiQ29udHJhY3QgZGF0YSBvcHRpb25zIGV4cGlyZV9tZXRob2Q6IFwiKyBjb250cmFjdERhdGEub3B0aW9ucy50b1N0cmluZygpKTtcblxuICAgIC8vIGNvbnNvbGUubG9nKFwiY29udHJhY3QgZGF0YTogXCIrSlNPTi5zdHJpbmdpZnkoY29udHJhY3REYXRhKSk7XG5cbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QoXG4gICAgICBDb25maWcuYXBpVXJsICsgXCJjb250cmFjdHNcIixcbiAgICAgIEpTT04uc3RyaW5naWZ5KGNvbnRyYWN0RGF0YSksXG4gICAgICB7IGhlYWRlcnM6IGhlYWRlcnMgfVxuICAgIClcbiAgICAubWFwKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAuY2F0Y2godGhpcy5oYW5kbGVFcnJvcnMpO1xuICB9XG5cbiAgZ2V0Q3VzdG9tZXJzV2l0aENvbnRyYWN0KGxvY2F0aW9uX2lkKXtcbiAgICBsZXQgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XG4gICAgaGVhZGVycy5hcHBlbmQoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgIGhlYWRlcnMuYXBwZW5kKFwiQXV0aG9yaXphdGlvblwiLCBcIkJlYXJlciBcIiArIENvbmZpZy50b2tlbik7XG5cbiAgICByZXR1cm4gdGhpcy5odHRwLmdldChDb25maWcuYXBpVXJsICsgXCJjb250cmFjdHMvY3VzdG9tZXJzL1wiK2xvY2F0aW9uX2lkLCB7XG4gICAgICBoZWFkZXJzOiBoZWFkZXJzXG4gICAgfSlcbiAgICAubWFwKHJlcyA9PiByZXMuanNvbigpKVxuICAgIC5tYXAoZGF0YSA9PiB7XG4gICAgICBsZXQgY3VzdG9tZXJMaXN0ID0gbmV3IEFycmF5PFVzZXI+KCk7XG4gICAgICBkYXRhLmZvckVhY2goKGN1c3RvbWVyKSA9PiB7XG4gICAgICAgIGxldCBjdXN0ID0gbmV3IFVzZXIoKTtcbiAgICAgICAgY3VzdC5pZCA9IGN1c3RvbWVyLmN1c3RvbWVyX2lkO1xuICAgICAgICBjdXN0Lm5hbWUgPSBjdXN0b21lci5jdXN0b21lcl9uYW1lO1xuICAgICAgICBjdXN0LnVzZXJuYW1lID0gY3VzdG9tZXIuY3VzdG9tZXJfdXNlcm5hbWU7XG4gICAgICAgIGN1c3QuZW1haWwgPSBjdXN0b21lci5jdXN0b21lcl9lbWFpbDtcbiAgICAgICAgY3VzdG9tZXJMaXN0LnB1c2goY3VzdCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBjdXN0b21lckxpc3Q7XG4gICAgfSlcbiAgICAuY2F0Y2godGhpcy5oYW5kbGVFcnJvcnMpO1xuICB9XG5cbiAgZXhwaXJlQ29udHJhY3QobG9jYXRpb25faWQsIGN1c3RvbWVyX2lkKXtcbiAgICBsZXQgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XG4gICAgaGVhZGVycy5hcHBlbmQoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgIGhlYWRlcnMuYXBwZW5kKFwiQXV0aG9yaXphdGlvblwiLCBcIkJlYXJlciBcIiArIENvbmZpZy50b2tlbik7XG4gICAgXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KFxuICAgICAgQ29uZmlnLmFwaVVybCArIFwiY29udHJhY3RzL2V4cGlyZVwiLCBcbiAgICAgIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgXCJjdXN0b21lcl9pZFwiOiBjdXN0b21lcl9pZCxcbiAgICAgICAgXCJsb2NhdGlvbl9pZFwiOiBsb2NhdGlvbl9pZFxuICAgICAgfSksXG4gICAgICB7aGVhZGVyczogaGVhZGVyc30pXG4gICAgICAubWFwKHJlcyA9PiByZXMuanNvbigpWzBdKVxuICAgICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3JzKTtcbiAgfVxuXG4gIGhhbmRsZUVycm9ycyhlcnJvcjogUmVzcG9uc2UsKSB7XG4gICAgLy8gY29uc29sZS5sb2coXCJFcnJvciBpbiBDb250cmFjdCBTZXJ2aWNlOiBcIitlcnJvcik7XG4gICAgLy8gY29uc29sZS5sb2coXCJFcnJvciBzdGF0dXM6IFwiK2Vycm9yLnN0YXR1cyk7XG4gICAgcmV0dXJuIE9ic2VydmFibGUudGhyb3coZXJyb3IpO1xuICB9XG59Il19