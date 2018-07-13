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
var ContractComponent = (function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJhY3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29udHJhY3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXlFO0FBQ3pFLDBDQUFpRDtBQUNqRCxzREFBK0Q7QUFFL0QsMENBQTRDO0FBRTVDLHlDQUEyQztBQUMzQywyQ0FBc0Y7QUFDdEYscUNBQXFDO0FBRXJDLDZEQUE2RDtBQUM3RCwyRUFBeUU7QUFDekUsdUZBQXVGO0FBQ3ZGLDJFQUE4RTtBQUM5RSxpRkFBb0Y7QUFDcEYsMkVBQXlFO0FBRXpFLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBVWxEO0lBbUJJLDJCQUNZLGVBQWdDLEVBQ2hDLEtBQXFCLEVBQ3JCLE1BQXdCO1FBQ2hDLDJEQUEyRDtRQUNuRCx1QkFBZ0QsRUFDaEQsZUFBZ0MsRUFDaEMscUJBQTRDO1FBTjVDLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUNoQyxVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQUNyQixXQUFNLEdBQU4sTUFBTSxDQUFrQjtRQUV4Qiw0QkFBdUIsR0FBdkIsdUJBQXVCLENBQXlCO1FBQ2hELG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUNoQywwQkFBcUIsR0FBckIscUJBQXFCLENBQXVCO1FBYmpELFVBQUssR0FBVyxtQkFBbUIsQ0FBQztRQWV6QyxPQUFPLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxDQUFDLENBQUE7UUFDOUMsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7UUFDMUIsSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUE7UUFDaEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7UUFDMUIsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7UUFDaEIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztRQUM5QixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztR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UUFBUTthQUNsQjtTQUNGLENBQUMsQ0FBQztJQUNQLENBQUM7SUFwVVEsaUJBQWlCO1FBUjdCLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsYUFBYTtZQUN2Qix3REFBd0Q7WUFDeEQsU0FBUyxFQUFFLENBQUMsa0NBQWUsRUFBRSx5Q0FBcUIsRUFBRSw2Q0FBdUIsRUFBRSxrQ0FBZSxDQUFDO1lBQzdGLHVCQUF1QjtZQUN2QixXQUFXLEVBQUUsZ0NBQWdDO1lBQzdDLFNBQVMsRUFBQyxDQUFDLCtCQUErQixDQUFDO1NBQzlDLENBQUM7eUNBcUIrQixrQ0FBZTtZQUN6Qix1QkFBYztZQUNiLHlCQUFnQjtZQUVDLDZDQUF1QjtZQUMvQixrQ0FBZTtZQUNULHlDQUFxQjtPQTFCL0MsaUJBQWlCLENBcVU3QjtJQUFELHdCQUFDO0NBQUEsQUFyVUQsSUFxVUM7QUFyVVksOENBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcbmltcG9ydCB7IFJvdXRlckV4dGVuc2lvbnMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQgeyBTd2l0Y2ggfSBmcm9tIFwidWkvc3dpdGNoXCI7XG5pbXBvcnQgKiBhcyBUb2FzdCBmcm9tICduYXRpdmVzY3JpcHQtdG9hc3QnO1xuXG5pbXBvcnQgKiBhcyBhcHBsaWNhdGlvbiBmcm9tICdhcHBsaWNhdGlvbic7XG5pbXBvcnQgeyBBbmRyb2lkQXBwbGljYXRpb24sIEFuZHJvaWRBY3Rpdml0eUJhY2tQcmVzc2VkRXZlbnREYXRhIH0gZnJvbSBcImFwcGxpY2F0aW9uXCI7XG5pbXBvcnQgeyBpc0FuZHJvaWQgfSBmcm9tIFwicGxhdGZvcm1cIjtcblxuLy8gaW1wb3J0IHsgQ29udHJhY3QgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2NvbnRyYWN0L2NvbnRyYWN0XCI7XG5pbXBvcnQgeyBDb250cmFjdFNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2NvbnRyYWN0L2NvbnRyYWN0LnNlcnZpY2VcIjtcbi8vIGltcG9ydCB7IExvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2hhcmVkL2xvY2F0aW9uL2xvY2F0aW9uLmRiLnNlcnZpY2UnO1xuaW1wb3J0IHsgQmVhY29uRGF0YWJhc2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2hhcmVkL2JlYWNvbi9iZWFjb24uZGIuc2VydmljZSc7XG5pbXBvcnQgeyBJbnRlcmVzdERhdGFiYXNlU2VydmljZSB9IGZyb20gJy4uLy4uL3NoYXJlZC9pbnRlcmVzdC9pbnRlcmVzdC5kYi5zZXJ2aWNlJztcbmltcG9ydCB7IEludGVyZXN0U2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvaW50ZXJlc3QvaW50ZXJlc3Quc2VydmljZVwiO1xuXG52YXIgYXBwU2V0dGluZ3MgPSByZXF1aXJlKFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIik7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiBcIm5zLWNvbnRyYWN0XCIsXG4gICAgLy8gcHJvdmlkZXJzOiBbQ29udHJhY3RTZXJ2aWNlLExvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlXSxcbiAgICBwcm92aWRlcnM6IFtDb250cmFjdFNlcnZpY2UsIEJlYWNvbkRhdGFiYXNlU2VydmljZSwgSW50ZXJlc3REYXRhYmFzZVNlcnZpY2UsIEludGVyZXN0U2VydmljZV0sXG4gICAgLy8gbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgICB0ZW1wbGF0ZVVybDogXCIuL3BhZ2VzL2NvbnRyYWN0L2NvbnRyYWN0Lmh0bWxcIixcbiAgICBzdHlsZVVybHM6W1wiLi9wYWdlcy9jb250cmFjdC9jb250cmFjdC5jc3NcIl0gXG59KVxuZXhwb3J0IGNsYXNzIENvbnRyYWN0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgICBwcml2YXRlIF9sb2NhdGlvbl9pZDogbnVtYmVyO1xuICAgIHByaXZhdGUgX2N1c3RvbWVyX2lkOiBudW1iZXI7XG4gICAgLy8gcHJpdmF0ZSBfY29udHJhY3Q6IENvbnRyYWN0O1xuXG4gICAgbWludXRlczogbnVtYmVyO1xuICAgIGV4cGlyZUJ5VGltZTogc3RyaW5nO1xuICAgIGF1dG9hdXRob3JpemU6IHN0cmluZztcbiAgICBiZWhhdmlvdXJUcmFja2luZzogc3RyaW5nO1xuXG4gICAgcHVibGljIGFhYzogYm9vbGVhbjtcbiAgICBwdWJsaWMgZXRjOiBib29sZWFuO1xuICAgIHB1YmxpYyBiaHQ6IGJvb2xlYW47XG4gICAgcHVibGljIHRpdGxlOiBzdHJpbmcgPSBcIldlbGNvbWUgdG8gTmFybmlhXCI7XG5cblxuICAgIGlzQnVzeTogYm9vbGVhbjtcbiAgICBpc1NldHRpbmdzOiBib29sZWFuO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgY29udHJhY3RTZXJ2aWNlOiBDb250cmFjdFNlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgcm91dGU6IEFjdGl2YXRlZFJvdXRlLFxuICAgICAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyRXh0ZW5zaW9ucyxcbiAgICAgICAgLy8gcHJpdmF0ZSBsb2NhdGlvbkRhdGFiYXNlU2VydmljZTogTG9jYXRpb25EYXRhYmFzZVNlcnZpY2VcbiAgICAgICAgcHJpdmF0ZSBpbnRlcmVzdERhdGFiYXNlU2VydmljZTogSW50ZXJlc3REYXRhYmFzZVNlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgaW50ZXJlc3RTZXJ2aWNlOiBJbnRlcmVzdFNlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgYmVhY29uRGF0YWJhc2VTZXJ2aWNlOiBCZWFjb25EYXRhYmFzZVNlcnZpY2VcbiAgICApIHsgXG4gICAgICBjb25zb2xlLmxvZyhcIkluIENyZWF0ZSBjb250cmFjdCBjb25zdHJ1Y3Rvci5cIilcbiAgICAgIHRoaXMuZXhwaXJlQnlUaW1lID0gXCJPRkZcIjtcbiAgICAgIHRoaXMuZXRjID0gZmFsc2VcbiAgICAgIHRoaXMuYXV0b2F1dGhvcml6ZSA9IFwiT05cIjtcbiAgICAgIHRoaXMuYWFjID0gdHJ1ZTsgIFxuICAgICAgdGhpcy5iZWhhdmlvdXJUcmFja2luZyA9IFwiT05cIjtcbiAgICAgIHRoaXMuYmh0ID0gdHJ1ZTsgXG4gICAgICAgXG4gICAgICAgXG4gICAgICAvLyAgdGhpcy5fY29udHJhY3QgPSBudWxsO1xuICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgdGhpcy5pc1NldHRpbmdzID0gZmFsc2U7XG5cbiAgICAgIHRoaXMubWludXRlcyA9IDEwO1xuICAgICAgLy8gY29uc29sZS5sb2coXCJpbml0IHRpbWU6IFwiK3RoaXMubWludXRlcyk7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICB0aGlzLl9sb2NhdGlvbl9pZCA9IHBhcnNlSW50KHRoaXMucm91dGUuc25hcHNob3QucGFyYW1zW1wibG9jYXRpb25faWRcIl0pO1xuICAgICAgdGhpcy5pc1NldHRpbmdzID0gKHRoaXMucm91dGUuc25hcHNob3QucGFyYW1zW1wic2V0dGluZ3NcIl0pO1xuICAgICAgLy8gY29uc29sZS5sb2coXCJpcyBzZXR0aW5nczogXCIrdGhpcy5pc1NldHRpbmdzKTtcblxuICAgICAgLy8gYWxlcnQoXCJXYWl0IGZvciBpdC4uIHdpdGggbG9jYXRpb24gaWQ6IFwiK3RoaXMuX2xvY2F0aW9uX2lkKTtcbiAgICAgIFxuICAgICAgLy8gdGhpcy5sb2NhdGlvbkRhdGFiYXNlU2VydmljZS5zZWxlY3RMb2NhdGlvbih0aGlzLl9sb2NhdGlvbl9pZClcbiAgICAgIC8vIHRoaXMudGl0bGUgPSBcIkF0IFwiK3RoaXMubG9jYXRpb25EYXRhYmFzZVNlcnZpY2Uuc2VsZWN0TG9jYXRpb24odGhpcy5fbG9jYXRpb25faWQpWzFdO1xuICAgICAgdGhpcy50aXRsZSA9IFwiQXQgXCIrdGhpcy5iZWFjb25EYXRhYmFzZVNlcnZpY2Uuc2VsZWN0QmVhY29uQnlMb2NhdGlvbih0aGlzLl9sb2NhdGlvbl9pZClbNl0rXCIgc3RvcmVcIjtcbiAgICAgIC8vIGFsZXJ0KFwic3R1ZmY6XCIrIHRoaXMubG9jYXRpb25EYXRhYmFzZVNlcnZpY2Uuc2VsZWN0TG9jYXRpb24odGhpcy5fbG9jYXRpb25faWQpWzFdKTtcblxuICAgICAgaWYgKGlzQW5kcm9pZCkge1xuICAgICAgICBhcHBsaWNhdGlvbi5hbmRyb2lkLm9uKEFuZHJvaWRBcHBsaWNhdGlvbi5hY3Rpdml0eUJhY2tQcmVzc2VkRXZlbnQsIChkYXRhOiBBbmRyb2lkQWN0aXZpdHlCYWNrUHJlc3NlZEV2ZW50RGF0YSkgPT4ge1xuICAgICAgICAgIHRoaXMuZ29NYWluKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB0cnl7XG4gICAgICAgIHRoaXMuX2N1c3RvbWVyX2lkID0gYXBwU2V0dGluZ3MuZ2V0TnVtYmVyKFwidXNlcl9pZFwiKTtcbiAgICAgIH1jYXRjaChlKXtcbiAgICAgICAgdGhpcy5fY3VzdG9tZXJfaWQgPSAwO1xuICAgICAgfSAgIFxuXG4gICAgICBcbiAgICAgIGlmICh0aGlzLmlzU2V0dGluZ3MgPT0gdHJ1ZSl7XG4gICAgICAgIHRoaXMuaXNCdXN5ID0gdHJ1ZTtcbiAgICAgICAgY29uc29sZS5sb2coXCJpbiBzZXR0aW5nc1wiKTtcbiAgICAgICAgdGhpcy5jb250cmFjdFNlcnZpY2UuZ2V0QWN0aXZlQ29udHJhY3QodGhpcy5fY3VzdG9tZXJfaWQsIHRoaXMuX2xvY2F0aW9uX2lkKVxuICAgICAgICAgIC5zdWJzY3JpYmUocmVzcG9uc2VDb250cmFjdCA9PiB7XG4gICAgICAgICAgICBpZiAoIXJlc3BvbnNlQ29udHJhY3QubWVzc2FnZSAmJiByZXNwb25zZUNvbnRyYWN0LnN0YXR1cyAhPSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5vIG1lc3NhZ2UgOiksIHN0YXR1czogXCIrcmVzcG9uc2VDb250cmFjdC5zdGF0dXMpO1xuICAgICAgICAgICAgICBpZighcmVzcG9uc2VDb250cmFjdC5hdXRvX2F1dGhvcml6ZSl7XG4gICAgICAgICAgICAgICAgdGhpcy5hdXRvYXV0aG9yaXplID0gXCJPRkZcIjtcbiAgICAgICAgICAgICAgICB0aGlzLmFhYyA9IGZhbHNlOyAgXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZihyZXNwb25zZUNvbnRyYWN0Lm9wdGlvbnMuZXhwaXJlX21ldGhvZCA9PSAndGltZScpe1xuICAgICAgICAgICAgICAgIHRoaXMuZXhwaXJlQnlUaW1lID0gXCJPTlwiO1xuICAgICAgICAgICAgICAgIHRoaXMuZXRjID0gdHJ1ZTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIC8vIGFsZXJ0KHJlc3BvbnNlQ29udHJhY3Qub3B0aW9ucy5iZWhhdmlvdXJfdHJhY2tpbmcpO1xuICAgICAgICAgICAgICBpZihyZXNwb25zZUNvbnRyYWN0Lm9wdGlvbnMuYmVoYXZpb3VyX3RyYWNraW5nID09IGZhbHNlKXtcbiAgICAgICAgICAgICAgICB0aGlzLmJlaGF2aW91clRyYWNraW5nID0gXCJPRkZcIjtcbiAgICAgICAgICAgICAgICB0aGlzLmJodCA9IGZhbHNlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vIGFsZXJ0KHJlc3BvbnNlQ29udHJhY3Qub3B0aW9ucy5iZWhhdmlvdXJfdHJhY2tpbmcpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibWVzc2FnZTpcIityZXNwb25zZUNvbnRyYWN0Lm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAvLyBhbGVydChcIkNvbnRyYWN0IGV4cGlyZWQuXCIpO1xuICAgICAgICAgICAgICB0aGlzLmdvTWFpbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgICB9LGVycm9yID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgaW4gY29udHJhY3RcIik7XG4gICAgICAgICAgICBpZiAoZXJyb3Iuc3RhdHVzICE9IDQwNCl7XG4gICAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgZ2V0dGluZyBhY3RpdmUgY29udHJhY3QgaW5mb3JtYXRpb246IFwiK2Vycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmdvTWFpbigpO1xuICAgICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgfVxuXG4gICBwdWJsaWMgZXhwaXJlQnlUaW1lRXZlbnQoYXJncykge1xuICAgICAgICBsZXQgc3dpdGNoQm94ID0gPFN3aXRjaD5hcmdzLm9iamVjdDtcbiAgICAgICAgaWYgKHN3aXRjaEJveC5jaGVja2VkKSB7XG4gICAgICAgICAgICB0aGlzLmV4cGlyZUJ5VGltZSA9IFwiT05cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZXhwaXJlQnlUaW1lID0gXCJPRkZcIjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhdXRvYXV0aG9yaXplRXZlbnQoYXJncykge1xuICAgICAgICBsZXQgc3dpdGNoQm94ID0gPFN3aXRjaD5hcmdzLm9iamVjdDtcbiAgICAgICAgaWYgKHN3aXRjaEJveC5jaGVja2VkKSB7XG4gICAgICAgICAgICB0aGlzLmF1dG9hdXRob3JpemUgPSBcIk9OXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmF1dG9hdXRob3JpemUgPSBcIk9GRlwiO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGJlaGF2aW91clRyYWNraW5nRXZlbnQoYXJncykge1xuICAgICAgbGV0IHN3aXRjaEJveCA9IDxTd2l0Y2g+YXJncy5vYmplY3Q7XG4gICAgICBpZiAoc3dpdGNoQm94LmNoZWNrZWQpIHtcbiAgICAgICAgICB0aGlzLmJlaGF2aW91clRyYWNraW5nID0gXCJPTlwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmJlaGF2aW91clRyYWNraW5nID0gXCJPRkZcIjtcbiAgICAgICAgICAvLyBhbGVydChcIm9mZlwiKTtcbiAgICAgIH1cbiAgfVxuXG4gICAgY3JlYXRlQ29udHJhY3QoKXtcbiAgICAgIHRoaXMuaXNCdXN5ID0gdHJ1ZTtcbiAgICAgIGxldCBhdXRvX2F1dGhvcml6ZTtcbiAgICAgIGlmICh0aGlzLmF1dG9hdXRob3JpemUgPT0gXCJPTlwiKVxuICAgICAgICBhdXRvX2F1dGhvcml6ZSA9IHRydWU7XG4gICAgICBlbHNlXG4gICAgICAgIGF1dG9fYXV0aG9yaXplID0gZmFsc2U7XG4gICAgICBcbiAgICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICBcImV4cGlyZV9tZXRob2RcIjpcIlwiLFxuICAgICAgICBcImJlaGF2aW91cl90cmFja2luZ1wiOnRydWVcbiAgICAgIH07XG5cbiAgICAgIGxldCBleHBpcmVfbWV0aG9kID0gXCJsb2NhdGlvblwiO1xuICAgICAgaWYgKHRoaXMuZXhwaXJlQnlUaW1lID09IFwiT05cIil7XG4gICAgICAgIGV4cGlyZV9tZXRob2QgPSBcInRpbWVcIjtcbiAgICAgIH1cbiAgICAgIG9wdGlvbnMuZXhwaXJlX21ldGhvZCA9IGV4cGlyZV9tZXRob2Q7XG5cbiAgICAgIGxldCBiZWhhdmlvdXJfdHJhY2tpbmcgPSB0cnVlO1xuICAgICAgaWYodGhpcy5iZWhhdmlvdXJUcmFja2luZyA9PSBcIk9GRlwiKXtcbiAgICAgICAgXG4gICAgICAgIGJlaGF2aW91cl90cmFja2luZyA9IGZhbHNlO1xuICAgICAgICAvLyBhbGVydCgnaXQgaXMgb2ZmJyk7XG4gICAgICB9XG4gICAgICBvcHRpb25zLmJlaGF2aW91cl90cmFja2luZyA9IGJlaGF2aW91cl90cmFja2luZztcbiAgICAgIC8vIGFsZXJ0KG9wdGlvbnMuYmVoYXZpb3VyX3RyYWNraW5nKVxuICAgICAgXG4gICAgICBsZXQgY29udHJhY3REYXRhPXtcbiAgICAgICAgXCJsb2NhdGlvbl9pZFwiOiB0aGlzLl9sb2NhdGlvbl9pZCxcbiAgICAgICAgXCJhdXRvX2F1dGhvcml6ZVwiOiBhdXRvX2F1dGhvcml6ZSxcbiAgICAgICAgLy8gXCJleHBpcmVcIjogdGhpcy50aW1lLm1pbnV0ZXMsXG4gICAgICAgIFwiZXhwaXJlXCI6IHRoaXMubWludXRlcyxcbiAgICAgICAgXCJvcHRpb25zXCI6IG9wdGlvbnNcbiAgICAgIH07XG4gICAgICAvLyBhbGVydChjb250cmFjdERhdGEub3B0aW9ucy5iZWhhdmlvdXJfdHJhY2tpbmcpXG4gICAgICB0aGlzLmNvbnRyYWN0U2VydmljZS5jcmVhdGVDb250cmFjdChjb250cmFjdERhdGEpXG4gICAgICAuc3Vic2NyaWJlKHJlc3BvbnNlID0+IHsgXG4gICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiQ29udHJhY3QgY3JlYXRlZCBzdWNjZXNmdWxseSFcIikuc2hvdygpO1xuICAgICAgICB0aGlzLmdvTWFpbigpO1xuICAgICAgfSxlcnJvciA9PiB7XG4gICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgIGFsZXJ0KFwiRXJyb3IgY3JlYXRpbmcgdGhlIGNvbnRyYWN0OiBcIitlcnJvcik7XG4gICAgICAgIHRoaXMuZ29NYWluKCk7XG4gICAgICAgIC8vIHRocm93IG5ldyBFcnJvcihlcnJvcik7XG4gICAgICB9KTtcbiAgICB9XG5cblxuICAgIGV4cGlyZUNvbnRyYWN0KCl7XG4gICAgICB0aGlzLmlzQnVzeSA9IHRydWU7XG4gICAgICBjb25zb2xlLmxvZyhcImV4cGlyaW5nIGNvbnRyYWN0IGluIHNldHRpbmdzXCIpO1xuXG4gICAgICAvLyBsZXQgZmluaXNoZWRJbnRlcmVzdHMgPSB0aGlzLmludGVyZXN0RGF0YWJhc2VTZXJ2aWNlLmZpbmlzaEludGVyZXN0cygpOyBcbiAgICAgIC8vIGlmIChmaW5pc2hlZEludGVyZXN0cy5sZW5ndGggPiAwKXtcbiAgICAgIC8vICAgZmluaXNoZWRJbnRlcmVzdHMuZm9yRWFjaChpbnRlcmVzdD0+e1xuICAgICAgLy8gICAgIC8vIHNlbmQgaW50ZXJlc3RcbiAgICAgIC8vICAgICBjb25zb2xlLmxvZyhcIlNlbmRpbmcgaW50ZXJlc3QgZnJvbSBmaW5pc2ggaW50ZXJlc3Q6IFwiK2ludGVyZXN0LmJlYWNvbik7XG4gICAgICAvLyAgICAgY29uc29sZS5sb2coXCJBY3R1YWwgaW1wbGVtZW50YXRpb24gcGVuZGluZy4uXCIpO1xuXG4gICAgICAvLyAgICAgVG9hc3QubWFrZVRleHQoXCJJbnRlcmVzdCBzdG9yZWQuXCIpLnNob3coKTtcbiAgICAgIC8vICAgICBjb25zb2xlLmxvZyhcIkludGVyZXN0IHN0b3JlZC5cIilcbiAgICAgIC8vICAgfSk7XG4gICAgICAvLyB9XG5cbiAgICAgIHRoaXMudmVyaWZ5SW50ZXJlc3QoKTtcblxuICAgICAgLy8gLy8gUmV0cml2ZSBhbGwgaW50ZXJlc3RzIChzaG91bGQgYmUgbWF4IDEpXG4gICAgICAvLyBsZXQgaW50ZXJlc3RzID0gdGhpcy5pbnRlcmVzdERhdGFiYXNlU2VydmljZS5zZWxlY3RJbnRlcmVzdHMoKTtcblxuICAgICAgLy8gY29uc29sZS5sb2coXCJob3cgbWFueSBpbnRlcnN0cyB0byBmaW5pc2g6IFwiK2ludGVyZXN0cy5sZW5ndGgpO1xuICAgICAgLy8gLy8gaWYgdGhlcmUgaXMgYW4gaW50ZXJlc3QgXG4gICAgICAvLyBpZiAoaW50ZXJlc3RzLmxlbmd0aCA+IDApe1xuICAgICAgLy8gICAgIGludGVyZXN0cy5mb3JFYWNoKGludGVyZXN0ID0+e1xuICAgICAgLy8gICAgIGxldCBzdGFydCA9IG5ldyBEYXRlKGludGVyZXN0LnN0YXJ0KTtcbiAgICAgIC8vICAgICBsZXQgZW5kID0gbmV3IERhdGUoaW50ZXJlc3QuZW5kKTtcbiAgICAgIC8vICAgICBsZXQgZHVyYXRpb24gPSBlbmQuZ2V0VGltZSgpIC0gc3RhcnQuZ2V0VGltZSgpO1xuICAgICAgLy8gICAgIGxldCBzaW5jZUxhc3QgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIGVuZC5nZXRUaW1lKCk7XG4gICAgICAvLyAgICAgY29uc29sZS5sb2coXCJJbnRlcmVzdDogXCIraW50ZXJlc3QuYmVhY29uK1wiLCBzaW5jZUxhc3Q6IFwiK3NpbmNlTGFzdCtcIiwgZHVyYXRpb246IFwiK2R1cmF0aW9uKTtcbiAgICAgICAgICBcbiAgICAgIC8vICAgICAvLyBpZiBkdXJhdGlvbiAgPiAxIG1pbnV0ZSB0aGVuIHNlbmQgaW50ZXJlc3RcbiAgICAgIC8vICAgICBpZiggZHVyYXRpb24gPiA2MDAwMCl7XG4gICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyBpbnRlcmVzdCBiOiBcIitpbnRlcmVzdC5iZWFjb24pXG4gICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKFwiQWN0dWFsIGltcGxlbWVudGF0aW9uIHBlbmRpbmcuLlwiKTtcbiAgICAgIC8vICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJJbnRlcmVzdCBzdG9yZWQuXCIpLnNob3coKTtcbiAgICAgIC8vICAgICB9XG4gICAgICAvLyAgICAgY29uc29sZS5sb2coXCJEZWxldGluZyBpbnRlcmVzdCBkdWUgdG8gZXhwaXJpbmcgY29udHJhY3Q6IFwiK2ludGVyZXN0LmJlYWNvbik7XG4gICAgICAvLyAgICAgdGhpcy5pbnRlcmVzdERhdGFiYXNlU2VydmljZS5kZWxldGVJbnRlcmVzdChpbnRlcmVzdC5pZCk7XG4gICAgICAgICAgXG4gICAgICAvLyAgICAgfSk7XG4gICAgICAvLyB9XG5cbiAgICAgIHRoaXMuY29udHJhY3RTZXJ2aWNlLmV4cGlyZUNvbnRyYWN0KHRoaXMuX2xvY2F0aW9uX2lkLCB0aGlzLl9jdXN0b21lcl9pZClcbiAgICAgICAgLnN1YnNjcmliZShyZXNwb25zZUNvbnRyYWN0ID0+IHtcbiAgICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICAgIC8vIGFsZXJ0KFwiQ29udHJhY3QgZXhwaXJlZCBzdWNjZXNmdWxseSFcIik7XG4gICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJDb250cmFjdCBleHBpcmVkIHN1Y2Nlc2Z1bGx5IVwiKS5zaG93KCk7XG4gICAgICAgICAgdGhpcy5nb01haW4oKTtcbiAgICAgICAgfSxlcnJvciA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciBpbiBjb250cmFjdFwiKTtcbiAgICAgICAgICBpZiAoZXJyb3Iuc3RhdHVzICE9IDQwNCl7XG4gICAgICAgICAgICBhbGVydChcIkVycm9yIGV4cGlyaW5nIHRoZSBjb250cmFjdDogXCIrZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuZ29NYWluKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHZlcmlmeUludGVyZXN0KCl7XG4gICAgICAvLyBSZXRyaXZlIGFsbCBpbnRlcmVzdHMgKHNob3VsZCBiZSBtYXggMSlcbiAgICAgIGxldCBpbnRlcmVzdHMgPSB0aGlzLmludGVyZXN0RGF0YWJhc2VTZXJ2aWNlLnNlbGVjdEludGVyZXN0cygpO1xuICBcbiAgICAgIGNvbnNvbGUubG9nKFwiaG93IG1hbnkgaW50ZXJzdHMgY2MuOiBcIitpbnRlcmVzdHMubGVuZ3RoKTtcbiAgICAgIC8vIGlmIHRoZXJlIGlzIGFuIGludGVyZXN0IFxuICAgICAgaWYgKGludGVyZXN0cy5sZW5ndGggPiAwKXtcbiAgICAgICAgaW50ZXJlc3RzLmZvckVhY2goaW50ZXJlc3QgPT57XG4gICAgICAgICAgbGV0IHN0YXJ0ID0gbmV3IERhdGUoaW50ZXJlc3Quc3RhcnQpO1xuICAgICAgICAgIGxldCBlbmQgPSBuZXcgRGF0ZShpbnRlcmVzdC5lbmQpO1xuICAgICAgICAgIGxldCBkdXJhdGlvbiA9IGVuZC5nZXRUaW1lKCkgLSBzdGFydC5nZXRUaW1lKCk7XG4gICAgICAgICAgbGV0IHNpbmNlTGFzdCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gZW5kLmdldFRpbWUoKTtcbiAgICAgICAgICAvLyBpZiBzaW5jZUxhc3QgPiA2MCBzZWNvbmRzIDwtIHRoaXMgaXMgY3J1Y2lhbCBmb3Iga25vd2luZyBpZiBpdCBpcyBhd2F5XG4gICAgICAgICAgY29uc29sZS5sb2coXCJJbnRlcmVzdCBjYy46IFwiK2ludGVyZXN0LmJlYWNvbitcIiwgc2luY2VMYXN0OiBcIitzaW5jZUxhc3QrXCIsIGR1cmF0aW9uOiBcIitkdXJhdGlvbik7XG4gICAgICAgICAgaWYoc2luY2VMYXN0ID4gNjAwMDApe1xuICAgICAgICAgICAgLy8gaWYgZHVyYXRpb24gID4gMSBtaW51dGUgdGhlbiBzZW5kIGludGVyZXN0XG4gICAgICAgICAgICBpZiggZHVyYXRpb24gPiA2MDAwMCl7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyBpbnRlcmVzdCBjYy46IFwiK2ludGVyZXN0LmJlYWNvbilcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJBY3R1YWwgaW1wbGVtZW50YXRpb24gcGVuZGluZy4uIHdvcmsgaW4gcHJvZ3Jlc3MuLlwiKTtcbiAgICAgICAgICAgICAgdGhpcy5pbnRlcmVzdFNlcnZpY2UuY3JlYXRlSW50ZXJlc3QoaW50ZXJlc3QpLnN1YnNjcmliZShyZXNwb25zZSA9PiB7IFxuICAgICAgICAgICAgICAgIC8vIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJJbnRlcmVzdCBTZW50ISAgY2MuXCIpLnNob3coKTtcbiAgICAgICAgICAgICAgfSxlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBhbGVydChcIkVycm9yIHNlbmRpbmcgdGhlIGludGVyZXN0OiBcIitlcnJvcik7XG4gICAgICAgICAgICAgICAgLy8gdGhyb3cgbmV3IEVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiSW50ZXJlc3Qgc3RvcmVkLlwiKS5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkRlbGV0aW5nIGludGVyZXN0IGR1ZSB0byBtb3JlIHRoYW4gMSBtaW51dGUgYXdheSBjYy46IFwiK2ludGVyZXN0LmlkKTtcbiAgICAgICAgICAgIHRoaXMuaW50ZXJlc3REYXRhYmFzZVNlcnZpY2UuZGVsZXRlSW50ZXJlc3QoaW50ZXJlc3QuaWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9ICBcbiAgICB9XG5cbiAgICAvLyB2ZXJpZnlCZWhhdmlvdXIoKXtcbiAgICAvLyAgIC8vIFJldHJpdmUgYWxsIGludGVyZXN0cyAoc2hvdWxkIGJlIG1heCAxKVxuICAgIC8vICAgbGV0IGludGVyZXN0cyA9IHRoaXMuaW50ZXJlc3REYXRhYmFzZVNlcnZpY2Uuc2VsZWN0SW50ZXJlc3RzKCk7XG5cbiAgICAvLyAgIGNvbnNvbGUubG9nKFwiaG93IG1hbnkgaW50ZXJzdHM6IFwiK2ludGVyZXN0cy5sZW5ndGgpO1xuICAgIC8vICAgLy8gaWYgdGhlcmUgaXMgYW4gaW50ZXJlc3QgXG4gICAgLy8gICBpZiAoaW50ZXJlc3RzLmxlbmd0aCA+IDApe1xuICAgIC8vICAgICBpbnRlcmVzdHMuZm9yRWFjaChpbnRlcmVzdCA9PntcbiAgICAvLyAgICAgICBsZXQgc3RhcnQgPSBuZXcgRGF0ZShpbnRlcmVzdFszXSk7XG4gICAgLy8gICAgICAgbGV0IGVuZCA9IG5ldyBEYXRlKGludGVyZXN0WzRdKTtcbiAgICAvLyAgICAgICBsZXQgZHVyYXRpb24gPSBlbmQuZ2V0VGltZSgpIC0gc3RhcnQuZ2V0VGltZSgpO1xuICAgIC8vICAgICAgIGxldCBzaW5jZUxhc3QgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIGVuZC5nZXRUaW1lKCk7XG4gICAgLy8gICAgICAgLy8gaWYgc2luY2VMYXN0ID4gNjAgc2Vjb25kcyA8LSB0aGlzIGlzIGNydWNpYWwgZm9yIGtub3dpbmcgaWYgaXQgaXMgYXdheVxuICAgIC8vICAgICAgIGlmKHNpbmNlTGFzdCA+IDYwMDAwKXtcbiAgICAvLyAgICAgICAgIC8vIGlmIGR1cmF0aW9uICA+IDEgbWludXRlIHRoZW4gc2VuZCBpbnRlcmVzdFxuICAgIC8vICAgICAgICAgaWYoIGR1cmF0aW9uID4gNjAwMDApe1xuICAgIC8vICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNlbmRpbmcgaW50ZXJlc3QgYjogXCIraW50ZXJlc3RbMF0pXG4gICAgLy8gICAgICAgICAgIGNvbnNvbGUubG9nKFwiQWN0dWFsIGltcGxlbWVudGF0aW9uIHBlbmRpbmcuLlwiKTtcbiAgICAvLyAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJJbnRlcmVzdCBzdG9yZWQuXCIpLnNob3coKTtcbiAgICAvLyAgICAgICAgIH1cbiAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKFwiRGVsZXRpbmcgaW50ZXJlc3QgZHVlIHRvIG1vcmUgdGhhbiAxIG1pbnV0ZSBhd2F5OiBcIitpbnRlcmVzdFswXSk7XG4gICAgLy8gICAgICAgICB0aGlzLmludGVyZXN0RGF0YWJhc2VTZXJ2aWNlLmRlbGV0ZUludGVyZXN0KGludGVyZXN0WzBdKTtcbiAgICAvLyAgICAgICB9XG4gICAgLy8gICAgIH0pO1xuICAgIC8vICAgfVxuICAgIC8vIH1cblxuICAgIHB1YmxpYyBjYW5jZWwoKXtcbiAgICAgIHRoaXMuZ29NYWluKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGdvTWFpbigpe1xuICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL21haW5cIl0sIHtcbiAgICAgICAgICAvLyBhbmltYXRpb246IHRydWUsXG4gICAgICAgICAgdHJhbnNpdGlvbjoge1xuICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlUmlnaHRcIixcbiAgICAgICAgICAgICAgZHVyYXRpb246IDIwMCxcbiAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn0iXX0=