"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var nativescript_module_1 = require("nativescript-angular/nativescript.module");
var forms_1 = require("nativescript-angular/forms");
var http_1 = require("nativescript-angular/http");
var app_routing_1 = require("./app.routing");
var app_component_1 = require("./app.component");
var login_component_1 = require("./pages/login/login.component");
var main_component_1 = require("./pages/main/main.component");
var main_agent_component_1 = require("./pages/main-agent/main-agent.component");
var customer_details_component_1 = require("./pages/customer-details/customer-details.component");
var contract_component_1 = require("./pages/contract/contract.component");
// import { ContractSettingsComponent } from "./pages/contract/contract-settings";
var shelf_component_1 = require("./pages/shelf/shelf.component");
var location_db_service_1 = require("./shared/location/location.db.service");
var item_service_1 = require("./pages/item/item.service");
var items_component_1 = require("./pages/item/items.component");
var item_detail_component_1 = require("./pages/item/item-detail.component");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            bootstrap: [
                app_component_1.AppComponent
            ],
            imports: [
                nativescript_module_1.NativeScriptModule,
                forms_1.NativeScriptFormsModule,
                http_1.NativeScriptHttpModule,
                app_routing_1.AppRoutingModule
            ],
            declarations: [
                app_component_1.AppComponent,
                login_component_1.LoginComponent,
                main_component_1.MainComponent,
                main_agent_component_1.MainAgentComponent,
                customer_details_component_1.CustomerDetailsComponent,
                contract_component_1.ContractComponent,
                // ContractSettingsComponent,
                shelf_component_1.ShelfComponent,
                items_component_1.ItemsComponent,
                item_detail_component_1.ItemDetailComponent
            ],
            providers: [
                item_service_1.ItemService,
                location_db_service_1.LocationDatabaseService
            ],
            schemas: [
                core_1.NO_ERRORS_SCHEMA
            ]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkQ7QUFDM0QsZ0ZBQThFO0FBQzlFLG9EQUFxRTtBQUNyRSxrREFBbUU7QUFDbkUsNkNBQWlEO0FBQ2pELGlEQUErQztBQUUvQyxpRUFBK0Q7QUFDL0QsOERBQTREO0FBQzVELGdGQUE2RTtBQUM3RSxrR0FBK0Y7QUFDL0YsMEVBQXdFO0FBQ3hFLGtGQUFrRjtBQUNsRixpRUFBK0Q7QUFFL0QsNkVBQWdGO0FBRWhGLDBEQUF3RDtBQUN4RCxnRUFBOEQ7QUFDOUQsNEVBQXlFO0FBZ0N6RTtJQUFBO0lBQXlCLENBQUM7SUFBYixTQUFTO1FBOUJyQixlQUFRLENBQUM7WUFDTixTQUFTLEVBQUU7Z0JBQ1QsNEJBQVk7YUFDYjtZQUNELE9BQU8sRUFBRTtnQkFDUCx3Q0FBa0I7Z0JBQ2xCLCtCQUF1QjtnQkFDdkIsNkJBQXNCO2dCQUN0Qiw4QkFBZ0I7YUFDakI7WUFDRCxZQUFZLEVBQUU7Z0JBQ1osNEJBQVk7Z0JBQ1osZ0NBQWM7Z0JBQ2QsOEJBQWE7Z0JBQ2IseUNBQWtCO2dCQUNsQixxREFBd0I7Z0JBQ3hCLHNDQUFpQjtnQkFDakIsNkJBQTZCO2dCQUM3QixnQ0FBYztnQkFDZCxnQ0FBYztnQkFDZCwyQ0FBbUI7YUFDcEI7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsMEJBQVc7Z0JBQ1gsNkNBQXVCO2FBQ3hCO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLHVCQUFnQjthQUNqQjtTQUNKLENBQUM7T0FDVyxTQUFTLENBQUk7SUFBRCxnQkFBQztDQUFBLEFBQTFCLElBQTBCO0FBQWIsOEJBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgTk9fRVJST1JTX1NDSEVNQSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvbmF0aXZlc2NyaXB0Lm1vZHVsZVwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0Rm9ybXNNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvZm9ybXNcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdEh0dHBNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvaHR0cFwiO1xuaW1wb3J0IHsgQXBwUm91dGluZ01vZHVsZSB9IGZyb20gXCIuL2FwcC5yb3V0aW5nXCI7XG5pbXBvcnQgeyBBcHBDb21wb25lbnQgfSBmcm9tIFwiLi9hcHAuY29tcG9uZW50XCI7XG5cbmltcG9ydCB7IExvZ2luQ29tcG9uZW50IH0gZnJvbSAnLi9wYWdlcy9sb2dpbi9sb2dpbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgTWFpbkNvbXBvbmVudCB9IGZyb20gXCIuL3BhZ2VzL21haW4vbWFpbi5jb21wb25lbnRcIjtcbmltcG9ydCB7IE1haW5BZ2VudENvbXBvbmVudCB9IGZyb20gXCIuL3BhZ2VzL21haW4tYWdlbnQvbWFpbi1hZ2VudC5jb21wb25lbnRcIjtcbmltcG9ydCB7IEN1c3RvbWVyRGV0YWlsc0NvbXBvbmVudCB9IGZyb20gJy4vcGFnZXMvY3VzdG9tZXItZGV0YWlscy9jdXN0b21lci1kZXRhaWxzLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDb250cmFjdENvbXBvbmVudCB9IGZyb20gXCIuL3BhZ2VzL2NvbnRyYWN0L2NvbnRyYWN0LmNvbXBvbmVudFwiO1xuLy8gaW1wb3J0IHsgQ29udHJhY3RTZXR0aW5nc0NvbXBvbmVudCB9IGZyb20gXCIuL3BhZ2VzL2NvbnRyYWN0L2NvbnRyYWN0LXNldHRpbmdzXCI7XG5pbXBvcnQgeyBTaGVsZkNvbXBvbmVudCB9IGZyb20gXCIuL3BhZ2VzL3NoZWxmL3NoZWxmLmNvbXBvbmVudFwiO1xuXG5pbXBvcnQgeyBMb2NhdGlvbkRhdGFiYXNlU2VydmljZSB9IGZyb20gXCIuL3NoYXJlZC9sb2NhdGlvbi9sb2NhdGlvbi5kYi5zZXJ2aWNlXCI7XG5cbmltcG9ydCB7IEl0ZW1TZXJ2aWNlIH0gZnJvbSBcIi4vcGFnZXMvaXRlbS9pdGVtLnNlcnZpY2VcIjtcbmltcG9ydCB7IEl0ZW1zQ29tcG9uZW50IH0gZnJvbSBcIi4vcGFnZXMvaXRlbS9pdGVtcy5jb21wb25lbnRcIjtcbmltcG9ydCB7IEl0ZW1EZXRhaWxDb21wb25lbnQgfSBmcm9tIFwiLi9wYWdlcy9pdGVtL2l0ZW0tZGV0YWlsLmNvbXBvbmVudFwiO1xuXG5ATmdNb2R1bGUoe1xuICAgIGJvb3RzdHJhcDogW1xuICAgICAgQXBwQ29tcG9uZW50XG4gICAgXSxcbiAgICBpbXBvcnRzOiBbXG4gICAgICBOYXRpdmVTY3JpcHRNb2R1bGUsXG4gICAgICBOYXRpdmVTY3JpcHRGb3Jtc01vZHVsZSxcbiAgICAgIE5hdGl2ZVNjcmlwdEh0dHBNb2R1bGUsXG4gICAgICBBcHBSb3V0aW5nTW9kdWxlXG4gICAgXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgIEFwcENvbXBvbmVudCxcbiAgICAgIExvZ2luQ29tcG9uZW50LFxuICAgICAgTWFpbkNvbXBvbmVudCxcbiAgICAgIE1haW5BZ2VudENvbXBvbmVudCxcbiAgICAgIEN1c3RvbWVyRGV0YWlsc0NvbXBvbmVudCxcbiAgICAgIENvbnRyYWN0Q29tcG9uZW50LFxuICAgICAgLy8gQ29udHJhY3RTZXR0aW5nc0NvbXBvbmVudCxcbiAgICAgIFNoZWxmQ29tcG9uZW50LFxuICAgICAgSXRlbXNDb21wb25lbnQsXG4gICAgICBJdGVtRGV0YWlsQ29tcG9uZW50XG4gICAgXSxcbiAgICBwcm92aWRlcnM6IFtcbiAgICAgIEl0ZW1TZXJ2aWNlLFxuICAgICAgTG9jYXRpb25EYXRhYmFzZVNlcnZpY2VcbiAgICBdLFxuICAgIHNjaGVtYXM6IFtcbiAgICAgIE5PX0VSUk9SU19TQ0hFTUFcbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIEFwcE1vZHVsZSB7IH1cbiJdfQ==