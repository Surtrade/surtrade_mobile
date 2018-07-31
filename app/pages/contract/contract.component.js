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
var interest_service_1 = require("../../shared/interest/interest.service");
var appSettings = require("application-settings");
var ContractComponent = /** @class */ (function () {
    function ContractComponent(contractService, route, router, 
    // private locationDatabaseService: LocationDatabaseService
    interestDatabaseService, interestService, beaconDatabaseService) {
        this.contractService = contractService;
        this.route = route;
        this.router = router;
        this.interestDatabaseService = interestDatabaseService;
        this.interestService = interestService;
        this.beaconDatabaseService = beaconDatabaseService;
        this.title = "Welcome to Narnia";
        console.log("In Create contract constructor.");
        this.expireByTime = "OFF";
        this.etc = false;
        this.autoauthorize = "ON";
        this.aac = true;
        this.behaviourTracking = "ON";
        this.bht = true;
        this.shelfInfo = "ON";
        this.shi = true;
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
                    if (responseContract.options.behaviour_tracking == false) {
                        _this.behaviourTracking = "OFF";
                        _this.bht = false;
                    }
                    if (responseContract.options.shelf_info == false) {
                        _this.shelfInfo = "OFF";
                        _this.shi = false;
                    }
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
        }
    };
    ContractComponent.prototype.shelfInfoEvent = function (args) {
        var switchBox = args.object;
        if (switchBox.checked) {
            this.shelfInfo = "ON";
        }
        else {
            this.shelfInfo = "OFF";
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
            "behaviour_tracking": true,
            "shelf_info": true
        };
        var expire_method = "location";
        if (this.expireByTime == "ON") {
            expire_method = "time";
        }
        options.expire_method = expire_method;
        var behaviour_tracking = true;
        if (this.behaviourTracking == "OFF") {
            behaviour_tracking = false;
        }
        options.behaviour_tracking = behaviour_tracking;
        var shelf_info = true;
        if (this.shelfInfo == "OFF") {
            shelf_info = false;
        }
        options.shelf_info = shelf_info;
        var contractData = {
            "location_id": this._location_id,
            "auto_authorize": auto_authorize,
            // "expire": this.time.minutes,
            "expire": this.minutes,
            "options": options
        };
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
        // let finishedInterests = this.interestDatabaseService.finishInterests(); 
        // if (finishedInterests.length > 0){
        //   finishedInterests.forEach(interest=>{
        //     // send interest
        //     console.log("Sending interest from finish interest: "+interest.beacon);
        //     console.log("Actual implementation pending..");
        //     Toast.makeText("Interest stored.").show();
        //     console.log("Interest stored.")
        //   });
        // }
        this.verifyInterest();
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
    ContractComponent.prototype.verifyInterest = function () {
        var _this = this;
        // Retrive all interests (should be max 1)
        var interests = this.interestDatabaseService.selectInterests();
        console.log("how many intersts cc.: " + interests.length);
        // if there is an interest 
        if (interests.length > 0) {
            interests.forEach(function (interest) {
                var start = new Date(interest.start);
                var end = new Date(interest.end);
                var duration = end.getTime() - start.getTime();
                var sinceLast = new Date().getTime() - end.getTime();
                // if sinceLast > 60 seconds <- this is crucial for knowing if it is away
                console.log("Interest cc.: " + interest.beacon + ", sinceLast: " + sinceLast + ", duration: " + duration);
                if (sinceLast > 60000) {
                    // if duration  > 1 minute then send interest
                    if (duration > 60000) {
                        console.log("Sending interest cc.: " + interest.beacon);
                        console.log("Actual implementation pending.. work in progress..");
                        _this.interestService.createInterest(interest).subscribe(function (response) {
                            // this.isBusy = false;
                            Toast.makeText("Interest Sent!  cc.").show();
                        }, function (error) {
                            _this.isBusy = false;
                            alert("Error sending the interest: " + error);
                            // throw new Error(error);
                        });
                        Toast.makeText("Interest stored.").show();
                    }
                    console.log("Deleting interest due to more than 1 minute away cc.: " + interest.id);
                    _this.interestDatabaseService.deleteInterest(interest.id);
                }
            });
        }
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
            providers: [contract_service_1.ContractService, beacon_db_service_1.BeaconDatabaseService, interest_db_service_1.InterestDatabaseService, interest_service_1.InterestService],
            // moduleId: module.id,
            templateUrl: "./pages/contract/contract.html",
            styleUrls: ["./pages/contract/contract.css"]
        }),
        __metadata("design:paramtypes", [contract_service_1.ContractService,
            router_1.ActivatedRoute,
            router_2.RouterExtensions,
            interest_db_service_1.InterestDatabaseService,
            interest_service_1.InterestService,
            beacon_db_service_1.BeaconDatabaseService])
    ], ContractComponent);
    return ContractComponent;
}());
exports.ContractComponent = ContractComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJhY3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29udHJhY3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXlFO0FBQ3pFLDBDQUFpRDtBQUNqRCxzREFBK0Q7QUFFL0QsMENBQTRDO0FBRTVDLHlDQUEyQztBQUMzQywyQ0FBc0Y7QUFDdEYscUNBQXFDO0FBRXJDLDZEQUE2RDtBQUM3RCwyRUFBeUU7QUFDekUsdUZBQXVGO0FBQ3ZGLDJFQUE4RTtBQUM5RSxpRkFBb0Y7QUFDcEYsMkVBQXlFO0FBR3pFLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBVWxEO0lBcUJJLDJCQUNZLGVBQWdDLEVBQ2hDLEtBQXFCLEVBQ3JCLE1BQXdCO0lBQ2hDLDJEQUEyRDtJQUNuRCx1QkFBZ0QsRUFDaEQsZUFBZ0MsRUFDaEMscUJBQTRDO1FBTjVDLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUNoQyxVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQUNyQixXQUFNLEdBQU4sTUFBTSxDQUFrQjtRQUV4Qiw0QkFBdUIsR0FBdkIsdUJBQXVCLENBQXlCO1FBQ2hELG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUNoQywwQkFBcUIsR0FBckIscUJBQXFCLENBQXVCO1FBYmpELFVBQUssR0FBVyxtQkFBbUIsQ0FBQztRQWV6QyxPQUFPLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxDQUFDLENBQUE7UUFDOUMsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7UUFDMUIsSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUE7UUFDaEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7UUFDMUIsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7UUFDaEIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztRQUM5QixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztR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QTVCL0MsaUJBQWlCLENBNFY3QjtJQUFELHdCQUFDO0NBQUEsQUE1VkQsSUE0VkM7QUE1VlksOENBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcbmltcG9ydCB7IFJvdXRlckV4dGVuc2lvbnMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQgeyBTd2l0Y2ggfSBmcm9tIFwidWkvc3dpdGNoXCI7XG5pbXBvcnQgKiBhcyBUb2FzdCBmcm9tICduYXRpdmVzY3JpcHQtdG9hc3QnO1xuXG5pbXBvcnQgKiBhcyBhcHBsaWNhdGlvbiBmcm9tICdhcHBsaWNhdGlvbic7XG5pbXBvcnQgeyBBbmRyb2lkQXBwbGljYXRpb24sIEFuZHJvaWRBY3Rpdml0eUJhY2tQcmVzc2VkRXZlbnREYXRhIH0gZnJvbSBcImFwcGxpY2F0aW9uXCI7XG5pbXBvcnQgeyBpc0FuZHJvaWQgfSBmcm9tIFwicGxhdGZvcm1cIjtcblxuLy8gaW1wb3J0IHsgQ29udHJhY3QgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2NvbnRyYWN0L2NvbnRyYWN0XCI7XG5pbXBvcnQgeyBDb250cmFjdFNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2NvbnRyYWN0L2NvbnRyYWN0LnNlcnZpY2VcIjtcbi8vIGltcG9ydCB7IExvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2hhcmVkL2xvY2F0aW9uL2xvY2F0aW9uLmRiLnNlcnZpY2UnO1xuaW1wb3J0IHsgQmVhY29uRGF0YWJhc2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2hhcmVkL2JlYWNvbi9iZWFjb24uZGIuc2VydmljZSc7XG5pbXBvcnQgeyBJbnRlcmVzdERhdGFiYXNlU2VydmljZSB9IGZyb20gJy4uLy4uL3NoYXJlZC9pbnRlcmVzdC9pbnRlcmVzdC5kYi5zZXJ2aWNlJztcbmltcG9ydCB7IEludGVyZXN0U2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvaW50ZXJlc3QvaW50ZXJlc3Quc2VydmljZVwiO1xuaW1wb3J0IHsgc2hpbUhvc3RBdHRyaWJ1dGUgfSBmcm9tIFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvc3JjL2RvbS9kb21fcmVuZGVyZXJcIjtcblxudmFyIGFwcFNldHRpbmdzID0gcmVxdWlyZShcImFwcGxpY2F0aW9uLXNldHRpbmdzXCIpO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogXCJucy1jb250cmFjdFwiLFxuICAgIC8vIHByb3ZpZGVyczogW0NvbnRyYWN0U2VydmljZSxMb2NhdGlvbkRhdGFiYXNlU2VydmljZV0sXG4gICAgcHJvdmlkZXJzOiBbQ29udHJhY3RTZXJ2aWNlLCBCZWFjb25EYXRhYmFzZVNlcnZpY2UsIEludGVyZXN0RGF0YWJhc2VTZXJ2aWNlLCBJbnRlcmVzdFNlcnZpY2VdLFxuICAgIC8vIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9wYWdlcy9jb250cmFjdC9jb250cmFjdC5odG1sXCIsXG4gICAgc3R5bGVVcmxzOltcIi4vcGFnZXMvY29udHJhY3QvY29udHJhY3QuY3NzXCJdIFxufSlcbmV4cG9ydCBjbGFzcyBDb250cmFjdENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gICAgcHJpdmF0ZSBfbG9jYXRpb25faWQ6IG51bWJlcjtcbiAgICBwcml2YXRlIF9jdXN0b21lcl9pZDogbnVtYmVyO1xuICAgIC8vIHByaXZhdGUgX2NvbnRyYWN0OiBDb250cmFjdDtcblxuICAgIG1pbnV0ZXM6IG51bWJlcjtcbiAgICBleHBpcmVCeVRpbWU6IHN0cmluZztcbiAgICBhdXRvYXV0aG9yaXplOiBzdHJpbmc7XG4gICAgYmVoYXZpb3VyVHJhY2tpbmc6IHN0cmluZztcbiAgICBzaGVsZkluZm86IHN0cmluZztcblxuICAgIHB1YmxpYyBhYWM6IGJvb2xlYW47XG4gICAgcHVibGljIGV0YzogYm9vbGVhbjtcbiAgICBwdWJsaWMgYmh0OiBib29sZWFuO1xuICAgIHB1YmxpYyBzaGk6IGJvb2xlYW47XG4gICAgcHVibGljIHRpdGxlOiBzdHJpbmcgPSBcIldlbGNvbWUgdG8gTmFybmlhXCI7XG5cblxuICAgIGlzQnVzeTogYm9vbGVhbjtcbiAgICBpc1NldHRpbmdzOiBib29sZWFuO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgY29udHJhY3RTZXJ2aWNlOiBDb250cmFjdFNlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgcm91dGU6IEFjdGl2YXRlZFJvdXRlLFxuICAgICAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyRXh0ZW5zaW9ucyxcbiAgICAgICAgLy8gcHJpdmF0ZSBsb2NhdGlvbkRhdGFiYXNlU2VydmljZTogTG9jYXRpb25EYXRhYmFzZVNlcnZpY2VcbiAgICAgICAgcHJpdmF0ZSBpbnRlcmVzdERhdGFiYXNlU2VydmljZTogSW50ZXJlc3REYXRhYmFzZVNlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgaW50ZXJlc3RTZXJ2aWNlOiBJbnRlcmVzdFNlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgYmVhY29uRGF0YWJhc2VTZXJ2aWNlOiBCZWFjb25EYXRhYmFzZVNlcnZpY2VcbiAgICApIHsgXG4gICAgICBjb25zb2xlLmxvZyhcIkluIENyZWF0ZSBjb250cmFjdCBjb25zdHJ1Y3Rvci5cIilcbiAgICAgIHRoaXMuZXhwaXJlQnlUaW1lID0gXCJPRkZcIjtcbiAgICAgIHRoaXMuZXRjID0gZmFsc2VcbiAgICAgIHRoaXMuYXV0b2F1dGhvcml6ZSA9IFwiT05cIjtcbiAgICAgIHRoaXMuYWFjID0gdHJ1ZTsgIFxuICAgICAgdGhpcy5iZWhhdmlvdXJUcmFja2luZyA9IFwiT05cIjtcbiAgICAgIHRoaXMuYmh0ID0gdHJ1ZTsgXG4gICAgICB0aGlzLnNoZWxmSW5mbyA9IFwiT05cIjtcbiAgICAgIHRoaXMuc2hpID0gdHJ1ZTtcblxuICAgICAgIFxuICAgICAgIFxuICAgICAgLy8gIHRoaXMuX2NvbnRyYWN0ID0gbnVsbDtcbiAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgIHRoaXMuaXNTZXR0aW5ncyA9IGZhbHNlO1xuXG4gICAgICB0aGlzLm1pbnV0ZXMgPSAxMDtcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiaW5pdCB0aW1lOiBcIit0aGlzLm1pbnV0ZXMpO1xuICAgIH1cblxuICAgIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgdGhpcy5fbG9jYXRpb25faWQgPSBwYXJzZUludCh0aGlzLnJvdXRlLnNuYXBzaG90LnBhcmFtc1tcImxvY2F0aW9uX2lkXCJdKTtcbiAgICAgIHRoaXMuaXNTZXR0aW5ncyA9ICh0aGlzLnJvdXRlLnNuYXBzaG90LnBhcmFtc1tcInNldHRpbmdzXCJdKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiaXMgc2V0dGluZ3M6IFwiK3RoaXMuaXNTZXR0aW5ncyk7XG5cbiAgICAgIC8vIGFsZXJ0KFwiV2FpdCBmb3IgaXQuLiB3aXRoIGxvY2F0aW9uIGlkOiBcIit0aGlzLl9sb2NhdGlvbl9pZCk7XG4gICAgICBcbiAgICAgIC8vIHRoaXMubG9jYXRpb25EYXRhYmFzZVNlcnZpY2Uuc2VsZWN0TG9jYXRpb24odGhpcy5fbG9jYXRpb25faWQpXG4gICAgICAvLyB0aGlzLnRpdGxlID0gXCJBdCBcIit0aGlzLmxvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlLnNlbGVjdExvY2F0aW9uKHRoaXMuX2xvY2F0aW9uX2lkKVsxXTtcbiAgICAgIHRoaXMudGl0bGUgPSBcIkF0IFwiK3RoaXMuYmVhY29uRGF0YWJhc2VTZXJ2aWNlLnNlbGVjdEJlYWNvbkJ5TG9jYXRpb24odGhpcy5fbG9jYXRpb25faWQpWzZdK1wiIHN0b3JlXCI7XG4gICAgICAvLyBhbGVydChcInN0dWZmOlwiKyB0aGlzLmxvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlLnNlbGVjdExvY2F0aW9uKHRoaXMuX2xvY2F0aW9uX2lkKVsxXSk7XG5cbiAgICAgIGlmIChpc0FuZHJvaWQpIHtcbiAgICAgICAgYXBwbGljYXRpb24uYW5kcm9pZC5vbihBbmRyb2lkQXBwbGljYXRpb24uYWN0aXZpdHlCYWNrUHJlc3NlZEV2ZW50LCAoZGF0YTogQW5kcm9pZEFjdGl2aXR5QmFja1ByZXNzZWRFdmVudERhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLmdvTWFpbigpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgdHJ5e1xuICAgICAgICB0aGlzLl9jdXN0b21lcl9pZCA9IGFwcFNldHRpbmdzLmdldE51bWJlcihcInVzZXJfaWRcIik7XG4gICAgICB9Y2F0Y2goZSl7XG4gICAgICAgIHRoaXMuX2N1c3RvbWVyX2lkID0gMDtcbiAgICAgIH0gICBcblxuICAgICAgXG4gICAgICBpZiAodGhpcy5pc1NldHRpbmdzID09IHRydWUpe1xuICAgICAgICB0aGlzLmlzQnVzeSA9IHRydWU7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiaW4gc2V0dGluZ3NcIik7XG4gICAgICAgIHRoaXMuY29udHJhY3RTZXJ2aWNlLmdldEFjdGl2ZUNvbnRyYWN0KHRoaXMuX2N1c3RvbWVyX2lkLCB0aGlzLl9sb2NhdGlvbl9pZClcbiAgICAgICAgICAuc3Vic2NyaWJlKHJlc3BvbnNlQ29udHJhY3QgPT4ge1xuICAgICAgICAgICAgaWYgKCFyZXNwb25zZUNvbnRyYWN0Lm1lc3NhZ2UgJiYgcmVzcG9uc2VDb250cmFjdC5zdGF0dXMgIT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJubyBtZXNzYWdlIDopLCBzdGF0dXM6IFwiK3Jlc3BvbnNlQ29udHJhY3Quc3RhdHVzKTtcbiAgICAgICAgICAgICAgaWYoIXJlc3BvbnNlQ29udHJhY3QuYXV0b19hdXRob3JpemUpe1xuICAgICAgICAgICAgICAgIHRoaXMuYXV0b2F1dGhvcml6ZSA9IFwiT0ZGXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5hYWMgPSBmYWxzZTsgIFxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYocmVzcG9uc2VDb250cmFjdC5vcHRpb25zLmV4cGlyZV9tZXRob2QgPT0gJ3RpbWUnKXtcbiAgICAgICAgICAgICAgICB0aGlzLmV4cGlyZUJ5VGltZSA9IFwiT05cIjtcbiAgICAgICAgICAgICAgICB0aGlzLmV0YyA9IHRydWU7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZihyZXNwb25zZUNvbnRyYWN0Lm9wdGlvbnMuYmVoYXZpb3VyX3RyYWNraW5nID09IGZhbHNlKXtcbiAgICAgICAgICAgICAgICB0aGlzLmJlaGF2aW91clRyYWNraW5nID0gXCJPRkZcIjtcbiAgICAgICAgICAgICAgICB0aGlzLmJodCA9IGZhbHNlO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYocmVzcG9uc2VDb250cmFjdC5vcHRpb25zLnNoZWxmX2luZm8gPT0gZmFsc2Upe1xuICAgICAgICAgICAgICAgIHRoaXMuc2hlbGZJbmZvID0gXCJPRkZcIjtcbiAgICAgICAgICAgICAgICB0aGlzLnNoaSA9IGZhbHNlO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm1lc3NhZ2U6XCIrcmVzcG9uc2VDb250cmFjdC5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgLy8gYWxlcnQoXCJDb250cmFjdCBleHBpcmVkLlwiKTtcbiAgICAgICAgICAgICAgdGhpcy5nb01haW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgICAgfSxlcnJvciA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGluIGNvbnRyYWN0XCIpO1xuICAgICAgICAgICAgaWYgKGVycm9yLnN0YXR1cyAhPSA0MDQpe1xuICAgICAgICAgICAgICBhbGVydChcIkVycm9yIGdldHRpbmcgYWN0aXZlIGNvbnRyYWN0IGluZm9ybWF0aW9uOiBcIitlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5nb01haW4oKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgcHVibGljIGV4cGlyZUJ5VGltZUV2ZW50KGFyZ3MpIHtcbiAgICAgICAgbGV0IHN3aXRjaEJveCA9IDxTd2l0Y2g+YXJncy5vYmplY3Q7XG4gICAgICAgIGlmIChzd2l0Y2hCb3guY2hlY2tlZCkge1xuICAgICAgICAgICAgdGhpcy5leHBpcmVCeVRpbWUgPSBcIk9OXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmV4cGlyZUJ5VGltZSA9IFwiT0ZGXCI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXV0b2F1dGhvcml6ZUV2ZW50KGFyZ3MpIHtcbiAgICAgICAgbGV0IHN3aXRjaEJveCA9IDxTd2l0Y2g+YXJncy5vYmplY3Q7XG4gICAgICAgIGlmIChzd2l0Y2hCb3guY2hlY2tlZCkge1xuICAgICAgICAgICAgdGhpcy5hdXRvYXV0aG9yaXplID0gXCJPTlwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hdXRvYXV0aG9yaXplID0gXCJPRkZcIjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBiZWhhdmlvdXJUcmFja2luZ0V2ZW50KGFyZ3MpIHtcbiAgICAgIGxldCBzd2l0Y2hCb3ggPSA8U3dpdGNoPmFyZ3Mub2JqZWN0O1xuICAgICAgaWYgKHN3aXRjaEJveC5jaGVja2VkKSB7XG4gICAgICAgICAgdGhpcy5iZWhhdmlvdXJUcmFja2luZyA9IFwiT05cIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5iZWhhdmlvdXJUcmFja2luZyA9IFwiT0ZGXCI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHNoZWxmSW5mb0V2ZW50KGFyZ3MpIHtcbiAgICAgIGxldCBzd2l0Y2hCb3ggPSA8U3dpdGNoPmFyZ3Mub2JqZWN0O1xuICAgICAgaWYgKHN3aXRjaEJveC5jaGVja2VkKSB7XG4gICAgICAgICAgdGhpcy5zaGVsZkluZm8gPSBcIk9OXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2hlbGZJbmZvID0gXCJPRkZcIjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVDb250cmFjdCgpe1xuICAgICAgdGhpcy5pc0J1c3kgPSB0cnVlO1xuICAgICAgbGV0IGF1dG9fYXV0aG9yaXplO1xuICAgICAgaWYgKHRoaXMuYXV0b2F1dGhvcml6ZSA9PSBcIk9OXCIpXG4gICAgICAgIGF1dG9fYXV0aG9yaXplID0gdHJ1ZTtcbiAgICAgIGVsc2VcbiAgICAgICAgYXV0b19hdXRob3JpemUgPSBmYWxzZTtcbiAgICAgIFxuICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgIFwiZXhwaXJlX21ldGhvZFwiOlwiXCIsXG4gICAgICAgIFwiYmVoYXZpb3VyX3RyYWNraW5nXCI6dHJ1ZSxcbiAgICAgICAgXCJzaGVsZl9pbmZvXCI6dHJ1ZVxuICAgICAgfTtcblxuICAgICAgbGV0IGV4cGlyZV9tZXRob2QgPSBcImxvY2F0aW9uXCI7XG4gICAgICBpZiAodGhpcy5leHBpcmVCeVRpbWUgPT0gXCJPTlwiKXtcbiAgICAgICAgZXhwaXJlX21ldGhvZCA9IFwidGltZVwiO1xuICAgICAgfVxuICAgICAgb3B0aW9ucy5leHBpcmVfbWV0aG9kID0gZXhwaXJlX21ldGhvZDtcblxuICAgICAgbGV0IGJlaGF2aW91cl90cmFja2luZyA9IHRydWU7XG4gICAgICBpZih0aGlzLmJlaGF2aW91clRyYWNraW5nID09IFwiT0ZGXCIpe1xuICAgICAgICBcbiAgICAgICAgYmVoYXZpb3VyX3RyYWNraW5nID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBvcHRpb25zLmJlaGF2aW91cl90cmFja2luZyA9IGJlaGF2aW91cl90cmFja2luZztcblxuICAgICAgbGV0IHNoZWxmX2luZm8gPSB0cnVlO1xuICAgICAgaWYodGhpcy5zaGVsZkluZm8gPT0gXCJPRkZcIil7XG4gICAgICAgIFxuICAgICAgICBzaGVsZl9pbmZvID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBvcHRpb25zLnNoZWxmX2luZm8gPSBzaGVsZl9pbmZvO1xuICAgICAgXG4gICAgICBsZXQgY29udHJhY3REYXRhPXtcbiAgICAgICAgXCJsb2NhdGlvbl9pZFwiOiB0aGlzLl9sb2NhdGlvbl9pZCxcbiAgICAgICAgXCJhdXRvX2F1dGhvcml6ZVwiOiBhdXRvX2F1dGhvcml6ZSxcbiAgICAgICAgLy8gXCJleHBpcmVcIjogdGhpcy50aW1lLm1pbnV0ZXMsXG4gICAgICAgIFwiZXhwaXJlXCI6IHRoaXMubWludXRlcyxcbiAgICAgICAgXCJvcHRpb25zXCI6IG9wdGlvbnNcbiAgICAgIH07XG4gICAgICBcbiAgICAgIHRoaXMuY29udHJhY3RTZXJ2aWNlLmNyZWF0ZUNvbnRyYWN0KGNvbnRyYWN0RGF0YSlcbiAgICAgIC5zdWJzY3JpYmUocmVzcG9uc2UgPT4geyBcbiAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgVG9hc3QubWFrZVRleHQoXCJDb250cmFjdCBjcmVhdGVkIHN1Y2Nlc2Z1bGx5IVwiKS5zaG93KCk7XG4gICAgICAgIHRoaXMuZ29NYWluKCk7XG4gICAgICB9LGVycm9yID0+IHtcbiAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgYWxlcnQoXCJFcnJvciBjcmVhdGluZyB0aGUgY29udHJhY3Q6IFwiK2Vycm9yKTtcbiAgICAgICAgdGhpcy5nb01haW4oKTtcbiAgICAgICAgLy8gdGhyb3cgbmV3IEVycm9yKGVycm9yKTtcbiAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgZXhwaXJlQ29udHJhY3QoKXtcbiAgICAgIHRoaXMuaXNCdXN5ID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUubG9nKFwiZXhwaXJpbmcgY29udHJhY3QgaW4gc2V0dGluZ3NcIik7XG5cbiAgICAgIC8vIGxldCBmaW5pc2hlZEludGVyZXN0cyA9IHRoaXMuaW50ZXJlc3REYXRhYmFzZVNlcnZpY2UuZmluaXNoSW50ZXJlc3RzKCk7IFxuICAgICAgLy8gaWYgKGZpbmlzaGVkSW50ZXJlc3RzLmxlbmd0aCA+IDApe1xuICAgICAgLy8gICBmaW5pc2hlZEludGVyZXN0cy5mb3JFYWNoKGludGVyZXN0PT57XG4gICAgICAvLyAgICAgLy8gc2VuZCBpbnRlcmVzdFxuICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyBpbnRlcmVzdCBmcm9tIGZpbmlzaCBpbnRlcmVzdDogXCIraW50ZXJlc3QuYmVhY29uKTtcbiAgICAgIC8vICAgICBjb25zb2xlLmxvZyhcIkFjdHVhbCBpbXBsZW1lbnRhdGlvbiBwZW5kaW5nLi5cIik7XG5cbiAgICAgIC8vICAgICBUb2FzdC5tYWtlVGV4dChcIkludGVyZXN0IHN0b3JlZC5cIikuc2hvdygpO1xuICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwiSW50ZXJlc3Qgc3RvcmVkLlwiKVxuICAgICAgLy8gICB9KTtcbiAgICAgIC8vIH1cblxuICAgICAgdGhpcy52ZXJpZnlJbnRlcmVzdCgpO1xuXG4gICAgICAvLyAvLyBSZXRyaXZlIGFsbCBpbnRlcmVzdHMgKHNob3VsZCBiZSBtYXggMSlcbiAgICAgIC8vIGxldCBpbnRlcmVzdHMgPSB0aGlzLmludGVyZXN0RGF0YWJhc2VTZXJ2aWNlLnNlbGVjdEludGVyZXN0cygpO1xuXG4gICAgICAvLyBjb25zb2xlLmxvZyhcImhvdyBtYW55IGludGVyc3RzIHRvIGZpbmlzaDogXCIraW50ZXJlc3RzLmxlbmd0aCk7XG4gICAgICAvLyAvLyBpZiB0aGVyZSBpcyBhbiBpbnRlcmVzdCBcbiAgICAgIC8vIGlmIChpbnRlcmVzdHMubGVuZ3RoID4gMCl7XG4gICAgICAvLyAgICAgaW50ZXJlc3RzLmZvckVhY2goaW50ZXJlc3QgPT57XG4gICAgICAvLyAgICAgbGV0IHN0YXJ0ID0gbmV3IERhdGUoaW50ZXJlc3Quc3RhcnQpO1xuICAgICAgLy8gICAgIGxldCBlbmQgPSBuZXcgRGF0ZShpbnRlcmVzdC5lbmQpO1xuICAgICAgLy8gICAgIGxldCBkdXJhdGlvbiA9IGVuZC5nZXRUaW1lKCkgLSBzdGFydC5nZXRUaW1lKCk7XG4gICAgICAvLyAgICAgbGV0IHNpbmNlTGFzdCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gZW5kLmdldFRpbWUoKTtcbiAgICAgIC8vICAgICBjb25zb2xlLmxvZyhcIkludGVyZXN0OiBcIitpbnRlcmVzdC5iZWFjb24rXCIsIHNpbmNlTGFzdDogXCIrc2luY2VMYXN0K1wiLCBkdXJhdGlvbjogXCIrZHVyYXRpb24pO1xuICAgICAgICAgIFxuICAgICAgLy8gICAgIC8vIGlmIGR1cmF0aW9uICA+IDEgbWludXRlIHRoZW4gc2VuZCBpbnRlcmVzdFxuICAgICAgLy8gICAgIGlmKCBkdXJhdGlvbiA+IDYwMDAwKXtcbiAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2coXCJTZW5kaW5nIGludGVyZXN0IGI6IFwiK2ludGVyZXN0LmJlYWNvbilcbiAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2coXCJBY3R1YWwgaW1wbGVtZW50YXRpb24gcGVuZGluZy4uXCIpO1xuICAgICAgLy8gICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkludGVyZXN0IHN0b3JlZC5cIikuc2hvdygpO1xuICAgICAgLy8gICAgIH1cbiAgICAgIC8vICAgICBjb25zb2xlLmxvZyhcIkRlbGV0aW5nIGludGVyZXN0IGR1ZSB0byBleHBpcmluZyBjb250cmFjdDogXCIraW50ZXJlc3QuYmVhY29uKTtcbiAgICAgIC8vICAgICB0aGlzLmludGVyZXN0RGF0YWJhc2VTZXJ2aWNlLmRlbGV0ZUludGVyZXN0KGludGVyZXN0LmlkKTtcbiAgICAgICAgICBcbiAgICAgIC8vICAgICB9KTtcbiAgICAgIC8vIH1cblxuICAgICAgdGhpcy5jb250cmFjdFNlcnZpY2UuZXhwaXJlQ29udHJhY3QodGhpcy5fbG9jYXRpb25faWQsIHRoaXMuX2N1c3RvbWVyX2lkKVxuICAgICAgICAuc3Vic2NyaWJlKHJlc3BvbnNlQ29udHJhY3QgPT4ge1xuICAgICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgICAgLy8gYWxlcnQoXCJDb250cmFjdCBleHBpcmVkIHN1Y2Nlc2Z1bGx5IVwiKTtcbiAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkNvbnRyYWN0IGV4cGlyZWQgc3VjY2VzZnVsbHkhXCIpLnNob3coKTtcbiAgICAgICAgICB0aGlzLmdvTWFpbigpO1xuICAgICAgICB9LGVycm9yID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGluIGNvbnRyYWN0XCIpO1xuICAgICAgICAgIGlmIChlcnJvci5zdGF0dXMgIT0gNDA0KXtcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgZXhwaXJpbmcgdGhlIGNvbnRyYWN0OiBcIitlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5nb01haW4oKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdmVyaWZ5SW50ZXJlc3QoKXtcbiAgICAgIC8vIFJldHJpdmUgYWxsIGludGVyZXN0cyAoc2hvdWxkIGJlIG1heCAxKVxuICAgICAgbGV0IGludGVyZXN0cyA9IHRoaXMuaW50ZXJlc3REYXRhYmFzZVNlcnZpY2Uuc2VsZWN0SW50ZXJlc3RzKCk7XG4gIFxuICAgICAgY29uc29sZS5sb2coXCJob3cgbWFueSBpbnRlcnN0cyBjYy46IFwiK2ludGVyZXN0cy5sZW5ndGgpO1xuICAgICAgLy8gaWYgdGhlcmUgaXMgYW4gaW50ZXJlc3QgXG4gICAgICBpZiAoaW50ZXJlc3RzLmxlbmd0aCA+IDApe1xuICAgICAgICBpbnRlcmVzdHMuZm9yRWFjaChpbnRlcmVzdCA9PntcbiAgICAgICAgICBsZXQgc3RhcnQgPSBuZXcgRGF0ZShpbnRlcmVzdC5zdGFydCk7XG4gICAgICAgICAgbGV0IGVuZCA9IG5ldyBEYXRlKGludGVyZXN0LmVuZCk7XG4gICAgICAgICAgbGV0IGR1cmF0aW9uID0gZW5kLmdldFRpbWUoKSAtIHN0YXJ0LmdldFRpbWUoKTtcbiAgICAgICAgICBsZXQgc2luY2VMYXN0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSBlbmQuZ2V0VGltZSgpO1xuICAgICAgICAgIC8vIGlmIHNpbmNlTGFzdCA+IDYwIHNlY29uZHMgPC0gdGhpcyBpcyBjcnVjaWFsIGZvciBrbm93aW5nIGlmIGl0IGlzIGF3YXlcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkludGVyZXN0IGNjLjogXCIraW50ZXJlc3QuYmVhY29uK1wiLCBzaW5jZUxhc3Q6IFwiK3NpbmNlTGFzdCtcIiwgZHVyYXRpb246IFwiK2R1cmF0aW9uKTtcbiAgICAgICAgICBpZihzaW5jZUxhc3QgPiA2MDAwMCl7XG4gICAgICAgICAgICAvLyBpZiBkdXJhdGlvbiAgPiAxIG1pbnV0ZSB0aGVuIHNlbmQgaW50ZXJlc3RcbiAgICAgICAgICAgIGlmKCBkdXJhdGlvbiA+IDYwMDAwKXtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTZW5kaW5nIGludGVyZXN0IGNjLjogXCIraW50ZXJlc3QuYmVhY29uKVxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkFjdHVhbCBpbXBsZW1lbnRhdGlvbiBwZW5kaW5nLi4gd29yayBpbiBwcm9ncmVzcy4uXCIpO1xuICAgICAgICAgICAgICB0aGlzLmludGVyZXN0U2VydmljZS5jcmVhdGVJbnRlcmVzdChpbnRlcmVzdCkuc3Vic2NyaWJlKHJlc3BvbnNlID0+IHsgXG4gICAgICAgICAgICAgICAgLy8gdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkludGVyZXN0IFNlbnQhICBjYy5cIikuc2hvdygpO1xuICAgICAgICAgICAgICB9LGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3Igc2VuZGluZyB0aGUgaW50ZXJlc3Q6IFwiK2Vycm9yKTtcbiAgICAgICAgICAgICAgICAvLyB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJJbnRlcmVzdCBzdG9yZWQuXCIpLnNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRGVsZXRpbmcgaW50ZXJlc3QgZHVlIHRvIG1vcmUgdGhhbiAxIG1pbnV0ZSBhd2F5IGNjLjogXCIraW50ZXJlc3QuaWQpO1xuICAgICAgICAgICAgdGhpcy5pbnRlcmVzdERhdGFiYXNlU2VydmljZS5kZWxldGVJbnRlcmVzdChpbnRlcmVzdC5pZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gIFxuICAgIH1cblxuICAgIC8vIHZlcmlmeUJlaGF2aW91cigpe1xuICAgIC8vICAgLy8gUmV0cml2ZSBhbGwgaW50ZXJlc3RzIChzaG91bGQgYmUgbWF4IDEpXG4gICAgLy8gICBsZXQgaW50ZXJlc3RzID0gdGhpcy5pbnRlcmVzdERhdGFiYXNlU2VydmljZS5zZWxlY3RJbnRlcmVzdHMoKTtcblxuICAgIC8vICAgY29uc29sZS5sb2coXCJob3cgbWFueSBpbnRlcnN0czogXCIraW50ZXJlc3RzLmxlbmd0aCk7XG4gICAgLy8gICAvLyBpZiB0aGVyZSBpcyBhbiBpbnRlcmVzdCBcbiAgICAvLyAgIGlmIChpbnRlcmVzdHMubGVuZ3RoID4gMCl7XG4gICAgLy8gICAgIGludGVyZXN0cy5mb3JFYWNoKGludGVyZXN0ID0+e1xuICAgIC8vICAgICAgIGxldCBzdGFydCA9IG5ldyBEYXRlKGludGVyZXN0WzNdKTtcbiAgICAvLyAgICAgICBsZXQgZW5kID0gbmV3IERhdGUoaW50ZXJlc3RbNF0pO1xuICAgIC8vICAgICAgIGxldCBkdXJhdGlvbiA9IGVuZC5nZXRUaW1lKCkgLSBzdGFydC5nZXRUaW1lKCk7XG4gICAgLy8gICAgICAgbGV0IHNpbmNlTGFzdCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gZW5kLmdldFRpbWUoKTtcbiAgICAvLyAgICAgICAvLyBpZiBzaW5jZUxhc3QgPiA2MCBzZWNvbmRzIDwtIHRoaXMgaXMgY3J1Y2lhbCBmb3Iga25vd2luZyBpZiBpdCBpcyBhd2F5XG4gICAgLy8gICAgICAgaWYoc2luY2VMYXN0ID4gNjAwMDApe1xuICAgIC8vICAgICAgICAgLy8gaWYgZHVyYXRpb24gID4gMSBtaW51dGUgdGhlbiBzZW5kIGludGVyZXN0XG4gICAgLy8gICAgICAgICBpZiggZHVyYXRpb24gPiA2MDAwMCl7XG4gICAgLy8gICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyBpbnRlcmVzdCBiOiBcIitpbnRlcmVzdFswXSlcbiAgICAvLyAgICAgICAgICAgY29uc29sZS5sb2coXCJBY3R1YWwgaW1wbGVtZW50YXRpb24gcGVuZGluZy4uXCIpO1xuICAgIC8vICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkludGVyZXN0IHN0b3JlZC5cIikuc2hvdygpO1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICAgICAgY29uc29sZS5sb2coXCJEZWxldGluZyBpbnRlcmVzdCBkdWUgdG8gbW9yZSB0aGFuIDEgbWludXRlIGF3YXk6IFwiK2ludGVyZXN0WzBdKTtcbiAgICAvLyAgICAgICAgIHRoaXMuaW50ZXJlc3REYXRhYmFzZVNlcnZpY2UuZGVsZXRlSW50ZXJlc3QoaW50ZXJlc3RbMF0pO1xuICAgIC8vICAgICAgIH1cbiAgICAvLyAgICAgfSk7XG4gICAgLy8gICB9XG4gICAgLy8gfVxuXG4gICAgcHVibGljIGNhbmNlbCgpe1xuICAgICAgdGhpcy5nb01haW4oKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ29NYWluKCl7XG4gICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvbWFpblwiXSwge1xuICAgICAgICAgIC8vIGFuaW1hdGlvbjogdHJ1ZSxcbiAgICAgICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVSaWdodFwiLFxuICAgICAgICAgICAgICBkdXJhdGlvbjogMjAwLFxuICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufSJdfQ==