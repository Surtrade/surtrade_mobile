"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
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
        this.title = "At " + this.beaconDatabaseService.selectBeaconByLocation(this._location_id)[6];
        // alert("stuff:"+ this.locationDatabaseService.selectLocation(this._location_id)[1]);
        // if (isAndroid) {
        //   application.android.on(AndroidApplication.activityBackPressedEvent, (data: AndroidActivityBackPressedEventData) => {
        //     this.goMain();
        //   });
        // }
        // try{
        //   this._customer_id = appSettings.getNumber("user_id");
        // }catch(e){
        //   this._customer_id = 0;
        // }   
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
                }
                else {
                    console.log("message:" + responseContract.message);
                    alert("Contract expired.");
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
    ContractComponent.prototype.createContract = function () {
        var _this = this;
        this.isBusy = true;
        var auto_authorize;
        if (this.autoauthorize == "ON")
            auto_authorize = true;
        else
            auto_authorize = false;
        var options = {
            "expire_method": ""
        };
        var expire_method = "location";
        if (this.expireByTime == "ON") {
            expire_method = "time";
        }
        options.expire_method = expire_method;
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
            _this.goMain();
        }, function (error) {
            _this.isBusy = false;
            alert("Error creating the contract: " + error);
            _this.goMain();
            // throw new Error(error);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJhY3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29udHJhY3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXlFO0FBQ3pFLDBDQUFpRDtBQUNqRCxzREFBK0Q7QUFPL0QsNkRBQTZEO0FBQzdELDJFQUF5RTtBQUN6RSx1RkFBdUY7QUFDdkYsMkVBQThFO0FBRTlFLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBVWxEO0lBaUJJLDJCQUNZLGVBQWdDLEVBQ2hDLEtBQXFCLEVBQ3JCLE1BQXdCO1FBQ2hDLDJEQUEyRDtRQUNuRCxxQkFBNEM7UUFKNUMsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBQ2hDLFVBQUssR0FBTCxLQUFLLENBQWdCO1FBQ3JCLFdBQU0sR0FBTixNQUFNLENBQWtCO1FBRXhCLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBdUI7UUFYakQsVUFBSyxHQUFXLG1CQUFtQixDQUFDO1FBYXpDLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1FBQzFCLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFBO1FBQ2hCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBQzFCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO1FBR2hCLDBCQUEwQjtRQUN6QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNwQixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztRQUV6QixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNsQiwyQ0FBMkM7SUFDN0MsQ0FBQztJQUVELG9DQUFRLEdBQVI7UUFBQSxpQkEwREM7UUF6REMsSUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7UUFDeEUsSUFBSSxD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UTtZQUNqQixLQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztZQUNwQixLQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDaEIsQ0FBQyxFQUFDLFVBQUEsS0FBSztZQUNMLEtBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1lBQ3BCLEtBQUssQ0FBQywrQkFBK0IsR0FBQyxLQUFLLENBQUMsQ0FBQztZQUM3QyxLQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDZCwwQkFBMEI7UUFDNUIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU0sa0NBQU0sR0FBYjtRQUNFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRU0sa0NBQU0sR0FBYjtRQUNFLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDNUIsbUJBQW1CO1lBQ25CLFVBQVUsRUFBRTtnQkFDUixJQUFJLEVBQUUsWUFBWTtnQkFDbEIsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsS0FBSyxFQUFFLFFBQVE7YUFDbEI7U0FDRixDQUFDLENBQUM7SUFDUCxDQUFDO0lBdktRLGlCQUFpQjtRQVI3QixnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLGFBQWE7WUFDdkIsd0RBQXdEO1lBQ3hELFNBQVMsRUFBRSxDQUFDLGtDQUFlLEVBQUUseUNBQXFCLENBQUM7WUFDbkQsdUJBQXVCO1lBQ3ZCLFdBQVcsRUFBRSxnQ0FBZ0M7WUFDN0MsU0FBUyxFQUFDLENBQUMsK0JBQStCLENBQUM7U0FDOUMsQ0FBQzt5Q0FtQitCLGtDQUFlO1lBQ3pCLHVCQUFjO1lBQ2IseUJBQWdCO1lBRUQseUNBQXFCO09BdEIvQyxpQkFBaUIsQ0F3SzdCO0lBQUQsd0JBQUM7Q0FBQSxBQXhLRCxJQXdLQztBQXhLWSw4Q0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0NoaWxkLCBFbGVtZW50UmVmIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlIH0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgUm91dGVyRXh0ZW5zaW9ucyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXJcIjtcbmltcG9ydCB7IFN3aXRjaCB9IGZyb20gXCJ1aS9zd2l0Y2hcIjtcblxuaW1wb3J0ICogYXMgYXBwbGljYXRpb24gZnJvbSAnYXBwbGljYXRpb24nO1xuaW1wb3J0IHsgQW5kcm9pZEFwcGxpY2F0aW9uLCBBbmRyb2lkQWN0aXZpdHlCYWNrUHJlc3NlZEV2ZW50RGF0YSB9IGZyb20gXCJhcHBsaWNhdGlvblwiO1xuaW1wb3J0IHsgaXNBbmRyb2lkIH0gZnJvbSBcInBsYXRmb3JtXCI7XG5cbi8vIGltcG9ydCB7IENvbnRyYWN0IH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9jb250cmFjdC9jb250cmFjdFwiO1xuaW1wb3J0IHsgQ29udHJhY3RTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9jb250cmFjdC9jb250cmFjdC5zZXJ2aWNlXCI7XG4vLyBpbXBvcnQgeyBMb2NhdGlvbkRhdGFiYXNlU2VydmljZSB9IGZyb20gJy4uLy4uL3NoYXJlZC9sb2NhdGlvbi9sb2NhdGlvbi5kYi5zZXJ2aWNlJztcbmltcG9ydCB7IEJlYWNvbkRhdGFiYXNlU2VydmljZSB9IGZyb20gJy4uLy4uL3NoYXJlZC9iZWFjb24vYmVhY29uLmRiLnNlcnZpY2UnO1xuXG52YXIgYXBwU2V0dGluZ3MgPSByZXF1aXJlKFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIik7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiBcIm5zLWNvbnRyYWN0XCIsXG4gICAgLy8gcHJvdmlkZXJzOiBbQ29udHJhY3RTZXJ2aWNlLExvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlXSxcbiAgICBwcm92aWRlcnM6IFtDb250cmFjdFNlcnZpY2UsIEJlYWNvbkRhdGFiYXNlU2VydmljZV0sXG4gICAgLy8gbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgICB0ZW1wbGF0ZVVybDogXCIuL3BhZ2VzL2NvbnRyYWN0L2NvbnRyYWN0Lmh0bWxcIixcbiAgICBzdHlsZVVybHM6W1wiLi9wYWdlcy9jb250cmFjdC9jb250cmFjdC5jc3NcIl0gXG59KVxuZXhwb3J0IGNsYXNzIENvbnRyYWN0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgICBwcml2YXRlIF9sb2NhdGlvbl9pZDogbnVtYmVyO1xuICAgIHByaXZhdGUgX2N1c3RvbWVyX2lkOiBudW1iZXI7XG4gICAgLy8gcHJpdmF0ZSBfY29udHJhY3Q6IENvbnRyYWN0O1xuXG4gICAgbWludXRlczogbnVtYmVyO1xuICAgIGV4cGlyZUJ5VGltZTogc3RyaW5nO1xuICAgIGF1dG9hdXRob3JpemU6IHN0cmluZztcblxuICAgIHB1YmxpYyBhYWM6IGJvb2xlYW47XG4gICAgcHVibGljIGV0YzogYm9vbGVhbjtcbiAgICBwdWJsaWMgdGl0bGU6IHN0cmluZyA9IFwiV2VsY29tZSB0byBOYXJuaWFcIjtcblxuXG4gICAgaXNCdXN5OiBib29sZWFuO1xuICAgIGlzU2V0dGluZ3M6IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBjb250cmFjdFNlcnZpY2U6IENvbnRyYWN0U2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSByb3V0ZTogQWN0aXZhdGVkUm91dGUsXG4gICAgICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXJFeHRlbnNpb25zLFxuICAgICAgICAvLyBwcml2YXRlIGxvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlOiBMb2NhdGlvbkRhdGFiYXNlU2VydmljZVxuICAgICAgICBwcml2YXRlIGJlYWNvbkRhdGFiYXNlU2VydmljZTogQmVhY29uRGF0YWJhc2VTZXJ2aWNlXG4gICAgKSB7IFxuICAgICAgdGhpcy5leHBpcmVCeVRpbWUgPSBcIk9GRlwiO1xuICAgICAgdGhpcy5ldGMgPSBmYWxzZVxuICAgICAgdGhpcy5hdXRvYXV0aG9yaXplID0gXCJPTlwiO1xuICAgICAgdGhpcy5hYWMgPSB0cnVlOyAgXG4gICAgICAgXG4gICAgICAgXG4gICAgICAvLyAgdGhpcy5fY29udHJhY3QgPSBudWxsO1xuICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgdGhpcy5pc1NldHRpbmdzID0gZmFsc2U7XG5cbiAgICAgIHRoaXMubWludXRlcyA9IDEwO1xuICAgICAgLy8gY29uc29sZS5sb2coXCJpbml0IHRpbWU6IFwiK3RoaXMubWludXRlcyk7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICB0aGlzLl9sb2NhdGlvbl9pZCA9IHBhcnNlSW50KHRoaXMucm91dGUuc25hcHNob3QucGFyYW1zW1wibG9jYXRpb25faWRcIl0pO1xuICAgICAgdGhpcy5pc1NldHRpbmdzID0gKHRoaXMucm91dGUuc25hcHNob3QucGFyYW1zW1wic2V0dGluZ3NcIl0pO1xuICAgICAgLy8gY29uc29sZS5sb2coXCJpcyBzZXR0aW5nczogXCIrdGhpcy5pc1NldHRpbmdzKTtcblxuICAgICAgLy8gYWxlcnQoXCJXYWl0IGZvciBpdC4uIHdpdGggbG9jYXRpb24gaWQ6IFwiK3RoaXMuX2xvY2F0aW9uX2lkKTtcbiAgICAgIFxuICAgICAgLy8gdGhpcy5sb2NhdGlvbkRhdGFiYXNlU2VydmljZS5zZWxlY3RMb2NhdGlvbih0aGlzLl9sb2NhdGlvbl9pZClcbiAgICAgIC8vIHRoaXMudGl0bGUgPSBcIkF0IFwiK3RoaXMubG9jYXRpb25EYXRhYmFzZVNlcnZpY2Uuc2VsZWN0TG9jYXRpb24odGhpcy5fbG9jYXRpb25faWQpWzFdO1xuICAgICAgdGhpcy50aXRsZSA9IFwiQXQgXCIrdGhpcy5iZWFjb25EYXRhYmFzZVNlcnZpY2Uuc2VsZWN0QmVhY29uQnlMb2NhdGlvbih0aGlzLl9sb2NhdGlvbl9pZClbNl07XG4gICAgICAvLyBhbGVydChcInN0dWZmOlwiKyB0aGlzLmxvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlLnNlbGVjdExvY2F0aW9uKHRoaXMuX2xvY2F0aW9uX2lkKVsxXSk7XG5cbiAgICAgIC8vIGlmIChpc0FuZHJvaWQpIHtcbiAgICAgIC8vICAgYXBwbGljYXRpb24uYW5kcm9pZC5vbihBbmRyb2lkQXBwbGljYXRpb24uYWN0aXZpdHlCYWNrUHJlc3NlZEV2ZW50LCAoZGF0YTogQW5kcm9pZEFjdGl2aXR5QmFja1ByZXNzZWRFdmVudERhdGEpID0+IHtcbiAgICAgIC8vICAgICB0aGlzLmdvTWFpbigpO1xuICAgICAgLy8gICB9KTtcbiAgICAgIC8vIH1cblxuICAgICAgLy8gdHJ5e1xuICAgICAgLy8gICB0aGlzLl9jdXN0b21lcl9pZCA9IGFwcFNldHRpbmdzLmdldE51bWJlcihcInVzZXJfaWRcIik7XG4gICAgICAvLyB9Y2F0Y2goZSl7XG4gICAgICAvLyAgIHRoaXMuX2N1c3RvbWVyX2lkID0gMDtcbiAgICAgIC8vIH0gICBcblxuICAgICAgXG4gICAgICBpZiAodGhpcy5pc1NldHRpbmdzID09IHRydWUpe1xuICAgICAgICB0aGlzLmlzQnVzeSA9IHRydWU7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiaW4gc2V0dGluZ3NcIik7XG4gICAgICAgIHRoaXMuY29udHJhY3RTZXJ2aWNlLmdldEFjdGl2ZUNvbnRyYWN0KHRoaXMuX2xvY2F0aW9uX2lkLCB0aGlzLl9jdXN0b21lcl9pZClcbiAgICAgICAgICAuc3Vic2NyaWJlKHJlc3BvbnNlQ29udHJhY3QgPT4ge1xuICAgICAgICAgICAgaWYgKCFyZXNwb25zZUNvbnRyYWN0Lm1lc3NhZ2UgJiYgcmVzcG9uc2VDb250cmFjdC5zdGF0dXMgIT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJubyBtZXNzYWdlIDopLCBzdGF0dXM6IFwiK3Jlc3BvbnNlQ29udHJhY3Quc3RhdHVzKTtcbiAgICAgICAgICAgICAgaWYoIXJlc3BvbnNlQ29udHJhY3QuYXV0b19hdXRob3JpemUpe1xuICAgICAgICAgICAgICAgIHRoaXMuYXV0b2F1dGhvcml6ZSA9IFwiT0ZGXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5hYWMgPSBmYWxzZTsgIFxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYocmVzcG9uc2VDb250cmFjdC5vcHRpb25zLmV4cGlyZV9tZXRob2QgPT0gJ3RpbWUnKXtcbiAgICAgICAgICAgICAgICB0aGlzLmV4cGlyZUJ5VGltZSA9IFwiT05cIjtcbiAgICAgICAgICAgICAgICB0aGlzLmV0YyA9IHRydWU7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibWVzc2FnZTpcIityZXNwb25zZUNvbnRyYWN0Lm1lc3NhZ2UpO1xuICAgICAgICAgICAgICBhbGVydChcIkNvbnRyYWN0IGV4cGlyZWQuXCIpO1xuICAgICAgICAgICAgICB0aGlzLmdvTWFpbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgICB9LGVycm9yID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgaW4gY29udHJhY3RcIik7XG4gICAgICAgICAgICBpZiAoZXJyb3Iuc3RhdHVzICE9IDQwNCl7XG4gICAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgZ2V0dGluZyBhY3RpdmUgY29udHJhY3QgaW5mb3JtYXRpb246IFwiK2Vycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmdvTWFpbigpO1xuICAgICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgfVxuXG4gICBwdWJsaWMgZXhwaXJlQnlUaW1lRXZlbnQoYXJncykge1xuICAgICAgICBsZXQgc3dpdGNoQm94ID0gPFN3aXRjaD5hcmdzLm9iamVjdDtcbiAgICAgICAgaWYgKHN3aXRjaEJveC5jaGVja2VkKSB7XG4gICAgICAgICAgICB0aGlzLmV4cGlyZUJ5VGltZSA9IFwiT05cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZXhwaXJlQnlUaW1lID0gXCJPRkZcIjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwdWJsaWMgYXV0b2F1dGhvcml6ZUV2ZW50KGFyZ3MpIHtcbiAgICAgICAgbGV0IHN3aXRjaEJveCA9IDxTd2l0Y2g+YXJncy5vYmplY3Q7XG4gICAgICAgIGlmIChzd2l0Y2hCb3guY2hlY2tlZCkge1xuICAgICAgICAgICAgdGhpcy5hdXRvYXV0aG9yaXplID0gXCJPTlwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hdXRvYXV0aG9yaXplID0gXCJPRkZcIjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZUNvbnRyYWN0KCl7XG4gICAgICB0aGlzLmlzQnVzeSA9IHRydWU7XG4gICAgICBsZXQgYXV0b19hdXRob3JpemU7XG4gICAgICBpZiAodGhpcy5hdXRvYXV0aG9yaXplID09IFwiT05cIilcbiAgICAgICAgYXV0b19hdXRob3JpemUgPSB0cnVlO1xuICAgICAgZWxzZVxuICAgICAgICBhdXRvX2F1dGhvcml6ZSA9IGZhbHNlO1xuICAgICAgXG4gICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgXCJleHBpcmVfbWV0aG9kXCI6XCJcIlxuICAgICAgfTtcblxuICAgICAgbGV0IGV4cGlyZV9tZXRob2QgPSBcImxvY2F0aW9uXCI7XG4gICAgICBpZiAodGhpcy5leHBpcmVCeVRpbWUgPT0gXCJPTlwiKXtcbiAgICAgICAgZXhwaXJlX21ldGhvZCA9IFwidGltZVwiO1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zLmV4cGlyZV9tZXRob2QgPSBleHBpcmVfbWV0aG9kO1xuICAgICAgXG4gICAgICBsZXQgY29udHJhY3REYXRhPXtcbiAgICAgICAgXCJsb2NhdGlvbl9pZFwiOiB0aGlzLl9sb2NhdGlvbl9pZCxcbiAgICAgICAgXCJhdXRvX2F1dGhvcml6ZVwiOiBhdXRvX2F1dGhvcml6ZSxcbiAgICAgICAgLy8gXCJleHBpcmVcIjogdGhpcy50aW1lLm1pbnV0ZXMsXG4gICAgICAgIFwiZXhwaXJlXCI6IHRoaXMubWludXRlcyxcbiAgICAgICAgXCJvcHRpb25zXCI6IG9wdGlvbnNcbiAgICAgIH07XG5cbiAgICAgIHRoaXMuY29udHJhY3RTZXJ2aWNlLmNyZWF0ZUNvbnRyYWN0KGNvbnRyYWN0RGF0YSlcbiAgICAgIC5zdWJzY3JpYmUocmVzcG9uc2UgPT4geyBcbiAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTsgICAgXG4gICAgICAgIHRoaXMuZ29NYWluKCk7XG4gICAgICB9LGVycm9yID0+IHtcbiAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgYWxlcnQoXCJFcnJvciBjcmVhdGluZyB0aGUgY29udHJhY3Q6IFwiK2Vycm9yKTtcbiAgICAgICAgdGhpcy5nb01haW4oKTtcbiAgICAgICAgLy8gdGhyb3cgbmV3IEVycm9yKGVycm9yKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBjYW5jZWwoKXtcbiAgICAgIHRoaXMuZ29NYWluKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGdvTWFpbigpe1xuICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL21haW5cIl0sIHtcbiAgICAgICAgICAvLyBhbmltYXRpb246IHRydWUsXG4gICAgICAgICAgdHJhbnNpdGlvbjoge1xuICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlUmlnaHRcIixcbiAgICAgICAgICAgICAgZHVyYXRpb246IDIwMCxcbiAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn0iXX0=