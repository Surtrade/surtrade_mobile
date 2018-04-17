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
    BeaconDatabaseService.prototype.selectBeacons = function (role) {
        if (role === void 0) { role = "all"; }
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
                    if (role == beaconObj.role) {
                        beacons.push(beaconObj);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVhY29uLmRiLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiZWFjb24uZGIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF5RDtBQUN6RCxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUUscUJBQXFCLENBQUUsQ0FBQztBQUNoRCxtQ0FBa0M7QUFHbEM7SUFFRTtRQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0NBQWtDLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRUQsaUJBQWlCO0lBQ2pCLDJDQUFXLEdBQVg7UUFDRSxJQUFJLE1BQU0sQ0FBQyxXQUFXLEVBQUUsVUFBUyxHQUFHLEVBQUUsRUFBRTtZQUNwQyxFQUFFLENBQUMsT0FBTyxDQUFDLGlMQUFpTCxFQUFFLEVBQUUsRUFBRSxVQUFTLEdBQUc7Z0JBQzFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztnQkFDcEMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNoQixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELGdCQUFnQjtJQUNoQix5Q0FBUyxHQUFUO1FBQ0UsSUFBSSxNQUFNLENBQUMsV0FBVyxFQUFFLFVBQVMsR0FBRyxFQUFFLEVBQUU7WUFDcEMsRUFBRSxDQUFDLE9BQU8sQ0FBQyw2QkFBNkIsRUFBRSxFQUFFLEVBQUUsVUFBUyxHQUFHO2dCQUN0RCxPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUM7Z0JBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDaEIsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFQSw0Q0FBWSxHQUFaLFVBQWEsTUFBYztRQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixHQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNoRCxJQUFJLE1BQU0sQ0FBQyxXQUFXLEVBQUUsVUFBUyxH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LFNBQVMsQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM1QixTQUFTLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDOUIsU0FBUyxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2hDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNuQywyREFBMkQ7b0JBQzNELGtFQUFrRTtvQkFDbEUsRUFBRSxDQUFBLENBQUMsSUFBSSxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQSxDQUFDO3dCQUN2QixPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUM1QixDQUFDO29CQUFBLElBQUksQ0FBQyxFQUFFLENBQUEsQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLENBQUEsQ0FBQzt3QkFDcEIsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDNUIsQ0FBQztnQkFFSCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUE3SFUscUJBQXFCO1FBRGpDLGlCQUFVLEVBQUU7O09BQ0EscUJBQXFCLENBK0hqQztJQUFELDRCQUFDO0NBQUEsQUEvSEQsSUErSEM7QUEvSFksc0RBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgRXZlbnRFbWl0dGVyIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmNvbnN0IHNxbGl0ZSA9IHJlcXVpcmUoIFwibmF0aXZlc2NyaXB0LXNxbGl0ZVwiICk7XG5pbXBvcnQgeyBCZWFjb24gfSBmcm9tIFwiLi9iZWFjb25cIjtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEJlYWNvbkRhdGFiYXNlU2VydmljZSB7XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuICAgICAgY29uc29sZS5sb2coXCJJbiBCZWFjb24gREIgU2VydmljZSBDb25zdHJ1Y3RvclwiKTtcbiAgfVxuXG4gIC8vIGNyZWF0ZSBhIHRhYmxlXG4gIGNyZWF0ZVRhYmxlKCkge1xuICAgIG5ldyBzcWxpdGUoXCJiZWFjb24uZGJcIiwgZnVuY3Rpb24oZXJyLCBkYikge1xuICAgICAgICBkYi5leGVjU1FMKFwiQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgQmVhY29uIChpZCBJTlRFR0VSIFBSSU1BUlkgS0VZLCBpZGVudGlmaWNhdG9yLCBURVhULCBtYWpvciBURVhULCBtaW5vciBURVhULCByb2xlIFRFWFQsIG5hbWUgVEVYVCwgYWN0aXZlIE5VTUVSSUMsIGtleXdvcmRzIEpTT04sIGxvY2F0aW9uX2lkIFRFWFQgKVwiLCBbXSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRBQkxFIEJlYWNvbiBDUkVBVEVEXCIpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIFxuICAvLyBkcm9wcyBhIHRhYmxlXG4gIGRyb3BUYWJsZSgpIHtcbiAgICBuZXcgc3FsaXRlKFwiYmVhY29uLmRiXCIsIGZ1bmN0aW9uKGVyciwgZGIpIHtcbiAgICAgICAgZGIuZXhlY1NRTChcIkRST1AgVEFCTEUgSUYgRVhJU1RTIEJlYWNvblwiLCBbXSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRBQkxFIEJlYWNvbiBEUk9QUEVEXCIpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIFxuICAgaW5zZXJ0QmVhY29uKGJlYWNvbjogQmVhY29uKSB7XG4gICAgY29uc29sZS5sb2coXCJBdHRlbXB0aW5nIHRvIGluc2VydDogXCIrYmVhY29uLmlkKTtcbiAgICBuZXcgc3FsaXRlKFwiYmVhY29uLmRiXCIsIGZ1bmN0aW9uKGVyciwgZGIpIHtcbiAgICAgICAgZGIuZXhlY1NRTChcIklOU0VSVCBJTlRPIEJlYWNvbiAoaWQsIGlkZW50aWZpY2F0b3IsIG1ham9yLCBtaW5vciwgcm9sZSwgbmFtZSwgYWN0aXZlLCBrZXl3b3JkcywgbG9jYXRpb25faWQgKSBWQUxVRVMgKD8sPyw/LD8sPyw/LD8sPyw/KVwiLCBbYmVhY29uLmlkLGJlYWNvbi5pZGVudGlmaWNhdG9yLCBiZWFjb24ubWFqb3IsIGJlYWNvbi5taW5vciwgYmVhY29uLnJvbGUsIGJlYWNvbi5uYW1lLCBiZWFjb24uYWN0aXZlLCBiZWFjb24ua2V5d29yZHMsIGJlYWNvbi5sb2NhdGlvbl9pZF0sIGZ1bmN0aW9uKGVyciwgaWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhlIG5ldyByZWNvcmQgd2l0aCBpZCBcIiArIGlkK1wiIGFuZCBuYW1lIFwiK2JlYWNvbi5uYW1lKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICBcbiAgLy8gdXBkYXRlIGFuIGV4aXN0aW5nIHJlY29yZFxuICB1cGRhdGVCZWFjb24oaWQsIGlkZW50aWZpY2F0b3IsIG1ham9yLCBtaW5vciwgcm9sZSwgbmFtZSwgYWN0aXZlLCBrZXl3b3JkcywgbG9jYXRpb25faWQpIHtcbiAgICBuZXcgc3FsaXRlKFwiYmVhY29uLmRiXCIsIGZ1bmN0aW9uKGVyciwgZGIpIHtcbiAgICAgICAgZGIuZXhlY1NRTChcIlVQREFURSBCZWFjb24gU0VUIGlkZW50aWZpY2F0b3IgPSA/LCBtYWpvciA9ID8sIG1pbm9yID0gPywgcm9sZSA9ID8sIG5hbWUgPSA/LCBhY3RpdmUgPSA/LCBrZXl3b3JkcyA9ID8sIGxvY2F0aW9uX2lkID0gPyBXSEVSRSBpZCA9ID9cIiwgW21ham9yLCBtaW5vciwgcm9sZSwgaWRdLCBmdW5jdGlvbihlcnIsIGlkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRoZSBleGlzdGluZyByZWNvcmQgaWQgaXM6IFwiICsgaWQpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIFxuICAvLyBkZWxldGUgYSByZWNvcmRcbiAgZGVsZXRlQmVhY29uKGlkKSB7XG4gICAgbmV3IHNxbGl0ZShcImJlYWNvbi5kYlwiLCBmdW5jdGlvbihlcnIsIGRiKSB7XG4gICAgICAgIGRiLmV4ZWNTUUwoXCJERUxFVEUgRlJPTSBCZWFjb24gV0hFUkUgaWQgPSA/XCIsIFtpZF0sIGZ1bmN0aW9uKGVyciwgaWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhlIGRlbGV0ZWQgcmVjb3JkIGlkIGlzOiBcIiArIGlkKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICBcbiAgLy8gc2VsZWN0IGEgc2luZ2xlIHJlY29yZFxuICBzZWxlY3RCZWFjb24oaWQpIHtcbiAgICBsZXQgcmVjb3JkOiBhbnk7XG4gICAgbmV3IHNxbGl0ZShcImJlYWNvbi5kYlwiLCBmdW5jdGlvbihlcnIsIGRiKSB7XG4gICAgICAgIGRiLmdldChcIlNFTEVDVCAqIEZST00gQmVhY29uIFdIRVJFIGlkID0gP1wiLCBbaWRdLCBmdW5jdGlvbihlcnIsIHJvdykge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJSb3cgb2YgZGF0YSB3YXM6IFwiICsgcm93KTsgIC8vIFByaW50cyBbW1wiRmllbGQxXCIsIFwiRmllbGQyXCIsLi4uXV0gXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIjE6IFwiK3Jvd1sxXSk7XG4gICAgICAgICAgICByZWNvcmQgPSByb3c7XG4gICAgICAgICAgICAvLyByZXR1cm4gcm93O1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVjb3JkO1xuICB9XG5cbiAgLy8gc2VsZWN0IGEgc2luZ2xlIHN0b3JlIHJlY29yZCBieSBsb2NhdGlvblxuICBzZWxlY3RCZWFjb25CeUxvY2F0aW9uKGxvY2F0aW9uX2lkKSB7XG4gICAgbGV0IHJlY29yZDogYW55O1xuICAgIG5ldyBzcWxpdGUoXCJiZWFjb24uZGJcIiwgZnVuY3Rpb24oZXJyLCBkYikge1xuICAgICAgICBkYi5nZXQoXCJTRUxFQ1QgKiBGUk9NIEJlYWNvbiBXSEVSRSByb2xlID0gJ3N0b3JlJyBhbmQgbG9jYXRpb25faWQgPSA/XCIsIFtsb2NhdGlvbl9pZF0sIGZ1bmN0aW9uKGVyciwgcm93KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJvdyBvZiBkYXRhICBieSBsb2NhdGlvbiB3YXM6IFwiICsgcm93KTsgIC8vIFByaW50cyBbW1wiRmllbGQxXCIsIFwiRmllbGQyXCIsLi4uXV0gXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIjE6IFwiK3Jvd1sxXSk7XG4gICAgICAgICAgICByZWNvcmQgPSByb3c7XG4gICAgICAgICAgICAvLyByZXR1cm4gcm93O1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVjb3JkO1xuICB9XG4gIFxuICAvLyBzZWxlY3QgYWxsIHJlY29yZHNcbiAgc2VsZWN0QmVhY29ucyhyb2xlID0gXCJhbGxcIik6IEFycmF5PEJlYWNvbj4ge1xuICAgIC8vIGNvbnNvbGUubG9nKFwiU2VsZWN0aW5nIGFsbCBiZWFjb25zLlwiKTtcbiAgICBsZXQgYmVhY29ucyA9IG5ldyBBcnJheTxCZWFjb24+KCk7XG4gICAgbmV3IHNxbGl0ZShcImJlYWNvbi5kYlwiLCBmdW5jdGlvbihlcnIsIGRiKSB7XG4gICAgICAgIGRiLmFsbChcIlNFTEVDVCAqIEZST00gQmVhY29uIE9SREVSIEJZIGlkXCIsIFtdLCBmdW5jdGlvbihlcnIsIHJzKSB7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coXCJSZXN1bHQgc2V0IGlzOiBcIiArIHJzKTsgLy8gUHJpbnRzIFtbXCJSb3dfMSBGaWVsZF8xXCIgXCJSb3dfMSBGaWVsZF8yXCIsLi4uXSwgW1wiUm93IDJcIi4uLl0sIC4uLl1cbiAgICAgICAgICBycy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJOdW1iZXIgb2YgZWxlbWVudHM6IFwiK2VsZW1lbnQubGVuZ3RoKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRWxlbWVudHM6IFwiK2VsZW1lbnQpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFMDogXCIrZWxlbWVudFswXSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkUxOiBcIitlbGVtZW50WzFdKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRTI6IFwiK2VsZW1lbnRbMl0pO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFMzogXCIrZWxlbWVudFszXSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkU0OiBcIitlbGVtZW50WzRdKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRTU6IFwiK2VsZW1lbnRbNV0pO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFNjogXCIrZWxlbWVudFs2XSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkU3OiBcIitlbGVtZW50WzddKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRTg6IFwiK2VsZW1lbnRbOF0pO1xuICAgICAgICAgICAgbGV0IGJlYWNvbk9iaiA9IG5ldyBCZWFjb24oZWxlbWVudFszXSxlbGVtZW50WzRdKTtcbiAgICAgICAgICAgIGJlYWNvbk9iai5pZCA9IGVsZW1lbnRbMF07XG4gICAgICAgICAgICBiZWFjb25PYmouaWRlbnRpZmljYXRvciA9IGVsZW1lbnRbMV07XG4gICAgICAgICAgICBiZWFjb25PYmoubWFqb3IgPSBlbGVtZW50WzNdO1xuICAgICAgICAgICAgYmVhY29uT2JqLm1pbm9yID0gZWxlbWVudFs0XTtcbiAgICAgICAgICAgIGJlYWNvbk9iai5yb2xlID0gZWxlbWVudFs1XTtcbiAgICAgICAgICAgIGJlYWNvbk9iai5uYW1lID0gZWxlbWVudFs2XTtcbiAgICAgICAgICAgIGJlYWNvbk9iai5hY3RpdmUgPSBlbGVtZW50WzddO1xuICAgICAgICAgICAgYmVhY29uT2JqLmtleXdvcmRzID0gZWxlbWVudFs4XTtcbiAgICAgICAgICAgIGJlYWNvbk9iai5sb2NhdGlvbl9pZCA9IGVsZW1lbnRbOV07XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkJlYWNvbiBmZXRjaGVkIGZvcm0gTG9jYWwgREI6IFwiK2JlYWNvbk9iaik7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkJlYWNvbiBrZXl3b3JkczogXCIrYmVhY29uT2JqLmtleXdvcmRzLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgaWYocm9sZSA9PSBiZWFjb25PYmoucm9sZSl7XG4gICAgICAgICAgICAgICAgYmVhY29ucy5wdXNoKGJlYWNvbk9iaik7XG4gICAgICAgICAgICB9ZWxzZSBpZihyb2xlID09IFwiYWxsXCIpe1xuICAgICAgICAgICAgICAgIGJlYWNvbnMucHVzaChiZWFjb25PYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgfSk7ICAgXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBiZWFjb25zO1xuICB9ICAgXG5cbn0iXX0=