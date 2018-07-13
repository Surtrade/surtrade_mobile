"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
// import { Contract } from "../../shared/contract/contract";
// import { UserService } from '../../shared/user/user.service';
var contract_service_1 = require("../../shared/contract/contract.service");
var application = require("application");
var application_1 = require("application");
var platform_1 = require("platform");
var appSettings = require("application-settings");
var MainAgentComponent = /** @class */ (function () {
    function MainAgentComponent(route, router, contractService) {
        this.route = route;
        this.router = router;
        this.contractService = contractService;
        this.customerList = [];
        //flags
        this.isBusy = false;
        this.listLoaded = false;
        this.noContracts = false;
    }
    MainAgentComponent.prototype.ngOnInit = function () {
        var _this = this;
        try {
            // Return to login if app settings are not set
            if (!appSettings.hasKey("user_name") || !appSettings.hasKey("user_location_id")) {
                // alert("Logout in if");
                this.router.navigate(["/"], { clearHistory: true });
                this.logout();
            }
            this._agent_id = appSettings.getNumber("user_id");
            this._agent_location = appSettings.getNumber("user_location_id");
        }
        catch (e) {
            // alert("logout in catch");
            this.logout();
        }
        if (platform_1.isAndroid) {
            application.android.on(application_1.AndroidApplication.activityBackPressedEvent, function (data) {
                // this.logout();
            });
        }
        this.title = "Welcome agent: " + appSettings.getString("user_name");
        this.isBusy = true;
        this.contractService.getCustomersWithContract(this._agent_location)
            .subscribe(function (response) {
            _this.isBusy = false;
            _this.customerList = response;
            _this.listLoaded = true;
            // console.log(this.customers[0].name);
            // response.forEach(customer => {
            //   this.customers.push(customer);
            // })
        }, function (error) {
            _this.isBusy = false;
            if (error.status == 404) {
                _this.noContracts = true;
            }
            else {
                alert("Error getting active contract information: " + error);
            }
        });
    };
    MainAgentComponent.prototype.customerDetails = function (customer_id) {
        this.router.navigate(["/customer-details", customer_id], {
            // animation: true,
            transition: {
                name: "slideLeft",
                duration: 200,
                curve: "linear"
            }
        });
        // alert("Showing details of customer: "+customer_id);
    };
    MainAgentComponent.prototype.logout = function () {
        appSettings.remove("user_name");
        appSettings.remove("user_password");
        this.router.navigate(["/"], { clearHistory: true });
    };
    MainAgentComponent = __decorate([
        core_1.Component({
            selector: "main-agent",
            providers: [contract_service_1.ContractService],
            templateUrl: "pages/main-agent/main-agent.html",
            styleUrls: ["pages/main-agent/main-agent-common.css"]
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute,
            router_2.RouterExtensions,
            contract_service_1.ContractService])
    ], MainAgentComponent);
    return MainAgentComponent;
}());
exports.MainAgentComponent = MainAgentComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi1hZ2VudC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYWluLWFnZW50LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFrRDtBQUNsRCwwQ0FBaUQ7QUFDakQsc0RBQStEO0FBRy9ELDZEQUE2RDtBQUU3RCxnRUFBZ0U7QUFDaEUsMkVBQXlFO0FBRXpFLHlDQUEyQztBQUMzQywyQ0FBc0Y7QUFDdEYscUNBQXFDO0FBRXJDLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBU2xEO0lBY0UsNEJBQ1UsS0FBcUIsRUFDckIsTUFBd0IsRUFDeEIsZUFBZ0M7UUFGaEMsVUFBSyxHQUFMLEtBQUssQ0FBZ0I7UUFDckIsV0FBTSxHQUFOLE1BQU0sQ0FBa0I7UUFDeEIsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBVm5DLGlCQUFZLEdBQWdCLEVBQUUsQ0FBQztRQUV0QyxPQUFPO1FBQ0EsV0FBTSxHQUFHLEtBQUssQ0FBQztRQUNmLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFDbkIsZ0JBQVcsR0FBRyxLQUFLLENBQUM7SUFPM0IsQ0FBQztJQUVELHFDQUFRLEdBQVI7UUFBQSxpQkE2Q0M7UUE1Q0MsSUFBRyxDQUFDO1lBQ0YsOENBQThDO1lBQzlDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFBLENBQUM7Z0JBQy9FLHlCQUF5QjtnQkFDekIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO2dCQUNwRCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDaEIsQ0FBQztZQUVELElBQUksQ0FBQyxTQUFTLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNsRCxJQUFJLENBQUMsZUFBZSxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUNuRSxDQUFDO1FBQUEsS0FBSyxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUEsQ0FBQztZQUNSLDRCQUE0QjtZQUM1QixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDaEIsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLG9CQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ1osV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsZ0NBQWtCLENBQUMsd0JBQXdCLEVBQUUsVUFBQyxJQUF5QztnQkFDNUcsaUJBQWlCO1lBRW5CLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVILElBQUksQ0FBQyxLQUFLLEdBQUcsaUJBQWlCLEdBQUUsV0FBVyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUVuRSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUNuQixJQUFJLENBQUMsZUFBZSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxlQUFlLENBQUM7YUFDaEUsU0FBUyxDQUFDLFVBQUEsUUFBUTtZQUNqQixLQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztZQUNwQixLQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQztZQUM3QixLQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUN2Qix1Q0FBdUM7WUFDdkMsaUNBQWlDO1lBQ2pDLG1DQUFtQztZQUNuQyxLQUFLO1FBQ1AsQ0FBQyxFQUFDLFVBQUEsS0FBSztZQUNMLEtBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1lBQ3BCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLENBQUEsQ0FBQztnQkFFdkIsS0FBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDMUIsQ0FBQztZQUFBLElBQUksQ0FBQSxDQUFDO2dCQUNKLEtBQUssQ0FBQyw2Q0FBNkMsR0FBQyxLQUFLLENBQUMsQ0FBQztZQUM3RCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFUCxDQUFDO0lBRU0sNENBQWUsR0FBdEIsVUFBdUIsV0FBVztRQUNoQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLG1CQUFtQixFQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQ3RELG1CQUFtQjtZQUNuQixVQUFVLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLFdBQVc7Z0JBQ2pCLFFBQVEsRUFBRSxHQUFHO2dCQUNiLEtBQUssRUFBRSxRQUFRO2FBQ2xCO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsc0RBQXNEO0lBQ3hELENBQUM7SUFFTSxtQ0FBTSxHQUFiO1FBQ0UsV0FBVyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNoQyxXQUFXLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBRXBDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBckZVLGtCQUFrQjtRQVA5QixnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLFlBQVk7WUFDdEIsU0FBUyxFQUFFLENBQUMsa0NBQWUsQ0FBQztZQUM1QixXQUFXLEVBQUUsa0NBQWtDO1lBQy9DLFNBQVMsRUFBQyxDQUFDLHdDQUF3QyxDQUFDO1NBQ3ZELENBQUM7eUNBaUJpQix1QkFBYztZQUNiLHlCQUFnQjtZQUNQLGtDQUFlO09BakIvQixrQkFBa0IsQ0F1RjlCO0lBQUQseUJBQUM7Q0FBQSxBQXZGRCxJQXVGQztBQXZGWSxnREFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcbmltcG9ydCB7IFJvdXRlckV4dGVuc2lvbnMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XG5cbmltcG9ydCB7IFVzZXIgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3VzZXIvdXNlclwiO1xuLy8gaW1wb3J0IHsgQ29udHJhY3QgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2NvbnRyYWN0L2NvbnRyYWN0XCI7XG5cbi8vIGltcG9ydCB7IFVzZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2hhcmVkL3VzZXIvdXNlci5zZXJ2aWNlJztcbmltcG9ydCB7IENvbnRyYWN0U2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvY29udHJhY3QvY29udHJhY3Quc2VydmljZVwiO1xuXG5pbXBvcnQgKiBhcyBhcHBsaWNhdGlvbiBmcm9tICdhcHBsaWNhdGlvbic7XG5pbXBvcnQgeyBBbmRyb2lkQXBwbGljYXRpb24sIEFuZHJvaWRBY3Rpdml0eUJhY2tQcmVzc2VkRXZlbnREYXRhIH0gZnJvbSBcImFwcGxpY2F0aW9uXCI7XG5pbXBvcnQgeyBpc0FuZHJvaWQgfSBmcm9tIFwicGxhdGZvcm1cIjtcblxudmFyIGFwcFNldHRpbmdzID0gcmVxdWlyZShcImFwcGxpY2F0aW9uLXNldHRpbmdzXCIpO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogXCJtYWluLWFnZW50XCIsXG4gICAgcHJvdmlkZXJzOiBbQ29udHJhY3RTZXJ2aWNlXSxcbiAgICB0ZW1wbGF0ZVVybDogXCJwYWdlcy9tYWluLWFnZW50L21haW4tYWdlbnQuaHRtbFwiLFxuICAgIHN0eWxlVXJsczpbXCJwYWdlcy9tYWluLWFnZW50L21haW4tYWdlbnQtY29tbW9uLmNzc1wiXSBcbn0pXG5cbmV4cG9ydCBjbGFzcyBNYWluQWdlbnRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXR7XG4vLyBwcml2YXRlIHZhcmlhYmxlc1xuICBwcml2YXRlIF9hZ2VudF9pZDogTnVtYmVyO1xuICBwcml2YXRlIF9hZ2VudF9sb2NhdGlvbjogTnVtYmVyO1xuXG4gIC8vIHB1YmxpYyB2YXJpYWJsZXNcbiAgcHVibGljIHRpdGxlOiBzdHJpbmc7XG4gIHB1YmxpYyBjdXN0b21lckxpc3Q6IEFycmF5PFVzZXI+ID0gW107XG5cbiAgLy9mbGFnc1xuICBwdWJsaWMgaXNCdXN5ID0gZmFsc2U7XG4gIHB1YmxpYyBsaXN0TG9hZGVkID0gZmFsc2U7XG4gIHB1YmxpYyBub0NvbnRyYWN0cyA9IGZhbHNlO1xuICBcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByb3V0ZTogQWN0aXZhdGVkUm91dGUsXG4gICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlckV4dGVuc2lvbnMsXG4gICAgcHJpdmF0ZSBjb250cmFjdFNlcnZpY2U6IENvbnRyYWN0U2VydmljZSl7XG5cbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRyeXtcbiAgICAgIC8vIFJldHVybiB0byBsb2dpbiBpZiBhcHAgc2V0dGluZ3MgYXJlIG5vdCBzZXRcbiAgICAgIGlmICghYXBwU2V0dGluZ3MuaGFzS2V5KFwidXNlcl9uYW1lXCIpIHx8ICFhcHBTZXR0aW5ncy5oYXNLZXkoXCJ1c2VyX2xvY2F0aW9uX2lkXCIpKXtcbiAgICAgICAgLy8gYWxlcnQoXCJMb2dvdXQgaW4gaWZcIik7XG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9cIl0sIHsgY2xlYXJIaXN0b3J5OiB0cnVlIH0pO1xuICAgICAgICB0aGlzLmxvZ291dCgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9hZ2VudF9pZCA9IGFwcFNldHRpbmdzLmdldE51bWJlcihcInVzZXJfaWRcIik7XG4gICAgICB0aGlzLl9hZ2VudF9sb2NhdGlvbiA9IGFwcFNldHRpbmdzLmdldE51bWJlcihcInVzZXJfbG9jYXRpb25faWRcIik7XG4gICAgfWNhdGNoKGUpe1xuICAgICAgLy8gYWxlcnQoXCJsb2dvdXQgaW4gY2F0Y2hcIik7XG4gICAgICB0aGlzLmxvZ291dCgpO1xuICAgIH0gXG5cbiAgICBpZiAoaXNBbmRyb2lkKSB7XG4gICAgICAgIGFwcGxpY2F0aW9uLmFuZHJvaWQub24oQW5kcm9pZEFwcGxpY2F0aW9uLmFjdGl2aXR5QmFja1ByZXNzZWRFdmVudCwgKGRhdGE6IEFuZHJvaWRBY3Rpdml0eUJhY2tQcmVzc2VkRXZlbnREYXRhKSA9PiB7XG4gICAgICAgICAgLy8gdGhpcy5sb2dvdXQoKTtcblxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgIHRoaXMudGl0bGUgPSBcIldlbGNvbWUgYWdlbnQ6IFwiKyBhcHBTZXR0aW5ncy5nZXRTdHJpbmcoXCJ1c2VyX25hbWVcIik7ICAgIFxuXG4gICAgdGhpcy5pc0J1c3kgPSB0cnVlO1xuICAgIHRoaXMuY29udHJhY3RTZXJ2aWNlLmdldEN1c3RvbWVyc1dpdGhDb250cmFjdCh0aGlzLl9hZ2VudF9sb2NhdGlvbilcbiAgICAgIC5zdWJzY3JpYmUocmVzcG9uc2UgPT4ge1xuICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmN1c3RvbWVyTGlzdCA9IHJlc3BvbnNlO1xuICAgICAgICB0aGlzLmxpc3RMb2FkZWQgPSB0cnVlO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmN1c3RvbWVyc1swXS5uYW1lKTtcbiAgICAgICAgLy8gcmVzcG9uc2UuZm9yRWFjaChjdXN0b21lciA9PiB7XG4gICAgICAgIC8vICAgdGhpcy5jdXN0b21lcnMucHVzaChjdXN0b21lcik7XG4gICAgICAgIC8vIH0pXG4gICAgICB9LGVycm9yID0+IHtcbiAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgaWYgKGVycm9yLnN0YXR1cyA9PSA0MDQpe1xuICAgICAgICAgIFxuICAgICAgICAgIHRoaXMubm9Db250cmFjdHMgPSB0cnVlO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICBhbGVydChcIkVycm9yIGdldHRpbmcgYWN0aXZlIGNvbnRyYWN0IGluZm9ybWF0aW9uOiBcIitlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gIH1cblxuICBwdWJsaWMgY3VzdG9tZXJEZXRhaWxzKGN1c3RvbWVyX2lkKXtcbiAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvY3VzdG9tZXItZGV0YWlsc1wiLGN1c3RvbWVyX2lkXSwge1xuICAgICAgLy8gYW5pbWF0aW9uOiB0cnVlLFxuICAgICAgdHJhbnNpdGlvbjoge1xuICAgICAgICAgIG5hbWU6IFwic2xpZGVMZWZ0XCIsXG4gICAgICAgICAgZHVyYXRpb246IDIwMCxcbiAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxuICAgICAgfVxuICAgIH0pO1xuICAgIC8vIGFsZXJ0KFwiU2hvd2luZyBkZXRhaWxzIG9mIGN1c3RvbWVyOiBcIitjdXN0b21lcl9pZCk7XG4gIH1cblxuICBwdWJsaWMgbG9nb3V0KCl7XG4gICAgYXBwU2V0dGluZ3MucmVtb3ZlKFwidXNlcl9uYW1lXCIpO1xuICAgIGFwcFNldHRpbmdzLnJlbW92ZShcInVzZXJfcGFzc3dvcmRcIik7XG5cbiAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvXCJdLCB7IGNsZWFySGlzdG9yeTogdHJ1ZSB9KTtcbiAgfVxuXG59Il19