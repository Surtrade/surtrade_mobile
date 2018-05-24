import { Injectable, EventEmitter } from "@angular/core";
const sqlite = require( "nativescript-sqlite" );
import { Beacon } from "./beacon";

@Injectable()
export class BeaconDatabaseService {

  public constructor() {
      console.log("In Beacon DB Service Constructor");
  }

  // create a table
  createTable() {
    new sqlite("beacon.db", function(err, db) {
        db.execSQL("CREATE TABLE IF NOT EXISTS Beacon (id INTEGER PRIMARY KEY, identificator, TEXT, major TEXT, minor TEXT, role TEXT, name TEXT, active NUMERIC, keywords JSON, location_id TEXT )", [], function(err) {
            console.log("TABLE Beacon CREATED");
            return true;
        });
    });
  }
  
  // drops a table
  dropTable() {
    new sqlite("beacon.db", function(err, db) {
        db.execSQL("DROP TABLE IF EXISTS Beacon", [], function(err) {
            console.log("TABLE Beacon DROPPED");
            return true;
        });
    });
  }
  
   insertBeacon(beacon: Beacon) {
    console.log("Attempting to insert: "+beacon.id);
    new sqlite("beacon.db", function(err, db) {
        db.execSQL("INSERT INTO Beacon (id, identificator, major, minor, role, name, active, keywords, location_id ) VALUES (?,?,?,?,?,?,?,?,?)", [beacon.id,beacon.identificator, beacon.major, beacon.minor, beacon.role, beacon.name, beacon.active, beacon.keywords, beacon.location_id], function(err, id) {
            console.log("The new record with id " + id+" and name "+beacon.name);
            return true;
        });
    });
  }
  
  // update an existing record
  updateBeacon(id, identificator, major, minor, role, name, active, keywords, location_id) {
    new sqlite("beacon.db", function(err, db) {
        db.execSQL("UPDATE Beacon SET identificator = ?, major = ?, minor = ?, role = ?, name = ?, active = ?, keywords = ?, location_id = ? WHERE id = ?", [major, minor, role, id], function(err, id) {
            console.log("The existing record id is: " + id);
            return true;
        });
    });
  }
  
  // delete a record
  deleteBeacon(id) {
    new sqlite("beacon.db", function(err, db) {
        db.execSQL("DELETE FROM Beacon WHERE id = ?", [id], function(err, id) {
            console.log("The deleted record id is: " + id);
            return true;
        });
    });
  }
  
  // select a single record
  selectBeacon(id) {
    let record: any;
    new sqlite("beacon.db", function(err, db) {
        db.get("SELECT * FROM Beacon WHERE id = ?", [id], function(err, row) {
            // console.log("Row of data was: " + row);  // Prints [["Field1", "Field2",...]] 
            // console.log("1: "+row[1]);
            record = row;
            // return row;
        });
    });
    return record;
  }

  // select a single store record by location
  selectBeaconByLocation(location_id) {
    let record: any;
    new sqlite("beacon.db", function(err, db) {
        db.get("SELECT * FROM Beacon WHERE role = 'store' and location_id = ?", [location_id], function(err, row) {
            console.log("Row of data  by location was: " + row);  // Prints [["Field1", "Field2",...]] 
            console.log("1: "+row[1]);
            record = row;
            // return row;
        });
    });
    return record;
  }
  
  // select all records
  selectBeacons(role = "all", location_id = "0"): Array<Beacon> {
    
    // console.log("out param id: "+location_id);
    // console.log("Selecting all beacons.");
    let beacons = new Array<Beacon>();
    new sqlite("beacon.db", function(err, db) {
        db.all("SELECT * FROM Beacon ORDER BY id", [], function(err, rs) {
          // console.log("Result set is: " + rs); // Prints [["Row_1 Field_1" "Row_1 Field_2",...], ["Row 2"...], ...]
          rs.forEach(element => {
            // console.log("Number of elements: "+element.length);
            // console.log("Elements: "+element);
            // console.log("E0: "+element[0]);
            // console.log("E1: "+element[1]);
            // console.log("E2: "+element[2]);
            // console.log("E3: "+element[3]);
            // console.log("E4: "+element[4]);
            // console.log("E5: "+element[5]);
            // console.log("E6: "+element[6]);
            // console.log("E7: "+element[7]);
            // console.log("E8: "+element[8]);
            let beaconObj = new Beacon(element[3],element[4]);
            beaconObj.id = element[0];
            beaconObj.identificator = element[1];
            beaconObj.major = element[3];
            beaconObj.minor = element[4];
            beaconObj.role = element[5];
            beaconObj.name = element[6];
            beaconObj.active = element[7];
            beaconObj.keywords = element[8];
            beaconObj.location_id = element[9];
            // console.log("Beacon fetched form Local DB: "+beaconObj);
            // console.log("Beacon keywords: "+beaconObj.keywords.toString());
            // console.log("param role: "+role);
            // console.log("obj role: "+beaconObj.role);
            if(role == beaconObj.role){
                // console.log("Role: "+role);
                
                if(location_id!="0"){
                    // console.log("in param id: "+location_id);
                    // console.log("obj id: "+beaconObj.location_id);
                    if(location_id == beaconObj.location_id){
                        beacons.push(beaconObj);
                        // console.log("Pushing beacon: "+beaconObj.name)
                    }
                    // If role is item and location_id is not the same as beacon object's location then ignore beacon.
                }
                else{
                    beacons.push(beaconObj);
                }
                
            }else if(role == "all"){
                beacons.push(beaconObj);
            }
            
          });   
        });
    });
    return beacons;
  }   

}