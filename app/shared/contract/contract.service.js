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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJhY3Quc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbnRyYWN0LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkM7QUFDM0Msc0NBQXdEO0FBQ3hELDhCQUFxQztBQUNyQyx3SUFBd0k7QUFFeEksb0NBQW1DO0FBRW5DLHFDQUFvQztBQUdwQztJQUNFLHlCQUFvQixJQUFVO1FBQVYsU0FBSSxHQUFKLElBQUksQ0FBTTtJQUFFLENBQUM7SUFJakMscUNBQVcsR0FBWCxVQUFZLFdBQVc7UUFDckIsSUFBSSxPQUFPLEdBQUcsSUFBSSxjQUFPLEVBQUUsQ0FBQztRQUM1QixPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQ25ELE9BQU8sQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLFNBQVMsR0FBRyxlQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFMUQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGVBQU0sQ0FBQyxNQUFNLEdBQUcsWUFBWSxHQUFDLFdBQVcsRUFBRTtZQUM3RCxPQUFPLEVBQUUsT0FBTztTQUNqQixDQUFDO2FBQ0QsR0FBRyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFWLENBQVUsQ0FBQzthQUN0QixLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCwyQ0FBaUIsR0FBakIsVUFBa0IsV0FBVyxFQUFFLFdBQVc7UUFDeEMsSUFBSSxPQUFPLEdBQUcsSUFBSSxjQUFPLEVBQUUsQ0FBQztRQUM1QixPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQ25ELE9BQU8sQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLFNBQVMsR0FBRyxlQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFMUQsZ0VBQWdF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S0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFuRlUsZUFBZTtRQUQzQixpQkFBVSxFQUFFO3lDQUVlLFdBQUk7T0FEbkIsZUFBZSxDQW9GM0I7SUFBRCxzQkFBQztDQUFBLEFBcEZELElBb0ZDO0FBcEZZLDBDQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBIdHRwLCBIZWFkZXJzLCBSZXNwb25zZSB9IGZyb20gXCJAYW5ndWxhci9odHRwXCI7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSBcInJ4anMvUnhcIjtcbi8vIGltcG9ydCB7IGlzRW5hYmxlZCwgZW5hYmxlTG9jYXRpb25SZXF1ZXN0LCBnZXRDdXJyZW50TG9jYXRpb24sIHdhdGNoTG9jYXRpb24sIGRpc3RhbmNlLCBjbGVhcldhdGNoIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1nZW9sb2NhdGlvblwiO1xuXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi4vY29uZmlnXCI7XG5pbXBvcnQgeyBDb250cmFjdCB9IGZyb20gXCIuL2NvbnRyYWN0XCI7XG5pbXBvcnQgeyBVc2VyIH0gZnJvbSBcIi4uL3VzZXIvdXNlclwiO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ29udHJhY3RTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwKXt9XG5cbiAgcHJpdmF0ZSBfY29udHJhY3Q6IENvbnRyYWN0O1xuXG4gIGdldENvbnRyYWN0KGxvY2F0aW9uX2lkKXtcbiAgICBsZXQgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XG4gICAgaGVhZGVycy5hcHBlbmQoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgIGhlYWRlcnMuYXBwZW5kKFwiQXV0aG9yaXphdGlvblwiLCBcIkJlYXJlciBcIiArIENvbmZpZy50b2tlbik7XG5cbiAgICByZXR1cm4gdGhpcy5odHRwLmdldChDb25maWcuYXBpVXJsICsgXCJjb250cmFjdHMvXCIrbG9jYXRpb25faWQsIHtcbiAgICAgIGhlYWRlcnM6IGhlYWRlcnNcbiAgICB9KVxuICAgIC5tYXAocmVzID0+IHJlcy5qc29uKCkpXG4gICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3JzKTtcbiAgfVxuXG4gIGdldEFjdGl2ZUNvbnRyYWN0KGxvY2F0aW9uX2lkLCBjdXN0b21lcl9pZCl7XG4gICAgbGV0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuICAgIGhlYWRlcnMuYXBwZW5kKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICBoZWFkZXJzLmFwcGVuZChcIkF1dGhvcml6YXRpb25cIiwgXCJCZWFyZXIgXCIgKyBDb25maWcudG9rZW4pO1xuXG4gICAgLy8gY29uc29sZS5sb2coXCJjdXN0b21lcjogXCIrIGN1c3RvbWVyX2lkK1wiLCBsb2M6IFwiK2xvY2F0aW9uX2lkKTtcblxuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChcbiAgICAgIENvbmZpZy5hcGlVcmwgKyBcImNvbnRyYWN0cy9hY3RpdmVcIiwgXG4gICAgICBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIFwiY3VzdG9tZXJfaWRcIjogY3VzdG9tZXJfaWQsXG4gICAgICAgIFwibG9jYXRpb25faWRcIjogbG9jYXRpb25faWRcbiAgICAgIH0pLFxuICAgICAge2hlYWRlcnM6IGhlYWRlcnN9KVxuICAgICAgLm1hcChyZXMgPT4gcmVzLmpzb24oKVswXSlcbiAgICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9ycyk7XG4gIH1cblxuICBjcmVhdGVDb250cmFjdChjb250cmFjdERhdGEpe1xuICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcbiAgICBoZWFkZXJzLmFwcGVuZChcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgaGVhZGVycy5hcHBlbmQoXCJBdXRob3JpemF0aW9uXCIsIFwiQmVhcmVyIFwiICsgQ29uZmlnLnRva2VuKTtcbiAgICAvLyBjb25zb2xlLmxvZyhcIkF0dGVtcHRpbmcgdG8gY3JlYXRlIGEgY29udHJhY3QuXCIpO1xuICAgIC8vIGNvbnNvbGUubG9nKFwiaW4gQ29udHJhY3Qgc2VydmljZVwiKTtcbiAgICAvLyBjb25zb2xlLmxvZyhcIkNvbnRyYWN0IGRhdGEgZXhwaXJlOiBcIisgY29udHJhY3REYXRhLmV4cGlyZSk7XG4gICAgLy8gY29uc29sZS5sb2coXCJDb250cmFjdCBkYXRhIG9wdGlvbnMgZXhwaXJlX21ldGhvZDogXCIrIGNvbnRyYWN0RGF0YS5vcHRpb25zLnRvU3RyaW5nKCkpO1xuXG4gICAgLy8gY29uc29sZS5sb2coXCJjb250cmFjdCBkYXRhOiBcIitKU09OLnN0cmluZ2lmeShjb250cmFjdERhdGEpKTtcblxuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChcbiAgICAgIENvbmZpZy5hcGlVcmwgKyBcImNvbnRyYWN0c1wiLFxuICAgICAgSlNPTi5zdHJpbmdpZnkoY29udHJhY3REYXRhKSxcbiAgICAgIHsgaGVhZGVyczogaGVhZGVycyB9XG4gICAgKVxuICAgIC5tYXAocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9ycyk7XG4gIH1cblxuICBnZXRDdXN0b21lcnNXaXRoQ29udHJhY3QobG9jYXRpb25faWQpe1xuICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcbiAgICBoZWFkZXJzLmFwcGVuZChcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgaGVhZGVycy5hcHBlbmQoXCJBdXRob3JpemF0aW9uXCIsIFwiQmVhcmVyIFwiICsgQ29uZmlnLnRva2VuKTtcblxuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KENvbmZpZy5hcGlVcmwgKyBcImNvbnRyYWN0cy9jdXN0b21lcnMvXCIrbG9jYXRpb25faWQsIHtcbiAgICAgIGhlYWRlcnM6IGhlYWRlcnNcbiAgICB9KVxuICAgIC5tYXAocmVzID0+IHJlcy5qc29uKCkpXG4gICAgLm1hcChkYXRhID0+IHtcbiAgICAgIGxldCBjdXN0b21lckxpc3QgPSBuZXcgQXJyYXk8VXNlcj4oKTtcbiAgICAgIGRhdGEuZm9yRWFjaCgoY3VzdG9tZXIpID0+IHtcbiAgICAgICAgbGV0IGN1c3QgPSBuZXcgVXNlcigpO1xuICAgICAgICBjdXN0LmlkID0gY3VzdG9tZXIuY3VzdG9tZXJfaWQ7XG4gICAgICAgIGN1c3QubmFtZSA9IGN1c3RvbWVyLmN1c3RvbWVyX25hbWU7XG4gICAgICAgIGN1c3QudXNlcm5hbWUgPSBjdXN0b21lci5jdXN0b21lcl91c2VybmFtZTtcbiAgICAgICAgY3VzdC5lbWFpbCA9IGN1c3RvbWVyLmN1c3RvbWVyX2VtYWlsO1xuICAgICAgICBjdXN0b21lckxpc3QucHVzaChjdXN0KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGN1c3RvbWVyTGlzdDtcbiAgICB9KVxuICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9ycyk7XG4gIH1cblxuICBoYW5kbGVFcnJvcnMoZXJyb3I6IFJlc3BvbnNlLCkge1xuICAgIC8vIGNvbnNvbGUubG9nKFwiRXJyb3IgaW4gQ29udHJhY3QgU2VydmljZTogXCIrZXJyb3IpO1xuICAgIC8vIGNvbnNvbGUubG9nKFwiRXJyb3Igc3RhdHVzOiBcIitlcnJvci5zdGF0dXMpO1xuICAgIHJldHVybiBPYnNlcnZhYmxlLnRocm93KGVycm9yKTtcbiAgfVxufSJdfQ==