// var validator = require("email-validator");

export class User {
  id: Number;
  email: string;
  password: string;
  name: string;
  username: string;
  role: string;
  created_date: Date;
  location_id: string;

  // isValidEmail() {
  //   return validator.validate(this.email);
  // }
}
