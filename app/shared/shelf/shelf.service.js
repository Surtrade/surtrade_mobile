"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Rx_1 = require("rxjs/Rx");
var config_1 = require("../config");
var shelf_1 = require("./shelf");
var appSettings = require("application-settings");
var ShelfService = /** @class */ (function () {
    function ShelfService(http) {
        this.http = http;
        console.log("In Shelf Service Constructor");
    }
    // this method calls the API and receives a list of all beacons
    ShelfService.prototype.getShelves = function () {
        var headers = new http_1.Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + config_1.Config.token);
        return this.http.get(config_1.Config.apiUrl + "shelves", {
            headers: headers
        })
            .map(function (res) { return res.json(); })
            .map(function (data) {
            var shelvesList = new Array();
            data.forEach(function (shelf) {
                var shelfObj = new shelf_1.Shelf(shelf.code, shelf.beacon);
                shelfObj.id = shelf.id;
                shelfObj.code = shelf.role;
                shelfObj.beacon = shelf.beacon;
                shelfObj.active = shelf.active;
                shelfObj.keywords = shelf.keywords;
                shelfObj.created_dt = shelf.created_dt;
                var products = [];
                shelf.products.forEach(function (product) {
                    var productObj = new shelf_1.Product(product.code, product.name, product.description);
                    productObj.keywords = product.keywords;
                    productObj.image = product.image;
                    productObj.video = product.video;
                    productObj.remark = product.remark;
                    products.push(productObj);
                });
                shelfObj.products = products;
            });
            return shelvesList;
        })
            .catch(this.handleErrors);
    };
    ShelfService.prototype.getShelf = function (beacon) {
        var headers = new http_1.Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + config_1.Config.token);
        return this.http.get(config_1.Config.apiUrl + "shelves/beacon/" + beacon, {
            headers: headers
        })
            .map(function (res) { return res.json(); })
            .map(function (shelf) {
            var shelfObj = new shelf_1.Shelf(shelf.code, shelf.beacon);
            shelfObj.id = shelf.id;
            shelfObj.code = shelf.code;
            shelfObj.beacon = shelf.beacon;
            shelfObj.active = shelf.active;
            shelfObj.keywords = shelf.keywords;
            shelfObj.created_dt = shelf.created_dt;
            var products = [];
            shelf.products.forEach(function (product) {
                var productObj = new shelf_1.Product(product.code, product.name, product.description);
                productObj.keywords = product.keywords;
                productObj.image = product.image;
                productObj.video = product.video;
                productObj.remark = product.remark;
                products.push(productObj);
            });
            shelfObj.products = products;
            return shelfObj;
        })
            .catch(this.handleErrors);
    };
    ShelfService.prototype.handleErrors = function (error) {
        // var err = new Error(error)
        console.log("in Shelf Service: " + error);
        console.log("Type of error: " + error.type);
        // return Promise.reject(error);
        return Rx_1.Observable.throw(error);
        // throw error;
        // return error;
    };
    ShelfService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http])
    ], ShelfService);
    return ShelfService;
}());
exports.ShelfService = ShelfService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlbGYuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNoZWxmLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkM7QUFDM0Msc0NBQXdEO0FBQ3hELDhCQUFxQztBQUVyQyxvQ0FBbUM7QUFDbkMsaUNBQXlDO0FBRXpDLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBR2xEO0lBRUUsc0JBQ1UsSUFBVTtRQUFWLFNBQUksR0FBSixJQUFJLENBQU07UUFFbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFHRCwrREFBK0Q7SUFDL0QsaUNBQVUsR0FBVjtRQUNFLElBQUksT0FBTyxHQUFHLElBQUksY0FBTyxFQUFFLENBQUM7UUFDNUIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUNuRCxPQUFPLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxTQUFTLEdBQUcsZUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTFELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxlQUFNLENBQUMsTUFBTSxHQUFHLFNBQVMsRUFBRTtZQUM5QyxPQUFPLEVBQUUsT0FBTztTQUNqQixDQUFDO2FBQ0QsR0FBRyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFWLENBQVUsQ0FBQzthQUN0QixHQUFHLENBQUMsVUFBQSxJQUFJO1lBQ1AsSUFBSSxXQUFXLEdBQUcsSUFBSSxLQUFLLEVBQVMsQ0FBQztZQUNyQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztnQkFDakIsSUFBSSxRQUFRLEdBQUcsSUFBSSxhQUFLLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ25ELFFBQVEsQ0FBQyxFQUFF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LFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO2dCQUN2QyxVQUFVLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7Z0JBQ2pDLFVBQVUsQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztnQkFDakMsVUFBVSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO2dCQUVuQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzlCLENBQUMsQ0FBQyxDQUFDO1lBQ0gsUUFBUSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7WUFFN0IsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUVwQixDQUFDLENBQUM7YUFDRCxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCxtQ0FBWSxHQUFaLFVBQWEsS0FBZTtRQUMxQiw2QkFBNkI7UUFDN0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsR0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4QyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixHQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxQyxnQ0FBZ0M7UUFDaEMsTUFBTSxDQUFDLGVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDL0IsZUFBZTtRQUNmLGdCQUFnQjtJQUNsQixDQUFDO0lBakdVLFlBQVk7UUFEeEIsaUJBQVUsRUFBRTt5Q0FJSyxXQUFJO09BSFQsWUFBWSxDQWtHeEI7SUFBRCxtQkFBQztDQUFBLEFBbEdELElBa0dDO0FBbEdZLG9DQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBIdHRwLCBIZWFkZXJzLCBSZXNwb25zZSB9IGZyb20gXCJAYW5ndWxhci9odHRwXCI7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSBcInJ4anMvUnhcIjtcblxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4uL2NvbmZpZ1wiO1xuaW1wb3J0IHsgU2hlbGYsIFByb2R1Y3QgfSBmcm9tIFwiLi9zaGVsZlwiO1xuXG52YXIgYXBwU2V0dGluZ3MgPSByZXF1aXJlKFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIik7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTaGVsZlNlcnZpY2Uge1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgaHR0cDogSHR0cCwgXG4gICl7XG4gICAgY29uc29sZS5sb2coXCJJbiBTaGVsZiBTZXJ2aWNlIENvbnN0cnVjdG9yXCIpO1xuICB9XG4gIFxuXG4gIC8vIHRoaXMgbWV0aG9kIGNhbGxzIHRoZSBBUEkgYW5kIHJlY2VpdmVzIGEgbGlzdCBvZiBhbGwgYmVhY29uc1xuICBnZXRTaGVsdmVzKCl7XG4gICAgbGV0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuICAgIGhlYWRlcnMuYXBwZW5kKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICBoZWFkZXJzLmFwcGVuZChcIkF1dGhvcml6YXRpb25cIiwgXCJCZWFyZXIgXCIgKyBDb25maWcudG9rZW4pO1xuXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoQ29uZmlnLmFwaVVybCArIFwic2hlbHZlc1wiLCB7XG4gICAgICBoZWFkZXJzOiBoZWFkZXJzXG4gICAgfSlcbiAgICAubWFwKHJlcyA9PiByZXMuanNvbigpKVxuICAgIC5tYXAoZGF0YSA9PiB7XG4gICAgICBsZXQgc2hlbHZlc0xpc3QgPSBuZXcgQXJyYXk8U2hlbGY+KCk7XG4gICAgICBkYXRhLmZvckVhY2goKHNoZWxmKSA9PiB7XG4gICAgICAgIGxldCBzaGVsZk9iaiA9IG5ldyBTaGVsZihzaGVsZi5jb2RlLCBzaGVsZi5iZWFjb24pO1xuICAgICAgICBzaGVsZk9iai5pZCA9IHNoZWxmLmlkO1xuICAgICAgICBzaGVsZk9iai5jb2RlID0gc2hlbGYucm9sZTtcbiAgICAgICAgc2hlbGZPYmouYmVhY29uID0gc2hlbGYuYmVhY29uO1xuICAgICAgICBzaGVsZk9iai5hY3RpdmUgPSBzaGVsZi5hY3RpdmU7XG4gICAgICAgIHNoZWxmT2JqLmtleXdvcmRzID0gc2hlbGYua2V5d29yZHM7XG4gICAgICAgIHNoZWxmT2JqLmNyZWF0ZWRfZHQgPSBzaGVsZi5jcmVhdGVkX2R0O1xuXG4gICAgICAgIGxldCBwcm9kdWN0cyA9IFtdXG5cbiAgICAgICAgc2hlbGYucHJvZHVjdHMuZm9yRWFjaChwcm9kdWN0ID0+IHtcbiAgICAgICAgICAgIGxldCBwcm9kdWN0T2JqID0gbmV3IFByb2R1Y3QocHJvZHVjdC5jb2RlLHByb2R1Y3QubmFtZSwgcHJvZHVjdC5kZXNjcmlwdGlvbik7XG4gICAgICAgICAgICBwcm9kdWN0T2JqLmtleXdvcmRzID0gcHJvZHVjdC5rZXl3b3JkcztcbiAgICAgICAgICAgIHByb2R1Y3RPYmouaW1hZ2UgPSBwcm9kdWN0LmltYWdlO1xuICAgICAgICAgICAgcHJvZHVjdE9iai52aWRlbyA9IHByb2R1Y3QudmlkZW87XG4gICAgICAgICAgICBwcm9kdWN0T2JqLnJlbWFyayA9IHByb2R1Y3QucmVtYXJrO1xuXG4gICAgICAgICAgICBwcm9kdWN0cy5wdXNoKHByb2R1Y3RPYmopO1xuICAgICAgICB9KTtcblxuICAgICAgICBzaGVsZk9iai5wcm9kdWN0cyA9IHByb2R1Y3RzO1xuXG4gICAgICAgIFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gc2hlbHZlc0xpc3Q7XG4gICAgfSlcbiAgICAuY2F0Y2godGhpcy5oYW5kbGVFcnJvcnMpO1xuICB9XG5cbiAgZ2V0U2hlbGYoYmVhY29uKXtcbiAgICBsZXQgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XG4gICAgaGVhZGVycy5hcHBlbmQoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgIGhlYWRlcnMuYXBwZW5kKFwiQXV0aG9yaXphdGlvblwiLCBcIkJlYXJlciBcIiArIENvbmZpZy50b2tlbik7XG4gICAgXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoQ29uZmlnLmFwaVVybCArIFwic2hlbHZlcy9iZWFjb24vXCIrYmVhY29uLCB7XG4gICAgICBoZWFkZXJzOiBoZWFkZXJzXG4gICAgfSlcbiAgICAubWFwKHJlcyA9PiByZXMuanNvbigpKVxuICAgIC5tYXAoc2hlbGYgID0+IHtcbiAgICBcbiAgICAgICAgbGV0IHNoZWxmT2JqID0gbmV3IFNoZWxmKHNoZWxmLmNvZGUsIHNoZWxmLmJlYWNvbik7XG4gICAgICAgIHNoZWxmT2JqLmlkID0gc2hlbGYuaWQ7XG4gICAgICAgIHNoZWxmT2JqLmNvZGUgPSBzaGVsZi5jb2RlO1xuICAgICAgICBzaGVsZk9iai5iZWFjb24gPSBzaGVsZi5iZWFjb247XG4gICAgICAgIHNoZWxmT2JqLmFjdGl2ZSA9IHNoZWxmLmFjdGl2ZTtcbiAgICAgICAgc2hlbGZPYmoua2V5d29yZHMgPSBzaGVsZi5rZXl3b3JkcztcblxuICAgICAgICBzaGVsZk9iai5jcmVhdGVkX2R0ID0gc2hlbGYuY3JlYXRlZF9kdDtcbiAgICAgICAgbGV0IHByb2R1Y3RzID0gW11cblxuICAgICAgICBzaGVsZi5wcm9kdWN0cy5mb3JFYWNoKHByb2R1Y3QgPT4ge1xuICAgICAgICAgICAgbGV0IHByb2R1Y3RPYmogPSBuZXcgUHJvZHVjdChwcm9kdWN0LmNvZGUscHJvZHVjdC5uYW1lLCBwcm9kdWN0LmRlc2NyaXB0aW9uKTtcbiAgICAgICAgICAgIHByb2R1Y3RPYmoua2V5d29yZHMgPSBwcm9kdWN0LmtleXdvcmRzO1xuICAgICAgICAgICAgcHJvZHVjdE9iai5pbWFnZSA9IHByb2R1Y3QuaW1hZ2U7XG4gICAgICAgICAgICBwcm9kdWN0T2JqLnZpZGVvID0gcHJvZHVjdC52aWRlbztcbiAgICAgICAgICAgIHByb2R1Y3RPYmoucmVtYXJrID0gcHJvZHVjdC5yZW1hcms7XG5cbiAgICAgICAgICAgIHByb2R1Y3RzLnB1c2gocHJvZHVjdE9iaik7XG4gICAgICAgIH0pO1xuICAgICAgICBzaGVsZk9iai5wcm9kdWN0cyA9IHByb2R1Y3RzO1xuXG4gICAgICAgIHJldHVybiBzaGVsZk9iajtcblxuICAgIH0pXG4gICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3JzKTsgXG4gIH1cblxuICBoYW5kbGVFcnJvcnMoZXJyb3I6IFJlc3BvbnNlLCkge1xuICAgIC8vIHZhciBlcnIgPSBuZXcgRXJyb3IoZXJyb3IpXG4gICAgY29uc29sZS5sb2coXCJpbiBTaGVsZiBTZXJ2aWNlOiBcIitlcnJvcik7XG4gICAgY29uc29sZS5sb2coXCJUeXBlIG9mIGVycm9yOiBcIitlcnJvci50eXBlKTtcbiAgICAvLyByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICAgIHJldHVybiBPYnNlcnZhYmxlLnRocm93KGVycm9yKTtcbiAgICAvLyB0aHJvdyBlcnJvcjtcbiAgICAvLyByZXR1cm4gZXJyb3I7XG4gIH1cbn0iXX0=