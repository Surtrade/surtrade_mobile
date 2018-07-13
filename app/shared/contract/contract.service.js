"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Rx_1 = require("rxjs/Rx");
// import { isEnabled, enableLocationRequest, getCurrentLocation, watchLocation, distance, clearWatch } from "nativescript-geolocation";
var config_1 = require("../config");
var user_1 = require("../user/user");
var ContractService = /** @class */ (function () {
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
    ContractService.prototype.getActiveContract = function (customer_id, location_id) {
        if (location_id === void 0) { location_id = 0; }
        var headers = new http_1.Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + config_1.Config.token);
        // console.log("customer: "+ customer_id+", loc: "+location_id);
        var data = {
            customer_id: customer_id
        };
        if (location_id != 0) {
            data["location_id"] = location_id;
        }
        console.log("creating contract.. location: " + location_id);
        console.log("data: " + JSON.stringify(data));
        return this.http.post(config_1.Config.apiUrl + "contracts/active", JSON.stringify(data), { headers: headers })
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJhY3Quc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbnRyYWN0LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkM7QUFDM0Msc0NBQXdEO0FBQ3hELDhCQUFxQztBQUNyQyx3SUFBd0k7QUFFeEksb0NBQW1DO0FBRW5DLHFDQUFvQztBQUdwQztJQUNFLHlCQUFvQixJQUFVO1FBQVYsU0FBSSxHQUFKLElBQUksQ0FBTTtJQUFFLENBQUM7SUFJakMscUNBQVcsR0FBWCxVQUFZLFdBQVc7UUFDckIsSUFBSSxPQUFPLEdBQUcsSUFBSSxjQUFPLEVBQUUsQ0FBQztRQUM1QixPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQ25ELE9BQU8sQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLFNBQVMsR0FBRyxlQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFMUQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGVBQU0sQ0FBQyxNQUFNLEdBQUcsWUFBWSxHQUFDLFdBQVcsRUFBRTtZQUM3RCxPQUFPLEVBQUUsT0FBTztTQUNqQixDQUFDO2FBQ0QsR0FBRyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFWLENBQVUsQ0FBQzthQUN0QixLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCwyQ0FBaUIsR0FBakIsVUFBa0IsV0FBVyxFQUFHLFdBQWE7UUFBYiw0QkFBQSxFQUFBLGVBQWE7UUFDM0MsSUFBSSxPQUFPLEdBQUcsSUFBSSxjQUFPLEVBQUUsQ0FBQztRQUM1QixPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQ25ELE9BQU8sQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLFNBQVMsR0FBRyxlQUFNLENBQUMsS0FBSyxD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R0QsSUEwR0M7QUExR1ksMENBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IEh0dHAsIEhlYWRlcnMsIFJlc3BvbnNlIH0gZnJvbSBcIkBhbmd1bGFyL2h0dHBcIjtcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tIFwicnhqcy9SeFwiO1xuLy8gaW1wb3J0IHsgaXNFbmFibGVkLCBlbmFibGVMb2NhdGlvblJlcXVlc3QsIGdldEN1cnJlbnRMb2NhdGlvbiwgd2F0Y2hMb2NhdGlvbiwgZGlzdGFuY2UsIGNsZWFyV2F0Y2ggfSBmcm9tIFwibmF0aXZlc2NyaXB0LWdlb2xvY2F0aW9uXCI7XG5cbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuLi9jb25maWdcIjtcbmltcG9ydCB7IENvbnRyYWN0IH0gZnJvbSBcIi4vY29udHJhY3RcIjtcbmltcG9ydCB7IFVzZXIgfSBmcm9tIFwiLi4vdXNlci91c2VyXCI7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDb250cmFjdFNlcnZpY2Uge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHApe31cblxuICBwcml2YXRlIF9jb250cmFjdDogQ29udHJhY3Q7XG5cbiAgZ2V0Q29udHJhY3QobG9jYXRpb25faWQpe1xuICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcbiAgICBoZWFkZXJzLmFwcGVuZChcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgaGVhZGVycy5hcHBlbmQoXCJBdXRob3JpemF0aW9uXCIsIFwiQmVhcmVyIFwiICsgQ29uZmlnLnRva2VuKTtcblxuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KENvbmZpZy5hcGlVcmwgKyBcImNvbnRyYWN0cy9cIitsb2NhdGlvbl9pZCwge1xuICAgICAgaGVhZGVyczogaGVhZGVyc1xuICAgIH0pXG4gICAgLm1hcChyZXMgPT4gcmVzLmpzb24oKSlcbiAgICAuY2F0Y2godGhpcy5oYW5kbGVFcnJvcnMpO1xuICB9XG5cbiAgZ2V0QWN0aXZlQ29udHJhY3QoY3VzdG9tZXJfaWQgLCBsb2NhdGlvbl9pZD0wKXtcbiAgICBsZXQgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XG4gICAgaGVhZGVycy5hcHBlbmQoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgIGhlYWRlcnMuYXBwZW5kKFwiQXV0aG9yaXphdGlvblwiLCBcIkJlYXJlciBcIiArIENvbmZpZy50b2tlbik7XG5cbiAgICAvLyBjb25zb2xlLmxvZyhcImN1c3RvbWVyOiBcIisgY3VzdG9tZXJfaWQrXCIsIGxvYzogXCIrbG9jYXRpb25faWQpO1xuICAgIGxldCBkYXRhID0ge1xuICAgICAgY3VzdG9tZXJfaWQ6IGN1c3RvbWVyX2lkXG4gICAgfVxuICAgIGlmIChsb2NhdGlvbl9pZCAhPSAwKXtcbiAgICAgIGRhdGFbXCJsb2NhdGlvbl9pZFwiXSA9IGxvY2F0aW9uX2lkO1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKFwiY3JlYXRpbmcgY29udHJhY3QuLiBsb2NhdGlvbjogXCIrbG9jYXRpb25faWQpO1xuICAgIGNvbnNvbGUubG9nKFwiZGF0YTogXCIrSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KFxuICAgICAgQ29uZmlnLmFwaVVybCArIFwiY29udHJhY3RzL2FjdGl2ZVwiLCBcbiAgICAgIEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAge2hlYWRlcnM6IGhlYWRlcnN9KVxuICAgICAgLm1hcChyZXMgPT4gcmVzLmpzb24oKVswXSlcbiAgICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9ycyk7XG4gIH1cblxuICBjcmVhdGVDb250cmFjdChjb250cmFjdERhdGEpe1xuICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcbiAgICBoZWFkZXJzLmFwcGVuZChcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgaGVhZGVycy5hcHBlbmQoXCJBdXRob3JpemF0aW9uXCIsIFwiQmVhcmVyIFwiICsgQ29uZmlnLnRva2VuKTtcbiAgICAvLyBjb25zb2xlLmxvZyhcIkF0dGVtcHRpbmcgdG8gY3JlYXRlIGEgY29udHJhY3QuXCIpO1xuICAgIC8vIGNvbnNvbGUubG9nKFwiaW4gQ29udHJhY3Qgc2VydmljZVwiKTtcbiAgICAvLyBjb25zb2xlLmxvZyhcIkNvbnRyYWN0IGRhdGEgZXhwaXJlOiBcIisgY29udHJhY3REYXRhLmV4cGlyZSk7XG4gICAgLy8gY29uc29sZS5sb2coXCJDb250cmFjdCBkYXRhIG9wdGlvbnMgZXhwaXJlX21ldGhvZDogXCIrIGNvbnRyYWN0RGF0YS5vcHRpb25zLnRvU3RyaW5nKCkpO1xuXG4gICAgLy8gY29uc29sZS5sb2coXCJjb250cmFjdCBkYXRhOiBcIitKU09OLnN0cmluZ2lmeShjb250cmFjdERhdGEpKTtcblxuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChcbiAgICAgIENvbmZpZy5hcGlVcmwgKyBcImNvbnRyYWN0c1wiLFxuICAgICAgSlNPTi5zdHJpbmdpZnkoY29udHJhY3REYXRhKSxcbiAgICAgIHsgaGVhZGVyczogaGVhZGVycyB9XG4gICAgKVxuICAgIC5tYXAocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9ycyk7XG4gIH1cblxuICBnZXRDdXN0b21lcnNXaXRoQ29udHJhY3QobG9jYXRpb25faWQpe1xuICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcbiAgICBoZWFkZXJzLmFwcGVuZChcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgaGVhZGVycy5hcHBlbmQoXCJBdXRob3JpemF0aW9uXCIsIFwiQmVhcmVyIFwiICsgQ29uZmlnLnRva2VuKTtcblxuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KENvbmZpZy5hcGlVcmwgKyBcImNvbnRyYWN0cy9jdXN0b21lcnMvXCIrbG9jYXRpb25faWQsIHtcbiAgICAgIGhlYWRlcnM6IGhlYWRlcnNcbiAgICB9KVxuICAgIC5tYXAocmVzID0+IHJlcy5qc29uKCkpXG4gICAgLm1hcChkYXRhID0+IHtcbiAgICAgIGxldCBjdXN0b21lckxpc3QgPSBuZXcgQXJyYXk8VXNlcj4oKTtcbiAgICAgIGRhdGEuZm9yRWFjaCgoY3VzdG9tZXIpID0+IHtcbiAgICAgICAgbGV0IGN1c3QgPSBuZXcgVXNlcigpO1xuICAgICAgICBjdXN0LmlkID0gY3VzdG9tZXIuY3VzdG9tZXJfaWQ7XG4gICAgICAgIGN1c3QubmFtZSA9IGN1c3RvbWVyLmN1c3RvbWVyX25hbWU7XG4gICAgICAgIGN1c3QudXNlcm5hbWUgPSBjdXN0b21lci5jdXN0b21lcl91c2VybmFtZTtcbiAgICAgICAgY3VzdC5lbWFpbCA9IGN1c3RvbWVyLmN1c3RvbWVyX2VtYWlsO1xuICAgICAgICBjdXN0b21lckxpc3QucHVzaChjdXN0KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGN1c3RvbWVyTGlzdDtcbiAgICB9KVxuICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9ycyk7XG4gIH1cblxuICBleHBpcmVDb250cmFjdChsb2NhdGlvbl9pZCwgY3VzdG9tZXJfaWQpe1xuICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcbiAgICBoZWFkZXJzLmFwcGVuZChcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgaGVhZGVycy5hcHBlbmQoXCJBdXRob3JpemF0aW9uXCIsIFwiQmVhcmVyIFwiICsgQ29uZmlnLnRva2VuKTtcbiAgICBcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QoXG4gICAgICBDb25maWcuYXBpVXJsICsgXCJjb250cmFjdHMvZXhwaXJlXCIsIFxuICAgICAgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBcImN1c3RvbWVyX2lkXCI6IGN1c3RvbWVyX2lkLFxuICAgICAgICBcImxvY2F0aW9uX2lkXCI6IGxvY2F0aW9uX2lkXG4gICAgICB9KSxcbiAgICAgIHtoZWFkZXJzOiBoZWFkZXJzfSlcbiAgICAgIC5tYXAocmVzID0+IHJlcy5qc29uKClbMF0pXG4gICAgICAuY2F0Y2godGhpcy5oYW5kbGVFcnJvcnMpO1xuICB9XG5cbiAgaGFuZGxlRXJyb3JzKGVycm9yOiBSZXNwb25zZSwpIHtcbiAgICAvLyBjb25zb2xlLmxvZyhcIkVycm9yIGluIENvbnRyYWN0IFNlcnZpY2U6IFwiK2Vycm9yKTtcbiAgICAvLyBjb25zb2xlLmxvZyhcIkVycm9yIHN0YXR1czogXCIrZXJyb3Iuc3RhdHVzKTtcbiAgICByZXR1cm4gT2JzZXJ2YWJsZS50aHJvdyhlcnJvcik7XG4gIH1cbn0iXX0=