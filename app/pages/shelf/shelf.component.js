"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
var utils_1 = require("utils/utils");
var shelf_1 = require("../../shared/shelf/shelf");
var shelf_service_1 = require("../../shared/shelf/shelf.service");
var ShelfComponent = /** @class */ (function () {
    function ShelfComponent(shelfService, route, router) {
        this.shelfService = shelfService;
        this.route = route;
        this.router = router;
        console.log("Constructing Shelf component");
    }
    ShelfComponent.prototype.ngOnInit = function () {
        // TODO send beacon info from prev page
        this._beacon = this.route.snapshot.params["beacon"];
        this.verifyShelf();
    };
    ShelfComponent.prototype.verifyShelf = function () {
        var _this = this;
        this.shelfService.getShelf(this._beacon)
            .subscribe(function (responseShelf) {
            if (!responseShelf.message) {
                _this.shelf = new shelf_1.Shelf(responseShelf.code, responseShelf.beacon);
                _this.shelf.keywords = responseShelf.keywords;
                var products_1 = [];
                responseShelf.products.forEach(function (product) {
                    var productObj = new shelf_1.Product(product.code, product.name, product.description);
                    productObj.keywords = product.keywords;
                    productObj.image = product.image;
                    productObj.video = product.video;
                    productObj.remark = product.remark;
                    products_1.push(productObj);
                });
                _this.shelf.products = products_1;
                _this.shelfProducts = products_1;
                // console.log("~~~~~~~~~~~~~~~~")
                // console.log("code: "+this.shelf.code);
                // console.log("beacon: "+this.shelf.beacon);
                // console.log("kewords"+this.shelf.keywords);
                // console.log("products: "+this.shelf.products.length);
                // this.shelf.products.forEach(product => {
                //   console.log("code: "+product.code);
                //   console.log("name: "+product.name);
                //   console.log("description: "+product.description);
                //   console.log("keywords: "+product.keywords);
                //   console.log("image: "+product.image);
                //   console.log("video: "+product.video);
                // });
                _this.shelfTitle = _this.shelf.code;
                // console.log("~ ~ ~ ~ ~ ~ ~ ~ ~")
            }
            else {
                console.log("message:" + responseShelf.message);
                // alert("Contract expired.");
                _this.goMain();
            }
        }, function (error) {
            console.log("error in shelf component");
            if (error.status == 401) {
                alert("No available information for this Shelf.");
            }
            else if (error.status != 404) {
                alert("Error getting shelf by beacon information: " + error);
            }
            _this.goMain();
        });
    };
    ShelfComponent.prototype.cancel = function () {
        this.goMain();
    };
    ShelfComponent.prototype.goMain = function () {
        this.router.navigate(["/main"], {
            // animation: true,
            transition: {
                name: "slideRight",
                duration: 200,
                curve: "linear"
            }
        });
    };
    ShelfComponent.prototype.playVideo = function (video) {
        utils_1.openUrl(video);
    };
    ShelfComponent = __decorate([
        core_1.Component({
            selector: "shelf",
            providers: [shelf_service_1.ShelfService],
            templateUrl: "pages/shelf/shelf.html",
            styleUrls: ["pages/shelf/shelf-common.css"]
        }),
        __metadata("design:paramtypes", [shelf_service_1.ShelfService,
            router_1.ActivatedRoute,
            router_2.RouterExtensions])
    ], ShelfComponent);
    return ShelfComponent;
}());
exports.ShelfComponent = ShelfComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlbGYuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2hlbGYuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBQ2xELDBDQUFpRDtBQUNqRCxzREFBK0Q7QUFDL0QscUNBQXNDO0FBRXRDLGtEQUEwRDtBQUMxRCxrRUFBZ0U7QUFTaEU7SUFNSSx3QkFDWSxZQUEwQixFQUMxQixLQUFxQixFQUNyQixNQUF3QjtRQUZ4QixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQixVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQUNyQixXQUFNLEdBQU4sTUFBTSxDQUFrQjtRQUNoQyxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDLENBQUM7SUFBQSxDQUFDO0lBRWpELGlDQUFRLEdBQVI7UUFDSSx1Q0FBdUM7UUFDdkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFcEQsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBRXZCLENBQUM7SUFFTSxvQ0FBVyxHQUFsQjtRQUFBLGlCQXNEQztRQXJEQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO2FBQ25DLFNBQVMsQ0FBQyxVQUFBLGFBQWE7WUFDdEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUEsQ0FBQztnQkFDMUIsS0FBSSxDQUFDLEtBQUssR0FBRyxJQUFJLGFBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDakUsS0FBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQztnQkFFN0MsSUFBSSxVQUFRLEdBQUcsRUFBRSxDQUFBO2dCQUVqQixhQUFhLENBQUMsUUFBUSxDQUFDLE9BQU8s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IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUgfSBmcm9tIFwiQGFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQgeyBSb3V0ZXJFeHRlbnNpb25zIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgb3BlblVybCB9IGZyb20gXCJ1dGlscy91dGlsc1wiO1xuXG5pbXBvcnQgeyBTaGVsZiwgUHJvZHVjdCB9IGZyb20gXCIuLi8uLi9zaGFyZWQvc2hlbGYvc2hlbGZcIjtcbmltcG9ydCB7IFNoZWxmU2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvc2hlbGYvc2hlbGYuc2VydmljZVwiO1xuXG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiBcInNoZWxmXCIsXG4gICAgcHJvdmlkZXJzOiBbU2hlbGZTZXJ2aWNlXSxcbiAgICB0ZW1wbGF0ZVVybDogXCJwYWdlcy9zaGVsZi9zaGVsZi5odG1sXCIsXG4gICAgc3R5bGVVcmxzOltcInBhZ2VzL3NoZWxmL3NoZWxmLWNvbW1vbi5jc3NcIl0gXG59KVxuZXhwb3J0IGNsYXNzIFNoZWxmQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgICBwcml2YXRlIF9iZWFjb246IHN0cmluZztcbiAgICBwdWJsaWMgc2hlbGY6IFNoZWxmO1xuICAgIHB1YmxpYyBzaGVsZlRpdGxlOiBzdHJpbmc7XG4gICAgcHVibGljIHNoZWxmUHJvZHVjdHM6IFByb2R1Y3RbXTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIHNoZWxmU2VydmljZTogU2hlbGZTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSxcbiAgICAgICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlckV4dGVuc2lvbnMsXG4gICAgKSB7IGNvbnNvbGUubG9nKFwiQ29uc3RydWN0aW5nIFNoZWxmIGNvbXBvbmVudFwiKTt9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgLy8gVE9ETyBzZW5kIGJlYWNvbiBpbmZvIGZyb20gcHJldiBwYWdlXG4gICAgICAgIHRoaXMuX2JlYWNvbiA9IHRoaXMucm91dGUuc25hcHNob3QucGFyYW1zW1wiYmVhY29uXCJdO1xuXG4gICAgICAgIHRoaXMudmVyaWZ5U2hlbGYoKTtcbiAgICAgICAgXG4gICAgfVxuXG4gICAgcHVibGljIHZlcmlmeVNoZWxmKCl7XG4gICAgICB0aGlzLnNoZWxmU2VydmljZS5nZXRTaGVsZih0aGlzLl9iZWFjb24pXG4gICAgICAgICAgLnN1YnNjcmliZShyZXNwb25zZVNoZWxmID0+IHtcbiAgICAgICAgICAgIGlmICghcmVzcG9uc2VTaGVsZi5tZXNzYWdlKXtcbiAgICAgICAgICAgICAgdGhpcy5zaGVsZiA9IG5ldyBTaGVsZihyZXNwb25zZVNoZWxmLmNvZGUsIHJlc3BvbnNlU2hlbGYuYmVhY29uKTtcbiAgICAgICAgICAgICAgdGhpcy5zaGVsZi5rZXl3b3JkcyA9IHJlc3BvbnNlU2hlbGYua2V5d29yZHM7XG5cbiAgICAgICAgICAgICAgbGV0IHByb2R1Y3RzID0gW11cblxuICAgICAgICAgICAgICByZXNwb25zZVNoZWxmLnByb2R1Y3RzLmZvckVhY2gocHJvZHVjdCA9PiB7XG4gICAgICAgICAgICAgICAgICBsZXQgcHJvZHVjdE9iaiA9IG5ldyBQcm9kdWN0KHByb2R1Y3QuY29kZSwgcHJvZHVjdC5uYW1lLHByb2R1Y3QuZGVzY3JpcHRpb24pO1xuICAgICAgICAgICAgICAgICAgcHJvZHVjdE9iai5rZXl3b3JkcyA9IHByb2R1Y3Qua2V5d29yZHM7XG4gICAgICAgICAgICAgICAgICBwcm9kdWN0T2JqLmltYWdlID0gcHJvZHVjdC5pbWFnZTtcbiAgICAgICAgICAgICAgICAgIHByb2R1Y3RPYmoudmlkZW8gPSBwcm9kdWN0LnZpZGVvO1xuICAgICAgICAgICAgICAgICAgcHJvZHVjdE9iai5yZW1hcmsgPSBwcm9kdWN0LnJlbWFyaztcbiAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgcHJvZHVjdHMucHVzaChwcm9kdWN0T2JqKTtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgdGhpcy5zaGVsZi5wcm9kdWN0cyA9IHByb2R1Y3RzO1xuICAgICAgICAgICAgICB0aGlzLnNoZWxmUHJvZHVjdHMgPSBwcm9kdWN0cztcblxuICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIn5+fn5+fn5+fn5+fn5+fn5cIilcbiAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJjb2RlOiBcIit0aGlzLnNoZWxmLmNvZGUpO1xuICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImJlYWNvbjogXCIrdGhpcy5zaGVsZi5iZWFjb24pO1xuICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImtld29yZHNcIit0aGlzLnNoZWxmLmtleXdvcmRzKTtcbiAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJwcm9kdWN0czogXCIrdGhpcy5zaGVsZi5wcm9kdWN0cy5sZW5ndGgpO1xuICAgICAgICAgICAgICAvLyB0aGlzLnNoZWxmLnByb2R1Y3RzLmZvckVhY2gocHJvZHVjdCA9PiB7XG4gICAgICAgICAgICAgIC8vICAgY29uc29sZS5sb2coXCJjb2RlOiBcIitwcm9kdWN0LmNvZGUpO1xuICAgICAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKFwibmFtZTogXCIrcHJvZHVjdC5uYW1lKTtcbiAgICAgICAgICAgICAgLy8gICBjb25zb2xlLmxvZyhcImRlc2NyaXB0aW9uOiBcIitwcm9kdWN0LmRlc2NyaXB0aW9uKTtcbiAgICAgICAgICAgICAgLy8gICBjb25zb2xlLmxvZyhcImtleXdvcmRzOiBcIitwcm9kdWN0LmtleXdvcmRzKTtcbiAgICAgICAgICAgICAgLy8gICBjb25zb2xlLmxvZyhcImltYWdlOiBcIitwcm9kdWN0LmltYWdlKTtcbiAgICAgICAgICAgICAgLy8gICBjb25zb2xlLmxvZyhcInZpZGVvOiBcIitwcm9kdWN0LnZpZGVvKTtcbiAgICAgICAgICAgICAgLy8gfSk7XG5cbiAgICAgICAgICAgICAgdGhpcy5zaGVsZlRpdGxlID0gdGhpcy5zaGVsZi5jb2RlO1xuXG4gICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwifiB+IH4gfiB+IH4gfiB+IH5cIilcblxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibWVzc2FnZTpcIityZXNwb25zZVNoZWxmLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAvLyBhbGVydChcIkNvbnRyYWN0IGV4cGlyZWQuXCIpO1xuICAgICAgICAgICAgICB0aGlzLmdvTWFpbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sZXJyb3IgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciBpbiBzaGVsZiBjb21wb25lbnRcIik7XG4gICAgICAgICAgICBpZiAoZXJyb3Iuc3RhdHVzID09IDQwMSl7XG4gICAgICAgICAgICAgIGFsZXJ0KFwiTm8gYXZhaWxhYmxlIGluZm9ybWF0aW9uIGZvciB0aGlzIFNoZWxmLlwiKTtcbiAgICAgICAgICAgIH1lbHNlIGlmIChlcnJvci5zdGF0dXMgIT0gNDA0KXtcbiAgICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBnZXR0aW5nIHNoZWxmIGJ5IGJlYWNvbiBpbmZvcm1hdGlvbjogXCIrZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5nb01haW4oKTtcbiAgICAgICAgICB9KTtcbiAgICB9XG4gICAgcHVibGljIGNhbmNlbCgpe1xuICAgICAgICB0aGlzLmdvTWFpbigpO1xuICAgICAgfVxuXG4gICAgcHVibGljIGdvTWFpbigpe1xuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvbWFpblwiXSwge1xuICAgICAgICAgICAgLy8gYW5pbWF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xuICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVSaWdodFwiLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAyMDAsXG4gICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgIHB1YmxpYyBwbGF5VmlkZW8odmlkZW8pe1xuICAgICAgb3BlblVybCh2aWRlbyk7XG4gICAgfVxufSJdfQ==