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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkQ7QUFDM0QsZ0ZBQThFO0FBQzlFLG9EQUFxRTtBQUNyRSxrREFBbUU7QUFDbkUsNkNBQWlEO0FBQ2pELGlEQUErQztBQUUvQyxpRUFBK0Q7QUFDL0QsOERBQTREO0FBQzVELGdGQUE2RTtBQUM3RSxrR0FBK0Y7QUFDL0YsMEVBQXdFO0FBQ3hFLGtGQUFrRjtBQUVsRiw2RUFBZ0Y7QUFFaEYsMERBQXdEO0FBQ3hELGdFQUE4RDtBQUM5RCw0RUFBeUU7QUErQnpFO0lBQUE7SUFBeUIsQ0FBQztJQUFiLFNBQVM7UUE3QnJCLGVBQVEsQ0FBQztZQUNOLFNBQVMsRUFBRTtnQkFDVCw0QkFBWTthQUNiO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLHdDQUFrQjtnQkFDbEIsK0JBQXVCO2dCQUN2Qiw2QkFBc0I7Z0JBQ3RCLDhCQUFnQjthQUNqQjtZQUNELFlBQVksRUFBRTtnQkFDWiw0QkFBWTtnQkFDWixnQ0FBYztnQkFDZCw4QkFBYTtnQkFDYix5Q0FBa0I7Z0JBQ2xCLHFEQUF3QjtnQkFDeEIsc0NBQWlCO2dCQUNqQiw2QkFBNkI7Z0JBQzdCLGdDQUFjO2dCQUNkLDJDQUFtQjthQUNwQjtZQUNELFNBQVMsRUFBRTtnQkFDVCwwQkFBVztnQkFDWCw2Q0FBdUI7YUFDeEI7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AsdUJBQWdCO2FBQ2pCO1NBQ0osQ0FBQztPQUNXLFNBQVMsQ0FBSTtJQUFELGdCQUFDO0NBQUEsQUFBMUIsSUFBMEI7QUFBYiw4QkFBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBOT19FUlJPUlNfU0NIRU1BIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdE1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9uYXRpdmVzY3JpcHQubW9kdWxlXCI7XG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRGb3Jtc01vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9mb3Jtc1wiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0SHR0cE1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9odHRwXCI7XG5pbXBvcnQgeyBBcHBSb3V0aW5nTW9kdWxlIH0gZnJvbSBcIi4vYXBwLnJvdXRpbmdcIjtcbmltcG9ydCB7IEFwcENvbXBvbmVudCB9IGZyb20gXCIuL2FwcC5jb21wb25lbnRcIjtcblxuaW1wb3J0IHsgTG9naW5Db21wb25lbnQgfSBmcm9tICcuL3BhZ2VzL2xvZ2luL2xvZ2luLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNYWluQ29tcG9uZW50IH0gZnJvbSBcIi4vcGFnZXMvbWFpbi9tYWluLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgTWFpbkFnZW50Q29tcG9uZW50IH0gZnJvbSBcIi4vcGFnZXMvbWFpbi1hZ2VudC9tYWluLWFnZW50LmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgQ3VzdG9tZXJEZXRhaWxzQ29tcG9uZW50IH0gZnJvbSAnLi9wYWdlcy9jdXN0b21lci1kZXRhaWxzL2N1c3RvbWVyLWRldGFpbHMuY29tcG9uZW50JztcbmltcG9ydCB7IENvbnRyYWN0Q29tcG9uZW50IH0gZnJvbSBcIi4vcGFnZXMvY29udHJhY3QvY29udHJhY3QuY29tcG9uZW50XCI7XG4vLyBpbXBvcnQgeyBDb250cmFjdFNldHRpbmdzQ29tcG9uZW50IH0gZnJvbSBcIi4vcGFnZXMvY29udHJhY3QvY29udHJhY3Qtc2V0dGluZ3NcIjtcblxuaW1wb3J0IHsgTG9jYXRpb25EYXRhYmFzZVNlcnZpY2UgfSBmcm9tIFwiLi9zaGFyZWQvbG9jYXRpb24vbG9jYXRpb24uZGIuc2VydmljZVwiO1xuXG5pbXBvcnQgeyBJdGVtU2VydmljZSB9IGZyb20gXCIuL3BhZ2VzL2l0ZW0vaXRlbS5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBJdGVtc0NvbXBvbmVudCB9IGZyb20gXCIuL3BhZ2VzL2l0ZW0vaXRlbXMuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBJdGVtRGV0YWlsQ29tcG9uZW50IH0gZnJvbSBcIi4vcGFnZXMvaXRlbS9pdGVtLWRldGFpbC5jb21wb25lbnRcIjtcblxuQE5nTW9kdWxlKHtcbiAgICBib290c3RyYXA6IFtcbiAgICAgIEFwcENvbXBvbmVudFxuICAgIF0sXG4gICAgaW1wb3J0czogW1xuICAgICAgTmF0aXZlU2NyaXB0TW9kdWxlLFxuICAgICAgTmF0aXZlU2NyaXB0Rm9ybXNNb2R1bGUsXG4gICAgICBOYXRpdmVTY3JpcHRIdHRwTW9kdWxlLFxuICAgICAgQXBwUm91dGluZ01vZHVsZVxuICAgIF0sXG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICBBcHBDb21wb25lbnQsXG4gICAgICBMb2dpbkNvbXBvbmVudCxcbiAgICAgIE1haW5Db21wb25lbnQsXG4gICAgICBNYWluQWdlbnRDb21wb25lbnQsXG4gICAgICBDdXN0b21lckRldGFpbHNDb21wb25lbnQsXG4gICAgICBDb250cmFjdENvbXBvbmVudCxcbiAgICAgIC8vIENvbnRyYWN0U2V0dGluZ3NDb21wb25lbnQsXG4gICAgICBJdGVtc0NvbXBvbmVudCxcbiAgICAgIEl0ZW1EZXRhaWxDb21wb25lbnRcbiAgICBdLFxuICAgIHByb3ZpZGVyczogW1xuICAgICAgSXRlbVNlcnZpY2UsXG4gICAgICBMb2NhdGlvbkRhdGFiYXNlU2VydmljZVxuICAgIF0sXG4gICAgc2NoZW1hczogW1xuICAgICAgTk9fRVJST1JTX1NDSEVNQVxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgQXBwTW9kdWxlIHsgfVxuIl19