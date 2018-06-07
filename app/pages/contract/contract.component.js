"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
var Toast = require("nativescript-toast");
var application = require("application");
var application_1 = require("application");
var platform_1 = require("platform");
// import { Contract } from "../../shared/contract/contract";
var contract_service_1 = require("../../shared/contract/contract.service");
// import { LocationDatabaseService } from '../../shared/location/location.db.service';
var beacon_db_service_1 = require("../../shared/beacon/beacon.db.service");
var interest_db_service_1 = require("../../shared/interest/interest.db.service");
var appSettings = require("application-settings");
var ContractComponent = (function () {
    function ContractComponent(contractService, route, router, 
        // private locationDatabaseService: LocationDatabaseService
        interestDatabaseService, beaconDatabaseService) {
        this.contractService = contractService;
        this.route = route;
        this.router = router;
        this.interestDatabaseService = interestDatabaseService;
        this.beaconDatabaseService = beaconDatabaseService;
        this.title = "Welcome to Narnia";
        console.log("In Create contract constructor.");
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
        if (platform_1.isAndroid) {
            application.android.on(application_1.AndroidApplication.activityBackPressedEvent, function (data) {
                _this.goMain();
            });
        }
        try {
            this._customer_id = appSettings.getNumber("user_id");
        }
        catch (e) {
            this._customer_id = 0;
        }
        if (this.isSettings == true) {
            this.isBusy = true;
            console.log("in settings");
            this.contractService.getActiveContract(this._customer_id, this._location_id)
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
        console.log("expiring contract in settings");
        var finishedInterests = this.interestDatabaseService.finishInterests();
        if (finishedInterests.length > 0) {
            finishedInterests.forEach(function (interest) {
                // send interest
                console.log("Sending interest from finish interest: " + interest.beacon);
                console.log("Actual implementation pending..");
                Toast.makeText("Interest stored.").show();
                console.log("Interest stored.");
            });
        }
        // // Retrive all interests (should be max 1)
        // let interests = this.interestDatabaseService.selectInterests();
        // console.log("how many intersts to finish: "+interests.length);
        // // if there is an interest 
        // if (interests.length > 0){
        //     interests.forEach(interest =>{
        //     let start = new Date(interest.start);
        //     let end = new Date(interest.end);
        //     let duration = end.getTime() - start.getTime();
        //     let sinceLast = new Date().getTime() - end.getTime();
        //     console.log("Interest: "+interest.beacon+", sinceLast: "+sinceLast+", duration: "+duration);
        //     // if duration  > 1 minute then send interest
        //     if( duration > 60000){
        //         console.log("Sending interest b: "+interest.beacon)
        //         console.log("Actual implementation pending..");
        //         Toast.makeText("Interest stored.").show();
        //     }
        //     console.log("Deleting interest due to expiring contract: "+interest.beacon);
        //     this.interestDatabaseService.deleteInterest(interest.id);
        //     });
        // }
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
    // verifyBehaviour(){
    //   // Retrive all interests (should be max 1)
    //   let interests = this.interestDatabaseService.selectInterests();
    //   console.log("how many intersts: "+interests.length);
    //   // if there is an interest 
    //   if (interests.length > 0){
    //     interests.forEach(interest =>{
    //       let start = new Date(interest[3]);
    //       let end = new Date(interest[4]);
    //       let duration = end.getTime() - start.getTime();
    //       let sinceLast = new Date().getTime() - end.getTime();
    //       // if sinceLast > 60 seconds <- this is crucial for knowing if it is away
    //       if(sinceLast > 60000){
    //         // if duration  > 1 minute then send interest
    //         if( duration > 60000){
    //           console.log("Sending interest b: "+interest[0])
    //           console.log("Actual implementation pending..");
    //           Toast.makeText("Interest stored.").show();
    //         }
    //         console.log("Deleting interest due to more than 1 minute away: "+interest[0]);
    //         this.interestDatabaseService.deleteInterest(interest[0]);
    //       }
    //     });
    //   }
    // }
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
            providers: [contract_service_1.ContractService, beacon_db_service_1.BeaconDatabaseService, interest_db_service_1.InterestDatabaseService],
            // moduleId: module.id,
            templateUrl: "./pages/contract/contract.html",
            styleUrls: ["./pages/contract/contract.css"]
        }),
        __metadata("design:paramtypes", [contract_service_1.ContractService,
            router_1.ActivatedRoute,
            router_2.RouterExtensions,
            interest_db_service_1.InterestDatabaseService,
            beacon_db_service_1.BeaconDatabaseService])
    ], ContractComponent);
    return ContractComponent;
}());
exports.ContractComponent = ContractComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJhY3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29udHJhY3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXlFO0FBQ3pFLDBDQUFpRDtBQUNqRCxzREFBK0Q7QUFFL0QsMENBQTRDO0FBRTVDLHlDQUEyQztBQUMzQywyQ0FBc0Y7QUFDdEYscUNBQXFDO0FBRXJDLDZEQUE2RDtBQUM3RCwyRUFBeUU7QUFDekUsdUZBQXVGO0FBQ3ZGLDJFQUE4RTtBQUM5RSxpRkFBb0Y7QUFFcEYsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFVbEQ7SUFtQkksMkJBQ1ksZUFBZ0MsRUFDaEMsS0FBcUIsRUFDckIsTUFBd0I7UUFDaEMsMkRBQTJEO1FBQ25ELHVCQUFnRCxFQUNoRCxxQkFBNEM7UUFMNUMsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBQ2hDLFVBQUssR0FBTCxLQUFLLENBQWdCO1FBQ3JCLFdBQU0sR0FBTixNQUFNLENBQWtCO1FBRXhCLDRCQUF1QixHQUF2Qix1QkFBdUIsQ0FBeUI7UUFDaEQsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtRQVpqRCxVQUFLLEdBQVcsbUJBQW1CLENBQUM7UUFjekMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFBO1FBQzlDLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1FBQzFCLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFBO1FBQ2hCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBQzFCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFDOUIsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7UUFHaEIsMEJBQTBCO1FBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3BC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LHdCQUFDO0NBQUEsQUE5UkQsSUE4UkM7QUE5UlksOENBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcbmltcG9ydCB7IFJvdXRlckV4dGVuc2lvbnMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQgeyBTd2l0Y2ggfSBmcm9tIFwidWkvc3dpdGNoXCI7XG5pbXBvcnQgKiBhcyBUb2FzdCBmcm9tICduYXRpdmVzY3JpcHQtdG9hc3QnO1xuXG5pbXBvcnQgKiBhcyBhcHBsaWNhdGlvbiBmcm9tICdhcHBsaWNhdGlvbic7XG5pbXBvcnQgeyBBbmRyb2lkQXBwbGljYXRpb24sIEFuZHJvaWRBY3Rpdml0eUJhY2tQcmVzc2VkRXZlbnREYXRhIH0gZnJvbSBcImFwcGxpY2F0aW9uXCI7XG5pbXBvcnQgeyBpc0FuZHJvaWQgfSBmcm9tIFwicGxhdGZvcm1cIjtcblxuLy8gaW1wb3J0IHsgQ29udHJhY3QgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2NvbnRyYWN0L2NvbnRyYWN0XCI7XG5pbXBvcnQgeyBDb250cmFjdFNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2NvbnRyYWN0L2NvbnRyYWN0LnNlcnZpY2VcIjtcbi8vIGltcG9ydCB7IExvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2hhcmVkL2xvY2F0aW9uL2xvY2F0aW9uLmRiLnNlcnZpY2UnO1xuaW1wb3J0IHsgQmVhY29uRGF0YWJhc2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2hhcmVkL2JlYWNvbi9iZWFjb24uZGIuc2VydmljZSc7XG5pbXBvcnQgeyBJbnRlcmVzdERhdGFiYXNlU2VydmljZSB9IGZyb20gJy4uLy4uL3NoYXJlZC9pbnRlcmVzdC9pbnRlcmVzdC5kYi5zZXJ2aWNlJztcblxudmFyIGFwcFNldHRpbmdzID0gcmVxdWlyZShcImFwcGxpY2F0aW9uLXNldHRpbmdzXCIpO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogXCJucy1jb250cmFjdFwiLFxuICAgIC8vIHByb3ZpZGVyczogW0NvbnRyYWN0U2VydmljZSxMb2NhdGlvbkRhdGFiYXNlU2VydmljZV0sXG4gICAgcHJvdmlkZXJzOiBbQ29udHJhY3RTZXJ2aWNlLCBCZWFjb25EYXRhYmFzZVNlcnZpY2UsIEludGVyZXN0RGF0YWJhc2VTZXJ2aWNlXSxcbiAgICAvLyBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICAgIHRlbXBsYXRlVXJsOiBcIi4vcGFnZXMvY29udHJhY3QvY29udHJhY3QuaHRtbFwiLFxuICAgIHN0eWxlVXJsczpbXCIuL3BhZ2VzL2NvbnRyYWN0L2NvbnRyYWN0LmNzc1wiXSBcbn0pXG5leHBvcnQgY2xhc3MgQ29udHJhY3RDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIHByaXZhdGUgX2xvY2F0aW9uX2lkOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBfY3VzdG9tZXJfaWQ6IG51bWJlcjtcbiAgICAvLyBwcml2YXRlIF9jb250cmFjdDogQ29udHJhY3Q7XG5cbiAgICBtaW51dGVzOiBudW1iZXI7XG4gICAgZXhwaXJlQnlUaW1lOiBzdHJpbmc7XG4gICAgYXV0b2F1dGhvcml6ZTogc3RyaW5nO1xuICAgIGJlaGF2aW91clRyYWNraW5nOiBzdHJpbmc7XG5cbiAgICBwdWJsaWMgYWFjOiBib29sZWFuO1xuICAgIHB1YmxpYyBldGM6IGJvb2xlYW47XG4gICAgcHVibGljIGJodDogYm9vbGVhbjtcbiAgICBwdWJsaWMgdGl0bGU6IHN0cmluZyA9IFwiV2VsY29tZSB0byBOYXJuaWFcIjtcblxuXG4gICAgaXNCdXN5OiBib29sZWFuO1xuICAgIGlzU2V0dGluZ3M6IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBjb250cmFjdFNlcnZpY2U6IENvbnRyYWN0U2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSByb3V0ZTogQWN0aXZhdGVkUm91dGUsXG4gICAgICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXJFeHRlbnNpb25zLFxuICAgICAgICAvLyBwcml2YXRlIGxvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlOiBMb2NhdGlvbkRhdGFiYXNlU2VydmljZVxuICAgICAgICBwcml2YXRlIGludGVyZXN0RGF0YWJhc2VTZXJ2aWNlOiBJbnRlcmVzdERhdGFiYXNlU2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSBiZWFjb25EYXRhYmFzZVNlcnZpY2U6IEJlYWNvbkRhdGFiYXNlU2VydmljZVxuICAgICkgeyBcbiAgICAgIGNvbnNvbGUubG9nKFwiSW4gQ3JlYXRlIGNvbnRyYWN0IGNvbnN0cnVjdG9yLlwiKVxuICAgICAgdGhpcy5leHBpcmVCeVRpbWUgPSBcIk9GRlwiO1xuICAgICAgdGhpcy5ldGMgPSBmYWxzZVxuICAgICAgdGhpcy5hdXRvYXV0aG9yaXplID0gXCJPTlwiO1xuICAgICAgdGhpcy5hYWMgPSB0cnVlOyAgXG4gICAgICB0aGlzLmJlaGF2aW91clRyYWNraW5nID0gXCJPTlwiO1xuICAgICAgdGhpcy5iaHQgPSB0cnVlOyBcbiAgICAgICBcbiAgICAgICBcbiAgICAgIC8vICB0aGlzLl9jb250cmFjdCA9IG51bGw7XG4gICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICB0aGlzLmlzU2V0dGluZ3MgPSBmYWxzZTtcblxuICAgICAgdGhpcy5taW51dGVzID0gMTA7XG4gICAgICAvLyBjb25zb2xlLmxvZyhcImluaXQgdGltZTogXCIrdGhpcy5taW51dGVzKTtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgIHRoaXMuX2xvY2F0aW9uX2lkID0gcGFyc2VJbnQodGhpcy5yb3V0ZS5zbmFwc2hvdC5wYXJhbXNbXCJsb2NhdGlvbl9pZFwiXSk7XG4gICAgICB0aGlzLmlzU2V0dGluZ3MgPSAodGhpcy5yb3V0ZS5zbmFwc2hvdC5wYXJhbXNbXCJzZXR0aW5nc1wiXSk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhcImlzIHNldHRpbmdzOiBcIit0aGlzLmlzU2V0dGluZ3MpO1xuXG4gICAgICAvLyBhbGVydChcIldhaXQgZm9yIGl0Li4gd2l0aCBsb2NhdGlvbiBpZDogXCIrdGhpcy5fbG9jYXRpb25faWQpO1xuICAgICAgXG4gICAgICAvLyB0aGlzLmxvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlLnNlbGVjdExvY2F0aW9uKHRoaXMuX2xvY2F0aW9uX2lkKVxuICAgICAgLy8gdGhpcy50aXRsZSA9IFwiQXQgXCIrdGhpcy5sb2NhdGlvbkRhdGFiYXNlU2VydmljZS5zZWxlY3RMb2NhdGlvbih0aGlzLl9sb2NhdGlvbl9pZClbMV07XG4gICAgICB0aGlzLnRpdGxlID0gXCJBdCBcIit0aGlzLmJlYWNvbkRhdGFiYXNlU2VydmljZS5zZWxlY3RCZWFjb25CeUxvY2F0aW9uKHRoaXMuX2xvY2F0aW9uX2lkKVs2XStcIiBzdG9yZVwiO1xuICAgICAgLy8gYWxlcnQoXCJzdHVmZjpcIisgdGhpcy5sb2NhdGlvbkRhdGFiYXNlU2VydmljZS5zZWxlY3RMb2NhdGlvbih0aGlzLl9sb2NhdGlvbl9pZClbMV0pO1xuXG4gICAgICBpZiAoaXNBbmRyb2lkKSB7XG4gICAgICAgIGFwcGxpY2F0aW9uLmFuZHJvaWQub24oQW5kcm9pZEFwcGxpY2F0aW9uLmFjdGl2aXR5QmFja1ByZXNzZWRFdmVudCwgKGRhdGE6IEFuZHJvaWRBY3Rpdml0eUJhY2tQcmVzc2VkRXZlbnREYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy5nb01haW4oKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHRyeXtcbiAgICAgICAgdGhpcy5fY3VzdG9tZXJfaWQgPSBhcHBTZXR0aW5ncy5nZXROdW1iZXIoXCJ1c2VyX2lkXCIpO1xuICAgICAgfWNhdGNoKGUpe1xuICAgICAgICB0aGlzLl9jdXN0b21lcl9pZCA9IDA7XG4gICAgICB9ICAgXG5cbiAgICAgIFxuICAgICAgaWYgKHRoaXMuaXNTZXR0aW5ncyA9PSB0cnVlKXtcbiAgICAgICAgdGhpcy5pc0J1c3kgPSB0cnVlO1xuICAgICAgICBjb25zb2xlLmxvZyhcImluIHNldHRpbmdzXCIpO1xuICAgICAgICB0aGlzLmNvbnRyYWN0U2VydmljZS5nZXRBY3RpdmVDb250cmFjdCh0aGlzLl9jdXN0b21lcl9pZCwgdGhpcy5fbG9jYXRpb25faWQpXG4gICAgICAgICAgLnN1YnNjcmliZShyZXNwb25zZUNvbnRyYWN0ID0+IHtcbiAgICAgICAgICAgIGlmICghcmVzcG9uc2VDb250cmFjdC5tZXNzYWdlICYmIHJlc3BvbnNlQ29udHJhY3Quc3RhdHVzICE9IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm8gbWVzc2FnZSA6KSwgc3RhdHVzOiBcIityZXNwb25zZUNvbnRyYWN0LnN0YXR1cyk7XG4gICAgICAgICAgICAgIGlmKCFyZXNwb25zZUNvbnRyYWN0LmF1dG9fYXV0aG9yaXplKXtcbiAgICAgICAgICAgICAgICB0aGlzLmF1dG9hdXRob3JpemUgPSBcIk9GRlwiO1xuICAgICAgICAgICAgICAgIHRoaXMuYWFjID0gZmFsc2U7ICBcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmKHJlc3BvbnNlQ29udHJhY3Qub3B0aW9ucy5leHBpcmVfbWV0aG9kID09ICd0aW1lJyl7XG4gICAgICAgICAgICAgICAgdGhpcy5leHBpcmVCeVRpbWUgPSBcIk9OXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5ldGMgPSB0cnVlO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgLy8gYWxlcnQocmVzcG9uc2VDb250cmFjdC5vcHRpb25zLmJlaGF2aW91cl90cmFja2luZyk7XG4gICAgICAgICAgICAgIGlmKHJlc3BvbnNlQ29udHJhY3Qub3B0aW9ucy5iZWhhdmlvdXJfdHJhY2tpbmcgPT0gZmFsc2Upe1xuICAgICAgICAgICAgICAgIHRoaXMuYmVoYXZpb3VyVHJhY2tpbmcgPSBcIk9GRlwiO1xuICAgICAgICAgICAgICAgIHRoaXMuYmh0ID0gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLy8gYWxlcnQocmVzcG9uc2VDb250cmFjdC5vcHRpb25zLmJlaGF2aW91cl90cmFja2luZyk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJtZXNzYWdlOlwiK3Jlc3BvbnNlQ29udHJhY3QubWVzc2FnZSk7XG4gICAgICAgICAgICAgIC8vIGFsZXJ0KFwiQ29udHJhY3QgZXhwaXJlZC5cIik7XG4gICAgICAgICAgICAgIHRoaXMuZ29NYWluKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICAgIH0sZXJyb3IgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciBpbiBjb250cmFjdFwiKTtcbiAgICAgICAgICAgIGlmIChlcnJvci5zdGF0dXMgIT0gNDA0KXtcbiAgICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBnZXR0aW5nIGFjdGl2ZSBjb250cmFjdCBpbmZvcm1hdGlvbjogXCIrZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuZ29NYWluKCk7XG4gICAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICB9XG5cbiAgIHB1YmxpYyBleHBpcmVCeVRpbWVFdmVudChhcmdzKSB7XG4gICAgICAgIGxldCBzd2l0Y2hCb3ggPSA8U3dpdGNoPmFyZ3Mub2JqZWN0O1xuICAgICAgICBpZiAoc3dpdGNoQm94LmNoZWNrZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZXhwaXJlQnlUaW1lID0gXCJPTlwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5leHBpcmVCeVRpbWUgPSBcIk9GRlwiO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGF1dG9hdXRob3JpemVFdmVudChhcmdzKSB7XG4gICAgICAgIGxldCBzd2l0Y2hCb3ggPSA8U3dpdGNoPmFyZ3Mub2JqZWN0O1xuICAgICAgICBpZiAoc3dpdGNoQm94LmNoZWNrZWQpIHtcbiAgICAgICAgICAgIHRoaXMuYXV0b2F1dGhvcml6ZSA9IFwiT05cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYXV0b2F1dGhvcml6ZSA9IFwiT0ZGXCI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYmVoYXZpb3VyVHJhY2tpbmdFdmVudChhcmdzKSB7XG4gICAgICBsZXQgc3dpdGNoQm94ID0gPFN3aXRjaD5hcmdzLm9iamVjdDtcbiAgICAgIGlmIChzd2l0Y2hCb3guY2hlY2tlZCkge1xuICAgICAgICAgIHRoaXMuYmVoYXZpb3VyVHJhY2tpbmcgPSBcIk9OXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuYmVoYXZpb3VyVHJhY2tpbmcgPSBcIk9GRlwiO1xuICAgICAgICAgIC8vIGFsZXJ0KFwib2ZmXCIpO1xuICAgICAgfVxuICB9XG5cbiAgICBjcmVhdGVDb250cmFjdCgpe1xuICAgICAgdGhpcy5pc0J1c3kgPSB0cnVlO1xuICAgICAgbGV0IGF1dG9fYXV0aG9yaXplO1xuICAgICAgaWYgKHRoaXMuYXV0b2F1dGhvcml6ZSA9PSBcIk9OXCIpXG4gICAgICAgIGF1dG9fYXV0aG9yaXplID0gdHJ1ZTtcbiAgICAgIGVsc2VcbiAgICAgICAgYXV0b19hdXRob3JpemUgPSBmYWxzZTtcbiAgICAgIFxuICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgIFwiZXhwaXJlX21ldGhvZFwiOlwiXCIsXG4gICAgICAgIFwiYmVoYXZpb3VyX3RyYWNraW5nXCI6dHJ1ZVxuICAgICAgfTtcblxuICAgICAgbGV0IGV4cGlyZV9tZXRob2QgPSBcImxvY2F0aW9uXCI7XG4gICAgICBpZiAodGhpcy5leHBpcmVCeVRpbWUgPT0gXCJPTlwiKXtcbiAgICAgICAgZXhwaXJlX21ldGhvZCA9IFwidGltZVwiO1xuICAgICAgfVxuICAgICAgb3B0aW9ucy5leHBpcmVfbWV0aG9kID0gZXhwaXJlX21ldGhvZDtcblxuICAgICAgbGV0IGJlaGF2aW91cl90cmFja2luZyA9IHRydWU7XG4gICAgICBpZih0aGlzLmJlaGF2aW91clRyYWNraW5nID09IFwiT0ZGXCIpe1xuICAgICAgICBcbiAgICAgICAgYmVoYXZpb3VyX3RyYWNraW5nID0gZmFsc2U7XG4gICAgICAgIC8vIGFsZXJ0KCdpdCBpcyBvZmYnKTtcbiAgICAgIH1cbiAgICAgIG9wdGlvbnMuYmVoYXZpb3VyX3RyYWNraW5nID0gYmVoYXZpb3VyX3RyYWNraW5nO1xuICAgICAgLy8gYWxlcnQob3B0aW9ucy5iZWhhdmlvdXJfdHJhY2tpbmcpXG4gICAgICBcbiAgICAgIGxldCBjb250cmFjdERhdGE9e1xuICAgICAgICBcImxvY2F0aW9uX2lkXCI6IHRoaXMuX2xvY2F0aW9uX2lkLFxuICAgICAgICBcImF1dG9fYXV0aG9yaXplXCI6IGF1dG9fYXV0aG9yaXplLFxuICAgICAgICAvLyBcImV4cGlyZVwiOiB0aGlzLnRpbWUubWludXRlcyxcbiAgICAgICAgXCJleHBpcmVcIjogdGhpcy5taW51dGVzLFxuICAgICAgICBcIm9wdGlvbnNcIjogb3B0aW9uc1xuICAgICAgfTtcbiAgICAgIC8vIGFsZXJ0KGNvbnRyYWN0RGF0YS5vcHRpb25zLmJlaGF2aW91cl90cmFja2luZylcbiAgICAgIHRoaXMuY29udHJhY3RTZXJ2aWNlLmNyZWF0ZUNvbnRyYWN0KGNvbnRyYWN0RGF0YSlcbiAgICAgIC5zdWJzY3JpYmUocmVzcG9uc2UgPT4geyBcbiAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgVG9hc3QubWFrZVRleHQoXCJDb250cmFjdCBjcmVhdGVkIHN1Y2Nlc2Z1bGx5IVwiKS5zaG93KCk7XG4gICAgICAgIHRoaXMuZ29NYWluKCk7XG4gICAgICB9LGVycm9yID0+IHtcbiAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgYWxlcnQoXCJFcnJvciBjcmVhdGluZyB0aGUgY29udHJhY3Q6IFwiK2Vycm9yKTtcbiAgICAgICAgdGhpcy5nb01haW4oKTtcbiAgICAgICAgLy8gdGhyb3cgbmV3IEVycm9yKGVycm9yKTtcbiAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgZXhwaXJlQ29udHJhY3QoKXtcbiAgICAgIHRoaXMuaXNCdXN5ID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUubG9nKFwiZXhwaXJpbmcgY29udHJhY3QgaW4gc2V0dGluZ3NcIik7XG5cbiAgICAgIGxldCBmaW5pc2hlZEludGVyZXN0cyA9IHRoaXMuaW50ZXJlc3REYXRhYmFzZVNlcnZpY2UuZmluaXNoSW50ZXJlc3RzKCk7IFxuICAgICAgaWYgKGZpbmlzaGVkSW50ZXJlc3RzLmxlbmd0aCA+IDApe1xuICAgICAgICBmaW5pc2hlZEludGVyZXN0cy5mb3JFYWNoKGludGVyZXN0PT57XG4gICAgICAgICAgLy8gc2VuZCBpbnRlcmVzdFxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyBpbnRlcmVzdCBmcm9tIGZpbmlzaCBpbnRlcmVzdDogXCIraW50ZXJlc3QuYmVhY29uKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkFjdHVhbCBpbXBsZW1lbnRhdGlvbiBwZW5kaW5nLi5cIik7XG5cbiAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkludGVyZXN0IHN0b3JlZC5cIikuc2hvdygpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiSW50ZXJlc3Qgc3RvcmVkLlwiKVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gLy8gUmV0cml2ZSBhbGwgaW50ZXJlc3RzIChzaG91bGQgYmUgbWF4IDEpXG4gICAgICAvLyBsZXQgaW50ZXJlc3RzID0gdGhpcy5pbnRlcmVzdERhdGFiYXNlU2VydmljZS5zZWxlY3RJbnRlcmVzdHMoKTtcblxuICAgICAgLy8gY29uc29sZS5sb2coXCJob3cgbWFueSBpbnRlcnN0cyB0byBmaW5pc2g6IFwiK2ludGVyZXN0cy5sZW5ndGgpO1xuICAgICAgLy8gLy8gaWYgdGhlcmUgaXMgYW4gaW50ZXJlc3QgXG4gICAgICAvLyBpZiAoaW50ZXJlc3RzLmxlbmd0aCA+IDApe1xuICAgICAgLy8gICAgIGludGVyZXN0cy5mb3JFYWNoKGludGVyZXN0ID0+e1xuICAgICAgLy8gICAgIGxldCBzdGFydCA9IG5ldyBEYXRlKGludGVyZXN0LnN0YXJ0KTtcbiAgICAgIC8vICAgICBsZXQgZW5kID0gbmV3IERhdGUoaW50ZXJlc3QuZW5kKTtcbiAgICAgIC8vICAgICBsZXQgZHVyYXRpb24gPSBlbmQuZ2V0VGltZSgpIC0gc3RhcnQuZ2V0VGltZSgpO1xuICAgICAgLy8gICAgIGxldCBzaW5jZUxhc3QgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIGVuZC5nZXRUaW1lKCk7XG4gICAgICAvLyAgICAgY29uc29sZS5sb2coXCJJbnRlcmVzdDogXCIraW50ZXJlc3QuYmVhY29uK1wiLCBzaW5jZUxhc3Q6IFwiK3NpbmNlTGFzdCtcIiwgZHVyYXRpb246IFwiK2R1cmF0aW9uKTtcbiAgICAgICAgICBcbiAgICAgIC8vICAgICAvLyBpZiBkdXJhdGlvbiAgPiAxIG1pbnV0ZSB0aGVuIHNlbmQgaW50ZXJlc3RcbiAgICAgIC8vICAgICBpZiggZHVyYXRpb24gPiA2MDAwMCl7XG4gICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyBpbnRlcmVzdCBiOiBcIitpbnRlcmVzdC5iZWFjb24pXG4gICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKFwiQWN0dWFsIGltcGxlbWVudGF0aW9uIHBlbmRpbmcuLlwiKTtcbiAgICAgIC8vICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJJbnRlcmVzdCBzdG9yZWQuXCIpLnNob3coKTtcbiAgICAgIC8vICAgICB9XG4gICAgICAvLyAgICAgY29uc29sZS5sb2coXCJEZWxldGluZyBpbnRlcmVzdCBkdWUgdG8gZXhwaXJpbmcgY29udHJhY3Q6IFwiK2ludGVyZXN0LmJlYWNvbik7XG4gICAgICAvLyAgICAgdGhpcy5pbnRlcmVzdERhdGFiYXNlU2VydmljZS5kZWxldGVJbnRlcmVzdChpbnRlcmVzdC5pZCk7XG4gICAgICAgICAgXG4gICAgICAvLyAgICAgfSk7XG4gICAgICAvLyB9XG5cbiAgICAgIHRoaXMuY29udHJhY3RTZXJ2aWNlLmV4cGlyZUNvbnRyYWN0KHRoaXMuX2xvY2F0aW9uX2lkLCB0aGlzLl9jdXN0b21lcl9pZClcbiAgICAgICAgLnN1YnNjcmliZShyZXNwb25zZUNvbnRyYWN0ID0+IHtcbiAgICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICAgIC8vIGFsZXJ0KFwiQ29udHJhY3QgZXhwaXJlZCBzdWNjZXNmdWxseSFcIik7XG4gICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJDb250cmFjdCBleHBpcmVkIHN1Y2Nlc2Z1bGx5IVwiKS5zaG93KCk7XG4gICAgICAgICAgdGhpcy5nb01haW4oKTtcbiAgICAgICAgfSxlcnJvciA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciBpbiBjb250cmFjdFwiKTtcbiAgICAgICAgICBpZiAoZXJyb3Iuc3RhdHVzICE9IDQwNCl7XG4gICAgICAgICAgICBhbGVydChcIkVycm9yIGV4cGlyaW5nIHRoZSBjb250cmFjdDogXCIrZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuZ29NYWluKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIHZlcmlmeUJlaGF2aW91cigpe1xuICAgIC8vICAgLy8gUmV0cml2ZSBhbGwgaW50ZXJlc3RzIChzaG91bGQgYmUgbWF4IDEpXG4gICAgLy8gICBsZXQgaW50ZXJlc3RzID0gdGhpcy5pbnRlcmVzdERhdGFiYXNlU2VydmljZS5zZWxlY3RJbnRlcmVzdHMoKTtcblxuICAgIC8vICAgY29uc29sZS5sb2coXCJob3cgbWFueSBpbnRlcnN0czogXCIraW50ZXJlc3RzLmxlbmd0aCk7XG4gICAgLy8gICAvLyBpZiB0aGVyZSBpcyBhbiBpbnRlcmVzdCBcbiAgICAvLyAgIGlmIChpbnRlcmVzdHMubGVuZ3RoID4gMCl7XG4gICAgLy8gICAgIGludGVyZXN0cy5mb3JFYWNoKGludGVyZXN0ID0+e1xuICAgIC8vICAgICAgIGxldCBzdGFydCA9IG5ldyBEYXRlKGludGVyZXN0WzNdKTtcbiAgICAvLyAgICAgICBsZXQgZW5kID0gbmV3IERhdGUoaW50ZXJlc3RbNF0pO1xuICAgIC8vICAgICAgIGxldCBkdXJhdGlvbiA9IGVuZC5nZXRUaW1lKCkgLSBzdGFydC5nZXRUaW1lKCk7XG4gICAgLy8gICAgICAgbGV0IHNpbmNlTGFzdCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gZW5kLmdldFRpbWUoKTtcbiAgICAvLyAgICAgICAvLyBpZiBzaW5jZUxhc3QgPiA2MCBzZWNvbmRzIDwtIHRoaXMgaXMgY3J1Y2lhbCBmb3Iga25vd2luZyBpZiBpdCBpcyBhd2F5XG4gICAgLy8gICAgICAgaWYoc2luY2VMYXN0ID4gNjAwMDApe1xuICAgIC8vICAgICAgICAgLy8gaWYgZHVyYXRpb24gID4gMSBtaW51dGUgdGhlbiBzZW5kIGludGVyZXN0XG4gICAgLy8gICAgICAgICBpZiggZHVyYXRpb24gPiA2MDAwMCl7XG4gICAgLy8gICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyBpbnRlcmVzdCBiOiBcIitpbnRlcmVzdFswXSlcbiAgICAvLyAgICAgICAgICAgY29uc29sZS5sb2coXCJBY3R1YWwgaW1wbGVtZW50YXRpb24gcGVuZGluZy4uXCIpO1xuICAgIC8vICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkludGVyZXN0IHN0b3JlZC5cIikuc2hvdygpO1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICAgICAgY29uc29sZS5sb2coXCJEZWxldGluZyBpbnRlcmVzdCBkdWUgdG8gbW9yZSB0aGFuIDEgbWludXRlIGF3YXk6IFwiK2ludGVyZXN0WzBdKTtcbiAgICAvLyAgICAgICAgIHRoaXMuaW50ZXJlc3REYXRhYmFzZVNlcnZpY2UuZGVsZXRlSW50ZXJlc3QoaW50ZXJlc3RbMF0pO1xuICAgIC8vICAgICAgIH1cbiAgICAvLyAgICAgfSk7XG4gICAgLy8gICB9XG4gICAgLy8gfVxuXG4gICAgcHVibGljIGNhbmNlbCgpe1xuICAgICAgdGhpcy5nb01haW4oKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ29NYWluKCl7XG4gICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvbWFpblwiXSwge1xuICAgICAgICAgIC8vIGFuaW1hdGlvbjogdHJ1ZSxcbiAgICAgICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVSaWdodFwiLFxuICAgICAgICAgICAgICBkdXJhdGlvbjogMjAwLFxuICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufSJdfQ==