"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
var Toast = require("nativescript-toast");
// import { Contract } from "../../shared/contract/contract";
var contract_service_1 = require("../../shared/contract/contract.service");
// import { LocationDatabaseService } from '../../shared/location/location.db.service';
var beacon_db_service_1 = require("../../shared/beacon/beacon.db.service");
var appSettings = require("application-settings");
var ContractComponent = (function () {
    function ContractComponent(contractService, route, router, 
        // private locationDatabaseService: LocationDatabaseService
        beaconDatabaseService) {
        this.contractService = contractService;
        this.route = route;
        this.router = router;
        this.beaconDatabaseService = beaconDatabaseService;
        this.title = "Welcome to Narnia";
        this.expireByTime = "OFF";
        this.etc = false;
        this.autoauthorize = "ON";
        this.aac = true;
        this.behaviourTracking = "ON";
        this.bht = true;
        //  this._contract = null;
        this.isBusy = false;
        this.isSettings = false;
        this.minutes = 10;
        // console.log("init time: "+this.minutes);
    }
    ContractComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._location_id = parseInt(this.route.snapshot.params["location_id"]);
        this.isSettings = (this.route.snapshot.params["settings"]);
        // console.log("is settings: "+this.isSettings);
        // alert("Wait for it.. with location id: "+this._location_id);
        // this.locationDatabaseService.selectLocation(this._location_id)
        // this.title = "At "+this.locationDatabaseService.selectLocation(this._location_id)[1];
        this.title = "At " + this.beaconDatabaseService.selectBeaconByLocation(this._location_id)[6] + " store";
        // alert("stuff:"+ this.locationDatabaseService.selectLocation(this._location_id)[1]);
        // if (isAndroid) {
        //   application.android.on(AndroidApplication.activityBackPressedEvent, (data: AndroidActivityBackPressedEventData) => {
        //     this.goMain();
        //   });
        // }
        try {
            this._customer_id = appSettings.getNumber("user_id");
        }
        catch (e) {
            this._customer_id = 0;
        }
        if (this.isSettings == true) {
            this.isBusy = true;
            console.log("in settings");
            this.contractService.getActiveContract(this._location_id, this._customer_id)
                .subscribe(function (responseContract) {
                if (!responseContract.message && responseContract.status != undefined) {
                    console.log("no message :), status: " + responseContract.status);
                    if (!responseContract.auto_authorize) {
                        _this.autoauthorize = "OFF";
                        _this.aac = false;
                    }
                    if (responseContract.options.expire_method == 'time') {
                        _this.expireByTime = "ON";
                        _this.etc = true;
                    }
                    // alert(responseContract.options.behaviour_tracking);
                    if (responseContract.options.behaviour_tracking == false) {
                        _this.behaviourTracking = "OFF";
                        _this.bht = false;
                    }
                    // alert(responseContract.options.behaviour_tracking);
                }
                else {
                    console.log("message:" + responseContract.message);
                    // alert("Contract expired.");
                    _this.goMain();
                }
                _this.isBusy = false;
            }, function (error) {
                console.log("error in contract");
                if (error.status != 404) {
                    alert("Error getting active contract information: " + error);
                }
                _this.isBusy = false;
                _this.goMain();
            });
        }
    };
    ContractComponent.prototype.expireByTimeEvent = function (args) {
        var switchBox = args.object;
        if (switchBox.checked) {
            this.expireByTime = "ON";
        }
        else {
            this.expireByTime = "OFF";
        }
    };
    ContractComponent.prototype.autoauthorizeEvent = function (args) {
        var switchBox = args.object;
        if (switchBox.checked) {
            this.autoauthorize = "ON";
        }
        else {
            this.autoauthorize = "OFF";
        }
    };
    ContractComponent.prototype.behaviourTrackingEvent = function (args) {
        var switchBox = args.object;
        if (switchBox.checked) {
            this.behaviourTracking = "ON";
        }
        else {
            this.behaviourTracking = "OFF";
            // alert("off");
        }
    };
    ContractComponent.prototype.createContract = function () {
        var _this = this;
        this.isBusy = true;
        var auto_authorize;
        if (this.autoauthorize == "ON")
            auto_authorize = true;
        else
            auto_authorize = false;
        var options = {
            "expire_method": "",
            "behaviour_tracking": true
        };
        var expire_method = "location";
        if (this.expireByTime == "ON") {
            expire_method = "time";
        }
        options.expire_method = expire_method;
        var behaviour_tracking = true;
        if (this.behaviourTracking == "OFF") {
            behaviour_tracking = false;
            // alert('it is off');
        }
        options.behaviour_tracking = behaviour_tracking;
        // alert(options.behaviour_tracking)
        var contractData = {
            "location_id": this._location_id,
            "auto_authorize": auto_authorize,
            // "expire": this.time.minutes,
            "expire": this.minutes,
            "options": options
        };
        // alert(contractData.options.behaviour_tracking)
        this.contractService.createContract(contractData)
            .subscribe(function (response) {
            _this.isBusy = false;
            Toast.makeText("Contract created succesfully!").show();
            _this.goMain();
        }, function (error) {
            _this.isBusy = false;
            alert("Error creating the contract: " + error);
            _this.goMain();
            // throw new Error(error);
        });
    };
    ContractComponent.prototype.expireContract = function () {
        var _this = this;
        this.isBusy = true;
        console.log("in settings");
        this.contractService.expireContract(this._location_id, this._customer_id)
            .subscribe(function (responseContract) {
            _this.isBusy = false;
            // alert("Contract expired succesfully!");
            Toast.makeText("Contract expired succesfully!").show();
            _this.goMain();
        }, function (error) {
            console.log("error in contract");
            if (error.status != 404) {
                alert("Error expiring the contract: " + error);
            }
            _this.isBusy = false;
            _this.goMain();
        });
    };
    ContractComponent.prototype.cancel = function () {
        this.goMain();
    };
    ContractComponent.prototype.goMain = function () {
        this.router.navigate(["/main"], {
            // animation: true,
            transition: {
                name: "slideRight",
                duration: 200,
                curve: "linear"
            }
        });
    };
    ContractComponent = __decorate([
        core_1.Component({
            selector: "ns-contract",
            // providers: [ContractService,LocationDatabaseService],
            providers: [contract_service_1.ContractService, beacon_db_service_1.BeaconDatabaseService],
            // moduleId: module.id,
            templateUrl: "./pages/contract/contract.html",
            styleUrls: ["./pages/contract/contract.css"]
        }),
        __metadata("design:paramtypes", [contract_service_1.ContractService,
            router_1.ActivatedRoute,
            router_2.RouterExtensions,
            beacon_db_service_1.BeaconDatabaseService])
    ], ContractComponent);
    return ContractComponent;
}());
exports.ContractComponent = ContractComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJhY3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29udHJhY3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXlFO0FBQ3pFLDBDQUFpRDtBQUNqRCxzREFBK0Q7QUFFL0QsMENBQTRDO0FBTTVDLDZEQUE2RDtBQUM3RCwyRUFBeUU7QUFDekUsdUZBQXVGO0FBQ3ZGLDJFQUE4RTtBQUU5RSxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQVVsRDtJQW1CSSwyQkFDWSxlQUFnQyxFQUNoQyxLQUFxQixFQUNyQixNQUF3QjtRQUNoQywyREFBMkQ7UUFDbkQscUJBQTRDO1FBSjVDLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUNoQyxVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQUNyQixXQUFNLEdBQU4sTUFBTSxDQUFrQjtRQUV4QiwwQkFBcUIsR0FBckIscUJBQXFCLENBQXVCO1FBWGpELFVBQUssR0FBVyxtQkFBbUIsQ0FBQztRQWF6QyxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztRQUMxQixJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQTtRQUNoQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUMxQixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO1FBQzlCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO1FBR2hCLDBCQUEwQjtRQUN6QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNwQixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztRQUV6QixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNsQiwyQ0FBMkM7SUFDN0MsQ0FBQztJQUVELG9DQUFRLEdBQVI7UUFBQSxpQkFnRUM7UUEvREMsSUFBSSxDQUFDLFlBQVks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QUFDO0lBQ1AsQ0FBQztJQUVNLGtDQUFNLEdBQWI7UUFDRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVNLGtDQUFNLEdBQWI7UUFDRSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQzVCLG1CQUFtQjtZQUNuQixVQUFVLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLFlBQVk7Z0JBQ2xCLFFBQVEsRUFBRSxHQUFHO2dCQUNiLEtBQUssRUFBRSxRQUFRO2FBQ2xCO1NBQ0YsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQXpOUSxpQkFBaUI7UUFSN0IsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxhQUFhO1lBQ3ZCLHdEQUF3RDtZQUN4RCxTQUFTLEVBQUUsQ0FBQyxrQ0FBZSxFQUFFLHlDQUFxQixDQUFDO1lBQ25ELHVCQUF1QjtZQUN2QixXQUFXLEVBQUUsZ0NBQWdDO1lBQzdDLFNBQVMsRUFBQyxDQUFDLCtCQUErQixDQUFDO1NBQzlDLENBQUM7eUNBcUIrQixrQ0FBZTtZQUN6Qix1QkFBYztZQUNiLHlCQUFnQjtZQUVELHlDQUFxQjtPQXhCL0MsaUJBQWlCLENBME43QjtJQUFELHdCQUFDO0NBQUEsQUExTkQsSUEwTkM7QUExTlksOENBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcbmltcG9ydCB7IFJvdXRlckV4dGVuc2lvbnMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQgeyBTd2l0Y2ggfSBmcm9tIFwidWkvc3dpdGNoXCI7XG5pbXBvcnQgKiBhcyBUb2FzdCBmcm9tICduYXRpdmVzY3JpcHQtdG9hc3QnO1xuXG5pbXBvcnQgKiBhcyBhcHBsaWNhdGlvbiBmcm9tICdhcHBsaWNhdGlvbic7XG5pbXBvcnQgeyBBbmRyb2lkQXBwbGljYXRpb24sIEFuZHJvaWRBY3Rpdml0eUJhY2tQcmVzc2VkRXZlbnREYXRhIH0gZnJvbSBcImFwcGxpY2F0aW9uXCI7XG5pbXBvcnQgeyBpc0FuZHJvaWQgfSBmcm9tIFwicGxhdGZvcm1cIjtcblxuLy8gaW1wb3J0IHsgQ29udHJhY3QgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2NvbnRyYWN0L2NvbnRyYWN0XCI7XG5pbXBvcnQgeyBDb250cmFjdFNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2NvbnRyYWN0L2NvbnRyYWN0LnNlcnZpY2VcIjtcbi8vIGltcG9ydCB7IExvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2hhcmVkL2xvY2F0aW9uL2xvY2F0aW9uLmRiLnNlcnZpY2UnO1xuaW1wb3J0IHsgQmVhY29uRGF0YWJhc2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2hhcmVkL2JlYWNvbi9iZWFjb24uZGIuc2VydmljZSc7XG5cbnZhciBhcHBTZXR0aW5ncyA9IHJlcXVpcmUoXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiKTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwibnMtY29udHJhY3RcIixcbiAgICAvLyBwcm92aWRlcnM6IFtDb250cmFjdFNlcnZpY2UsTG9jYXRpb25EYXRhYmFzZVNlcnZpY2VdLFxuICAgIHByb3ZpZGVyczogW0NvbnRyYWN0U2VydmljZSwgQmVhY29uRGF0YWJhc2VTZXJ2aWNlXSxcbiAgICAvLyBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICAgIHRlbXBsYXRlVXJsOiBcIi4vcGFnZXMvY29udHJhY3QvY29udHJhY3QuaHRtbFwiLFxuICAgIHN0eWxlVXJsczpbXCIuL3BhZ2VzL2NvbnRyYWN0L2NvbnRyYWN0LmNzc1wiXSBcbn0pXG5leHBvcnQgY2xhc3MgQ29udHJhY3RDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIHByaXZhdGUgX2xvY2F0aW9uX2lkOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBfY3VzdG9tZXJfaWQ6IG51bWJlcjtcbiAgICAvLyBwcml2YXRlIF9jb250cmFjdDogQ29udHJhY3Q7XG5cbiAgICBtaW51dGVzOiBudW1iZXI7XG4gICAgZXhwaXJlQnlUaW1lOiBzdHJpbmc7XG4gICAgYXV0b2F1dGhvcml6ZTogc3RyaW5nO1xuICAgIGJlaGF2aW91clRyYWNraW5nOiBzdHJpbmc7XG5cbiAgICBwdWJsaWMgYWFjOiBib29sZWFuO1xuICAgIHB1YmxpYyBldGM6IGJvb2xlYW47XG4gICAgcHVibGljIGJodDogYm9vbGVhbjtcbiAgICBwdWJsaWMgdGl0bGU6IHN0cmluZyA9IFwiV2VsY29tZSB0byBOYXJuaWFcIjtcblxuXG4gICAgaXNCdXN5OiBib29sZWFuO1xuICAgIGlzU2V0dGluZ3M6IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBjb250cmFjdFNlcnZpY2U6IENvbnRyYWN0U2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSByb3V0ZTogQWN0aXZhdGVkUm91dGUsXG4gICAgICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXJFeHRlbnNpb25zLFxuICAgICAgICAvLyBwcml2YXRlIGxvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlOiBMb2NhdGlvbkRhdGFiYXNlU2VydmljZVxuICAgICAgICBwcml2YXRlIGJlYWNvbkRhdGFiYXNlU2VydmljZTogQmVhY29uRGF0YWJhc2VTZXJ2aWNlXG4gICAgKSB7IFxuICAgICAgdGhpcy5leHBpcmVCeVRpbWUgPSBcIk9GRlwiO1xuICAgICAgdGhpcy5ldGMgPSBmYWxzZVxuICAgICAgdGhpcy5hdXRvYXV0aG9yaXplID0gXCJPTlwiO1xuICAgICAgdGhpcy5hYWMgPSB0cnVlOyAgXG4gICAgICB0aGlzLmJlaGF2aW91clRyYWNraW5nID0gXCJPTlwiO1xuICAgICAgdGhpcy5iaHQgPSB0cnVlOyBcbiAgICAgICBcbiAgICAgICBcbiAgICAgIC8vICB0aGlzLl9jb250cmFjdCA9IG51bGw7XG4gICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICB0aGlzLmlzU2V0dGluZ3MgPSBmYWxzZTtcblxuICAgICAgdGhpcy5taW51dGVzID0gMTA7XG4gICAgICAvLyBjb25zb2xlLmxvZyhcImluaXQgdGltZTogXCIrdGhpcy5taW51dGVzKTtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgIHRoaXMuX2xvY2F0aW9uX2lkID0gcGFyc2VJbnQodGhpcy5yb3V0ZS5zbmFwc2hvdC5wYXJhbXNbXCJsb2NhdGlvbl9pZFwiXSk7XG4gICAgICB0aGlzLmlzU2V0dGluZ3MgPSAodGhpcy5yb3V0ZS5zbmFwc2hvdC5wYXJhbXNbXCJzZXR0aW5nc1wiXSk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhcImlzIHNldHRpbmdzOiBcIit0aGlzLmlzU2V0dGluZ3MpO1xuXG4gICAgICAvLyBhbGVydChcIldhaXQgZm9yIGl0Li4gd2l0aCBsb2NhdGlvbiBpZDogXCIrdGhpcy5fbG9jYXRpb25faWQpO1xuICAgICAgXG4gICAgICAvLyB0aGlzLmxvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlLnNlbGVjdExvY2F0aW9uKHRoaXMuX2xvY2F0aW9uX2lkKVxuICAgICAgLy8gdGhpcy50aXRsZSA9IFwiQXQgXCIrdGhpcy5sb2NhdGlvbkRhdGFiYXNlU2VydmljZS5zZWxlY3RMb2NhdGlvbih0aGlzLl9sb2NhdGlvbl9pZClbMV07XG4gICAgICB0aGlzLnRpdGxlID0gXCJBdCBcIit0aGlzLmJlYWNvbkRhdGFiYXNlU2VydmljZS5zZWxlY3RCZWFjb25CeUxvY2F0aW9uKHRoaXMuX2xvY2F0aW9uX2lkKVs2XStcIiBzdG9yZVwiO1xuICAgICAgLy8gYWxlcnQoXCJzdHVmZjpcIisgdGhpcy5sb2NhdGlvbkRhdGFiYXNlU2VydmljZS5zZWxlY3RMb2NhdGlvbih0aGlzLl9sb2NhdGlvbl9pZClbMV0pO1xuXG4gICAgICAvLyBpZiAoaXNBbmRyb2lkKSB7XG4gICAgICAvLyAgIGFwcGxpY2F0aW9uLmFuZHJvaWQub24oQW5kcm9pZEFwcGxpY2F0aW9uLmFjdGl2aXR5QmFja1ByZXNzZWRFdmVudCwgKGRhdGE6IEFuZHJvaWRBY3Rpdml0eUJhY2tQcmVzc2VkRXZlbnREYXRhKSA9PiB7XG4gICAgICAvLyAgICAgdGhpcy5nb01haW4oKTtcbiAgICAgIC8vICAgfSk7XG4gICAgICAvLyB9XG5cbiAgICAgIHRyeXtcbiAgICAgICAgdGhpcy5fY3VzdG9tZXJfaWQgPSBhcHBTZXR0aW5ncy5nZXROdW1iZXIoXCJ1c2VyX2lkXCIpO1xuICAgICAgfWNhdGNoKGUpe1xuICAgICAgICB0aGlzLl9jdXN0b21lcl9pZCA9IDA7XG4gICAgICB9ICAgXG5cbiAgICAgIFxuICAgICAgaWYgKHRoaXMuaXNTZXR0aW5ncyA9PSB0cnVlKXtcbiAgICAgICAgdGhpcy5pc0J1c3kgPSB0cnVlO1xuICAgICAgICBjb25zb2xlLmxvZyhcImluIHNldHRpbmdzXCIpO1xuICAgICAgICB0aGlzLmNvbnRyYWN0U2VydmljZS5nZXRBY3RpdmVDb250cmFjdCh0aGlzLl9sb2NhdGlvbl9pZCwgdGhpcy5fY3VzdG9tZXJfaWQpXG4gICAgICAgICAgLnN1YnNjcmliZShyZXNwb25zZUNvbnRyYWN0ID0+IHtcbiAgICAgICAgICAgIGlmICghcmVzcG9uc2VDb250cmFjdC5tZXNzYWdlICYmIHJlc3BvbnNlQ29udHJhY3Quc3RhdHVzICE9IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm8gbWVzc2FnZSA6KSwgc3RhdHVzOiBcIityZXNwb25zZUNvbnRyYWN0LnN0YXR1cyk7XG4gICAgICAgICAgICAgIGlmKCFyZXNwb25zZUNvbnRyYWN0LmF1dG9fYXV0aG9yaXplKXtcbiAgICAgICAgICAgICAgICB0aGlzLmF1dG9hdXRob3JpemUgPSBcIk9GRlwiO1xuICAgICAgICAgICAgICAgIHRoaXMuYWFjID0gZmFsc2U7ICBcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmKHJlc3BvbnNlQ29udHJhY3Qub3B0aW9ucy5leHBpcmVfbWV0aG9kID09ICd0aW1lJyl7XG4gICAgICAgICAgICAgICAgdGhpcy5leHBpcmVCeVRpbWUgPSBcIk9OXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5ldGMgPSB0cnVlO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgLy8gYWxlcnQocmVzcG9uc2VDb250cmFjdC5vcHRpb25zLmJlaGF2aW91cl90cmFja2luZyk7XG4gICAgICAgICAgICAgIGlmKHJlc3BvbnNlQ29udHJhY3Qub3B0aW9ucy5iZWhhdmlvdXJfdHJhY2tpbmcgPT0gZmFsc2Upe1xuICAgICAgICAgICAgICAgIHRoaXMuYmVoYXZpb3VyVHJhY2tpbmcgPSBcIk9GRlwiO1xuICAgICAgICAgICAgICAgIHRoaXMuYmh0ID0gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLy8gYWxlcnQocmVzcG9uc2VDb250cmFjdC5vcHRpb25zLmJlaGF2aW91cl90cmFja2luZyk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJtZXNzYWdlOlwiK3Jlc3BvbnNlQ29udHJhY3QubWVzc2FnZSk7XG4gICAgICAgICAgICAgIC8vIGFsZXJ0KFwiQ29udHJhY3QgZXhwaXJlZC5cIik7XG4gICAgICAgICAgICAgIHRoaXMuZ29NYWluKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICAgIH0sZXJyb3IgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciBpbiBjb250cmFjdFwiKTtcbiAgICAgICAgICAgIGlmIChlcnJvci5zdGF0dXMgIT0gNDA0KXtcbiAgICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBnZXR0aW5nIGFjdGl2ZSBjb250cmFjdCBpbmZvcm1hdGlvbjogXCIrZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuZ29NYWluKCk7XG4gICAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICB9XG5cbiAgIHB1YmxpYyBleHBpcmVCeVRpbWVFdmVudChhcmdzKSB7XG4gICAgICAgIGxldCBzd2l0Y2hCb3ggPSA8U3dpdGNoPmFyZ3Mub2JqZWN0O1xuICAgICAgICBpZiAoc3dpdGNoQm94LmNoZWNrZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZXhwaXJlQnlUaW1lID0gXCJPTlwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5leHBpcmVCeVRpbWUgPSBcIk9GRlwiO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGF1dG9hdXRob3JpemVFdmVudChhcmdzKSB7XG4gICAgICAgIGxldCBzd2l0Y2hCb3ggPSA8U3dpdGNoPmFyZ3Mub2JqZWN0O1xuICAgICAgICBpZiAoc3dpdGNoQm94LmNoZWNrZWQpIHtcbiAgICAgICAgICAgIHRoaXMuYXV0b2F1dGhvcml6ZSA9IFwiT05cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYXV0b2F1dGhvcml6ZSA9IFwiT0ZGXCI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYmVoYXZpb3VyVHJhY2tpbmdFdmVudChhcmdzKSB7XG4gICAgICBsZXQgc3dpdGNoQm94ID0gPFN3aXRjaD5hcmdzLm9iamVjdDtcbiAgICAgIGlmIChzd2l0Y2hCb3guY2hlY2tlZCkge1xuICAgICAgICAgIHRoaXMuYmVoYXZpb3VyVHJhY2tpbmcgPSBcIk9OXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuYmVoYXZpb3VyVHJhY2tpbmcgPSBcIk9GRlwiO1xuICAgICAgICAgIC8vIGFsZXJ0KFwib2ZmXCIpO1xuICAgICAgfVxuICB9XG5cbiAgICBjcmVhdGVDb250cmFjdCgpe1xuICAgICAgdGhpcy5pc0J1c3kgPSB0cnVlO1xuICAgICAgbGV0IGF1dG9fYXV0aG9yaXplO1xuICAgICAgaWYgKHRoaXMuYXV0b2F1dGhvcml6ZSA9PSBcIk9OXCIpXG4gICAgICAgIGF1dG9fYXV0aG9yaXplID0gdHJ1ZTtcbiAgICAgIGVsc2VcbiAgICAgICAgYXV0b19hdXRob3JpemUgPSBmYWxzZTtcbiAgICAgIFxuICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgIFwiZXhwaXJlX21ldGhvZFwiOlwiXCIsXG4gICAgICAgIFwiYmVoYXZpb3VyX3RyYWNraW5nXCI6dHJ1ZVxuICAgICAgfTtcblxuICAgICAgbGV0IGV4cGlyZV9tZXRob2QgPSBcImxvY2F0aW9uXCI7XG4gICAgICBpZiAodGhpcy5leHBpcmVCeVRpbWUgPT0gXCJPTlwiKXtcbiAgICAgICAgZXhwaXJlX21ldGhvZCA9IFwidGltZVwiO1xuICAgICAgfVxuICAgICAgb3B0aW9ucy5leHBpcmVfbWV0aG9kID0gZXhwaXJlX21ldGhvZDtcblxuICAgICAgbGV0IGJlaGF2aW91cl90cmFja2luZyA9IHRydWU7XG4gICAgICBpZih0aGlzLmJlaGF2aW91clRyYWNraW5nID09IFwiT0ZGXCIpe1xuICAgICAgICBcbiAgICAgICAgYmVoYXZpb3VyX3RyYWNraW5nID0gZmFsc2U7XG4gICAgICAgIC8vIGFsZXJ0KCdpdCBpcyBvZmYnKTtcbiAgICAgIH1cbiAgICAgIG9wdGlvbnMuYmVoYXZpb3VyX3RyYWNraW5nID0gYmVoYXZpb3VyX3RyYWNraW5nO1xuICAgICAgLy8gYWxlcnQob3B0aW9ucy5iZWhhdmlvdXJfdHJhY2tpbmcpXG4gICAgICBcbiAgICAgIGxldCBjb250cmFjdERhdGE9e1xuICAgICAgICBcImxvY2F0aW9uX2lkXCI6IHRoaXMuX2xvY2F0aW9uX2lkLFxuICAgICAgICBcImF1dG9fYXV0aG9yaXplXCI6IGF1dG9fYXV0aG9yaXplLFxuICAgICAgICAvLyBcImV4cGlyZVwiOiB0aGlzLnRpbWUubWludXRlcyxcbiAgICAgICAgXCJleHBpcmVcIjogdGhpcy5taW51dGVzLFxuICAgICAgICBcIm9wdGlvbnNcIjogb3B0aW9uc1xuICAgICAgfTtcbiAgICAgIC8vIGFsZXJ0KGNvbnRyYWN0RGF0YS5vcHRpb25zLmJlaGF2aW91cl90cmFja2luZylcbiAgICAgIHRoaXMuY29udHJhY3RTZXJ2aWNlLmNyZWF0ZUNvbnRyYWN0KGNvbnRyYWN0RGF0YSlcbiAgICAgIC5zdWJzY3JpYmUocmVzcG9uc2UgPT4geyBcbiAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgVG9hc3QubWFrZVRleHQoXCJDb250cmFjdCBjcmVhdGVkIHN1Y2Nlc2Z1bGx5IVwiKS5zaG93KCk7XG4gICAgICAgIHRoaXMuZ29NYWluKCk7XG4gICAgICB9LGVycm9yID0+IHtcbiAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgYWxlcnQoXCJFcnJvciBjcmVhdGluZyB0aGUgY29udHJhY3Q6IFwiK2Vycm9yKTtcbiAgICAgICAgdGhpcy5nb01haW4oKTtcbiAgICAgICAgLy8gdGhyb3cgbmV3IEVycm9yKGVycm9yKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGV4cGlyZUNvbnRyYWN0KCl7XG4gICAgICB0aGlzLmlzQnVzeSA9IHRydWU7XG4gICAgICBjb25zb2xlLmxvZyhcImluIHNldHRpbmdzXCIpO1xuICAgICAgdGhpcy5jb250cmFjdFNlcnZpY2UuZXhwaXJlQ29udHJhY3QodGhpcy5fbG9jYXRpb25faWQsIHRoaXMuX2N1c3RvbWVyX2lkKVxuICAgICAgICAuc3Vic2NyaWJlKHJlc3BvbnNlQ29udHJhY3QgPT4ge1xuICAgICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgICAgLy8gYWxlcnQoXCJDb250cmFjdCBleHBpcmVkIHN1Y2Nlc2Z1bGx5IVwiKTtcbiAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkNvbnRyYWN0IGV4cGlyZWQgc3VjY2VzZnVsbHkhXCIpLnNob3coKTtcbiAgICAgICAgICB0aGlzLmdvTWFpbigpO1xuICAgICAgICB9LGVycm9yID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGluIGNvbnRyYWN0XCIpO1xuICAgICAgICAgIGlmIChlcnJvci5zdGF0dXMgIT0gNDA0KXtcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgZXhwaXJpbmcgdGhlIGNvbnRyYWN0OiBcIitlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5nb01haW4oKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGNhbmNlbCgpe1xuICAgICAgdGhpcy5nb01haW4oKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ29NYWluKCl7XG4gICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvbWFpblwiXSwge1xuICAgICAgICAgIC8vIGFuaW1hdGlvbjogdHJ1ZSxcbiAgICAgICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVSaWdodFwiLFxuICAgICAgICAgICAgICBkdXJhdGlvbjogMjAwLFxuICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufSJdfQ==