"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { Component, OnInit } from "@angular/core";
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
// import { Color } from "color";
// import { View } from "ui/core/view";
var page_1 = require("ui/page");
// import { TextField } from "ui/text-field";
// import { set } from "application-settings";
var user_1 = require("../../shared/user/user");
var user_service_1 = require("../../shared/user/user.service");
// import { setHintColor } from "../../utils/hint-util";
var appSettings = require("application-settings");
var LoginComponent = (function () {
    // @ViewChild("container") container: ElementRef;
    // @ViewChild("username") username: ElementRef;
    // @ViewChild("password") password: ElementRef;
    function LoginComponent(router, userService, page) {
        this.router = router;
        this.userService = userService;
        this.page = page;
        this.isLoggingIn = true;
        this.isBusy = false;
        this.user = new user_1.User();
        this.isBusy = false;
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.page.actionBarHidden = true;
        this.page.backgroundImage = "res://particles_bg";
        this.user.username = "crflickC";
        this.user.password = "Password1!";
        // Autologin
        if (appSettings.hasKey("user_name") && appSettings.hasKey("user_password")) {
            this.user.username = appSettings.getString("user_name", this.user.username);
            this.user.password = appSettings.getString("user_password", this.user.password);
            this.login();
        }
    };
    LoginComponent.prototype.submit = function () {
        // if (!this.user.isValidEmail()) {
        //   alert("Enter a valid email address.");
        //   return;
        // }
        if (this.isLoggingIn) {
            this.login();
        }
        else {
            this.signUp();
        }
    };
    LoginComponent.prototype.login = function () {
        var _this = this;
        this.isBusy = true;
        this.userService.login(this.user)
            .subscribe(function (response) {
            // console.log("login attempt");
            appSettings.setString("user_name", _this.user.username);
            appSettings.setString("user_password", _this.user.password);
            appSettings.setNumber("user_id", response.user_id);
            appSettings.setString("user_role", response.user_role);
            _this.isBusy = false;
            if (response.user_role == 'Customer') {
                _this.router.navigate(["/main"]);
            }
            else {
                // console.log("It's agent, user location: "+response.user_location);
                // alert("U loc: "+response.user_location);
                appSettings.setNumber("user_location_id", response.user_location);
                // console.log("It's agent2");
                _this.router.navigate(["/main-agent"]);
            }
        }, function (error) {
            alert("Unfortunately we could not find your account.");
            _this.isBusy = false;
        });
    };
    LoginComponent.prototype.signUp = function () {
        var _this = this;
        this.isBusy = true;
        this.userService.register(this.user)
            .subscribe(function (response) {
            _this.isBusy = false;
            alert("Your account was successfully created.");
            _this.toggleDisplay();
        }, function (error) {
            alert("Unfortunately we were unable to create your account: " + error);
            _this.isBusy = false;
        });
    };
    LoginComponent.prototype.toggleDisplay = function () {
        this.isLoggingIn = !this.isLoggingIn;
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: "my-app",
            providers: [user_service_1.UserService],
            templateUrl: "pages/login/login.html",
            styleUrls: ["pages/login/login-common.css", "pages/login/login.css"],
        }),
        __metadata("design:paramtypes", [router_1.Router, user_service_1.UserService, page_1.Page])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9naW4uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscURBQXFEO0FBQ3JELHNDQUF5RTtBQUN6RSwwQ0FBeUM7QUFDekMsaUNBQWlDO0FBQ2pDLHVDQUF1QztBQUN2QyxnQ0FBK0I7QUFDL0IsNkNBQTZDO0FBQzdDLDhDQUE4QztBQUU5QywrQ0FBOEM7QUFDOUMsK0RBQTZEO0FBQzdELHdEQUF3RDtBQUV4RCxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQVNsRDtJQUtFLGlEQUFpRDtJQUNqRCwrQ0FBK0M7SUFDL0MsK0NBQStDO0lBRS9DLHdCQUFvQixNQUFjLEVBQVUsV0FBd0IsRUFBVSxJQUFVO1FBQXBFLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBVSxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUFVLFNBQUksR0FBSixJQUFJLENBQU07UUFQeEYsZ0JBQVcsR0FBRyxJQUFJLENBQUM7UUFDbkIsV0FBTSxHQUFHLEtBQUssQ0FBQztRQU9iLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxXQUFJLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztJQUV0QixDQUFDO0lBRUQsaUNBQVEsR0FBUjtRQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztRQUNqQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxvQkFBb0IsQ0FBQztRQUVqRCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7UUFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFDO1FBRWxDLFlBQVk7UUFDWixFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxNQUFNLENBQUMsZUFB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YSxHQUFiO1FBQ0UsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDdkMsQ0FBQztJQTFGVSxjQUFjO1FBUDFCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsUUFBUTtZQUNsQixTQUFTLEVBQUUsQ0FBQywwQkFBVyxDQUFDO1lBQ3hCLFdBQVcsRUFBRSx3QkFBd0I7WUFDckMsU0FBUyxFQUFFLENBQUMsOEJBQThCLEVBQUUsdUJBQXVCLENBQUM7U0FDckUsQ0FBQzt5Q0FXNEIsZUFBTSxFQUF1QiwwQkFBVyxFQUFnQixXQUFJO09BVDdFLGNBQWMsQ0E0RjFCO0lBQUQscUJBQUM7Q0FBQSxBQTVGRCxJQTRGQztBQTVGWSx3Q0FBYyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgT25Jbml0LCBWaWV3Q2hpbGQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xuLy8gaW1wb3J0IHsgQ29sb3IgfSBmcm9tIFwiY29sb3JcIjtcbi8vIGltcG9ydCB7IFZpZXcgfSBmcm9tIFwidWkvY29yZS92aWV3XCI7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInVpL3BhZ2VcIjtcbi8vIGltcG9ydCB7IFRleHRGaWVsZCB9IGZyb20gXCJ1aS90ZXh0LWZpZWxkXCI7XG4vLyBpbXBvcnQgeyBzZXQgfSBmcm9tIFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIjtcblxuaW1wb3J0IHsgVXNlciB9IGZyb20gXCIuLi8uLi9zaGFyZWQvdXNlci91c2VyXCI7XG5pbXBvcnQgeyBVc2VyU2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvdXNlci91c2VyLnNlcnZpY2VcIjtcbi8vIGltcG9ydCB7IHNldEhpbnRDb2xvciB9IGZyb20gXCIuLi8uLi91dGlscy9oaW50LXV0aWxcIjtcblxudmFyIGFwcFNldHRpbmdzID0gcmVxdWlyZShcImFwcGxpY2F0aW9uLXNldHRpbmdzXCIpO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6IFwibXktYXBwXCIsXG4gIHByb3ZpZGVyczogW1VzZXJTZXJ2aWNlXSxcbiAgdGVtcGxhdGVVcmw6IFwicGFnZXMvbG9naW4vbG9naW4uaHRtbFwiLFxuICBzdHlsZVVybHM6IFtcInBhZ2VzL2xvZ2luL2xvZ2luLWNvbW1vbi5jc3NcIiwgXCJwYWdlcy9sb2dpbi9sb2dpbi5jc3NcIl0sXG59KVxuXG5leHBvcnQgY2xhc3MgTG9naW5Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXR7XG4gIHVzZXI6IFVzZXI7XG4gIGlzTG9nZ2luZ0luID0gdHJ1ZTtcbiAgaXNCdXN5ID0gZmFsc2U7XG5cbiAgLy8gQFZpZXdDaGlsZChcImNvbnRhaW5lclwiKSBjb250YWluZXI6IEVsZW1lbnRSZWY7XG4gIC8vIEBWaWV3Q2hpbGQoXCJ1c2VybmFtZVwiKSB1c2VybmFtZTogRWxlbWVudFJlZjtcbiAgLy8gQFZpZXdDaGlsZChcInBhc3N3b3JkXCIpIHBhc3N3b3JkOiBFbGVtZW50UmVmO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsIHByaXZhdGUgdXNlclNlcnZpY2U6IFVzZXJTZXJ2aWNlLCBwcml2YXRlIHBhZ2U6IFBhZ2UpIHtcbiAgICB0aGlzLnVzZXIgPSBuZXcgVXNlcigpO1xuICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgICAgXG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLnBhZ2UuYWN0aW9uQmFySGlkZGVuID0gdHJ1ZTtcbiAgICB0aGlzLnBhZ2UuYmFja2dyb3VuZEltYWdlID0gXCJyZXM6Ly9wYXJ0aWNsZXNfYmdcIjtcblxuICAgIHRoaXMudXNlci51c2VybmFtZSA9IFwiY3JmbGlja0NcIjtcbiAgICB0aGlzLnVzZXIucGFzc3dvcmQgPSBcIlBhc3N3b3JkMSFcIjtcblxuICAgIC8vIEF1dG9sb2dpblxuICAgIGlmIChhcHBTZXR0aW5ncy5oYXNLZXkoXCJ1c2VyX25hbWVcIikgJiYgYXBwU2V0dGluZ3MuaGFzS2V5KFwidXNlcl9wYXNzd29yZFwiKSl7XG4gICAgICB0aGlzLnVzZXIudXNlcm5hbWUgPSBhcHBTZXR0aW5ncy5nZXRTdHJpbmcoXCJ1c2VyX25hbWVcIix0aGlzLnVzZXIudXNlcm5hbWUpO1xuICAgICAgdGhpcy51c2VyLnBhc3N3b3JkID0gYXBwU2V0dGluZ3MuZ2V0U3RyaW5nKFwidXNlcl9wYXNzd29yZFwiLHRoaXMudXNlci5wYXNzd29yZCk7XG5cbiAgICAgIHRoaXMubG9naW4oKVxuICAgIH1cbiAgfVxuXG4gIHN1Ym1pdCgpIHtcbiAgICAvLyBpZiAoIXRoaXMudXNlci5pc1ZhbGlkRW1haWwoKSkge1xuICAgIC8vICAgYWxlcnQoXCJFbnRlciBhIHZhbGlkIGVtYWlsIGFkZHJlc3MuXCIpO1xuICAgIC8vICAgcmV0dXJuO1xuICAgIC8vIH1cbiAgICBpZiAodGhpcy5pc0xvZ2dpbmdJbikge1xuICAgICAgdGhpcy5sb2dpbigpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNpZ25VcCgpO1xuICAgIH1cbiAgfVxuXG4gIGxvZ2luKCkge1xuICAgIHRoaXMuaXNCdXN5ID0gdHJ1ZTtcbiAgICB0aGlzLnVzZXJTZXJ2aWNlLmxvZ2luKHRoaXMudXNlcilcbiAgICAgIC5zdWJzY3JpYmUoXG4gICAgICAgIChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgIFxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwibG9naW4gYXR0ZW1wdFwiKTtcbiAgICAgICAgICBhcHBTZXR0aW5ncy5zZXRTdHJpbmcoXCJ1c2VyX25hbWVcIix0aGlzLnVzZXIudXNlcm5hbWUpO1xuICAgICAgICAgIGFwcFNldHRpbmdzLnNldFN0cmluZyhcInVzZXJfcGFzc3dvcmRcIix0aGlzLnVzZXIucGFzc3dvcmQpO1xuICAgICAgICAgIGFwcFNldHRpbmdzLnNldE51bWJlcihcInVzZXJfaWRcIixyZXNwb25zZS51c2VyX2lkKTtcbiAgICAgICAgICBhcHBTZXR0aW5ncy5zZXRTdHJpbmcoXCJ1c2VyX3JvbGVcIixyZXNwb25zZS51c2VyX3JvbGUpO1xuICAgICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7IFxuICAgICAgICAgIGlmIChyZXNwb25zZS51c2VyX3JvbGUgPT0gJ0N1c3RvbWVyJyl7XG4gICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvbWFpblwiXSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkl0J3MgYWdlbnQsIHVzZXIgbG9jYXRpb246IFwiK3Jlc3BvbnNlLnVzZXJfbG9jYXRpb24pO1xuICAgICAgICAgICAgLy8gYWxlcnQoXCJVIGxvYzogXCIrcmVzcG9uc2UudXNlcl9sb2NhdGlvbik7XG4gICAgICAgICAgICBhcHBTZXR0aW5ncy5zZXROdW1iZXIoXCJ1c2VyX2xvY2F0aW9uX2lkXCIscmVzcG9uc2UudXNlcl9sb2NhdGlvbik7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkl0J3MgYWdlbnQyXCIpO1xuICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL21haW4tYWdlbnRcIl0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgKGVycm9yKSA9PiB7XG4gICAgICAgICAgYWxlcnQoXCJVbmZvcnR1bmF0ZWx5IHdlIGNvdWxkIG5vdCBmaW5kIHlvdXIgYWNjb3VudC5cIik7XG4gICAgICAgICAgdGhpcy5pc0J1c3kgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgKTtcbiAgfVxuXG4gIHNpZ25VcCgpIHtcbiAgICB0aGlzLmlzQnVzeSA9IHRydWU7XG4gICAgdGhpcy51c2VyU2VydmljZS5yZWdpc3Rlcih0aGlzLnVzZXIpXG4gICAgICAuc3Vic2NyaWJlKFxuICAgICAgICAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICAgIGFsZXJ0KFwiWW91ciBhY2NvdW50IHdhcyBzdWNjZXNzZnVsbHkgY3JlYXRlZC5cIik7XG4gICAgICAgICAgdGhpcy50b2dnbGVEaXNwbGF5KCk7XG4gICAgICAgIH0sXG4gICAgICAgIChlcnJvcikgPT4ge2FsZXJ0KFwiVW5mb3J0dW5hdGVseSB3ZSB3ZXJlIHVuYWJsZSB0byBjcmVhdGUgeW91ciBhY2NvdW50OiBcIitlcnJvcik7IFxuICAgICAgICB0aGlzLmlzQnVzeSA9IGZhbHNlO31cbiAgICAgICk7XG4gICAgXG4gIH1cblxuICB0b2dnbGVEaXNwbGF5KCkge1xuICAgIHRoaXMuaXNMb2dnaW5nSW4gPSAhdGhpcy5pc0xvZ2dpbmdJbjtcbiAgfVxuXG59Il19