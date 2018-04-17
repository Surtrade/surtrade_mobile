"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
var contract_service_1 = require("../../shared/contract/contract.service");
var ContractCreateComponent = (function () {
    function ContractCreateComponent(contractService, route, router) {
        this.contractService = contractService;
        this.route = route;
        this.router = router;
        this.expireByTime = "OFF";
        this.autoauthorize = "ON";
        this.isBusy = false;
        this.isSettings = false;
        this.minutes = 10;
        console.log("init time: " + this.minutes);
    }
    ContractCreateComponent.prototype.ngOnInit = function () {
        this.location_id = parseInt(this.route.snapshot.params["location_id"]);
        this.isSettings = (this.route.snapshot.params["settings"]);
        if (this.isSettings == true) {
            alert("in settings");
        }
    };
    ContractCreateComponent.prototype.expireByTimeEvent = function (args) {
        var switchBox = args.object;
        if (switchBox.checked) {
            this.expireByTime = "ON";
        }
        else {
            this.expireByTime = "OFF";
        }
    };
    ContractCreateComponent.prototype.autoauthorizeEvent = function (args) {
        var switchBox = args.object;
        if (switchBox.checked) {
            this.autoauthorize = "ON";
        }
        else {
            this.autoauthorize = "OFF";
        }
    };
    ContractCreateComponent.prototype.createContract = function () {
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
            "location_id": this.location_id,
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
    ContractCreateComponent.prototype.cancel = function () {
        this.goMain();
    };
    ContractCreateComponent.prototype.goMain = function () {
        this.router.navigate(["/main"], {
            // animation: true,
            transition: {
                name: "slideRight",
                duration: 200,
                curve: "linear"
            }
        });
    };
    ContractCreateComponent = __decorate([
        core_1.Component({
            selector: "ns-contract-create",
            providers: [contract_service_1.ContractService],
            // moduleId: module.id,
            templateUrl: "./pages/contract/contract-create.html",
            styleUrls: ["./pages/contract/contract.css"]
        }),
        __metadata("design:paramtypes", [contract_service_1.ContractService,
            router_1.ActivatedRoute,
            router_2.RouterExtensions])
    ], ContractCreateComponent);
    return ContractCreateComponent;
}());
exports.ContractCreateComponent = ContractCreateComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJhY3QtY3JlYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29udHJhY3QtY3JlYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXlFO0FBQ3pFLDBDQUFpRDtBQUNqRCxzREFBK0Q7QUFJL0QsMkVBQXlFO0FBU3pFO0lBVUksaUNBQ1ksZUFBZ0MsRUFDaEMsS0FBcUIsRUFDckIsTUFBd0I7UUFGeEIsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBQ2hDLFVBQUssR0FBTCxLQUFLLENBQWdCO1FBQ3JCLFdBQU0sR0FBTixNQUFNLENBQWtCO1FBRWpDLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1FBQzFCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBQzFCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1FBRXpCLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxHQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsMENBQVEsR0FBUjtRQUNFLElBQUksQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1FBQ3ZFLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUUzRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxDQUFBLENBQUM7WUFDM0IsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3ZCLENBQUM7SUFDSCxDQUFDO0lBRUssbURBQWlCLEdBQXhCLFVBQXlCLElBQUk7UUFDeEIsSUFB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QztJQUFELDhCQUFDO0NBQUEsQUF2R0QsSUF1R0M7QUF2R1ksMERBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcbmltcG9ydCB7IFJvdXRlckV4dGVuc2lvbnMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQgeyBTd2l0Y2ggfSBmcm9tIFwidWkvc3dpdGNoXCI7XG5cbmltcG9ydCB7IENvbnRyYWN0IH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9jb250cmFjdC9jb250cmFjdFwiO1xuaW1wb3J0IHsgQ29udHJhY3RTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9jb250cmFjdC9jb250cmFjdC5zZXJ2aWNlXCI7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiBcIm5zLWNvbnRyYWN0LWNyZWF0ZVwiLFxuICAgIHByb3ZpZGVyczogW0NvbnRyYWN0U2VydmljZV0sXG4gICAgLy8gbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgICB0ZW1wbGF0ZVVybDogXCIuL3BhZ2VzL2NvbnRyYWN0L2NvbnRyYWN0LWNyZWF0ZS5odG1sXCIsXG4gICAgc3R5bGVVcmxzOltcIi4vcGFnZXMvY29udHJhY3QvY29udHJhY3QuY3NzXCJdIFxufSlcbmV4cG9ydCBjbGFzcyBDb250cmFjdENyZWF0ZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gICAgbG9jYXRpb25faWQ6IG51bWJlcjtcbiAgICBtaW51dGVzOiBudW1iZXI7XG4gICAgXG4gICAgZXhwaXJlQnlUaW1lOiBzdHJpbmc7XG4gICAgYXV0b2F1dGhvcml6ZTogc3RyaW5nO1xuXG4gICAgaXNCdXN5OiBib29sZWFuO1xuICAgIGlzU2V0dGluZ3M6IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBjb250cmFjdFNlcnZpY2U6IENvbnRyYWN0U2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSByb3V0ZTogQWN0aXZhdGVkUm91dGUsXG4gICAgICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXJFeHRlbnNpb25zXG4gICAgKSB7IFxuICAgICAgIHRoaXMuZXhwaXJlQnlUaW1lID0gXCJPRkZcIjtcbiAgICAgICB0aGlzLmF1dG9hdXRob3JpemUgPSBcIk9OXCI7XG4gICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICB0aGlzLmlzU2V0dGluZ3MgPSBmYWxzZTtcblxuICAgICAgdGhpcy5taW51dGVzID0gMTA7XG4gICAgICBjb25zb2xlLmxvZyhcImluaXQgdGltZTogXCIrdGhpcy5taW51dGVzKTtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgIHRoaXMubG9jYXRpb25faWQgPSBwYXJzZUludCh0aGlzLnJvdXRlLnNuYXBzaG90LnBhcmFtc1tcImxvY2F0aW9uX2lkXCJdKTtcbiAgICAgIHRoaXMuaXNTZXR0aW5ncyA9ICh0aGlzLnJvdXRlLnNuYXBzaG90LnBhcmFtc1tcInNldHRpbmdzXCJdKTtcblxuICAgICAgaWYgKHRoaXMuaXNTZXR0aW5ncyA9PSB0cnVlKXtcbiAgICAgICAgYWxlcnQoXCJpbiBzZXR0aW5nc1wiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgIHB1YmxpYyBleHBpcmVCeVRpbWVFdmVudChhcmdzKSB7XG4gICAgICAgIGxldCBzd2l0Y2hCb3ggPSA8U3dpdGNoPmFyZ3Mub2JqZWN0O1xuICAgICAgICBpZiAoc3dpdGNoQm94LmNoZWNrZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZXhwaXJlQnlUaW1lID0gXCJPTlwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5leHBpcmVCeVRpbWUgPSBcIk9GRlwiO1xuICAgICAgICB9XG4gICAgfVxuICAgIHB1YmxpYyBhdXRvYXV0aG9yaXplRXZlbnQoYXJncykge1xuICAgICAgICBsZXQgc3dpdGNoQm94ID0gPFN3aXRjaD5hcmdzLm9iamVjdDtcbiAgICAgICAgaWYgKHN3aXRjaEJveC5jaGVja2VkKSB7XG4gICAgICAgICAgICB0aGlzLmF1dG9hdXRob3JpemUgPSBcIk9OXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmF1dG9hdXRob3JpemUgPSBcIk9GRlwiO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlQ29udHJhY3QoKXtcbiAgICAgIHRoaXMuaXNCdXN5ID0gdHJ1ZTtcbiAgICAgIGxldCBhdXRvX2F1dGhvcml6ZTtcbiAgICAgIGlmICh0aGlzLmF1dG9hdXRob3JpemUgPT0gXCJPTlwiKVxuICAgICAgICBhdXRvX2F1dGhvcml6ZSA9IHRydWU7XG4gICAgICBlbHNlXG4gICAgICAgIGF1dG9fYXV0aG9yaXplID0gZmFsc2U7XG4gICAgICBcbiAgICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICBcImV4cGlyZV9tZXRob2RcIjpcIlwiXG4gICAgICB9O1xuXG4gICAgICBsZXQgZXhwaXJlX21ldGhvZCA9IFwibG9jYXRpb25cIjtcbiAgICAgIGlmICh0aGlzLmV4cGlyZUJ5VGltZSA9PSBcIk9OXCIpe1xuICAgICAgICBleHBpcmVfbWV0aG9kID0gXCJ0aW1lXCI7XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMuZXhwaXJlX21ldGhvZCA9IGV4cGlyZV9tZXRob2Q7XG4gICAgICBcbiAgICAgIGxldCBjb250cmFjdERhdGE9e1xuICAgICAgICBcImxvY2F0aW9uX2lkXCI6IHRoaXMubG9jYXRpb25faWQsXG4gICAgICAgIFwiYXV0b19hdXRob3JpemVcIjogYXV0b19hdXRob3JpemUsXG4gICAgICAgIC8vIFwiZXhwaXJlXCI6IHRoaXMudGltZS5taW51dGVzLFxuICAgICAgICBcImV4cGlyZVwiOiB0aGlzLm1pbnV0ZXMsXG4gICAgICAgIFwib3B0aW9uc1wiOiBvcHRpb25zXG4gICAgICB9O1xuXG4gICAgICB0aGlzLmNvbnRyYWN0U2VydmljZS5jcmVhdGVDb250cmFjdChjb250cmFjdERhdGEpXG4gICAgICAuc3Vic2NyaWJlKHJlc3BvbnNlID0+IHsgXG4gICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7ICAgIFxuICAgICAgICB0aGlzLmdvTWFpbigpO1xuICAgICAgfSxlcnJvciA9PiB7XG4gICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgIGFsZXJ0KFwiRXJyb3IgY3JlYXRpbmcgdGhlIGNvbnRyYWN0OiBcIitlcnJvcik7XG4gICAgICAgIHRoaXMuZ29NYWluKCk7XG4gICAgICAgIC8vIHRocm93IG5ldyBFcnJvcihlcnJvcik7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2FuY2VsKCl7XG4gICAgICB0aGlzLmdvTWFpbigpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnb01haW4oKXtcbiAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9tYWluXCJdLCB7XG4gICAgICAgICAgLy8gYW5pbWF0aW9uOiB0cnVlLFxuICAgICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVJpZ2h0XCIsXG4gICAgICAgICAgICAgIGR1cmF0aW9uOiAyMDAsXG4gICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59Il19