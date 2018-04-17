import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { LoginComponent } from "./pages/login/login.component";
import { MainComponent } from "./pages/main/main.component";
import { MainAgentComponent } from "./pages/main-agent/main-agent.component";
import { CustomerDetailsComponent } from './pages/customer-details/customer-details.component';
import { ContractComponent } from "./pages/contract/contract.component";
// import { ContractSettingsComponent } from "./pages/contract/contract-settings";

import { ItemsComponent } from "./pages/item/items.component";
import { ItemDetailComponent } from "./pages/item/item-detail.component";

const routes: Routes = [
    { path: "", component: LoginComponent },
    { path: "main", component: MainComponent },
    { path: "main-agent", component: MainAgentComponent },
    { path: "customer-details/:customer_id", component: CustomerDetailsComponent },
    { path: "contractcreate/:location_id/:settings", component: ContractComponent },
    // { path: "contractsettings/:id", component:  ContractSettingsComponent },

    { path: "items", component: ItemsComponent },
    { path: "item/:id", component: ItemDetailComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }