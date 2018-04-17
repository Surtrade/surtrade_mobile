// import { Component, OnInit } from "@angular/core";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
// import { Color } from "color";
// import { View } from "ui/core/view";
import { Page } from "ui/page";
// import { TextField } from "ui/text-field";
// import { set } from "application-settings";

import { User } from "../../shared/user/user";
import { UserService } from "../../shared/user/user.service";
// import { setHintColor } from "../../utils/hint-util";

var appSettings = require("application-settings");

@Component({
  selector: "my-app",
  providers: [UserService],
  templateUrl: "pages/login/login.html",
  styleUrls: ["pages/login/login-common.css", "pages/login/login.css"],
})

export class LoginComponent implements OnInit{
  user: User;
  isLoggingIn = true;
  isBusy = false;

  // @ViewChild("container") container: ElementRef;
  // @ViewChild("username") username: ElementRef;
  // @ViewChild("password") password: ElementRef;

  constructor(private router: Router, private userService: UserService, private page: Page) {
    this.user = new User();
    this.isBusy = false;
          
  }

  ngOnInit() {
    this.page.actionBarHidden = true;
    this.page.backgroundImage = "res://particles_bg";

    this.user.username = "crflickC";
    this.user.password = "Password1!";

    // Autologin
    if (appSettings.hasKey("user_name") && appSettings.hasKey("user_password")){
      this.user.username = appSettings.getString("user_name",this.user.username);
      this.user.password = appSettings.getString("user_password",this.user.password);

      this.login()
    }
  }

  submit() {
    // if (!this.user.isValidEmail()) {
    //   alert("Enter a valid email address.");
    //   return;
    // }
    if (this.isLoggingIn) {
      this.login();
    } else {
      this.signUp();
    }
  }

  login() {
    this.isBusy = true;
    this.userService.login(this.user)
      .subscribe(
        (response) => {
          
          // console.log("login attempt");
          appSettings.setString("user_name",this.user.username);
          appSettings.setString("user_password",this.user.password);
          appSettings.setNumber("user_id",response.user_id);
          appSettings.setString("user_role",response.user_role);
          this.isBusy = false; 
          if (response.user_role == 'Customer'){
            this.router.navigate(["/main"]);
          }
          else{
            // console.log("It's agent, user location: "+response.user_location);
            // alert("U loc: "+response.user_location);
            appSettings.setNumber("user_location_id",response.user_location);
            // console.log("It's agent2");
            this.router.navigate(["/main-agent"]);
          }
        },
        (error) => {
          alert("Unfortunately we could not find your account.");
          this.isBusy = false;
        }
      );
  }

  signUp() {
    this.isBusy = true;
    this.userService.register(this.user)
      .subscribe(
        (response) => {
          this.isBusy = false;
          alert("Your account was successfully created.");
          this.toggleDisplay();
        },
        (error) => {alert("Unfortunately we were unable to create your account: "+error); 
        this.isBusy = false;}
      );
    
  }

  toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;
  }

}