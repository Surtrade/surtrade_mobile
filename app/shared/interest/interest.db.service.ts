import { Injectable, EventEmitter } from "@angular/core";
const sqlite = require( "nativescript-sqlite" );
import { Interest } from "./interest";

@Injectable()
export class InterestDatabaseService {

  public constructor() {
      console.log("In Interest DB Service Constructor");
  }

  // create a table
  createTable() {
    new sqlite("interest.db", function(err, db) {
        db.execSQL("CREATE TABLE IF NOT EXISTS Interest (id INTEGER PRIMARY KEY, customer_id TEXT, beacon TEXT, start DATETIME,end DATETIME,creating NUMERIC, active NUMERIC, keywords JSON )", [], function(err) {
            console.log("TABLE Interest CREATED");
            return true;
        });
    });
  }
  
  // drops a table
  dropTable() {
    new sqlite("interest.db", function(err, db) {
        db.execSQL("DROP TABLE IF EXISTS Interest", [], function(err) {
            console.log("TABLE Interest DROPPED");
            return true;
        });
    });
  }
  
  insertInterest(interest: Interest) {
    console.log("Attempting to insert: "+interest.id);
    new sqlite("interest.db", function(err, db) {
        db.execSQL("INSERT INTO Interest (id,customer_id,  beacon , start ,end ,creating , active , keywords ) VALUES (?,?,?,?,?,?,?,?)", [interest.id,interest.customer_id, interest.beacon, interest.start, interest.end, interest.creating, interest.active, interest.keywords], function(err, id) {
            console.log("The new record with id " + id+" and beacon "+interest.beacon);
            return true;
        });
    });
  }
  
  // update an existing record
  updateInterest(id,customer_id,  beacon , start ,end ,creating , active , keywords) {
    new sqlite("interest.db", function(err, db) {
        db.execSQL("UPDATE Interest SET customer_id = ?, beacon = ?, start = ?, end = ?, creating = ?, active = ?, keywords = ? WHERE id = ?", [customer_id, beacon, start, end, creating, active, keywords, id], function(err, id) {
            console.log("The existing record id is: " + id);
            return true;
        });
    });
  }
  
  // delete a record
  deleteInterest(id) {
    new sqlite("interest.db", function(err, db) {
        db.execSQL("DELETE FROM Interest WHERE id = ?", [id], function(err, id) {
            console.log("The deleted record id is: " + id);
            return true;
        });
    });
  }
  
  // select a single record
  selectInterest(id): Interest {
    let record: any;
    new sqlite("interest.db", function(err, db) {
        db.get("SELECT * FROM Interest WHERE id = ?", [id], function(err, row) {
            // console.log("Row of data was: " + row);  // Prints [["Field1", "Field2",...]] 
            // console.log("1: "+row[1]);
            record = row;
            // return row;
        });
    });
    return record;
  }

    // select a single record
    selectInterestByBeacon(beacon): Interest {
        console.log("select beacon: "+beacon);
        let record: any;
        new sqlite("interest.db", function(err, db) {
            db.get("SELECT * FROM Interest WHERE beacon = ?", [beacon], function(err, row) {
                // console.log("Row of data was: " + row);  // Prints [["Field1", "Field2",...]] 
                // console.log("1: "+row[1]);
                record = row;
                // return row;
            });
        });
        console.log("record:" +record);
        return record;
      }
  
  // select all records
  selectInterests(): Array<Interest> {
    let interests = new Array<Interest>();
    new sqlite("interest.db", function(err, db) {
        db.all("SELECT * FROM Interest ORDER BY id", [], function(err, rs) {
          rs.forEach(element => {
            console.log("E0: "+element[0]);
            console.log("E1: "+element[1]);
            console.log("E2: "+element[2]);
            console.log("E3: "+element[3]);
            console.log("E4: "+element[4]);
            console.log("E5: "+element[5]);
            console.log("E6: "+element[6]);
            console.log("E7: "+element[7]);
            let interestObj = new Interest(element[1], element[2], element[3], element[4]);
            interestObj.id = element[0];
            interestObj.creating = element[5];
            interestObj.active = element[6];
            interestObj.keywords = element[7];
            interests.push(interestObj);
            
          });   
        });
    });
    return interests;
  }
  
  finishInterests(): Array<Interest>{
    let finishedInterests = Array<Interest>();

    // Retrive all interests (should be max 1)
    let interests = this.selectInterests();

    console.log("how many intersts to finish: "+interests.length);
    // if there is an interest 
    if (interests.length > 0){
        interests.forEach(interest =>{
        let start = new Date(interest.start);
        let end = new Date(interest.end);
        let duration = end.getTime() - start.getTime();
        let sinceLast = new Date().getTime() - end.getTime();
        console.log("Interest: "+interest.beacon+", sinceLast: "+sinceLast+", duration: "+duration);
        
        // if duration  > 1 minute then send interest
        if( duration > 60000){
            // console.log("Sending interest b: "+interest.beacon)
            // console.log("Actual implementation pending..");
            finishedInterests.push(interest);
        }
        console.log("Deleting interest due to expiring contract: "+interest.beacon);
        this.deleteInterest(interest.id);
        
        });
    }

    return finishedInterests;
  }

}