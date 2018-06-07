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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVhY29uLmRiLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiZWFjb24uZGIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF5RDtBQUN6RCxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUUscUJBQXFCLENBQUUsQ0FBQztBQUNoRCxtQ0FBa0M7QUFHbEM7SUFFRTtRQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0NBQWtDLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRUQsaUJBQWlCO0lBQ2pCLDJDQUFXLEdBQVg7UUFDRSxJQUFJLE1BQU0sQ0FBQyxXQUFXLEVBQUUsVUFBUyxHQUFHLEVBQUUsRUFBRTtZQUNwQyxFQUFFLENBQUMsT0FBTyxDQUFDLGlMQUFpTCxFQUFFLEVBQUUsRUFBRSxVQUFTLEdBQUc7Z0JBQzFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztnQkFDcEMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNoQixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELGdCQUFnQjtJQUNoQix5Q0FBUyxHQUFUO1FBQ0UsSUFBSSxNQUFNLENBQUMsV0FBVyxFQUFFLFVBQVMsR0FBRyxFQUFFLEVBQUU7WUFDcEMsRUFBRSxDQUFDLE9BQU8sQ0FBQyw2QkFBNkIsRUFBRSxFQUFFLEVBQUUsVUFBUyxHQUFHO2dCQUN0RCxPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUM7Z0JBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDaEIsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFQSw0Q0FBWSxHQUFaLFVBQWEsTUFBYztRQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixHQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNoRCxJQUFJLE1BQU0sQ0FBQyxXQUFXLEVBQUUsVUFBUyxH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QUM7SUFDakIsQ0FBQztJQS9JVSxxQkFBcUI7UUFEakMsaUJBQVUsRUFBRTs7T0FDQSxxQkFBcUIsQ0FpSmpDO0lBQUQsNEJBQUM7Q0FBQSxBQWpKRCxJQWlKQztBQWpKWSxzREFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBFdmVudEVtaXR0ZXIgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuY29uc3Qgc3FsaXRlID0gcmVxdWlyZSggXCJuYXRpdmVzY3JpcHQtc3FsaXRlXCIgKTtcbmltcG9ydCB7IEJlYWNvbiB9IGZyb20gXCIuL2JlYWNvblwiO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQmVhY29uRGF0YWJhc2VTZXJ2aWNlIHtcblxuICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkluIEJlYWNvbiBEQiBTZXJ2aWNlIENvbnN0cnVjdG9yXCIpO1xuICB9XG5cbiAgLy8gY3JlYXRlIGEgdGFibGVcbiAgY3JlYXRlVGFibGUoKSB7XG4gICAgbmV3IHNxbGl0ZShcImJlYWNvbi5kYlwiLCBmdW5jdGlvbihlcnIsIGRiKSB7XG4gICAgICAgIGRiLmV4ZWNTUUwoXCJDUkVBVEUgVEFCTEUgSUYgTk9UIEVYSVNUUyBCZWFjb24gKGlkIElOVEVHRVIgUFJJTUFSWSBLRVksIGlkZW50aWZpY2F0b3IsIFRFWFQsIG1ham9yIFRFWFQsIG1pbm9yIFRFWFQsIHJvbGUgVEVYVCwgbmFtZSBURVhULCBhY3RpdmUgTlVNRVJJQywga2V5d29yZHMgSlNPTiwgbG9jYXRpb25faWQgVEVYVCApXCIsIFtdLCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVEFCTEUgQmVhY29uIENSRUFURURcIik7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgXG4gIC8vIGRyb3BzIGEgdGFibGVcbiAgZHJvcFRhYmxlKCkge1xuICAgIG5ldyBzcWxpdGUoXCJiZWFjb24uZGJcIiwgZnVuY3Rpb24oZXJyLCBkYikge1xuICAgICAgICBkYi5leGVjU1FMKFwiRFJPUCBUQUJMRSBJRiBFWElTVFMgQmVhY29uXCIsIFtdLCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVEFCTEUgQmVhY29uIERST1BQRURcIik7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgXG4gICBpbnNlcnRCZWFjb24oYmVhY29uOiBCZWFjb24pIHtcbiAgICBjb25zb2xlLmxvZyhcIkF0dGVtcHRpbmcgdG8gaW5zZXJ0OiBcIitiZWFjb24uaWQpO1xuICAgIG5ldyBzcWxpdGUoXCJiZWFjb24uZGJcIiwgZnVuY3Rpb24oZXJyLCBkYikge1xuICAgICAgICBkYi5leGVjU1FMKFwiSU5TRVJUIElOVE8gQmVhY29uIChpZCwgaWRlbnRpZmljYXRvciwgbWFqb3IsIG1pbm9yLCByb2xlLCBuYW1lLCBhY3RpdmUsIGtleXdvcmRzLCBsb2NhdGlvbl9pZCApIFZBTFVFUyAoPyw/LD8sPyw/LD8sPyw/LD8pXCIsIFtiZWFjb24uaWQsYmVhY29uLmlkZW50aWZpY2F0b3IsIGJlYWNvbi5tYWpvciwgYmVhY29uLm1pbm9yLCBiZWFjb24ucm9sZSwgYmVhY29uLm5hbWUsIGJlYWNvbi5hY3RpdmUsIGJlYWNvbi5rZXl3b3JkcywgYmVhY29uLmxvY2F0aW9uX2lkXSwgZnVuY3Rpb24oZXJyLCBpZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJUaGUgbmV3IHJlY29yZCB3aXRoIGlkIFwiICsgaWQrXCIgYW5kIG5hbWUgXCIrYmVhY29uLm5hbWUpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIFxuICAvLyB1cGRhdGUgYW4gZXhpc3RpbmcgcmVjb3JkXG4gIHVwZGF0ZUJlYWNvbihpZCwgaWRlbnRpZmljYXRvciwgbWFqb3IsIG1pbm9yLCByb2xlLCBuYW1lLCBhY3RpdmUsIGtleXdvcmRzLCBsb2NhdGlvbl9pZCkge1xuICAgIG5ldyBzcWxpdGUoXCJiZWFjb24uZGJcIiwgZnVuY3Rpb24oZXJyLCBkYikge1xuICAgICAgICBkYi5leGVjU1FMKFwiVVBEQVRFIEJlYWNvbiBTRVQgaWRlbnRpZmljYXRvciA9ID8sIG1ham9yID0gPywgbWlub3IgPSA/LCByb2xlID0gPywgbmFtZSA9ID8sIGFjdGl2ZSA9ID8sIGtleXdvcmRzID0gPywgbG9jYXRpb25faWQgPSA/IFdIRVJFIGlkID0gP1wiLCBbbWFqb3IsIG1pbm9yLCByb2xlLCBpZF0sIGZ1bmN0aW9uKGVyciwgaWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhlIGV4aXN0aW5nIHJlY29yZCBpZCBpczogXCIgKyBpZCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgXG4gIC8vIGRlbGV0ZSBhIHJlY29yZFxuICBkZWxldGVCZWFjb24oaWQpIHtcbiAgICBuZXcgc3FsaXRlKFwiYmVhY29uLmRiXCIsIGZ1bmN0aW9uKGVyciwgZGIpIHtcbiAgICAgICAgZGIuZXhlY1NRTChcIkRFTEVURSBGUk9NIEJlYWNvbiBXSEVSRSBpZCA9ID9cIiwgW2lkXSwgZnVuY3Rpb24oZXJyLCBpZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJUaGUgZGVsZXRlZCByZWNvcmQgaWQgaXM6IFwiICsgaWQpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIFxuICAvLyBzZWxlY3QgYSBzaW5nbGUgcmVjb3JkXG4gIHNlbGVjdEJlYWNvbihpZCkge1xuICAgIGxldCByZWNvcmQ6IGFueTtcbiAgICBuZXcgc3FsaXRlKFwiYmVhY29uLmRiXCIsIGZ1bmN0aW9uKGVyciwgZGIpIHtcbiAgICAgICAgZGIuZ2V0KFwiU0VMRUNUICogRlJPTSBCZWFjb24gV0hFUkUgaWQgPSA/XCIsIFtpZF0sIGZ1bmN0aW9uKGVyciwgcm93KSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlJvdyBvZiBkYXRhIHdhczogXCIgKyByb3cpOyAgLy8gUHJpbnRzIFtbXCJGaWVsZDFcIiwgXCJGaWVsZDJcIiwuLi5dXSBcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiMTogXCIrcm93WzFdKTtcbiAgICAgICAgICAgIHJlY29yZCA9IHJvdztcbiAgICAgICAgICAgIC8vIHJldHVybiByb3c7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiByZWNvcmQ7XG4gIH1cblxuICAvLyBzZWxlY3QgYSBzaW5nbGUgc3RvcmUgcmVjb3JkIGJ5IGxvY2F0aW9uXG4gIHNlbGVjdEJlYWNvbkJ5TG9jYXRpb24obG9jYXRpb25faWQpIHtcbiAgICBsZXQgcmVjb3JkOiBhbnk7XG4gICAgbmV3IHNxbGl0ZShcImJlYWNvbi5kYlwiLCBmdW5jdGlvbihlcnIsIGRiKSB7XG4gICAgICAgIGRiLmdldChcIlNFTEVDVCAqIEZST00gQmVhY29uIFdIRVJFIHJvbGUgPSAnc3RvcmUnIGFuZCBsb2NhdGlvbl9pZCA9ID9cIiwgW2xvY2F0aW9uX2lkXSwgZnVuY3Rpb24oZXJyLCByb3cpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUm93IG9mIGRhdGEgIGJ5IGxvY2F0aW9uIHdhczogXCIgKyByb3cpOyAgLy8gUHJpbnRzIFtbXCJGaWVsZDFcIiwgXCJGaWVsZDJcIiwuLi5dXSBcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiMTogXCIrcm93WzFdKTtcbiAgICAgICAgICAgIHJlY29yZCA9IHJvdztcbiAgICAgICAgICAgIC8vIHJldHVybiByb3c7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiByZWNvcmQ7XG4gIH1cbiAgXG4gIC8vIHNlbGVjdCBhbGwgcmVjb3Jkc1xuICBzZWxlY3RCZWFjb25zKHJvbGUgPSBcImFsbFwiLCBsb2NhdGlvbl9pZCA9IFwiMFwiKTogQXJyYXk8QmVhY29uPiB7XG4gICAgXG4gICAgLy8gY29uc29sZS5sb2coXCJvdXQgcGFyYW0gaWQ6IFwiK2xvY2F0aW9uX2lkKTtcbiAgICAvLyBjb25zb2xlLmxvZyhcIlNlbGVjdGluZyBhbGwgYmVhY29ucy5cIik7XG4gICAgbGV0IGJlYWNvbnMgPSBuZXcgQXJyYXk8QmVhY29uPigpO1xuICAgIG5ldyBzcWxpdGUoXCJiZWFjb24uZGJcIiwgZnVuY3Rpb24oZXJyLCBkYikge1xuICAgICAgICBkYi5hbGwoXCJTRUxFQ1QgKiBGUk9NIEJlYWNvbiBPUkRFUiBCWSBpZFwiLCBbXSwgZnVuY3Rpb24oZXJyLCBycykge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUmVzdWx0IHNldCBpczogXCIgKyBycyk7IC8vIFByaW50cyBbW1wiUm93XzEgRmllbGRfMVwiIFwiUm93XzEgRmllbGRfMlwiLC4uLl0sIFtcIlJvdyAyXCIuLi5dLCAuLi5dXG4gICAgICAgICAgcnMuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiTnVtYmVyIG9mIGVsZW1lbnRzOiBcIitlbGVtZW50Lmxlbmd0aCk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkVsZW1lbnRzOiBcIitlbGVtZW50KTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRTA6IFwiK2VsZW1lbnRbMF0pO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFMTogXCIrZWxlbWVudFsxXSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkUyOiBcIitlbGVtZW50WzJdKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRTM6IFwiK2VsZW1lbnRbM10pO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFNDogXCIrZWxlbWVudFs0XSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkU1OiBcIitlbGVtZW50WzVdKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRTY6IFwiK2VsZW1lbnRbNl0pO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFNzogXCIrZWxlbWVudFs3XSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkU4OiBcIitlbGVtZW50WzhdKTtcbiAgICAgICAgICAgIGxldCBiZWFjb25PYmogPSBuZXcgQmVhY29uKGVsZW1lbnRbM10sZWxlbWVudFs0XSk7XG4gICAgICAgICAgICBiZWFjb25PYmouaWQgPSBlbGVtZW50WzBdO1xuICAgICAgICAgICAgYmVhY29uT2JqLmlkZW50aWZpY2F0b3IgPSBlbGVtZW50WzFdO1xuICAgICAgICAgICAgYmVhY29uT2JqLm1ham9yID0gZWxlbWVudFszXTtcbiAgICAgICAgICAgIGJlYWNvbk9iai5taW5vciA9IGVsZW1lbnRbNF07XG4gICAgICAgICAgICBiZWFjb25PYmoucm9sZSA9IGVsZW1lbnRbNV07XG4gICAgICAgICAgICBiZWFjb25PYmoubmFtZSA9IGVsZW1lbnRbNl07XG4gICAgICAgICAgICBiZWFjb25PYmouYWN0aXZlID0gZWxlbWVudFs3XTtcbiAgICAgICAgICAgIGJlYWNvbk9iai5rZXl3b3JkcyA9IGVsZW1lbnRbOF07XG4gICAgICAgICAgICBiZWFjb25PYmoubG9jYXRpb25faWQgPSBlbGVtZW50WzldO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJCZWFjb24gZmV0Y2hlZCBmb3JtIExvY2FsIERCOiBcIitiZWFjb25PYmopO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJCZWFjb24ga2V5d29yZHM6IFwiK2JlYWNvbk9iai5rZXl3b3Jkcy50b1N0cmluZygpKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwicGFyYW0gcm9sZTogXCIrcm9sZSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIm9iaiByb2xlOiBcIitiZWFjb25PYmoucm9sZSk7XG4gICAgICAgICAgICBpZihyb2xlID09IGJlYWNvbk9iai5yb2xlKXtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlJvbGU6IFwiK3JvbGUpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmKGxvY2F0aW9uX2lkIT1cIjBcIil7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiaW4gcGFyYW0gaWQ6IFwiK2xvY2F0aW9uX2lkKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJvYmogaWQ6IFwiK2JlYWNvbk9iai5sb2NhdGlvbl9pZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmKGxvY2F0aW9uX2lkID09IGJlYWNvbk9iai5sb2NhdGlvbl9pZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBiZWFjb25zLnB1c2goYmVhY29uT2JqKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUHVzaGluZyBiZWFjb246IFwiK2JlYWNvbk9iai5uYW1lKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHJvbGUgaXMgaXRlbSBhbmQgbG9jYXRpb25faWQgaXMgbm90IHRoZSBzYW1lIGFzIGJlYWNvbiBvYmplY3QncyBsb2NhdGlvbiB0aGVuIGlnbm9yZSBiZWFjb24uXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgIGJlYWNvbnMucHVzaChiZWFjb25PYmopO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1lbHNlIGlmKHJvbGUgPT0gXCJhbGxcIil7XG4gICAgICAgICAgICAgICAgYmVhY29ucy5wdXNoKGJlYWNvbk9iaik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICB9KTsgICBcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGJlYWNvbnM7XG4gIH0gICBcblxufSJdfQ==