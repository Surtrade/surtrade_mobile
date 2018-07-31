"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dialogs_1 = require("tns-core-modules/ui/dialogs");
var nativescript_cfalert_dialog_1 = require("nativescript-cfalert-dialog");
var CFAlertDialogHelper = /** @class */ (function () {
    function CFAlertDialogHelper() {
        this.cfalertDialog = new nativescript_cfalert_dialog_1.CFAlertDialog();
    }
    CFAlertDialogHelper.prototype.showAlert = function (blur) {
        this.cfalertDialog.show({
            dialogStyle: nativescript_cfalert_dialog_1.CFAlertStyle.ALERT,
            title: "Alert! Run 4 your life! 😱",
            backgroundBlur: blur,
            onDismiss: function () { return console.log("showAlert dismissed"); }
        });
    };
    CFAlertDialogHelper.prototype.showNotification = function (msg) {
        if (msg === void 0) { msg = "Generic Message."; }
        var options = {
            dialogStyle: nativescript_cfalert_dialog_1.CFAlertStyle.NOTIFICATION,
            title: "This is a notification!",
            message: msg,
            backgroundBlur: true,
            onDismiss: function (dialog) { return console.log("Dialog was dismissed: " + dialog); },
            buttons: [{
                    text: "Okay",
                    buttonStyle: nativescript_cfalert_dialog_1.CFAlertActionStyle.POSITIVE,
                    buttonAlignment: nativescript_cfalert_dialog_1.CFAlertActionAlignment.END,
                    textColor: "#eee",
                    backgroundColor: "#888",
                    onClick: function (response) { return console.log("Button pressed: " + response); }
                }]
        };
        this.cfalertDialog.show(options);
    };
    CFAlertDialogHelper.prototype.showBottomSheet = function (shelf, title) {
        if (title === void 0) { title = "Your selection:"; }
        var answer = false;
        var onSelection = function (response) {
            console.log("The response for shelf was: " + response);
            if (response == "Okay") {
                answer = true;
                console.log("Shelf answer updated to: " + answer);
                console.log("shelf return try: " + answer);
                return answer;
            }
            // alert({
            //   title: title,
            //   message: response,
            //   okButtonText: "Go"
            // });
        };
        var options = {
            dialogStyle: nativescript_cfalert_dialog_1.CFAlertStyle.BOTTOM_SHEET,
            title: "Information available!",
            message: "Would you like to know more about " + shelf + "?",
            buttons: [
                {
                    text: "Okay",
                    buttonStyle: nativescript_cfalert_dialog_1.CFAlertActionStyle.POSITIVE,
                    buttonAlignment: nativescript_cfalert_dialog_1.CFAlertActionAlignment.JUSTIFIED,
                    onClick: onSelection
                },
                {
                    text: "Nope",
                    buttonStyle: nativescript_cfalert_dialog_1.CFAlertActionStyle.NEGATIVE,
                    buttonAlignment: nativescript_cfalert_dialog_1.CFAlertActionAlignment.JUSTIFIED,
                    onClick: onSelection
                }
            ]
        };
        this.cfalertDialog.show(options);
        console.log("shelf return: " + answer);
        return answer;
    };
    CFAlertDialogHelper.prototype.showSimpleList = function () {
        var items = ["Tomato", "Potato", "Carrot", "Spinach"];
        var options = {
            dialogStyle: nativescript_cfalert_dialog_1.CFAlertStyle.ALERT,
            title: "This is a simple list!",
            simpleList: {
                items: items,
                onClick: function (dialogInterface, index) {
                    dialogs_1.alert({
                        title: "Your selection:",
                        message: items[index],
                        okButtonText: "OK"
                    });
                }
            }
        };
        this.cfalertDialog.show(options);
    };
    CFAlertDialogHelper.prototype.showSingleChoiceList = function () {
        var items = ["Tomato", "Potato", "Carrot", "Spinach"];
        var selection;
        var options = {
            dialogStyle: nativescript_cfalert_dialog_1.CFAlertStyle.ALERT,
            title: "This is a simple list!",
            singleChoiceList: {
                items: items,
                selectedItem: 2,
                onClick: function (dialog, index) {
                    selection = items[index];
                    console.log("Option selected: " + selection);
                }
            },
            buttons: [
                {
                    text: "Okay",
                    buttonStyle: nativescript_cfalert_dialog_1.CFAlertActionStyle.POSITIVE,
                    buttonAlignment: nativescript_cfalert_dialog_1.CFAlertActionAlignment.END,
                    onClick: function (pressedButton) {
                        dialogs_1.alert({
                            title: "You selected:",
                            message: selection,
                            okButtonText: "OK"
                        });
                    }
                }
            ]
        };
        this.cfalertDialog.show(options);
    };
    return CFAlertDialogHelper;
}());
exports.CFAlertDialogHelper = CFAlertDialogHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZhbGVydGRpYWxvZy1oZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZmFsZXJ0ZGlhbG9nLWhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVEQUFvRDtBQUNwRCwyRUFNcUM7QUFFckM7SUFHRTtRQUNFLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSwyQ0FBYSxFQUFFLENBQUM7SUFDM0MsQ0FBQztJQUVELHVDQUFTLEdBQVQsVUFBVSxJQUFhO1FBQ3JCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDO1lBQ3RCLFdBQVcsRUFBRSwwQ0FBWSxDQUFDLEtBQUs7WUFDL0IsS0FBSyxFQUFFLDRCQUE0QjtZQUNuQyxjQUFjLEVBQUUsSUFBSTtZQUNwQixTQUFTLEVBQUUsY0FBTSxPQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsRUFBbEMsQ0FBa0M7U0FDcEQsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELDhDQUFnQixHQUFoQixVQUFpQixHQUFnQztRQUFoQyxvQkFBQSxFQUFBLHdCQUFnQztRQUMvQyxJQUFNLE9BQU8sR0FBa0I7WUFDN0IsV0FBVyxFQUFFLDBDQUFZLENBQUMsWUFBWTtZQUN0QyxLQUFLLEVBQUUseUJBQXlCO1lBQ2hDLE9BQU8sRUFBRSxHQUFHO1lBQ1osY0FBYyxFQUFFLElBQUk7WUFDcEIsU0FBUyxFQUFFLFVBQUEsTUFBTSxJQUFJLE9BQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQywyQkFBeUIsTUFBUSxDQUFDLEVBQTlDLENBQThDO1lBQ25FLE9BQU8sRUFBRSxDQUFDO29CQUNSLElBQUksRUFBRSxNQUFNO29CQUNaLFdBQVcsRUFBRSxnREFBa0IsQ0FBQyxRQUFRO29CQUN4QyxlQUFlLEVBQUUsb0RBQXNCLENBQUMsR0FBRztvQkFDM0MsU0FBUyxFQUFFLE1BQU07b0JBQ2pCLGVBQWUsRUFBRSxNQUFNO29CQUN2QixPQUFPLEVBQUUsVUFBQSxRQUFRLElBQUksT0FBQSxP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RSxLQUFLO2dCQUNaLFlBQVksRUFBRSxDQUFDO2dCQUNmLE9BQU8sRUFBRSxVQUFDLE1BQU0sRUFBRSxLQUFLO29CQUNyQixTQUFTLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN6QixPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFvQixTQUFXLENBQUMsQ0FBQztnQkFDL0MsQ0FBQzthQUNGO1lBQ0QsT0FBTyxFQUFFO2dCQUNQO29CQUNFLElBQUksRUFBRSxNQUFNO29CQUNaLFdBQVcsRUFBRSxnREFBa0IsQ0FBQyxRQUFRO29CQUN4QyxlQUFlLEVBQUUsb0RBQXNCLENBQUMsR0FBRztvQkFDM0MsT0FBTyxFQUFFLFVBQUMsYUFBcUI7d0JBQzdCLGVBQUssQ0FBQzs0QkFDSixLQUFLLEVBQUUsZUFBZTs0QkFDdEIsT0FBTyxFQUFFLFNBQVM7NEJBQ2xCLFlBQVksRUFBRSxJQUFJO3lCQUNuQixDQUFDLENBQUM7b0JBQ0wsQ0FBQztpQkFDRjthQUNGO1NBQ0YsQ0FBQztRQUNGLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFDSCwwQkFBQztBQUFELENBQUMsQUEvSEQsSUErSEM7QUEvSFksa0RBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYWxlcnQgfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy91aS9kaWFsb2dzXCI7XG5pbXBvcnQge1xuICBDRkFsZXJ0RGlhbG9nLFxuICBEaWFsb2dPcHRpb25zLFxuICBDRkFsZXJ0QWN0aW9uQWxpZ25tZW50LFxuICBDRkFsZXJ0QWN0aW9uU3R5bGUsXG4gIENGQWxlcnRTdHlsZVxufSBmcm9tIFwibmF0aXZlc2NyaXB0LWNmYWxlcnQtZGlhbG9nXCI7XG5cbmV4cG9ydCBjbGFzcyBDRkFsZXJ0RGlhbG9nSGVscGVyIHtcbiAgcHJpdmF0ZSBjZmFsZXJ0RGlhbG9nOiBDRkFsZXJ0RGlhbG9nO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY2ZhbGVydERpYWxvZyA9IG5ldyBDRkFsZXJ0RGlhbG9nKCk7XG4gIH1cblxuICBzaG93QWxlcnQoYmx1cjogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuY2ZhbGVydERpYWxvZy5zaG93KHtcbiAgICAgIGRpYWxvZ1N0eWxlOiBDRkFsZXJ0U3R5bGUuQUxFUlQsXG4gICAgICB0aXRsZTogXCJBbGVydCEgUnVuIDQgeW91ciBsaWZlISDtoL3tuLFcIixcbiAgICAgIGJhY2tncm91bmRCbHVyOiBibHVyLFxuICAgICAgb25EaXNtaXNzOiAoKSA9PiBjb25zb2xlLmxvZyhcInNob3dBbGVydCBkaXNtaXNzZWRcIilcbiAgICB9KTtcbiAgfVxuXG4gIHNob3dOb3RpZmljYXRpb24obXNnOiBzdHJpbmcgPSBcIkdlbmVyaWMgTWVzc2FnZS5cIik6IHZvaWQge1xuICAgIGNvbnN0IG9wdGlvbnM6IERpYWxvZ09wdGlvbnMgPSB7XG4gICAgICBkaWFsb2dTdHlsZTogQ0ZBbGVydFN0eWxlLk5PVElGSUNBVElPTixcbiAgICAgIHRpdGxlOiBcIlRoaXMgaXMgYSBub3RpZmljYXRpb24hXCIsXG4gICAgICBtZXNzYWdlOiBtc2csXG4gICAgICBiYWNrZ3JvdW5kQmx1cjogdHJ1ZSxcbiAgICAgIG9uRGlzbWlzczogZGlhbG9nID0+IGNvbnNvbGUubG9nKGBEaWFsb2cgd2FzIGRpc21pc3NlZDogJHtkaWFsb2d9YCksXG4gICAgICBidXR0b25zOiBbe1xuICAgICAgICB0ZXh0OiBcIk9rYXlcIixcbiAgICAgICAgYnV0dG9uU3R5bGU6IENGQWxlcnRBY3Rpb25TdHlsZS5QT1NJVElWRSxcbiAgICAgICAgYnV0dG9uQWxpZ25tZW50OiBDRkFsZXJ0QWN0aW9uQWxpZ25tZW50LkVORCxcbiAgICAgICAgdGV4dENvbG9yOiBcIiNlZWVcIixcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcIiM4ODhcIixcbiAgICAgICAgb25DbGljazogcmVzcG9uc2UgPT4gY29uc29sZS5sb2coYEJ1dHRvbiBwcmVzc2VkOiAke3Jlc3BvbnNlfWApXG4gICAgICB9XVxuICAgIH07XG4gICAgdGhpcy5jZmFsZXJ0RGlhbG9nLnNob3cob3B0aW9ucyk7XG4gIH1cblxuICBzaG93Qm90dG9tU2hlZXQoc2hlbGY6c3RyaW5nLCB0aXRsZTpzdHJpbmcgPSBcIllvdXIgc2VsZWN0aW9uOlwiKTogYm9vbGVhbiB7XG4gICAgbGV0IGFuc3dlciA9IGZhbHNlO1xuICAgIGNvbnN0IG9uU2VsZWN0aW9uID0gcmVzcG9uc2UgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJUaGUgcmVzcG9uc2UgZm9yIHNoZWxmIHdhczogXCIrcmVzcG9uc2UpO1xuICAgICAgaWYgKHJlc3BvbnNlID09IFwiT2theVwiKXtcbiAgICAgICAgYW5zd2VyID0gdHJ1ZTtcbiAgICAgICAgY29uc29sZS5sb2coXCJTaGVsZiBhbnN3ZXIgdXBkYXRlZCB0bzogXCIrYW5zd2VyKTtcblxuICAgICAgICBjb25zb2xlLmxvZyhcInNoZWxmIHJldHVybiB0cnk6IFwiK2Fuc3dlcik7XG4gICAgICAgIHJldHVybiBhbnN3ZXI7XG4gICAgICB9XG4gICAgICAvLyBhbGVydCh7XG4gICAgICAvLyAgIHRpdGxlOiB0aXRsZSxcbiAgICAgIC8vICAgbWVzc2FnZTogcmVzcG9uc2UsXG4gICAgICAvLyAgIG9rQnV0dG9uVGV4dDogXCJHb1wiXG4gICAgICAvLyB9KTtcbiAgICB9O1xuXG4gICAgY29uc3Qgb3B0aW9uczogRGlhbG9nT3B0aW9ucyA9IHtcbiAgICAgIGRpYWxvZ1N0eWxlOiBDRkFsZXJ0U3R5bGUuQk9UVE9NX1NIRUVULFxuICAgICAgdGl0bGU6IFwiSW5mb3JtYXRpb24gYXZhaWxhYmxlIVwiLFxuICAgICAgbWVzc2FnZTogXCJXb3VsZCB5b3UgbGlrZSB0byBrbm93IG1vcmUgYWJvdXQgXCIrc2hlbGYrXCI/XCIsXG4gICAgICBidXR0b25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0ZXh0OiBcIk9rYXlcIixcbiAgICAgICAgICBidXR0b25TdHlsZTogQ0ZBbGVydEFjdGlvblN0eWxlLlBPU0lUSVZFLFxuICAgICAgICAgIGJ1dHRvbkFsaWdubWVudDogQ0ZBbGVydEFjdGlvbkFsaWdubWVudC5KVVNUSUZJRUQsXG4gICAgICAgICAgb25DbGljazogb25TZWxlY3Rpb25cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHRleHQ6IFwiTm9wZVwiLFxuICAgICAgICAgIGJ1dHRvblN0eWxlOiBDRkFsZXJ0QWN0aW9uU3R5bGUuTkVHQVRJVkUsXG4gICAgICAgICAgYnV0dG9uQWxpZ25tZW50OiBDRkFsZXJ0QWN0aW9uQWxpZ25tZW50LkpVU1RJRklFRCxcbiAgICAgICAgICBvbkNsaWNrOiBvblNlbGVjdGlvblxuICAgICAgICB9XVxuICAgIH07XG4gICAgdGhpcy5jZmFsZXJ0RGlhbG9nLnNob3cob3B0aW9ucyk7XG5cbiAgICBjb25zb2xlLmxvZyhcInNoZWxmIHJldHVybjogXCIrYW5zd2VyKTtcbiAgICByZXR1cm4gYW5zd2VyO1xuICB9XG5cbiAgc2hvd1NpbXBsZUxpc3QoKTogdm9pZCB7XG4gICAgY29uc3QgaXRlbXM6IGFueSA9IFtcIlRvbWF0b1wiLCBcIlBvdGF0b1wiLCBcIkNhcnJvdFwiLCBcIlNwaW5hY2hcIl07XG4gICAgY29uc3Qgb3B0aW9uczogRGlhbG9nT3B0aW9ucyA9IHtcbiAgICAgIGRpYWxvZ1N0eWxlOiBDRkFsZXJ0U3R5bGUuQUxFUlQsXG4gICAgICB0aXRsZTogXCJUaGlzIGlzIGEgc2ltcGxlIGxpc3QhXCIsXG4gICAgICBzaW1wbGVMaXN0OiB7XG4gICAgICAgIGl0ZW1zOiBpdGVtcyxcbiAgICAgICAgb25DbGljazogKGRpYWxvZ0ludGVyZmFjZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICBhbGVydCh7XG4gICAgICAgICAgICB0aXRsZTogXCJZb3VyIHNlbGVjdGlvbjpcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IGl0ZW1zW2luZGV4XSxcbiAgICAgICAgICAgIG9rQnV0dG9uVGV4dDogXCJPS1wiXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHRoaXMuY2ZhbGVydERpYWxvZy5zaG93KG9wdGlvbnMpO1xuICB9XG5cbiAgc2hvd1NpbmdsZUNob2ljZUxpc3QoKTogdm9pZCB7XG4gICAgY29uc3QgaXRlbXM6IGFueSA9IFtcIlRvbWF0b1wiLCBcIlBvdGF0b1wiLCBcIkNhcnJvdFwiLCBcIlNwaW5hY2hcIl07XG4gICAgbGV0IHNlbGVjdGlvbjogc3RyaW5nO1xuICAgIGNvbnN0IG9wdGlvbnM6IERpYWxvZ09wdGlvbnMgPSB7XG4gICAgICBkaWFsb2dTdHlsZTogQ0ZBbGVydFN0eWxlLkFMRVJULFxuICAgICAgdGl0bGU6IFwiVGhpcyBpcyBhIHNpbXBsZSBsaXN0IVwiLFxuICAgICAgc2luZ2xlQ2hvaWNlTGlzdDoge1xuICAgICAgICBpdGVtczogaXRlbXMsXG4gICAgICAgIHNlbGVjdGVkSXRlbTogMixcbiAgICAgICAgb25DbGljazogKGRpYWxvZywgaW5kZXgpID0+IHtcbiAgICAgICAgICBzZWxlY3Rpb24gPSBpdGVtc1tpbmRleF07XG4gICAgICAgICAgY29uc29sZS5sb2coYE9wdGlvbiBzZWxlY3RlZDogJHtzZWxlY3Rpb259YCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBidXR0b25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0ZXh0OiBcIk9rYXlcIixcbiAgICAgICAgICBidXR0b25TdHlsZTogQ0ZBbGVydEFjdGlvblN0eWxlLlBPU0lUSVZFLFxuICAgICAgICAgIGJ1dHRvbkFsaWdubWVudDogQ0ZBbGVydEFjdGlvbkFsaWdubWVudC5FTkQsXG4gICAgICAgICAgb25DbGljazogKHByZXNzZWRCdXR0b246IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgYWxlcnQoe1xuICAgICAgICAgICAgICB0aXRsZTogXCJZb3Ugc2VsZWN0ZWQ6XCIsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IHNlbGVjdGlvbixcbiAgICAgICAgICAgICAgb2tCdXR0b25UZXh0OiBcIk9LXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH07XG4gICAgdGhpcy5jZmFsZXJ0RGlhbG9nLnNob3cob3B0aW9ucyk7XG4gIH1cbn0iXX0=