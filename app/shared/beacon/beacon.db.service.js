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
            db.execSQL("CREATE TABLE IF NOT EXISTS Beacon (id INTEGER PRIMARY KEY, identificator, TEXT, major TEXT, minor TEXT, role TEXT, name TEXT, active NUMERIC, keywords JSON, location_id TEXT )", [], function (err) {
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
            db.execSQL("UPDATE Beacon SET identificator = ?, major = ?, minor = ?, role = ?, name = ?, active = ?, keywords = ?, location_id = ? WHERE id = ?", [major, minor, role, id], function (err, id) {
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
        console.log("out param id: " + location_id);
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
                    var beaconObj = new beacon_1.Beacon(element[3], element[4]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVhY29uLmRiLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiZWFjb24uZGIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF5RDtBQUN6RCxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUUscUJBQXFCLENBQUUsQ0FBQztBQUNoRCxtQ0FBa0M7QUFHbEM7SUFFRTtRQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0NBQWtDLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRUQsaUJBQWlCO0lBQ2pCLDJDQUFXLEdBQVg7UUFDRSxJQUFJLE1BQU0sQ0FBQyxXQUFXLEVBQUUsVUFBUyxHQUFHLEVBQUUsRUFBRTtZQUNwQyxFQUFFLENBQUMsT0FBTyxDQUFDLGlMQUFpTCxFQUFFLEVBQUUsRUFBRSxVQUFTLEdBQUc7Z0JBQzFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztnQkFDcEMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNoQixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELGdCQUFnQjtJQUNoQix5Q0FBUyxHQUFUO1FBQ0UsSUFBSSxNQUFNLENBQUMsV0FBVyxFQUFFLFVBQVMsR0FBRyxFQUFFLEVBQUU7WUFDcEMsRUFBRSxDQUFDLE9BQU8sQ0FBQyw2QkFBNkIsRUFBRSxFQUFFLEVBQUUsVUFBUyxHQUFHO2dCQUN0RCxPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUM7Z0JBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDaEIsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFQSw0Q0FBWSxHQUFaLFVBQWEsTUFBYztRQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixHQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNoRCxJQUFJLE1BQU0sQ0FBQyxXQUFXLEVBQUUsVUFBUyxH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Q1AsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUEvSVUscUJBQXFCO1FBRGpDLGlCQUFVLEVBQUU7O09BQ0EscUJBQXFCLENBaUpqQztJQUFELDRCQUFDO0NBQUEsQUFqSkQsSUFpSkM7QUFqSlksc0RBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgRXZlbnRFbWl0dGVyIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmNvbnN0IHNxbGl0ZSA9IHJlcXVpcmUoIFwibmF0aXZlc2NyaXB0LXNxbGl0ZVwiICk7XG5pbXBvcnQgeyBCZWFjb24gfSBmcm9tIFwiLi9iZWFjb25cIjtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEJlYWNvbkRhdGFiYXNlU2VydmljZSB7XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuICAgICAgY29uc29sZS5sb2coXCJJbiBCZWFjb24gREIgU2VydmljZSBDb25zdHJ1Y3RvclwiKTtcbiAgfVxuXG4gIC8vIGNyZWF0ZSBhIHRhYmxlXG4gIGNyZWF0ZVRhYmxlKCkge1xuICAgIG5ldyBzcWxpdGUoXCJiZWFjb24uZGJcIiwgZnVuY3Rpb24oZXJyLCBkYikge1xuICAgICAgICBkYi5leGVjU1FMKFwiQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgQmVhY29uIChpZCBJTlRFR0VSIFBSSU1BUlkgS0VZLCBpZGVudGlmaWNhdG9yLCBURVhULCBtYWpvciBURVhULCBtaW5vciBURVhULCByb2xlIFRFWFQsIG5hbWUgVEVYVCwgYWN0aXZlIE5VTUVSSUMsIGtleXdvcmRzIEpTT04sIGxvY2F0aW9uX2lkIFRFWFQgKVwiLCBbXSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRBQkxFIEJlYWNvbiBDUkVBVEVEXCIpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIFxuICAvLyBkcm9wcyBhIHRhYmxlXG4gIGRyb3BUYWJsZSgpIHtcbiAgICBuZXcgc3FsaXRlKFwiYmVhY29uLmRiXCIsIGZ1bmN0aW9uKGVyciwgZGIpIHtcbiAgICAgICAgZGIuZXhlY1NRTChcIkRST1AgVEFCTEUgSUYgRVhJU1RTIEJlYWNvblwiLCBbXSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRBQkxFIEJlYWNvbiBEUk9QUEVEXCIpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIFxuICAgaW5zZXJ0QmVhY29uKGJlYWNvbjogQmVhY29uKSB7XG4gICAgY29uc29sZS5sb2coXCJBdHRlbXB0aW5nIHRvIGluc2VydDogXCIrYmVhY29uLmlkKTtcbiAgICBuZXcgc3FsaXRlKFwiYmVhY29uLmRiXCIsIGZ1bmN0aW9uKGVyciwgZGIpIHtcbiAgICAgICAgZGIuZXhlY1NRTChcIklOU0VSVCBJTlRPIEJlYWNvbiAoaWQsIGlkZW50aWZpY2F0b3IsIG1ham9yLCBtaW5vciwgcm9sZSwgbmFtZSwgYWN0aXZlLCBrZXl3b3JkcywgbG9jYXRpb25faWQgKSBWQUxVRVMgKD8sPyw/LD8sPyw/LD8sPyw/KVwiLCBbYmVhY29uLmlkLGJlYWNvbi5pZGVudGlmaWNhdG9yLCBiZWFjb24ubWFqb3IsIGJlYWNvbi5taW5vciwgYmVhY29uLnJvbGUsIGJlYWNvbi5uYW1lLCBiZWFjb24uYWN0aXZlLCBiZWFjb24ua2V5d29yZHMsIGJlYWNvbi5sb2NhdGlvbl9pZF0sIGZ1bmN0aW9uKGVyciwgaWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhlIG5ldyByZWNvcmQgd2l0aCBpZCBcIiArIGlkK1wiIGFuZCBuYW1lIFwiK2JlYWNvbi5uYW1lKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICBcbiAgLy8gdXBkYXRlIGFuIGV4aXN0aW5nIHJlY29yZFxuICB1cGRhdGVCZWFjb24oaWQsIGlkZW50aWZpY2F0b3IsIG1ham9yLCBtaW5vciwgcm9sZSwgbmFtZSwgYWN0aXZlLCBrZXl3b3JkcywgbG9jYXRpb25faWQpIHtcbiAgICBuZXcgc3FsaXRlKFwiYmVhY29uLmRiXCIsIGZ1bmN0aW9uKGVyciwgZGIpIHtcbiAgICAgICAgZGIuZXhlY1NRTChcIlVQREFURSBCZWFjb24gU0VUIGlkZW50aWZpY2F0b3IgPSA/LCBtYWpvciA9ID8sIG1pbm9yID0gPywgcm9sZSA9ID8sIG5hbWUgPSA/LCBhY3RpdmUgPSA/LCBrZXl3b3JkcyA9ID8sIGxvY2F0aW9uX2lkID0gPyBXSEVSRSBpZCA9ID9cIiwgW21ham9yLCBtaW5vciwgcm9sZSwgaWRdLCBmdW5jdGlvbihlcnIsIGlkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRoZSBleGlzdGluZyByZWNvcmQgaWQgaXM6IFwiICsgaWQpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIFxuICAvLyBkZWxldGUgYSByZWNvcmRcbiAgZGVsZXRlQmVhY29uKGlkKSB7XG4gICAgbmV3IHNxbGl0ZShcImJlYWNvbi5kYlwiLCBmdW5jdGlvbihlcnIsIGRiKSB7XG4gICAgICAgIGRiLmV4ZWNTUUwoXCJERUxFVEUgRlJPTSBCZWFjb24gV0hFUkUgaWQgPSA/XCIsIFtpZF0sIGZ1bmN0aW9uKGVyciwgaWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhlIGRlbGV0ZWQgcmVjb3JkIGlkIGlzOiBcIiArIGlkKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICBcbiAgLy8gc2VsZWN0IGEgc2luZ2xlIHJlY29yZFxuICBzZWxlY3RCZWFjb24oaWQpIHtcbiAgICBsZXQgcmVjb3JkOiBhbnk7XG4gICAgbmV3IHNxbGl0ZShcImJlYWNvbi5kYlwiLCBmdW5jdGlvbihlcnIsIGRiKSB7XG4gICAgICAgIGRiLmdldChcIlNFTEVDVCAqIEZST00gQmVhY29uIFdIRVJFIGlkID0gP1wiLCBbaWRdLCBmdW5jdGlvbihlcnIsIHJvdykge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJSb3cgb2YgZGF0YSB3YXM6IFwiICsgcm93KTsgIC8vIFByaW50cyBbW1wiRmllbGQxXCIsIFwiRmllbGQyXCIsLi4uXV0gXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIjE6IFwiK3Jvd1sxXSk7XG4gICAgICAgICAgICByZWNvcmQgPSByb3c7XG4gICAgICAgICAgICAvLyByZXR1cm4gcm93O1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVjb3JkO1xuICB9XG5cbiAgLy8gc2VsZWN0IGEgc2luZ2xlIHN0b3JlIHJlY29yZCBieSBsb2NhdGlvblxuICBzZWxlY3RCZWFjb25CeUxvY2F0aW9uKGxvY2F0aW9uX2lkKSB7XG4gICAgbGV0IHJlY29yZDogYW55O1xuICAgIG5ldyBzcWxpdGUoXCJiZWFjb24uZGJcIiwgZnVuY3Rpb24oZXJyLCBkYikge1xuICAgICAgICBkYi5nZXQoXCJTRUxFQ1QgKiBGUk9NIEJlYWNvbiBXSEVSRSByb2xlID0gJ3N0b3JlJyBhbmQgbG9jYXRpb25faWQgPSA/XCIsIFtsb2NhdGlvbl9pZF0sIGZ1bmN0aW9uKGVyciwgcm93KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJvdyBvZiBkYXRhICBieSBsb2NhdGlvbiB3YXM6IFwiICsgcm93KTsgIC8vIFByaW50cyBbW1wiRmllbGQxXCIsIFwiRmllbGQyXCIsLi4uXV0gXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIjE6IFwiK3Jvd1sxXSk7XG4gICAgICAgICAgICByZWNvcmQgPSByb3c7XG4gICAgICAgICAgICAvLyByZXR1cm4gcm93O1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVjb3JkO1xuICB9XG4gIFxuICAvLyBzZWxlY3QgYWxsIHJlY29yZHNcbiAgc2VsZWN0QmVhY29ucyhyb2xlID0gXCJhbGxcIiwgbG9jYXRpb25faWQgPSBcIjBcIik6IEFycmF5PEJlYWNvbj4ge1xuICAgIFxuICAgIGNvbnNvbGUubG9nKFwib3V0IHBhcmFtIGlkOiBcIitsb2NhdGlvbl9pZCk7XG4gICAgLy8gY29uc29sZS5sb2coXCJTZWxlY3RpbmcgYWxsIGJlYWNvbnMuXCIpO1xuICAgIGxldCBiZWFjb25zID0gbmV3IEFycmF5PEJlYWNvbj4oKTtcbiAgICBuZXcgc3FsaXRlKFwiYmVhY29uLmRiXCIsIGZ1bmN0aW9uKGVyciwgZGIpIHtcbiAgICAgICAgZGIuYWxsKFwiU0VMRUNUICogRlJPTSBCZWFjb24gT1JERVIgQlkgaWRcIiwgW10sIGZ1bmN0aW9uKGVyciwgcnMpIHtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlJlc3VsdCBzZXQgaXM6IFwiICsgcnMpOyAvLyBQcmludHMgW1tcIlJvd18xIEZpZWxkXzFcIiBcIlJvd18xIEZpZWxkXzJcIiwuLi5dLCBbXCJSb3cgMlwiLi4uXSwgLi4uXVxuICAgICAgICAgIHJzLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIk51bWJlciBvZiBlbGVtZW50czogXCIrZWxlbWVudC5sZW5ndGgpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFbGVtZW50czogXCIrZWxlbWVudCk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkUwOiBcIitlbGVtZW50WzBdKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRTE6IFwiK2VsZW1lbnRbMV0pO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFMjogXCIrZWxlbWVudFsyXSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkUzOiBcIitlbGVtZW50WzNdKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRTQ6IFwiK2VsZW1lbnRbNF0pO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFNTogXCIrZWxlbWVudFs1XSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkU2OiBcIitlbGVtZW50WzZdKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRTc6IFwiK2VsZW1lbnRbN10pO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFODogXCIrZWxlbWVudFs4XSk7XG4gICAgICAgICAgICBsZXQgYmVhY29uT2JqID0gbmV3IEJlYWNvbihlbGVtZW50WzNdLGVsZW1lbnRbNF0pO1xuICAgICAgICAgICAgYmVhY29uT2JqLmlkID0gZWxlbWVudFswXTtcbiAgICAgICAgICAgIGJlYWNvbk9iai5pZGVudGlmaWNhdG9yID0gZWxlbWVudFsxXTtcbiAgICAgICAgICAgIGJlYWNvbk9iai5tYWpvciA9IGVsZW1lbnRbM107XG4gICAgICAgICAgICBiZWFjb25PYmoubWlub3IgPSBlbGVtZW50WzRdO1xuICAgICAgICAgICAgYmVhY29uT2JqLnJvbGUgPSBlbGVtZW50WzVdO1xuICAgICAgICAgICAgYmVhY29uT2JqLm5hbWUgPSBlbGVtZW50WzZdO1xuICAgICAgICAgICAgYmVhY29uT2JqLmFjdGl2ZSA9IGVsZW1lbnRbN107XG4gICAgICAgICAgICBiZWFjb25PYmoua2V5d29yZHMgPSBlbGVtZW50WzhdO1xuICAgICAgICAgICAgYmVhY29uT2JqLmxvY2F0aW9uX2lkID0gZWxlbWVudFs5XTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQmVhY29uIGZldGNoZWQgZm9ybSBMb2NhbCBEQjogXCIrYmVhY29uT2JqKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQmVhY29uIGtleXdvcmRzOiBcIitiZWFjb25PYmoua2V5d29yZHMudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInBhcmFtIHJvbGU6IFwiK3JvbGUpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJvYmogcm9sZTogXCIrYmVhY29uT2JqLnJvbGUpO1xuICAgICAgICAgICAgaWYocm9sZSA9PSBiZWFjb25PYmoucm9sZSl7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJSb2xlOiBcIityb2xlKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZihsb2NhdGlvbl9pZCE9XCIwXCIpe1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImluIHBhcmFtIGlkOiBcIitsb2NhdGlvbl9pZCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwib2JqIGlkOiBcIitiZWFjb25PYmoubG9jYXRpb25faWQpO1xuICAgICAgICAgICAgICAgICAgICBpZihsb2NhdGlvbl9pZCA9PSBiZWFjb25PYmoubG9jYXRpb25faWQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgYmVhY29ucy5wdXNoKGJlYWNvbk9iaik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlB1c2hpbmcgYmVhY29uOiBcIitiZWFjb25PYmoubmFtZSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBJZiByb2xlIGlzIGl0ZW0gYW5kIGxvY2F0aW9uX2lkIGlzIG5vdCB0aGUgc2FtZSBhcyBiZWFjb24gb2JqZWN0J3MgbG9jYXRpb24gdGhlbiBpZ25vcmUgYmVhY29uLlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICBiZWFjb25zLnB1c2goYmVhY29uT2JqKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9ZWxzZSBpZihyb2xlID09IFwiYWxsXCIpe1xuICAgICAgICAgICAgICAgIGJlYWNvbnMucHVzaChiZWFjb25PYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgfSk7ICAgXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBiZWFjb25zO1xuICB9ICAgXG5cbn0iXX0=