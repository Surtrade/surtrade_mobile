"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
// import { Contract } from "../../shared/contract/contract";
var user_service_1 = require("../../shared/user/user.service");
var appSettings = require("application-settings");
var CustomerDetailsComponent = (function () {
    function CustomerDetailsComponent(userService, route, router) {
        this.userService = userService;
        this.route = route;
        this.router = router;
        // Public variables
        this.title = "Customer: X";
        this.personal = [];
        this.recommendations = [];
        this.recommendations2 = [];
        // Semi-hard coding
        this.clothing = [];
        this.electronics = [];
        this.listsLoaded = false;
        this.isBusy = false;
    }
    CustomerDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isBusy = true;
        // this._location_id = parseInt(this.route.snapshot.params["location_id"]);
        this._customer_id = (this.route.snapshot.params["customer_id"]);
        // if (isAndroid) {
        //   application.android.on(AndroidApplication.activityBackPressedEvent, (data: AndroidActivityBackPressedEventData) => {
        //     this.goMainAgent();
        //   });
        // }
        try {
            this._agent_id = appSettings.getNumber("user_id");
            this._location_id = appSettings.getNumber("user_location_id");
        }
        catch (e) {
            this.goMainAgent();
        }
        // Get Customer's information
        this.isBusy = true;
        this.userService.getRecommendations(this._customer_id, this._location_id)
            .subscribe(function (response) {
            _this.isBusy = false;
            // for( var key in response.personal){
            //   if (response.personal.hasOwnProperty(key)) {
            //     // alert("Personal: Key is " + key + ", value is " + response.personal[key]);
            //     this.personal[key] = response.personal[key];
            //   }
            // }
            // // this.personal3 = response.personal;
            // for( var key in response.recommendations){
            //   if (response.recommendations.hasOwnProperty(key)) {
            //     this.recommendations[key] = response.recommendations[key];
            //     // alert("Recommendations: Key is " + key + ", value is " + this.recommendations[key]);
            //   }
            // }
            _this.personal = _this.toArray(response.personal);
            console.log(response.personal['name']);
            _this.title = "Customer " + response.personal['name'];
            _this.recommendations = _this.toArray(response.recommendations);
            _this.clothing = _this.toArray(response.recommendations.clothing);
            _this.electronics = _this.toArray(response.recommendations.electronics);
            // console.log(this.recommendations);
            _this.listsLoaded = true;
        }, function (error) {
            _this.goMainAgent();
        });
    };
    CustomerDetailsComponent.prototype.toArray = function (obj) {
        return Object.keys(obj).map(function (key) {
            var o = obj[key];
            // console.log("o: "+o);
            // if (typeof o == 'object'){
            //   console.log("object: "+o.length);
            //   o = this.toArray(o);
            // }
            return [String(key), o];
        });
    };
    CustomerDetailsComponent.prototype.goMainAgent = function () {
        this.router.navigate(["/main-agent"], {
            // animation: true,
            transition: {
                name: "slideRight",
                duration: 200,
                curve: "linear"
            }
        });
    };
    CustomerDetailsComponent = __decorate([
        core_1.Component({
            selector: "ns-customer-details",
            providers: [user_service_1.UserService],
            // moduleId: module.id,
            templateUrl: "./pages/customer-details/customer-details.html",
            styleUrls: ["./pages/customer-details/customer-details.css"]
        }),
        __metadata("design:paramtypes", [user_service_1.UserService,
            router_1.ActivatedRoute,
            router_2.RouterExtensions])
    ], CustomerDetailsComponent);
    return CustomerDetailsComponent;
}());
exports.CustomerDetailsComponent = CustomerDetailsComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tZXItZGV0YWlscy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjdXN0b21lci1kZXRhaWxzLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF5RTtBQUN6RSwwQ0FBaUQ7QUFDakQsc0RBQStEO0FBUy9ELDZEQUE2RDtBQUM3RCwrREFBNkQ7QUFFN0QsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFTbEQ7SUFtQkksa0NBQ1ksV0FBd0IsRUFDeEIsS0FBcUIsRUFDckIsTUFBd0I7UUFGeEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsVUFBSyxHQUFMLEtBQUssQ0FBZ0I7UUFDckIsV0FBTSxHQUFOLE1BQU0sQ0FBa0I7UUFoQnBDLG1CQUFtQjtRQUNaLFVBQUssR0FBVyxhQUFhLENBQUM7UUFDOUIsYUFBUSxHQUFnQixFQUFFLENBQUM7UUFDM0Isb0JBQWUsR0FBZSxFQUFFLENBQUM7UUFDakMscUJBQWdCLEdBQWdCLEVBQUUsQ0FBQztRQUMxQyxtQkFBbUI7UUFDWixhQUFRLEdBQWdCLEVBQUUsQ0FBQztRQUMzQixnQkFBVyxHQUFnQixFQUFFLENBQUM7UUFJOUIsZ0JBQVcsR0FBRyxLQUFLLENBQUM7UUFPeEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQztJQUVELDJDQUFRLEdBQVI7UUFBQSxpQkF1REM7UUF0REMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFFbkIsMkVBQTJFO1FBQzNFLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUVoRSxtQkFBbUI7UUFDbkIseUhBQXlIO1FBQ3pILDBCQUEwQjtRQUMxQixRQUFRO1FBQ1IsSUFBSTtRQUVKLElBQUcsQ0FBQztZQUNGLElBQUksQ0FBQyxT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QkFBYztZQUNiLHlCQUFnQjtPQXRCM0Isd0JBQXdCLENBMEdwQztJQUFELCtCQUFDO0NBQUEsQUExR0QsSUEwR0M7QUExR1ksNERBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcbmltcG9ydCB7IFJvdXRlckV4dGVuc2lvbnMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQgeyBTd2l0Y2ggfSBmcm9tIFwidWkvc3dpdGNoXCI7XG5cbmltcG9ydCAqIGFzIGFwcGxpY2F0aW9uIGZyb20gJ2FwcGxpY2F0aW9uJztcbmltcG9ydCB7IEFuZHJvaWRBcHBsaWNhdGlvbiwgQW5kcm9pZEFjdGl2aXR5QmFja1ByZXNzZWRFdmVudERhdGEgfSBmcm9tIFwiYXBwbGljYXRpb25cIjtcbmltcG9ydCB7IGlzQW5kcm9pZCB9IGZyb20gXCJwbGF0Zm9ybVwiO1xuXG5pbXBvcnQgeyBVc2VyIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC91c2VyL3VzZXJcIjtcblxuLy8gaW1wb3J0IHsgQ29udHJhY3QgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2NvbnRyYWN0L2NvbnRyYWN0XCI7XG5pbXBvcnQgeyBVc2VyU2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvdXNlci91c2VyLnNlcnZpY2VcIjtcblxudmFyIGFwcFNldHRpbmdzID0gcmVxdWlyZShcImFwcGxpY2F0aW9uLXNldHRpbmdzXCIpO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogXCJucy1jdXN0b21lci1kZXRhaWxzXCIsXG4gICAgcHJvdmlkZXJzOiBbVXNlclNlcnZpY2VdLFxuICAgIC8vIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9wYWdlcy9jdXN0b21lci1kZXRhaWxzL2N1c3RvbWVyLWRldGFpbHMuaHRtbFwiLFxuICAgIHN0eWxlVXJsczpbXCIuL3BhZ2VzL2N1c3RvbWVyLWRldGFpbHMvY3VzdG9tZXItZGV0YWlscy5jc3NcIl0gXG59KVxuZXhwb3J0IGNsYXNzIEN1c3RvbWVyRGV0YWlsc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gICAgLy8gUHJpdmF0ZSB2YXJpYWJsZXNcbiAgICBwcml2YXRlIF9sb2NhdGlvbl9pZDogTnVtYmVyO1xuICAgIHByaXZhdGUgX2N1c3RvbWVyX2lkOiBOdW1iZXI7XG4gICAgcHJpdmF0ZSBfYWdlbnRfaWQ6IE51bWJlcjtcblxuICAgIC8vIFB1YmxpYyB2YXJpYWJsZXNcbiAgICBwdWJsaWMgdGl0bGU6IFN0cmluZyA9IFwiQ3VzdG9tZXI6IFhcIjtcbiAgICBwdWJsaWMgcGVyc29uYWwgOiBBcnJheTxhbnk+ID0gW107XG4gICAgcHVibGljIHJlY29tbWVuZGF0aW9uczogQXJyYXk8YW55PiA9IFtdO1xuICAgIHB1YmxpYyByZWNvbW1lbmRhdGlvbnMyIDogQXJyYXk8YW55PiA9IFtdO1xuICAgIC8vIFNlbWktaGFyZCBjb2RpbmdcbiAgICBwdWJsaWMgY2xvdGhpbmcgOiBBcnJheTxhbnk+ID0gW107XG4gICAgcHVibGljIGVsZWN0cm9uaWNzIDogQXJyYXk8YW55PiA9IFtdO1xuXG4gICAgLy8gRmxhZ3NcbiAgICBwdWJsaWMgaXNCdXN5OiBib29sZWFuO1xuICAgIHB1YmxpYyBsaXN0c0xvYWRlZCA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgdXNlclNlcnZpY2U6IFVzZXJTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSxcbiAgICAgICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlckV4dGVuc2lvbnNcbiAgICApIHsgXG4gICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgIHRoaXMuaXNCdXN5ID0gdHJ1ZTtcbiAgICAgIFxuICAgICAgLy8gdGhpcy5fbG9jYXRpb25faWQgPSBwYXJzZUludCh0aGlzLnJvdXRlLnNuYXBzaG90LnBhcmFtc1tcImxvY2F0aW9uX2lkXCJdKTtcbiAgICAgIHRoaXMuX2N1c3RvbWVyX2lkID0gKHRoaXMucm91dGUuc25hcHNob3QucGFyYW1zW1wiY3VzdG9tZXJfaWRcIl0pO1xuXG4gICAgICAvLyBpZiAoaXNBbmRyb2lkKSB7XG4gICAgICAvLyAgIGFwcGxpY2F0aW9uLmFuZHJvaWQub24oQW5kcm9pZEFwcGxpY2F0aW9uLmFjdGl2aXR5QmFja1ByZXNzZWRFdmVudCwgKGRhdGE6IEFuZHJvaWRBY3Rpdml0eUJhY2tQcmVzc2VkRXZlbnREYXRhKSA9PiB7XG4gICAgICAvLyAgICAgdGhpcy5nb01haW5BZ2VudCgpO1xuICAgICAgLy8gICB9KTtcbiAgICAgIC8vIH1cblxuICAgICAgdHJ5e1xuICAgICAgICB0aGlzLl9hZ2VudF9pZCA9IGFwcFNldHRpbmdzLmdldE51bWJlcihcInVzZXJfaWRcIik7XG4gICAgICAgIHRoaXMuX2xvY2F0aW9uX2lkID0gYXBwU2V0dGluZ3MuZ2V0TnVtYmVyKFwidXNlcl9sb2NhdGlvbl9pZFwiKTtcbiAgICAgIH1jYXRjaChlKXtcbiAgICAgICAgdGhpcy5nb01haW5BZ2VudCgpO1xuICAgICAgfSAgIFxuXG4gICAgICAvLyBHZXQgQ3VzdG9tZXIncyBpbmZvcm1hdGlvblxuICAgICAgdGhpcy5pc0J1c3kgPSB0cnVlO1xuICAgICAgdGhpcy51c2VyU2VydmljZS5nZXRSZWNvbW1lbmRhdGlvbnModGhpcy5fY3VzdG9tZXJfaWQsIHRoaXMuX2xvY2F0aW9uX2lkKSAgICAgXG4gICAgICAgIC5zdWJzY3JpYmUocmVzcG9uc2UgPT4ge1xuICAgICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgICAgLy8gZm9yKCB2YXIga2V5IGluIHJlc3BvbnNlLnBlcnNvbmFsKXtcbiAgICAgICAgICAvLyAgIGlmIChyZXNwb25zZS5wZXJzb25hbC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgLy8gICAgIC8vIGFsZXJ0KFwiUGVyc29uYWw6IEtleSBpcyBcIiArIGtleSArIFwiLCB2YWx1ZSBpcyBcIiArIHJlc3BvbnNlLnBlcnNvbmFsW2tleV0pO1xuICAgICAgICAgIC8vICAgICB0aGlzLnBlcnNvbmFsW2tleV0gPSByZXNwb25zZS5wZXJzb25hbFtrZXldO1xuICAgICAgICAgIC8vICAgfVxuICAgICAgICAgIC8vIH1cbiAgICAgICAgICAvLyAvLyB0aGlzLnBlcnNvbmFsMyA9IHJlc3BvbnNlLnBlcnNvbmFsO1xuICAgICAgICAgIC8vIGZvciggdmFyIGtleSBpbiByZXNwb25zZS5yZWNvbW1lbmRhdGlvbnMpe1xuICAgICAgICAgIC8vICAgaWYgKHJlc3BvbnNlLnJlY29tbWVuZGF0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgLy8gICAgIHRoaXMucmVjb21tZW5kYXRpb25zW2tleV0gPSByZXNwb25zZS5yZWNvbW1lbmRhdGlvbnNba2V5XTtcbiAgICAgICAgICAvLyAgICAgLy8gYWxlcnQoXCJSZWNvbW1lbmRhdGlvbnM6IEtleSBpcyBcIiArIGtleSArIFwiLCB2YWx1ZSBpcyBcIiArIHRoaXMucmVjb21tZW5kYXRpb25zW2tleV0pO1xuICAgICAgICAgIC8vICAgfVxuICAgICAgICAgIC8vIH1cbiAgICAgICAgICBcbiAgICAgICAgICBcblxuICAgICAgICAgIHRoaXMucGVyc29uYWwgPSB0aGlzLnRvQXJyYXkocmVzcG9uc2UucGVyc29uYWwpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnBlcnNvbmFsWyduYW1lJ10pO1xuICAgICAgICAgIHRoaXMudGl0bGUgPSBcIkN1c3RvbWVyIFwiK3Jlc3BvbnNlLnBlcnNvbmFsWyduYW1lJ10gXG5cbiAgICAgICAgICB0aGlzLnJlY29tbWVuZGF0aW9ucyA9IHRoaXMudG9BcnJheShyZXNwb25zZS5yZWNvbW1lbmRhdGlvbnMpO1xuICAgICAgICAgIHRoaXMuY2xvdGhpbmcgPSB0aGlzLnRvQXJyYXkocmVzcG9uc2UucmVjb21tZW5kYXRpb25zLmNsb3RoaW5nKTtcbiAgICAgICAgICB0aGlzLmVsZWN0cm9uaWNzID0gdGhpcy50b0FycmF5KHJlc3BvbnNlLnJlY29tbWVuZGF0aW9ucy5lbGVjdHJvbmljcyk7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5yZWNvbW1lbmRhdGlvbnMpO1xuICAgICAgICAgIFxuICAgICAgICAgIHRoaXMubGlzdHNMb2FkZWQgPSB0cnVlO1xuICAgICAgICB9LGVycm9yID0+IHtcbiAgICAgICAgICB0aGlzLmdvTWFpbkFnZW50KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICBcbiAgICB9XG5cbiAgICBwcml2YXRlIHRvQXJyYXkob2JqKXtcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyhvYmopLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgdmFyIG8gPSBvYmpba2V5XVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIm86IFwiK28pO1xuICAgICAgICAvLyBpZiAodHlwZW9mIG8gPT0gJ29iamVjdCcpe1xuICAgICAgICAvLyAgIGNvbnNvbGUubG9nKFwib2JqZWN0OiBcIitvLmxlbmd0aCk7XG4gICAgICAgIC8vICAgbyA9IHRoaXMudG9BcnJheShvKTtcbiAgICAgICAgLy8gfVxuICAgICAgICByZXR1cm4gW1N0cmluZyhrZXkpLCBvXTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBnb01haW5BZ2VudCgpe1xuICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL21haW4tYWdlbnRcIl0sIHtcbiAgICAgICAgICAvLyBhbmltYXRpb246IHRydWUsXG4gICAgICAgICAgdHJhbnNpdGlvbjoge1xuICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlUmlnaHRcIixcbiAgICAgICAgICAgICAgZHVyYXRpb246IDIwMCxcbiAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn0iXX0=