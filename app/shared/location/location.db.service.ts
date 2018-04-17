import { Injectable, EventEmitter } from "@angular/core";
// import { Sqlite } from "nativescript-sqlite";
const sqlite = require( "nativescript-sqlite" );
import { Location } from "./location";

@Injectable()
export class LocationDatabaseService {

  public constructor() {
  }

  // create a table
  createTable() {
    new sqlite("location.db", function(err, db) {
        db.execSQL("CREATE TABLE IF NOT EXISTS Location (id INTEGER PRIMARY KEY, name TEXT, type TEXT, address TEXT, lat REAL, lng REAL, ne_lat REAL, ne_lng REAL, sw_lat REAL, sw_lng REAL)", [], function(err) {
            console.log("TABLE Location CREATED");
            return true;
        });
    });
  }
  
  // drops a table
  dropTable() {
    new sqlite("location.db", function(err, db) {
        db.execSQL("DROP TABLE IF EXISTS Location", [], function(err) {
            console.log("TABLE Location DROPPED");
            return true;
        });
    });
  }
  
  // insert a new record
  // insertLocation(id, lat, lng, name, address, type, ne_lat, ne_lng, sw_lat, sw_lng) {
  //   new sqlite("location.db", function(err, db) {
  //       db.execSQL("INSERT INTO Location (id, lat, lng, name, address, type, ne_lat, ne_lng, sw_lat, sw_lng ) VALUES (?,?,?,?,?,?,?,?,?,?)", [id, lat, lng, name, address, type, ne_lat, ne_lng, sw_lat, sw_lng], function(err, id) {
  //           console.log("The new record id is: " + id);
  //           return true;
  //       });
  //   });
  // }
   insertLocation(location: Location) {
    console.log("Attempting to insert: "+location.name);
    new sqlite("location.db", function(err, db) {
        db.execSQL("INSERT INTO Location (id, lat, lng, name, address, type, ne_lat, ne_lng, sw_lat, sw_lng ) VALUES (?,?,?,?,?,?,?,?,?,?)", [location.id, location.lat, location.lng, location.name, location.address, location.type, location.ne_lat, location.ne_lng, location.sw_lat, location.sw_lng], function(err, id) {
            console.log("The new record id is: " + id);
            return true;
        });
    });
  }
  
  // update an existing record
  updateLocation(id, lat, lng, name, address, type, ne_lat, ne_lng, sw_lat, sw_lng) {
    new sqlite("location.db", function(err, db) {
        db.execSQL("UPDATE Location SET lat = ?, lng = ?, name = ?, address = ?, type = ?, ne_lat = ?, ne_lng = ?, sw_lat = ?, sw_ln = ? WHERE id = ?", [lat, lng, name, address, type, ne_lat, ne_lng, sw_lat, sw_lng, id], function(err, id) {
            console.log("The existing record id is: " + id);
            return true;
        });
    });
  }
  
  // delete a record
  deleteLocation(id) {
    new sqlite("location.db", function(err, db) {
        db.execSQL("DELETE FROM Location WHERE id = ?", [id], function(err, id) {
            console.log("The deleted record id is: " + id);
            return true;
        });
    });
  }
  
  // select a single record
  selectLocation(id) {
    let record: any;
    new sqlite("location.db", function(err, db) {
        db.get("SELECT * FROM Location WHERE id = ?", [id], function(err, row) {
            console.log("Row of data was: " + row);  // Prints [["Field1", "Field2",...]] 
            console.log("1: "+row[1]);
            record = row;
            // return row;
        });
    });
    return record;
  }
  
  // select all records
  selectAllLocations(): Array<Location> {
    // console.log("Selecting all locations.");
    let locations = new Array<Location>();
    new sqlite("location.db", function(err, db) {
        db.all("SELECT * FROM Location ORDER BY id", [], function(err, rs) {
          // console.log("Result set is: " + rs); // Prints [["Row_1 Field_1" "Row_1 Field_2",...], ["Row 2"...], ...]
          rs.forEach(element => {
            // console.log("E0: "+element[0]);
            // console.log("E1: "+element[1]);
            // console.log("E2: "+element[2]);
            // console.log("E3: "+element[3]);
            // console.log("E4: "+element[4]);
            // console.log("E5: "+element[5]);
            // console.log("E6: "+element[6]);
            // console.log("E7: "+element[7]);
            // console.log("E8: "+element[8]);
            // console.log("E9: "+element[9]);
            // let location = new Location(element[1],element[2]);
            // location.id = element[0];
            // location.name = element[3];
            // location.address = element[4];
            // location.type = element[5];
            // location.ne_lat = element[6];
            // location.ne_lng = element[7];
            // location.sw_lat = element[8];
            // location.sw_lng = element[9];
            let location = new Location(element[4],element[5]);
            location.id = element[0];
            location.name = element[1];
            location.address = element[3];
            location.type = element[2];
            location.ne_lat = element[6];
            location.ne_lng = element[7];
            location.sw_lat = element[8];
            location.sw_lng = element[9];
            locations.push(location);
          });   
        });
    });
    return locations;
  }   

  // query(query){
  //   new sqlite("location.db", function(err, db) {

  //   });
  // } 

}