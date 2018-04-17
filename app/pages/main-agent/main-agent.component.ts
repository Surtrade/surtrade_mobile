import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";

import { User } from "../../shared/user/user";
// import { Contract } from "../../shared/contract/contract";

// import { UserService } from '../../shared/user/user.service';
import { ContractService } from "../../shared/contract/contract.service";

import * as application from 'application';
import { AndroidApplication, AndroidActivityBackPressedEventData } from "application";
import { isAndroid } from "platform";

var appSettings = require("application-settings");

@Component({
    selector: "main-agent",
    providers: [ContractService],
    templateUrl: "pages/main-agent/main-agent.html",
    styleUrls:["pages/main-agent/main-agent-common.css"] 
})

export class MainAgentComponent implements OnInit{
// private variables
  private _agent_id: Number;
  private _agent_location: Number;

  // public variables
  public title: string;
  public customerList: Array<User> = [];

  //flags
  public isBusy = false;
  public listLoaded = false;
  public noContracts = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: RouterExtensions,
    private contractService: ContractService){

  }

  ngOnInit() {
    try{
      // Return to login if app settings are not set
      if (!appSettings.hasKey("user_name") || !appSettings.hasKey("user_location_id")){
        // alert("Logout in if");
        this.router.navigate(["/"], { clearHistory: true });
        this.logout();
      }

      this._agent_id = appSettings.getNumber("user_id");
      this._agent_location = appSettings.getNumber("user_location_id");
    }catch(e){
      // alert("logout in catch");
      this.logout();
    } 

    if (isAndroid) {
        application.android.on(AndroidApplication.activityBackPressedEvent, (data: AndroidActivityBackPressedEventData) => {
          // this.logout();

        });
      }

    this.title = "Welcome agent: "+ appSettings.getString("user_name");    

    this.isBusy = true;
    this.contractService.getCustomersWithContract(this._agent_location)
      .subscribe(response => {
        this.isBusy = false;
        this.customerList = response;
        this.listLoaded = true;
        // console.log(this.customers[0].name);
        // response.forEach(customer => {
        //   this.customers.push(customer);
        // })
      },error => {
        this.isBusy = false;
        if (error.status == 404){
          
          this.noContracts = true;
        }else{
          alert("Error getting active contract information: "+error);
        }
      });

  }

  public customerDetails(customer_id){
    this.router.navigate(["/customer-details",customer_id], {
      // animation: true,
      transition: {
          name: "slideLeft",
          duration: 200,
          curve: "linear"
      }
    });
    // alert("Showing details of customer: "+customer_id);
  }

  public logout(){
    appSettings.remove("user_name");
    appSettings.remove("user_password");

    this.router.navigate(["/"], { clearHistory: true });
  }

}