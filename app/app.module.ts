import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { AppRoutingModule } from "./app.routing";
import { AppComponent } from "./app.component";

import { LoginComponent } from './pages/login/login.component';
import { MainComponent } from "./pages/main/main.component";
import { MainAgentComponent } from "./pages/main-agent/main-agent.component";
import { CustomerDetailsComponent } from './pages/customer-details/customer-details.component';
import { ContractComponent } from "./pages/contract/contract.component";
// import { ContractSettingsComponent } from "./pages/contract/contract-settings";
import { ShelfComponent } from "./pages/shelf/shelf.component";

import { LocationDatabaseService } from "./shared/location/location.db.service";

import { ItemService } from "./pages/item/item.service";
import { ItemsComponent } from "./pages/item/items.component";
import { ItemDetailComponent } from "./pages/item/item-detail.component";

@NgModule({
    bootstrap: [
      AppComponent
    ],
    imports: [
      NativeScriptModule,
      NativeScriptFormsModule,
      NativeScriptHttpModule,
      AppRoutingModule
    ],
    declarations: [
      AppComponent,
      LoginComponent,
      MainComponent,
      MainAgentComponent,
      CustomerDetailsComponent,
      ContractComponent,
      // ContractSettingsComponent,
      ShelfComponent,
      ItemsComponent,
      ItemDetailComponent
    ],
    providers: [
      ItemService,
      LocationDatabaseService
    ],
    schemas: [
      NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
