"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var sqlite = require("nativescript-sqlite");
var beacon_1 = require("./beacon");
var BeaconDatabaseService = (function () {
    function BeaconDatabaseService() {
        console.log("In Beacon DB Service Constructor");
    }
    // create a table
    BeaconDatabaseService.prototype.createTable = function () {
        new sqlite("beacon.db", function (err, db) {
            db.execSQL("CREATE TABLE IF NOT EXISTS Beacon (id INTEGER PRIMARY KEY, identificator TEXT, major TEXT, minor TEXT, role TEXT, name TEXT, active NUMERIC, keywords JSON, location_id TEXT )", [], function (err) {
                console.log("TABLE Beacon CREATED");
                return true;
            });
        });
    };
    // drops a table
    BeaconDatabaseService.prototype.dropTable = function () {
        new sqlite("beacon.db", function (err, db) {
            db.execSQL("DROP TABLE IF EXISTS Beacon", [], function (err) {
                console.log("TABLE Beacon DROPPED");
                return true;
            });
        });
    };
    BeaconDatabaseService.prototype.insertBeacon = function (beacon) {
        console.log("Attempting to insert: " + beacon.id);
        new sqlite("beacon.db", function (err, db) {
            db.execSQL("INSERT INTO Beacon (id, identificator, major, minor, role, name, active, keywords, location_id ) VALUES (?,?,?,?,?,?,?,?,?)", [beacon.id, beacon.identificator, beacon.major, beacon.minor, beacon.role, beacon.name, beacon.active, beacon.keywords, beacon.location_id], function (err, id) {
                console.log("The new record with id " + id + " and name " + beacon.name);
                return true;
            });
        });
    };
    // update an existing record
    BeaconDatabaseService.prototype.updateBeacon = function (id, identificator, major, minor, role, name, active, keywords, location_id) {
        new sqlite("beacon.db", function (err, db) {
            db.execSQL("UPDATE Beacon SET identificator = ?, major = ?, minor = ?, role = ?, name = ?, active = ?, keywords = ?, location_id = ? WHERE id = ?", [identificator, major, minor, role, name, active, keywords, location_id, id], function (err, id) {
                console.log("The existing record id is: " + id);
                return true;
            });
        });
    };
    // delete a record
    BeaconDatabaseService.prototype.deleteBeacon = function (id) {
        new sqlite("beacon.db", function (err, db) {
            db.execSQL("DELETE FROM Beacon WHERE id = ?", [id], function (err, id) {
                console.log("The deleted record id is: " + id);
                return true;
            });
        });
    };
    // select a single record
    BeaconDatabaseService.prototype.selectBeacon = function (id) {
        var record;
        new sqlite("beacon.db", function (err, db) {
            db.get("SELECT * FROM Beacon WHERE id = ?", [id], function (err, row) {
                // console.log("Row of data was: " + row);  // Prints [["Field1", "Field2",...]] 
                // console.log("1: "+row[1]);
                record = row;
                // return row;
            });
        });
        return record;
    };
    // select a single store record by location
    BeaconDatabaseService.prototype.selectBeaconByLocation = function (location_id) {
        var record;
        new sqlite("beacon.db", function (err, db) {
            db.get("SELECT * FROM Beacon WHERE role = 'store' and location_id = ?", [location_id], function (err, row) {
                console.log("Row of data  by location was: " + row); // Prints [["Field1", "Field2",...]] 
                console.log("1: " + row[1]);
                record = row;
                // return row;
            });
        });
        return record;
    };
    // select all records
    BeaconDatabaseService.prototype.selectBeacons = function (role, location_id) {
        if (role === void 0) { role = "all"; }
        if (location_id === void 0) { location_id = "0"; }
        // console.log("out param id: "+location_id);
        // console.log("Selecting all beacons.");
        var beacons = new Array();
        new sqlite("beacon.db", function (err, db) {
            db.all("SELECT * FROM Beacon ORDER BY id", [], function (err, rs) {
                // console.log("Result set is: " + rs); // Prints [["Row_1 Field_1" "Row_1 Field_2",...], ["Row 2"...], ...]
                rs.forEach(function (element) {
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
                    var beaconObj = new beacon_1.Beacon(element[2], element[3]);
                    beaconObj.id = element[0];
                    beaconObj.identificator = element[1];
                    beaconObj.role = element[4];
                    beaconObj.name = element[5];
                    beaconObj.active = element[6];
                    beaconObj.keywords = element[7];
                    beaconObj.location_id = element[8];
                    // console.log("Beacon fetched form Local DB: "+beaconObj);
                    // console.log("Beacon keywords: "+beaconObj.keywords.toString());
                    // console.log("param role: "+role);
                    // console.log("obj role: "+beaconObj.role);
                    if (role == beaconObj.role) {
                        // console.log("Role: "+role);
                        if (location_id != "0") {
                            // console.log("in param id: "+location_id);
                            // console.log("obj id: "+beaconObj.location_id);
                            if (location_id == beaconObj.location_id) {
                                beacons.push(beaconObj);
                                // console.log("Pushing beacon: "+beaconObj.name)
                            }
                            // If role is item and location_id is not the same as beacon object's location then ignore beacon.
                        }
                        else {
                            beacons.push(beaconObj);
                        }
                    }
                    else if (role == "all") {
                        beacons.push(beaconObj);
                    }
                });
            });
        });
        return beacons;
    };
    BeaconDatabaseService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], BeaconDatabaseService);
    return BeaconDatabaseService;
}());
exports.BeaconDatabaseService = BeaconDatabaseService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVhY29uLmRiLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiZWFjb24uZGIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF5RDtBQUN6RCxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUUscUJBQXFCLENBQUUsQ0FBQztBQUNoRCxtQ0FBa0M7QUFHbEM7SUFFRTtRQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0NBQWtDLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRUQsaUJBQWlCO0lBQ2pCLDJDQUFXLEdBQVg7UUFDRSxJQUFJLE1BQU0sQ0FBQyxXQUFXLEVBQUUsVUFBUyxHQUFHLEVBQUUsRUFBRTtZQUNwQyxFQUFFLENBQUMsT0FBTyxDQUFDLGdMQUFnTCxFQUFFLEVBQUUsRUFBRSxVQUFTLEdBQUc7Z0JBQ3pNLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztnQkFDcEMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNoQixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELGdCQUFnQjtJQUNoQix5Q0FBUyxHQUFUO1FBQ0UsSUFBSSxNQUFNLENBQUMsV0FBVyxFQUFFLFVBQVMsR0FBRyxFQUFFLEVBQUU7WUFDcEMsRUFBRSxDQUFDLE9BQU8sQ0FBQyw2QkFBNkIsRUFBRSxFQUFFLEVBQUUsVUFBUyxHQUFHO2dCQUN0RCxPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUM7Z0JBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDaEIsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFQSw0Q0FBWSxHQUFaLFVBQWEsTUFBYztRQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixHQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNoRCxJQUFJLE1BQU0sQ0FBQyxXQUFXLEVBQUUsVUFBUyxH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cUIsQ0ErSWpDO0lBQUQsNEJBQUM7Q0FBQSxBQS9JRCxJQStJQztBQS9JWSxzREFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBFdmVudEVtaXR0ZXIgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuY29uc3Qgc3FsaXRlID0gcmVxdWlyZSggXCJuYXRpdmVzY3JpcHQtc3FsaXRlXCIgKTtcbmltcG9ydCB7IEJlYWNvbiB9IGZyb20gXCIuL2JlYWNvblwiO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQmVhY29uRGF0YWJhc2VTZXJ2aWNlIHtcblxuICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkluIEJlYWNvbiBEQiBTZXJ2aWNlIENvbnN0cnVjdG9yXCIpO1xuICB9XG5cbiAgLy8gY3JlYXRlIGEgdGFibGVcbiAgY3JlYXRlVGFibGUoKSB7XG4gICAgbmV3IHNxbGl0ZShcImJlYWNvbi5kYlwiLCBmdW5jdGlvbihlcnIsIGRiKSB7XG4gICAgICAgIGRiLmV4ZWNTUUwoXCJDUkVBVEUgVEFCTEUgSUYgTk9UIEVYSVNUUyBCZWFjb24gKGlkIElOVEVHRVIgUFJJTUFSWSBLRVksIGlkZW50aWZpY2F0b3IgVEVYVCwgbWFqb3IgVEVYVCwgbWlub3IgVEVYVCwgcm9sZSBURVhULCBuYW1lIFRFWFQsIGFjdGl2ZSBOVU1FUklDLCBrZXl3b3JkcyBKU09OLCBsb2NhdGlvbl9pZCBURVhUIClcIiwgW10sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJUQUJMRSBCZWFjb24gQ1JFQVRFRFwiKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICBcbiAgLy8gZHJvcHMgYSB0YWJsZVxuICBkcm9wVGFibGUoKSB7XG4gICAgbmV3IHNxbGl0ZShcImJlYWNvbi5kYlwiLCBmdW5jdGlvbihlcnIsIGRiKSB7XG4gICAgICAgIGRiLmV4ZWNTUUwoXCJEUk9QIFRBQkxFIElGIEVYSVNUUyBCZWFjb25cIiwgW10sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJUQUJMRSBCZWFjb24gRFJPUFBFRFwiKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICBcbiAgIGluc2VydEJlYWNvbihiZWFjb246IEJlYWNvbikge1xuICAgIGNvbnNvbGUubG9nKFwiQXR0ZW1wdGluZyB0byBpbnNlcnQ6IFwiK2JlYWNvbi5pZCk7XG4gICAgbmV3IHNxbGl0ZShcImJlYWNvbi5kYlwiLCBmdW5jdGlvbihlcnIsIGRiKSB7XG4gICAgICAgIGRiLmV4ZWNTUUwoXCJJTlNFUlQgSU5UTyBCZWFjb24gKGlkLCBpZGVudGlmaWNhdG9yLCBtYWpvciwgbWlub3IsIHJvbGUsIG5hbWUsIGFjdGl2ZSwga2V5d29yZHMsIGxvY2F0aW9uX2lkICkgVkFMVUVTICg/LD8sPyw/LD8sPyw/LD8sPylcIiwgW2JlYWNvbi5pZCxiZWFjb24uaWRlbnRpZmljYXRvciwgYmVhY29uLm1ham9yLCBiZWFjb24ubWlub3IsIGJlYWNvbi5yb2xlLCBiZWFjb24ubmFtZSwgYmVhY29uLmFjdGl2ZSwgYmVhY29uLmtleXdvcmRzLCBiZWFjb24ubG9jYXRpb25faWRdLCBmdW5jdGlvbihlcnIsIGlkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRoZSBuZXcgcmVjb3JkIHdpdGggaWQgXCIgKyBpZCtcIiBhbmQgbmFtZSBcIitiZWFjb24ubmFtZSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgXG4gIC8vIHVwZGF0ZSBhbiBleGlzdGluZyByZWNvcmRcbiAgdXBkYXRlQmVhY29uKGlkLCBpZGVudGlmaWNhdG9yLCBtYWpvciwgbWlub3IsIHJvbGUsIG5hbWUsIGFjdGl2ZSwga2V5d29yZHMsIGxvY2F0aW9uX2lkKSB7XG4gICAgbmV3IHNxbGl0ZShcImJlYWNvbi5kYlwiLCBmdW5jdGlvbihlcnIsIGRiKSB7XG4gICAgICAgIGRiLmV4ZWNTUUwoXCJVUERBVEUgQmVhY29uIFNFVCBpZGVudGlmaWNhdG9yID0gPywgbWFqb3IgPSA/LCBtaW5vciA9ID8sIHJvbGUgPSA/LCBuYW1lID0gPywgYWN0aXZlID0gPywga2V5d29yZHMgPSA/LCBsb2NhdGlvbl9pZCA9ID8gV0hFUkUgaWQgPSA/XCIsIFtpZGVudGlmaWNhdG9yLCBtYWpvciwgbWlub3IsIHJvbGUsIG5hbWUsIGFjdGl2ZSwga2V5d29yZHMsIGxvY2F0aW9uX2lkLCBpZF0sIGZ1bmN0aW9uKGVyciwgaWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhlIGV4aXN0aW5nIHJlY29yZCBpZCBpczogXCIgKyBpZCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgXG4gIC8vIGRlbGV0ZSBhIHJlY29yZFxuICBkZWxldGVCZWFjb24oaWQpIHtcbiAgICBuZXcgc3FsaXRlKFwiYmVhY29uLmRiXCIsIGZ1bmN0aW9uKGVyciwgZGIpIHtcbiAgICAgICAgZGIuZXhlY1NRTChcIkRFTEVURSBGUk9NIEJlYWNvbiBXSEVSRSBpZCA9ID9cIiwgW2lkXSwgZnVuY3Rpb24oZXJyLCBpZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJUaGUgZGVsZXRlZCByZWNvcmQgaWQgaXM6IFwiICsgaWQpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIFxuICAvLyBzZWxlY3QgYSBzaW5nbGUgcmVjb3JkXG4gIHNlbGVjdEJlYWNvbihpZCkge1xuICAgIGxldCByZWNvcmQ6IGFueTtcbiAgICBuZXcgc3FsaXRlKFwiYmVhY29uLmRiXCIsIGZ1bmN0aW9uKGVyciwgZGIpIHtcbiAgICAgICAgZGIuZ2V0KFwiU0VMRUNUICogRlJPTSBCZWFjb24gV0hFUkUgaWQgPSA/XCIsIFtpZF0sIGZ1bmN0aW9uKGVyciwgcm93KSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlJvdyBvZiBkYXRhIHdhczogXCIgKyByb3cpOyAgLy8gUHJpbnRzIFtbXCJGaWVsZDFcIiwgXCJGaWVsZDJcIiwuLi5dXSBcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiMTogXCIrcm93WzFdKTtcbiAgICAgICAgICAgIHJlY29yZCA9IHJvdztcbiAgICAgICAgICAgIC8vIHJldHVybiByb3c7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiByZWNvcmQ7XG4gIH1cblxuICAvLyBzZWxlY3QgYSBzaW5nbGUgc3RvcmUgcmVjb3JkIGJ5IGxvY2F0aW9uXG4gIHNlbGVjdEJlYWNvbkJ5TG9jYXRpb24obG9jYXRpb25faWQpIHtcbiAgICBsZXQgcmVjb3JkOiBhbnk7XG4gICAgbmV3IHNxbGl0ZShcImJlYWNvbi5kYlwiLCBmdW5jdGlvbihlcnIsIGRiKSB7XG4gICAgICAgIGRiLmdldChcIlNFTEVDVCAqIEZST00gQmVhY29uIFdIRVJFIHJvbGUgPSAnc3RvcmUnIGFuZCBsb2NhdGlvbl9pZCA9ID9cIiwgW2xvY2F0aW9uX2lkXSwgZnVuY3Rpb24oZXJyLCByb3cpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUm93IG9mIGRhdGEgIGJ5IGxvY2F0aW9uIHdhczogXCIgKyByb3cpOyAgLy8gUHJpbnRzIFtbXCJGaWVsZDFcIiwgXCJGaWVsZDJcIiwuLi5dXSBcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiMTogXCIrcm93WzFdKTtcbiAgICAgICAgICAgIHJlY29yZCA9IHJvdztcbiAgICAgICAgICAgIC8vIHJldHVybiByb3c7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiByZWNvcmQ7XG4gIH1cbiAgXG4gIC8vIHNlbGVjdCBhbGwgcmVjb3Jkc1xuICBzZWxlY3RCZWFjb25zKHJvbGUgPSBcImFsbFwiLCBsb2NhdGlvbl9pZCA9IFwiMFwiKTogQXJyYXk8QmVhY29uPiB7XG4gICAgXG4gICAgLy8gY29uc29sZS5sb2coXCJvdXQgcGFyYW0gaWQ6IFwiK2xvY2F0aW9uX2lkKTtcbiAgICAvLyBjb25zb2xlLmxvZyhcIlNlbGVjdGluZyBhbGwgYmVhY29ucy5cIik7XG4gICAgbGV0IGJlYWNvbnMgPSBuZXcgQXJyYXk8QmVhY29uPigpO1xuICAgIG5ldyBzcWxpdGUoXCJiZWFjb24uZGJcIiwgZnVuY3Rpb24oZXJyLCBkYikge1xuICAgICAgICBkYi5hbGwoXCJTRUxFQ1QgKiBGUk9NIEJlYWNvbiBPUkRFUiBCWSBpZFwiLCBbXSwgZnVuY3Rpb24oZXJyLCBycykge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUmVzdWx0IHNldCBpczogXCIgKyBycyk7IC8vIFByaW50cyBbW1wiUm93XzEgRmllbGRfMVwiIFwiUm93XzEgRmllbGRfMlwiLC4uLl0sIFtcIlJvdyAyXCIuLi5dLCAuLi5dXG4gICAgICAgICAgcnMuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiTnVtYmVyIG9mIGVsZW1lbnRzOiBcIitlbGVtZW50Lmxlbmd0aCk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkVsZW1lbnRzOiBcIitlbGVtZW50KTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRTA6IFwiK2VsZW1lbnRbMF0pO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFMTogXCIrZWxlbWVudFsxXSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkUyOiBcIitlbGVtZW50WzJdKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRTM6IFwiK2VsZW1lbnRbM10pO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFNDogXCIrZWxlbWVudFs0XSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkU1OiBcIitlbGVtZW50WzVdKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRTY6IFwiK2VsZW1lbnRbNl0pO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFNzogXCIrZWxlbWVudFs3XSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkU4OiBcIitlbGVtZW50WzhdKTtcbiAgICAgICAgICAgIGxldCBiZWFjb25PYmogPSBuZXcgQmVhY29uKGVsZW1lbnRbMl0sZWxlbWVudFszXSk7XG4gICAgICAgICAgICBiZWFjb25PYmouaWQgPSBlbGVtZW50WzBdO1xuICAgICAgICAgICAgYmVhY29uT2JqLmlkZW50aWZpY2F0b3IgPSBlbGVtZW50WzFdO1xuICAgICAgICAgICAgYmVhY29uT2JqLnJvbGUgPSBlbGVtZW50WzRdO1xuICAgICAgICAgICAgYmVhY29uT2JqLm5hbWUgPSBlbGVtZW50WzVdO1xuICAgICAgICAgICAgYmVhY29uT2JqLmFjdGl2ZSA9IGVsZW1lbnRbNl07XG4gICAgICAgICAgICBiZWFjb25PYmoua2V5d29yZHMgPSBlbGVtZW50WzddO1xuICAgICAgICAgICAgYmVhY29uT2JqLmxvY2F0aW9uX2lkID0gZWxlbWVudFs4XTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQmVhY29uIGZldGNoZWQgZm9ybSBMb2NhbCBEQjogXCIrYmVhY29uT2JqKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQmVhY29uIGtleXdvcmRzOiBcIitiZWFjb25PYmoua2V5d29yZHMudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInBhcmFtIHJvbGU6IFwiK3JvbGUpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJvYmogcm9sZTogXCIrYmVhY29uT2JqLnJvbGUpO1xuICAgICAgICAgICAgaWYocm9sZSA9PSBiZWFjb25PYmoucm9sZSl7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJSb2xlOiBcIityb2xlKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZihsb2NhdGlvbl9pZCE9XCIwXCIpe1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImluIHBhcmFtIGlkOiBcIitsb2NhdGlvbl9pZCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwib2JqIGlkOiBcIitiZWFjb25PYmoubG9jYXRpb25faWQpO1xuICAgICAgICAgICAgICAgICAgICBpZihsb2NhdGlvbl9pZCA9PSBiZWFjb25PYmoubG9jYXRpb25faWQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgYmVhY29ucy5wdXNoKGJlYWNvbk9iaik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlB1c2hpbmcgYmVhY29uOiBcIitiZWFjb25PYmoubmFtZSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBJZiByb2xlIGlzIGl0ZW0gYW5kIGxvY2F0aW9uX2lkIGlzIG5vdCB0aGUgc2FtZSBhcyBiZWFjb24gb2JqZWN0J3MgbG9jYXRpb24gdGhlbiBpZ25vcmUgYmVhY29uLlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICBiZWFjb25zLnB1c2goYmVhY29uT2JqKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9ZWxzZSBpZihyb2xlID09IFwiYWxsXCIpe1xuICAgICAgICAgICAgICAgIGJlYWNvbnMucHVzaChiZWFjb25PYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgfSk7ICAgXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBiZWFjb25zO1xuICB9ICAgXG5cbn0iXX0=