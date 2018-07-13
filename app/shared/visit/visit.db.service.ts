import { Injectable, EventEmitter } from "@angular/core";
const sqlite = require( "nativescript-sqlite" );
import { Visit } from "./visit";

@Injectable()
export class VisitDatabaseService {

  public constructor() {
      console.log("In Visit DB Service Constructor");
  }

  // create a table
  createTable() {
    new sqlite("visit.db", function(err, db) {
        db.execSQL("CREATE TABLE IF NOT EXISTS Visit (id INTEGER PRIMARY KEY, customer_id TEXT, beacon TEXT, start DATETIME,end DATETIME,creating NUMERIC, active NUMERIC, keywords JSON )", [], function(err) {
            console.log("TABLE Visit CREATED");
            return true;
        });
    });
  }
  
  // drops a table
  dropTable() {
    new sqlite("visit.db", function(err, db) {
        db.execSQL("DROP TABLE IF EXISTS Visit", [], function(err) {
            console.log("TABLE Visit DROPPED");
            return true;
        });
    });
  }
  
  insertVisit(visit: Visit) {
      if (visit.id == null){
          visit.id = visit.beacon;
      }
    console.log("Attempting to insert visit: "+visit.id);
    new sqlite("visit.db", function(err, db) {
        db.execSQL("INSERT INTO Visit (id, customer_id,  beacon , start ,end ,creating , active , keywords ) VALUES (?,?,?,?,?,?,?,?)", [visit.id,visit.customer_id, visit.beacon, visit.start, visit.end, visit.creating, visit.active, visit.keywords], function(err, id) {
            console.log("The new visit record with id " + id+" and beacon "+visit.beacon);
            return true;
        });
    });
  }
  
  // update an existing record
//   updateVisit(id,customer_id,  beacon , start ,end ,creating , active , keywords) {
  updateVisit(visit:Visit) {
    new sqlite("visit.db", function(err, db) {
        // db.execSQL("UPDATE Visit SET customer_id = ?, beacon = ?, start = ?, end = ?, creating = ?, active = ?, keywords = ? WHERE id = ?", [customer_id, beacon, start, end, creating, active, keywords, id], function(err, id) {
        db.execSQL("UPDATE Visit SET customer_id = ?, beacon = ?, start = ?, end = ?, creating = ?, active = ?, keywords = ? WHERE id = ?", [visit.customer_id, visit.beacon, visit.start, new Date(), visit.creating, visit.active, visit.keywords, visit.id], function(err, id) {
            console.log("The existing visit record id is: " + id);
            return true;
        });
    });
  }
  
  // delete a record
  deleteVisit(id) {
      console.log("About to delete visit from db: "+id)
    new sqlite("visit.db", function(err, db) {
        db.execSQL("DELETE FROM Visit WHERE id = ?", [id], function(err, id) {
            console.log("The deleted visit record id is: " + id);
            return true;
        });
    });
  }
  
  // select a single record
  selectVisit(id): Visit {
    let record: Visit;
    new sqlite("visit.db", function(err, db) {
        db.get("SELECT * FROM Visit WHERE id = ?", [id], function(err, row) {
            // console.log("Row of data was: " + row);  // Prints [["Field1", "Field2",...]] 
            // console.log("1: "+row[1]);
            record = new Visit(row[1],row[2],row[3],row[4]);
            record.id = row[0];
            // record = row;
            // return row;
        });
    });
    return record;
  }

    // select a single record
    selectVisitByBeacon(beacon): Visit {
        console.log("select beacon: "+beacon);
        let record: Visit = null;
        new sqlite("visit.db", function(err, db) {
            db.get("SELECT * FROM Visit WHERE beacon = ? LIMIT 1", [beacon], function(err, row) {
                if (row!=null){
                    console.log("Row of visit data was: " + row);  // Prints [["Field1", "Field2",...]] 
                    // console.log("1: "+row[1]);
                    record = new Visit(row[1],row[2],row[3],row[4]);
                    record.id = row[0];
                    // record = row;
                    // return row;
                }else{
                    record = null;
                }
                
            });
        });
        console.log("record (visit):" +record);
        return record;
      }
  
  // select all records
  selectVisits(): Array<Visit> {
    let visits = new Array<Visit>();
    new sqlite("visit.db", function(err, db) {
        db.all("SELECT * FROM Visit ORDER BY id", [], function(err, rs) {
          rs.forEach(element => {
            // console.log("E0: "+element[0]);
            // console.log("E1: "+element[1]);
            // console.log("E2: "+element[2]);
            // console.log("E3: "+element[3]);
            // console.log("E4: "+element[4]);
            // console.log("E5: "+element[5]);
            // console.log("E6: "+element[6]);
            // console.log("E7: "+element[7]);
            let visitObj = new Visit(element[1], element[2], element[3], element[4]);
            visitObj.id = element[0];
            visitObj.creating = element[5];
            visitObj.active = element[6];
            visitObj.keywords = element[7];
            visits.push(visitObj);
            
          });   
        });
    });
    return visits;
  }   

//   finishVisits(){
//     let reply = false
//       // Retrive all visits (should be max 1)
//       let visits = this.selectVisits();

//       console.log("how many intersts to finish: "+visits.length);
//       // if there is an visit 
//       if (visits.length > 0){
//           visits.forEach(visit =>{
//           let start = new Date(visit[3]);
//           let end = new Date(visit[4]);
//           let duration = end.getTime() - start.getTime();
//           let sinceLast = new Date().getTime() - end.getTime();
//           // if sinceLast > 60 seconds <- this is crucial for knowing if it is away
//           if(sinceLast > 60000){
//               // if duration  > 1 minute then send visit
//               if( duration > 60000){
//                   console.log("Sending visit b: "+visit[0])
//                   console.log("Actual implementation pending..");
//                   reply = true
//               }
//               console.log("Deleting visit due to more than 1 minute away: "+visit[0]);
//               this.deleteVisit(visit[0]);
//           }
//           });
//       }

//       return reply;
// }

}