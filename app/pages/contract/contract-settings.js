"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var contract_service_1 = require("../../shared/contract/contract.service");
var ContractSettingsComponent = (function () {
    function ContractSettingsComponent(contractService, route, router) {
        this.contractService = contractService;
        this.route = route;
        this.router = router;
        this.isBusy = false;
    }
    ContractSettingsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isBusy = true;
        var id = +this.route.snapshot.params["id"];
        this.contractService.getContract(id)
            .subscribe(function (responseContract) {
            _this.contract = responseContract;
            _this.isBusy = false;
        }, function (error) {
            alert("Error getting the contract information.");
            _this.router.navigate(["/main"]);
        });
    };
    ContractSettingsComponent = __decorate([
        core_1.Component({
            selector: "ns-contract-settings",
            providers: [contract_service_1.ContractService],
            // moduleId: module.id,
            templateUrl: "./pages/contract/contract-settings.html",
            styleUrls: ["./pages/contract/contract.css"]
        }),
        __metadata("design:paramtypes", [contract_service_1.ContractService,
            router_1.ActivatedRoute,
            router_1.Router])
    ], ContractSettingsComponent);
    return ContractSettingsComponent;
}());
exports.ContractSettingsComponent = ContractSettingsComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJhY3Qtc2V0dGluZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb250cmFjdC1zZXR0aW5ncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFrRDtBQUNsRCwwQ0FBeUQ7QUFHekQsMkVBQXlFO0FBU3pFO0lBS0ksbUNBQ1ksZUFBZ0MsRUFDaEMsS0FBcUIsRUFDckIsTUFBYztRQUZkLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUNoQyxVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQUNyQixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBTDFCLFdBQU0sR0FBRyxLQUFLLENBQUM7SUFNWCxDQUFDO0lBRUwsNENBQVEsR0FBUjtRQUFBLGlCQWFDO1FBWkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFFbkIsSUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDO2FBQ2pDLFNBQVMsQ0FBQyxVQUFBLGdCQUFnQjtZQUN6QixLQUFJLENBQUMsUUFBUSxHQUFHLGdCQUFnQixDQUFDO1lBRWpDLEtBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLENBQUMsRUFBQyxVQUFBLEtBQUs7WUFDTCxLQUFLLENBQUMseUNBQXlDLENBQUMsQ0FBQztZQUNqRCxLQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBeEJRLHlCQUF5QjtRQVByQyxnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLHNCQUFzQjtZQUNoQyxTQUFTLEVBQUUsQ0FBQyxrQ0FBZSxDQUFDO1lBQzVCLHVCQUF1QjtZQUN2QixXQUFXLEVBQUUseUNBQXlDO1lBQ3RELFNBQVMsRUFBQyxDQUFDLCtCQUErQixDQUFDO1NBQzlDLENBQUM7eUNBTytCLGtDQUFlO1lBQ3pCLHVCQUFjO1lBQ2IsZUFBTTtPQVJqQix5QkFBeUIsQ0EyQnJDO0lBQUQsZ0NBQUM7Q0FBQSxBQTNCRCxJQTJCQztBQTNCWSw4REFBeUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgUm91dGVyIH0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xuXG5pbXBvcnQgeyBDb250cmFjdCB9IGZyb20gXCIuLi8uLi9zaGFyZWQvY29udHJhY3QvY29udHJhY3RcIjtcbmltcG9ydCB7IENvbnRyYWN0U2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvY29udHJhY3QvY29udHJhY3Quc2VydmljZVwiO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogXCJucy1jb250cmFjdC1zZXR0aW5nc1wiLFxuICAgIHByb3ZpZGVyczogW0NvbnRyYWN0U2VydmljZV0sXG4gICAgLy8gbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgICB0ZW1wbGF0ZVVybDogXCIuL3BhZ2VzL2NvbnRyYWN0L2NvbnRyYWN0LXNldHRpbmdzLmh0bWxcIixcbiAgICBzdHlsZVVybHM6W1wiLi9wYWdlcy9jb250cmFjdC9jb250cmFjdC5jc3NcIl0gXG59KVxuZXhwb3J0IGNsYXNzIENvbnRyYWN0U2V0dGluZ3NDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIGNvbnRyYWN0OiBDb250cmFjdDtcbiAgICBcbiAgICBpc0J1c3kgPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIGNvbnRyYWN0U2VydmljZTogQ29udHJhY3RTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSxcbiAgICAgICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlclxuICAgICkgeyB9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgIHRoaXMuaXNCdXN5ID0gdHJ1ZTtcblxuICAgICAgY29uc3QgaWQgPSArdGhpcy5yb3V0ZS5zbmFwc2hvdC5wYXJhbXNbXCJpZFwiXTtcbiAgICAgIHRoaXMuY29udHJhY3RTZXJ2aWNlLmdldENvbnRyYWN0KGlkKVxuICAgICAgICAuc3Vic2NyaWJlKHJlc3BvbnNlQ29udHJhY3QgPT4ge1xuICAgICAgICAgIHRoaXMuY29udHJhY3QgPSByZXNwb25zZUNvbnRyYWN0O1xuICAgICAgICAgIFxuICAgICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgIH0sZXJyb3IgPT57XG4gICAgICAgICAgYWxlcnQoXCJFcnJvciBnZXR0aW5nIHRoZSBjb250cmFjdCBpbmZvcm1hdGlvbi5cIik7XG4gICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL21haW5cIl0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cblxufSJdfQ==