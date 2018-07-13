"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
// import { Sqlite } from "nativescript-sqlite";
var sqlite = require("nativescript-sqlite");
var location_1 = require("./location");
var LocationDatabaseService = /** @class */ (function () {
    function LocationDatabaseService() {
    }
    // create a table
    LocationDatabaseService.prototype.createTable = function () {
        new sqlite("location.db", function (err, db) {
            db.execSQL("CREATE TABLE IF NOT EXISTS Location (id INTEGER PRIMARY KEY, name TEXT, type TEXT, address TEXT, lat REAL, lng REAL, ne_lat REAL, ne_lng REAL, sw_lat REAL, sw_lng REAL)", [], function (err) {
                console.log("TABLE Location CREATED");
                return true;
            });
        });
    };
    // drops a table
    LocationDatabaseService.prototype.dropTable = function () {
        new sqlite("location.db", function (err, db) {
            db.execSQL("DROP TABLE IF EXISTS Location", [], function (err) {
                console.log("TABLE Location DROPPED");
                return true;
            });
        });
    };
    // insert a new record
    // insertLocation(id, lat, lng, name, address, type, ne_lat, ne_lng, sw_lat, sw_lng) {
    //   new sqlite("location.db", function(err, db) {
    //       db.execSQL("INSERT INTO Location (id, lat, lng, name, address, type, ne_lat, ne_lng, sw_lat, sw_lng ) VALUES (?,?,?,?,?,?,?,?,?,?)", [id, lat, lng, name, address, type, ne_lat, ne_lng, sw_lat, sw_lng], function(err, id) {
    //           console.log("The new record id is: " + id);
    //           return true;
    //       });
    //   });
    // }
    LocationDatabaseService.prototype.insertLocation = function (location) {
        console.log("Attempting to insert: " + location.name);
        new sqlite("location.db", function (err, db) {
            db.execSQL("INSERT INTO Location (id, lat, lng, name, address, type, ne_lat, ne_lng, sw_lat, sw_lng ) VALUES (?,?,?,?,?,?,?,?,?,?)", [location.id, location.lat, location.lng, location.name, location.address, location.type, location.ne_lat, location.ne_lng, location.sw_lat, location.sw_lng], function (err, id) {
                console.log("The new record id is: " + id);
                return true;
            });
        });
    };
    // update an existing record
    LocationDatabaseService.prototype.updateLocation = function (id, lat, lng, name, address, type, ne_lat, ne_lng, sw_lat, sw_lng) {
        new sqlite("location.db", function (err, db) {
            db.execSQL("UPDATE Location SET lat = ?, lng = ?, name = ?, address = ?, type = ?, ne_lat = ?, ne_lng = ?, sw_lat = ?, sw_ln = ? WHERE id = ?", [lat, lng, name, address, type, ne_lat, ne_lng, sw_lat, sw_lng, id], function (err, id) {
                console.log("The existing record id is: " + id);
                return true;
            });
        });
    };
    // delete a record
    LocationDatabaseService.prototype.deleteLocation = function (id) {
        new sqlite("location.db", function (err, db) {
            db.execSQL("DELETE FROM Location WHERE id = ?", [id], function (err, id) {
                console.log("The deleted record id is: " + id);
                return true;
            });
        });
    };
    // select a single record
    LocationDatabaseService.prototype.selectLocation = function (id) {
        var record;
        new sqlite("location.db", function (err, db) {
            db.get("SELECT * FROM Location WHERE id = ?", [id], function (err, row) {
                console.log("Row of data was: " + row); // Prints [["Field1", "Field2",...]] 
                console.log("1: " + row[1]);
                record = row;
                // return row;
            });
        });
        return record;
    };
    // select all records
    LocationDatabaseService.prototype.selectAllLocations = function () {
        // console.log("Selecting all locations.");
        var locations = new Array();
        new sqlite("location.db", function (err, db) {
            db.all("SELECT * FROM Location ORDER BY id", [], function (err, rs) {
                // console.log("Result set is: " + rs); // Prints [["Row_1 Field_1" "Row_1 Field_2",...], ["Row 2"...], ...]
                rs.forEach(function (element) {
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
                    var location = new location_1.Location(element[4], element[5]);
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
    };
    LocationDatabaseService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], LocationDatabaseService);
    return LocationDatabaseService;
}());
exports.LocationDatabaseService = LocationDatabaseService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYXRpb24uZGIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxvY2F0aW9uLmRiLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBeUQ7QUFDekQsZ0RBQWdEO0FBQ2hELElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBRSxxQkFBcUIsQ0FBRSxDQUFDO0FBQ2hELHVDQUFzQztBQUd0QztJQUVFO0lBQ0EsQ0FBQztJQUVELGlCQUFpQjtJQUNqQiw2Q0FBVyxHQUFYO1FBQ0UsSUFBSSxNQUFNLENBQUMsYUFBYSxFQUFFLFVBQVMsR0FBRyxFQUFFLEVBQUU7WUFDdEMsRUFBRSxDQUFDLE9BQU8sQ0FBQywwS0FBMEssRUFBRSxFQUFFLEVBQUUsVUFBUyxHQUFHO2dCQUNuTSxPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7Z0JBQ3RDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDaEIsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIsMkNBQVMsR0FBVDtRQUNFLElBQUksTUFBTSxDQUFDLGFBQWEsRUFBRSxVQUFTLEdBQUcsRUFBRSxFQUFFO1lBQ3RDLEVBQUUsQ0FBQyxPQUFPLENBQUMsK0JBQStCLEVBQUUsRUFBRSxFQUFFLFVBQVMsR0FBRztnQkFDeEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO2dCQUN0QyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2hCLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsc0JBQXNCO0lBQ3RCLHNGQUFzRjtJQUN0RixrREFBa0Q7SUFDbEQsc09BQXNPO0lBQ3RPLHdEQUF3RDtJQUN4RCx5QkFBeUI7SUFDekIsWUFBWTtJQUNaLFFBQVE7SUFDUixJQUFJO0lBQ0gsZ0RBQWMsR0FBZCxVQUFlLFFBQWtCO1FBQ2hDLE9BQU8sQ0FBQyxH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LENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDN0IsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDM0IsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBdkhVLHVCQUF1QjtRQURuQyxpQkFBVSxFQUFFOztPQUNBLHVCQUF1QixDQStIbkM7SUFBRCw4QkFBQztDQUFBLEFBL0hELElBK0hDO0FBL0hZLDBEQUF1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIEV2ZW50RW1pdHRlciB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG4vLyBpbXBvcnQgeyBTcWxpdGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXNxbGl0ZVwiO1xuY29uc3Qgc3FsaXRlID0gcmVxdWlyZSggXCJuYXRpdmVzY3JpcHQtc3FsaXRlXCIgKTtcbmltcG9ydCB7IExvY2F0aW9uIH0gZnJvbSBcIi4vbG9jYXRpb25cIjtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIExvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlIHtcblxuICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XG4gIH1cblxuICAvLyBjcmVhdGUgYSB0YWJsZVxuICBjcmVhdGVUYWJsZSgpIHtcbiAgICBuZXcgc3FsaXRlKFwibG9jYXRpb24uZGJcIiwgZnVuY3Rpb24oZXJyLCBkYikge1xuICAgICAgICBkYi5leGVjU1FMKFwiQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgTG9jYXRpb24gKGlkIElOVEVHRVIgUFJJTUFSWSBLRVksIG5hbWUgVEVYVCwgdHlwZSBURVhULCBhZGRyZXNzIFRFWFQsIGxhdCBSRUFMLCBsbmcgUkVBTCwgbmVfbGF0IFJFQUwsIG5lX2xuZyBSRUFMLCBzd19sYXQgUkVBTCwgc3dfbG5nIFJFQUwpXCIsIFtdLCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVEFCTEUgTG9jYXRpb24gQ1JFQVRFRFwiKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICBcbiAgLy8gZHJvcHMgYSB0YWJsZVxuICBkcm9wVGFibGUoKSB7XG4gICAgbmV3IHNxbGl0ZShcImxvY2F0aW9uLmRiXCIsIGZ1bmN0aW9uKGVyciwgZGIpIHtcbiAgICAgICAgZGIuZXhlY1NRTChcIkRST1AgVEFCTEUgSUYgRVhJU1RTIExvY2F0aW9uXCIsIFtdLCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVEFCTEUgTG9jYXRpb24gRFJPUFBFRFwiKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICBcbiAgLy8gaW5zZXJ0IGEgbmV3IHJlY29yZFxuICAvLyBpbnNlcnRMb2NhdGlvbihpZCwgbGF0LCBsbmcsIG5hbWUsIGFkZHJlc3MsIHR5cGUsIG5lX2xhdCwgbmVfbG5nLCBzd19sYXQsIHN3X2xuZykge1xuICAvLyAgIG5ldyBzcWxpdGUoXCJsb2NhdGlvbi5kYlwiLCBmdW5jdGlvbihlcnIsIGRiKSB7XG4gIC8vICAgICAgIGRiLmV4ZWNTUUwoXCJJTlNFUlQgSU5UTyBMb2NhdGlvbiAoaWQsIGxhdCwgbG5nLCBuYW1lLCBhZGRyZXNzLCB0eXBlLCBuZV9sYXQsIG5lX2xuZywgc3dfbGF0LCBzd19sbmcgKSBWQUxVRVMgKD8sPyw/LD8sPyw/LD8sPyw/LD8pXCIsIFtpZCwgbGF0LCBsbmcsIG5hbWUsIGFkZHJlc3MsIHR5cGUsIG5lX2xhdCwgbmVfbG5nLCBzd19sYXQsIHN3X2xuZ10sIGZ1bmN0aW9uKGVyciwgaWQpIHtcbiAgLy8gICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhlIG5ldyByZWNvcmQgaWQgaXM6IFwiICsgaWQpO1xuICAvLyAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gIC8vICAgICAgIH0pO1xuICAvLyAgIH0pO1xuICAvLyB9XG4gICBpbnNlcnRMb2NhdGlvbihsb2NhdGlvbjogTG9jYXRpb24pIHtcbiAgICBjb25zb2xlLmxvZyhcIkF0dGVtcHRpbmcgdG8gaW5zZXJ0OiBcIitsb2NhdGlvbi5uYW1lKTtcbiAgICBuZXcgc3FsaXRlKFwibG9jYXRpb24uZGJcIiwgZnVuY3Rpb24oZXJyLCBkYikge1xuICAgICAgICBkYi5leGVjU1FMKFwiSU5TRVJUIElOVE8gTG9jYXRpb24gKGlkLCBsYXQsIGxuZywgbmFtZSwgYWRkcmVzcywgdHlwZSwgbmVfbGF0LCBuZV9sbmcsIHN3X2xhdCwgc3dfbG5nICkgVkFMVUVTICg/LD8sPyw/LD8sPyw/LD8sPyw/KVwiLCBbbG9jYXRpb24uaWQsIGxvY2F0aW9uLmxhdCwgbG9jYXRpb24ubG5nLCBsb2NhdGlvbi5uYW1lLCBsb2NhdGlvbi5hZGRyZXNzLCBsb2NhdGlvbi50eXBlLCBsb2NhdGlvbi5uZV9sYXQsIGxvY2F0aW9uLm5lX2xuZywgbG9jYXRpb24uc3dfbGF0LCBsb2NhdGlvbi5zd19sbmddLCBmdW5jdGlvbihlcnIsIGlkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRoZSBuZXcgcmVjb3JkIGlkIGlzOiBcIiArIGlkKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICBcbiAgLy8gdXBkYXRlIGFuIGV4aXN0aW5nIHJlY29yZFxuICB1cGRhdGVMb2NhdGlvbihpZCwgbGF0LCBsbmcsIG5hbWUsIGFkZHJlc3MsIHR5cGUsIG5lX2xhdCwgbmVfbG5nLCBzd19sYXQsIHN3X2xuZykge1xuICAgIG5ldyBzcWxpdGUoXCJsb2NhdGlvbi5kYlwiLCBmdW5jdGlvbihlcnIsIGRiKSB7XG4gICAgICAgIGRiLmV4ZWNTUUwoXCJVUERBVEUgTG9jYXRpb24gU0VUIGxhdCA9ID8sIGxuZyA9ID8sIG5hbWUgPSA/LCBhZGRyZXNzID0gPywgdHlwZSA9ID8sIG5lX2xhdCA9ID8sIG5lX2xuZyA9ID8sIHN3X2xhdCA9ID8sIHN3X2xuID0gPyBXSEVSRSBpZCA9ID9cIiwgW2xhdCwgbG5nLCBuYW1lLCBhZGRyZXNzLCB0eXBlLCBuZV9sYXQsIG5lX2xuZywgc3dfbGF0LCBzd19sbmcsIGlkXSwgZnVuY3Rpb24oZXJyLCBpZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJUaGUgZXhpc3RpbmcgcmVjb3JkIGlkIGlzOiBcIiArIGlkKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICBcbiAgLy8gZGVsZXRlIGEgcmVjb3JkXG4gIGRlbGV0ZUxvY2F0aW9uKGlkKSB7XG4gICAgbmV3IHNxbGl0ZShcImxvY2F0aW9uLmRiXCIsIGZ1bmN0aW9uKGVyciwgZGIpIHtcbiAgICAgICAgZGIuZXhlY1NRTChcIkRFTEVURSBGUk9NIExvY2F0aW9uIFdIRVJFIGlkID0gP1wiLCBbaWRdLCBmdW5jdGlvbihlcnIsIGlkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRoZSBkZWxldGVkIHJlY29yZCBpZCBpczogXCIgKyBpZCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgXG4gIC8vIHNlbGVjdCBhIHNpbmdsZSByZWNvcmRcbiAgc2VsZWN0TG9jYXRpb24oaWQpIHtcbiAgICBsZXQgcmVjb3JkOiBhbnk7XG4gICAgbmV3IHNxbGl0ZShcImxvY2F0aW9uLmRiXCIsIGZ1bmN0aW9uKGVyciwgZGIpIHtcbiAgICAgICAgZGIuZ2V0KFwiU0VMRUNUICogRlJPTSBMb2NhdGlvbiBXSEVSRSBpZCA9ID9cIiwgW2lkXSwgZnVuY3Rpb24oZXJyLCByb3cpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUm93IG9mIGRhdGEgd2FzOiBcIiArIHJvdyk7ICAvLyBQcmludHMgW1tcIkZpZWxkMVwiLCBcIkZpZWxkMlwiLC4uLl1dIFxuICAgICAgICAgICAgY29uc29sZS5sb2coXCIxOiBcIityb3dbMV0pO1xuICAgICAgICAgICAgcmVjb3JkID0gcm93O1xuICAgICAgICAgICAgLy8gcmV0dXJuIHJvdztcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlY29yZDtcbiAgfVxuICBcbiAgLy8gc2VsZWN0IGFsbCByZWNvcmRzXG4gIHNlbGVjdEFsbExvY2F0aW9ucygpOiBBcnJheTxMb2NhdGlvbj4ge1xuICAgIC8vIGNvbnNvbGUubG9nKFwiU2VsZWN0aW5nIGFsbCBsb2NhdGlvbnMuXCIpO1xuICAgIGxldCBsb2NhdGlvbnMgPSBuZXcgQXJyYXk8TG9jYXRpb24+KCk7XG4gICAgbmV3IHNxbGl0ZShcImxvY2F0aW9uLmRiXCIsIGZ1bmN0aW9uKGVyciwgZGIpIHtcbiAgICAgICAgZGIuYWxsKFwiU0VMRUNUICogRlJPTSBMb2NhdGlvbiBPUkRFUiBCWSBpZFwiLCBbXSwgZnVuY3Rpb24oZXJyLCBycykge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUmVzdWx0IHNldCBpczogXCIgKyBycyk7IC8vIFByaW50cyBbW1wiUm93XzEgRmllbGRfMVwiIFwiUm93XzEgRmllbGRfMlwiLC4uLl0sIFtcIlJvdyAyXCIuLi5dLCAuLi5dXG4gICAgICAgICAgcnMuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRTA6IFwiK2VsZW1lbnRbMF0pO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFMTogXCIrZWxlbWVudFsxXSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkUyOiBcIitlbGVtZW50WzJdKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRTM6IFwiK2VsZW1lbnRbM10pO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFNDogXCIrZWxlbWVudFs0XSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkU1OiBcIitlbGVtZW50WzVdKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRTY6IFwiK2VsZW1lbnRbNl0pO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFNzogXCIrZWxlbWVudFs3XSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkU4OiBcIitlbGVtZW50WzhdKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRTk6IFwiK2VsZW1lbnRbOV0pO1xuICAgICAgICAgICAgLy8gbGV0IGxvY2F0aW9uID0gbmV3IExvY2F0aW9uKGVsZW1lbnRbMV0sZWxlbWVudFsyXSk7XG4gICAgICAgICAgICAvLyBsb2NhdGlvbi5pZCA9IGVsZW1lbnRbMF07XG4gICAgICAgICAgICAvLyBsb2NhdGlvbi5uYW1lID0gZWxlbWVudFszXTtcbiAgICAgICAgICAgIC8vIGxvY2F0aW9uLmFkZHJlc3MgPSBlbGVtZW50WzRdO1xuICAgICAgICAgICAgLy8gbG9jYXRpb24udHlwZSA9IGVsZW1lbnRbNV07XG4gICAgICAgICAgICAvLyBsb2NhdGlvbi5uZV9sYXQgPSBlbGVtZW50WzZdO1xuICAgICAgICAgICAgLy8gbG9jYXRpb24ubmVfbG5nID0gZWxlbWVudFs3XTtcbiAgICAgICAgICAgIC8vIGxvY2F0aW9uLnN3X2xhdCA9IGVsZW1lbnRbOF07XG4gICAgICAgICAgICAvLyBsb2NhdGlvbi5zd19sbmcgPSBlbGVtZW50WzldO1xuICAgICAgICAgICAgbGV0IGxvY2F0aW9uID0gbmV3IExvY2F0aW9uKGVsZW1lbnRbNF0sZWxlbWVudFs1XSk7XG4gICAgICAgICAgICBsb2NhdGlvbi5pZCA9IGVsZW1lbnRbMF07XG4gICAgICAgICAgICBsb2NhdGlvbi5uYW1lID0gZWxlbWVudFsxXTtcbiAgICAgICAgICAgIGxvY2F0aW9uLmFkZHJlc3MgPSBlbGVtZW50WzNdO1xuICAgICAgICAgICAgbG9jYXRpb24udHlwZSA9IGVsZW1lbnRbMl07XG4gICAgICAgICAgICBsb2NhdGlvbi5uZV9sYXQgPSBlbGVtZW50WzZdO1xuICAgICAgICAgICAgbG9jYXRpb24ubmVfbG5nID0gZWxlbWVudFs3XTtcbiAgICAgICAgICAgIGxvY2F0aW9uLnN3X2xhdCA9IGVsZW1lbnRbOF07XG4gICAgICAgICAgICBsb2NhdGlvbi5zd19sbmcgPSBlbGVtZW50WzldO1xuICAgICAgICAgICAgbG9jYXRpb25zLnB1c2gobG9jYXRpb24pO1xuICAgICAgICAgIH0pOyAgIFxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gbG9jYXRpb25zO1xuICB9ICAgXG5cbiAgLy8gcXVlcnkocXVlcnkpe1xuICAvLyAgIG5ldyBzcWxpdGUoXCJsb2NhdGlvbi5kYlwiLCBmdW5jdGlvbihlcnIsIGRiKSB7XG5cbiAgLy8gICB9KTtcbiAgLy8gfSBcblxufSJdfQ==