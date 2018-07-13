"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var sqlite = require("nativescript-sqlite");
var interest_1 = require("./interest");
var InterestDatabaseService = (function () {
    function InterestDatabaseService() {
        console.log("In Interest DB Service Constructor");
    }
    // create a table
    InterestDatabaseService.prototype.createTable = function () {
        new sqlite("interest.db", function (err, db) {
            db.execSQL("CREATE TABLE IF NOT EXISTS Interest (id INTEGER PRIMARY KEY, customer_id TEXT, beacon TEXT, start DATETIME,end DATETIME,creating NUMERIC, active NUMERIC, keywords JSON )", [], function (err) {
                console.log("TABLE Interest CREATED");
                return true;
            });
        });
    };
    // drops a table
    InterestDatabaseService.prototype.dropTable = function () {
        new sqlite("interest.db", function (err, db) {
            db.execSQL("DROP TABLE IF EXISTS Interest", [], function (err) {
                console.log("TABLE Interest DROPPED");
                return true;
            });
        });
    };
    InterestDatabaseService.prototype.insertInterest = function (interest) {
        if (interest.id == null) {
            interest.id = interest.beacon;
        }
        console.log("Attempting to insert interest: " + interest.id);
        new sqlite("interest.db", function (err, db) {
            db.execSQL("INSERT INTO Interest (id,customer_id,  beacon , start ,end ,creating , active , keywords ) VALUES (?,?,?,?,?,?,?,?)", [interest.id, interest.customer_id, interest.beacon, interest.start, interest.end, interest.creating, interest.active, interest.keywords], function (err, id) {
                console.log("The new interest record with id " + id + " and beacon " + interest.beacon);
                return true;
            });
        });
    };
    // update an existing record
    //   updateInterest(id,customer_id,  beacon , start ,end ,creating , active , keywords) {
    InterestDatabaseService.prototype.updateInterest = function (interest) {
        new sqlite("interest.db", function (err, db) {
            // db.execSQL("UPDATE Interest SET customer_id = ?, beacon = ?, start = ?, end = ?, creating = ?, active = ?, keywords = ? WHERE id = ?", [customer_id, beacon, start, end, creating, active, keywords, id], function(err, id) {
            db.execSQL("UPDATE Interest SET customer_id = ?, beacon = ?, start = ?, end = ?, creating = ?, active = ?, keywords = ? WHERE id = ?", [interest.customer_id, interest.beacon, interest.start, new Date(), interest.creating, interest.active, interest.keywords, interest.id], function (err, id) {
                console.log("The existing interest record id is: " + id);
                return true;
            });
        });
    };
    // delete a record
    InterestDatabaseService.prototype.deleteInterest = function (id) {
        new sqlite("interest.db", function (err, db) {
            db.execSQL("DELETE FROM Interest WHERE id = ?", [id], function (err, id) {
                console.log("The deleted interest record id is: " + id);
                return true;
            });
        });
    };
    // select a single record
    InterestDatabaseService.prototype.selectInterest = function (id) {
        var record;
        new sqlite("interest.db", function (err, db) {
            db.get("SELECT * FROM Interest WHERE id = ?", [id], function (err, row) {
                // console.log("Row of data was: " + row);  // Prints [["Field1", "Field2",...]] 
                // console.log("1: "+row[1]);
                record = new interest_1.Interest(row[1], row[2], row[3], row[4]);
                record.id = row[0];
                // record = row;
                // return row;
            });
        });
        return record;
    };
    // select a single record
    InterestDatabaseService.prototype.selectInterestByBeacon = function (beacon) {
        console.log("select beacon: " + beacon);
        var record = null;
        new sqlite("interest.db", function (err, db) {
            db.get("SELECT * FROM Interest WHERE beacon = ?", [beacon], function (err, row) {
                if (row != null) {
                    console.log("Row of interest data was: " + row); // Prints [["Field1", "Field2",...]] 
                    // console.log("1: "+row[1]);
                    record = new interest_1.Interest(row[1], row[2], row[3], row[4]);
                    record.id = row[0];
                    // record = row;
                    // return row;
                }
                else {
                    console.log("No interest records with beacon " + beacon);
                    record = null;
                }
            });
        });
        console.log("interest record:" + record);
        return record;
    };
    // select all records
    InterestDatabaseService.prototype.selectInterests = function () {
        var interests = new Array();
        new sqlite("interest.db", function (err, db) {
            db.all("SELECT * FROM Interest ORDER BY id", [], function (err, rs) {
                rs.forEach(function (element) {
                    // console.log("E0: "+element[0]);
                    // console.log("E1: "+element[1]);
                    // console.log("E2: "+element[2]);
                    // console.log("E3: "+element[3]);
                    // console.log("E4: "+element[4]);
                    // console.log("E5: "+element[5]);
                    // console.log("E6: "+element[6]);
                    // console.log("E7: "+element[7]);
                    var interestObj = new interest_1.Interest(element[1], element[2], element[3], element[4]);
                    interestObj.id = element[0];
                    interestObj.creating = element[5];
                    interestObj.active = element[6];
                    interestObj.keywords = element[7];
                    interests.push(interestObj);
                });
            });
        });
        return interests;
    };
    InterestDatabaseService.prototype.finishInterests = function () {
        var _this = this;
        var finishedInterests = Array();
        // Retrive all interests (should be max 1)
        var interests = this.selectInterests();
        console.log("how many intersts to finish: " + interests.length);
        // if there is an interest 
        if (interests.length > 0) {
            interests.forEach(function (interest) {
                var start = new Date(interest.start);
                var end = new Date(interest.end);
                var duration = end.getTime() - start.getTime();
                var sinceLast = new Date().getTime() - end.getTime();
                console.log("Interest: " + interest.beacon + ", sinceLast: " + sinceLast + ", duration: " + duration);
                // if duration  > 1 minute then send interest
                if (duration > 60000) {
                    // console.log("Sending interest b: "+interest.beacon)
                    // console.log("Actual implementation pending..");
                    finishedInterests.push(interest);
                }
                console.log("Deleting interest due to expiring contract: " + interest.beacon);
                _this.deleteInterest(interest.id);
            });
        }
        return finishedInterests;
    };
    InterestDatabaseService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], InterestDatabaseService);
    return InterestDatabaseService;
}());
exports.InterestDatabaseService = InterestDatabaseService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJlc3QuZGIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVyZXN0LmRiLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBeUQ7QUFDekQsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFFLHFCQUFxQixDQUFFLENBQUM7QUFDaEQsdUNBQXNDO0FBR3RDO0lBRUU7UUFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVELGlCQUFpQjtJQUNqQiw2Q0FBVyxHQUFYO1FBQ0UsSUFBSSxNQUFNLENBQUMsYUFBYSxFQUFFLFVBQVMsR0FBRyxFQUFFLEVBQUU7WUFDdEMsRUFBRSxDQUFDLE9BQU8sQ0FBQywyS0FBMkssRUFBRSxFQUFFLEVBQUUsVUFBUyxHQUFHO2dCQUNwTSxPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7Z0JBQ3RDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDaEIsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIsMkNBQVMsR0FBVDtRQUNFLElBQUksTUFBTSxDQUFDLGFBQWEsRUFBRSxVQUFTLEdBQUcsRUFBRSxFQUFFO1lBQ3RDLEVBQUUsQ0FBQyxPQUFPLENBQUMsK0JBQStCLEVBQUUsRUFBRSxFQUFFLFVBQVMsR0FBRztnQkFDeEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO2dCQUN0QyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2hCLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsZ0RBQWMsR0FBZCxVQUFlLFFBQWtCO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLENBQUEsQ0FBQztZQUNyQixRQUFRLENBQUMsRUFBRSxHQUFHLFFBQVEsQ0FB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M0IsQ0FBQztJQTdKVSx1QkFBdUI7UUFEbkMsaUJBQVUsRUFBRTs7T0FDQSx1QkFBdUIsQ0ErSm5DO0lBQUQsOEJBQUM7Q0FBQSxBQS9KRCxJQStKQztBQS9KWSwwREFBdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBFdmVudEVtaXR0ZXIgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuY29uc3Qgc3FsaXRlID0gcmVxdWlyZSggXCJuYXRpdmVzY3JpcHQtc3FsaXRlXCIgKTtcbmltcG9ydCB7IEludGVyZXN0IH0gZnJvbSBcIi4vaW50ZXJlc3RcIjtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEludGVyZXN0RGF0YWJhc2VTZXJ2aWNlIHtcblxuICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkluIEludGVyZXN0IERCIFNlcnZpY2UgQ29uc3RydWN0b3JcIik7XG4gIH1cblxuICAvLyBjcmVhdGUgYSB0YWJsZVxuICBjcmVhdGVUYWJsZSgpIHtcbiAgICBuZXcgc3FsaXRlKFwiaW50ZXJlc3QuZGJcIiwgZnVuY3Rpb24oZXJyLCBkYikge1xuICAgICAgICBkYi5leGVjU1FMKFwiQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgSW50ZXJlc3QgKGlkIElOVEVHRVIgUFJJTUFSWSBLRVksIGN1c3RvbWVyX2lkIFRFWFQsIGJlYWNvbiBURVhULCBzdGFydCBEQVRFVElNRSxlbmQgREFURVRJTUUsY3JlYXRpbmcgTlVNRVJJQywgYWN0aXZlIE5VTUVSSUMsIGtleXdvcmRzIEpTT04gKVwiLCBbXSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRBQkxFIEludGVyZXN0IENSRUFURURcIik7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgXG4gIC8vIGRyb3BzIGEgdGFibGVcbiAgZHJvcFRhYmxlKCkge1xuICAgIG5ldyBzcWxpdGUoXCJpbnRlcmVzdC5kYlwiLCBmdW5jdGlvbihlcnIsIGRiKSB7XG4gICAgICAgIGRiLmV4ZWNTUUwoXCJEUk9QIFRBQkxFIElGIEVYSVNUUyBJbnRlcmVzdFwiLCBbXSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRBQkxFIEludGVyZXN0IERST1BQRURcIik7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgXG4gIGluc2VydEludGVyZXN0KGludGVyZXN0OiBJbnRlcmVzdCkge1xuICAgICAgaWYgKGludGVyZXN0LmlkID09IG51bGwpe1xuICAgICAgICAgIGludGVyZXN0LmlkID0gaW50ZXJlc3QuYmVhY29uO1xuICAgICAgfVxuICAgIGNvbnNvbGUubG9nKFwiQXR0ZW1wdGluZyB0byBpbnNlcnQgaW50ZXJlc3Q6IFwiK2ludGVyZXN0LmlkKTtcbiAgICBuZXcgc3FsaXRlKFwiaW50ZXJlc3QuZGJcIiwgZnVuY3Rpb24oZXJyLCBkYikge1xuICAgICAgICBkYi5leGVjU1FMKFwiSU5TRVJUIElOVE8gSW50ZXJlc3QgKGlkLGN1c3RvbWVyX2lkLCAgYmVhY29uICwgc3RhcnQgLGVuZCAsY3JlYXRpbmcgLCBhY3RpdmUgLCBrZXl3b3JkcyApIFZBTFVFUyAoPyw/LD8sPyw/LD8sPyw/KVwiLCBbaW50ZXJlc3QuaWQsaW50ZXJlc3QuY3VzdG9tZXJfaWQsIGludGVyZXN0LmJlYWNvbiwgaW50ZXJlc3Quc3RhcnQsIGludGVyZXN0LmVuZCwgaW50ZXJlc3QuY3JlYXRpbmcsIGludGVyZXN0LmFjdGl2ZSwgaW50ZXJlc3Qua2V5d29yZHNdLCBmdW5jdGlvbihlcnIsIGlkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRoZSBuZXcgaW50ZXJlc3QgcmVjb3JkIHdpdGggaWQgXCIgKyBpZCtcIiBhbmQgYmVhY29uIFwiK2ludGVyZXN0LmJlYWNvbik7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgXG4gIC8vIHVwZGF0ZSBhbiBleGlzdGluZyByZWNvcmRcbi8vICAgdXBkYXRlSW50ZXJlc3QoaWQsY3VzdG9tZXJfaWQsICBiZWFjb24gLCBzdGFydCAsZW5kICxjcmVhdGluZyAsIGFjdGl2ZSAsIGtleXdvcmRzKSB7XG4gICAgdXBkYXRlSW50ZXJlc3QoaW50ZXJlc3Q6IEludGVyZXN0KXtcbiAgICBuZXcgc3FsaXRlKFwiaW50ZXJlc3QuZGJcIiwgZnVuY3Rpb24oZXJyLCBkYikge1xuICAgICAgICAvLyBkYi5leGVjU1FMKFwiVVBEQVRFIEludGVyZXN0IFNFVCBjdXN0b21lcl9pZCA9ID8sIGJlYWNvbiA9ID8sIHN0YXJ0ID0gPywgZW5kID0gPywgY3JlYXRpbmcgPSA/LCBhY3RpdmUgPSA/LCBrZXl3b3JkcyA9ID8gV0hFUkUgaWQgPSA/XCIsIFtjdXN0b21lcl9pZCwgYmVhY29uLCBzdGFydCwgZW5kLCBjcmVhdGluZywgYWN0aXZlLCBrZXl3b3JkcywgaWRdLCBmdW5jdGlvbihlcnIsIGlkKSB7XG4gICAgICAgIGRiLmV4ZWNTUUwoXCJVUERBVEUgSW50ZXJlc3QgU0VUIGN1c3RvbWVyX2lkID0gPywgYmVhY29uID0gPywgc3RhcnQgPSA/LCBlbmQgPSA/LCBjcmVhdGluZyA9ID8sIGFjdGl2ZSA9ID8sIGtleXdvcmRzID0gPyBXSEVSRSBpZCA9ID9cIiwgW2ludGVyZXN0LmN1c3RvbWVyX2lkLCBpbnRlcmVzdC5iZWFjb24sIGludGVyZXN0LnN0YXJ0LCBuZXcgRGF0ZSgpLCBpbnRlcmVzdC5jcmVhdGluZywgaW50ZXJlc3QuYWN0aXZlLCBpbnRlcmVzdC5rZXl3b3JkcywgaW50ZXJlc3QuaWRdLCBmdW5jdGlvbihlcnIsIGlkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRoZSBleGlzdGluZyBpbnRlcmVzdCByZWNvcmQgaWQgaXM6IFwiICsgaWQpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIFxuICAvLyBkZWxldGUgYSByZWNvcmRcbiAgZGVsZXRlSW50ZXJlc3QoaWQpIHtcbiAgICBuZXcgc3FsaXRlKFwiaW50ZXJlc3QuZGJcIiwgZnVuY3Rpb24oZXJyLCBkYikge1xuICAgICAgICBkYi5leGVjU1FMKFwiREVMRVRFIEZST00gSW50ZXJlc3QgV0hFUkUgaWQgPSA/XCIsIFtpZF0sIGZ1bmN0aW9uKGVyciwgaWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhlIGRlbGV0ZWQgaW50ZXJlc3QgcmVjb3JkIGlkIGlzOiBcIiArIGlkKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICBcbiAgLy8gc2VsZWN0IGEgc2luZ2xlIHJlY29yZFxuICBzZWxlY3RJbnRlcmVzdChpZCk6IEludGVyZXN0IHtcbiAgICBsZXQgcmVjb3JkOiBJbnRlcmVzdDtcbiAgICBuZXcgc3FsaXRlKFwiaW50ZXJlc3QuZGJcIiwgZnVuY3Rpb24oZXJyLCBkYikge1xuICAgICAgICBkYi5nZXQoXCJTRUxFQ1QgKiBGUk9NIEludGVyZXN0IFdIRVJFIGlkID0gP1wiLCBbaWRdLCBmdW5jdGlvbihlcnIsIHJvdykge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJSb3cgb2YgZGF0YSB3YXM6IFwiICsgcm93KTsgIC8vIFByaW50cyBbW1wiRmllbGQxXCIsIFwiRmllbGQyXCIsLi4uXV0gXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIjE6IFwiK3Jvd1sxXSk7XG4gICAgICAgICAgICByZWNvcmQgPSBuZXcgSW50ZXJlc3Qocm93WzFdLHJvd1syXSxyb3dbM10scm93WzRdKTtcbiAgICAgICAgICAgIHJlY29yZC5pZCA9IHJvd1swXTtcbiAgICAgICAgICAgIC8vIHJlY29yZCA9IHJvdztcbiAgICAgICAgICAgIC8vIHJldHVybiByb3c7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiByZWNvcmQ7XG4gIH1cblxuICAgIC8vIHNlbGVjdCBhIHNpbmdsZSByZWNvcmRcbiAgICBzZWxlY3RJbnRlcmVzdEJ5QmVhY29uKGJlYWNvbik6IEludGVyZXN0IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJzZWxlY3QgYmVhY29uOiBcIitiZWFjb24pO1xuICAgICAgICBsZXQgcmVjb3JkOiBJbnRlcmVzdCA9IG51bGw7XG4gICAgICAgIG5ldyBzcWxpdGUoXCJpbnRlcmVzdC5kYlwiLCBmdW5jdGlvbihlcnIsIGRiKSB7XG4gICAgICAgICAgICBkYi5nZXQoXCJTRUxFQ1QgKiBGUk9NIEludGVyZXN0IFdIRVJFIGJlYWNvbiA9ID9cIiwgW2JlYWNvbl0sIGZ1bmN0aW9uKGVyciwgcm93KSB7XG4gICAgICAgICAgICAgICAgaWYgKHJvdyE9bnVsbCl7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUm93IG9mIGludGVyZXN0IGRhdGEgd2FzOiBcIiArIHJvdyk7ICAvLyBQcmludHMgW1tcIkZpZWxkMVwiLCBcIkZpZWxkMlwiLC4uLl1dIFxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIjE6IFwiK3Jvd1sxXSk7XG4gICAgICAgICAgICAgICAgICAgIHJlY29yZCA9IG5ldyBJbnRlcmVzdChyb3dbMV0scm93WzJdLHJvd1szXSxyb3dbNF0pO1xuICAgICAgICAgICAgICAgICAgICByZWNvcmQuaWQgPSByb3dbMF07XG4gICAgICAgICAgICAgICAgICAgIC8vIHJlY29yZCA9IHJvdztcbiAgICAgICAgICAgICAgICAgICAgLy8gcmV0dXJuIHJvdztcbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJObyBpbnRlcmVzdCByZWNvcmRzIHdpdGggYmVhY29uIFwiK2JlYWNvbik7XG4gICAgICAgICAgICAgICAgICAgIHJlY29yZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zb2xlLmxvZyhcImludGVyZXN0IHJlY29yZDpcIiArcmVjb3JkKTtcbiAgICAgICAgcmV0dXJuIHJlY29yZDtcbiAgICAgIH1cbiAgXG4gIC8vIHNlbGVjdCBhbGwgcmVjb3Jkc1xuICBzZWxlY3RJbnRlcmVzdHMoKTogQXJyYXk8SW50ZXJlc3Q+IHtcbiAgICBsZXQgaW50ZXJlc3RzID0gbmV3IEFycmF5PEludGVyZXN0PigpO1xuICAgIG5ldyBzcWxpdGUoXCJpbnRlcmVzdC5kYlwiLCBmdW5jdGlvbihlcnIsIGRiKSB7XG4gICAgICAgIGRiLmFsbChcIlNFTEVDVCAqIEZST00gSW50ZXJlc3QgT1JERVIgQlkgaWRcIiwgW10sIGZ1bmN0aW9uKGVyciwgcnMpIHtcbiAgICAgICAgICBycy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFMDogXCIrZWxlbWVudFswXSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkUxOiBcIitlbGVtZW50WzFdKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRTI6IFwiK2VsZW1lbnRbMl0pO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFMzogXCIrZWxlbWVudFszXSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkU0OiBcIitlbGVtZW50WzRdKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRTU6IFwiK2VsZW1lbnRbNV0pO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFNjogXCIrZWxlbWVudFs2XSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkU3OiBcIitlbGVtZW50WzddKTtcbiAgICAgICAgICAgIGxldCBpbnRlcmVzdE9iaiA9IG5ldyBJbnRlcmVzdChlbGVtZW50WzFdLCBlbGVtZW50WzJdLCBlbGVtZW50WzNdLCBlbGVtZW50WzRdKTtcbiAgICAgICAgICAgIGludGVyZXN0T2JqLmlkID0gZWxlbWVudFswXTtcbiAgICAgICAgICAgIGludGVyZXN0T2JqLmNyZWF0aW5nID0gZWxlbWVudFs1XTtcbiAgICAgICAgICAgIGludGVyZXN0T2JqLmFjdGl2ZSA9IGVsZW1lbnRbNl07XG4gICAgICAgICAgICBpbnRlcmVzdE9iai5rZXl3b3JkcyA9IGVsZW1lbnRbN107XG4gICAgICAgICAgICBpbnRlcmVzdHMucHVzaChpbnRlcmVzdE9iaik7XG4gICAgICAgICAgICBcbiAgICAgICAgICB9KTsgICBcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGludGVyZXN0cztcbiAgfVxuICBcbiAgZmluaXNoSW50ZXJlc3RzKCk6IEFycmF5PEludGVyZXN0PntcbiAgICBsZXQgZmluaXNoZWRJbnRlcmVzdHMgPSBBcnJheTxJbnRlcmVzdD4oKTtcblxuICAgIC8vIFJldHJpdmUgYWxsIGludGVyZXN0cyAoc2hvdWxkIGJlIG1heCAxKVxuICAgIGxldCBpbnRlcmVzdHMgPSB0aGlzLnNlbGVjdEludGVyZXN0cygpO1xuXG4gICAgY29uc29sZS5sb2coXCJob3cgbWFueSBpbnRlcnN0cyB0byBmaW5pc2g6IFwiK2ludGVyZXN0cy5sZW5ndGgpO1xuICAgIC8vIGlmIHRoZXJlIGlzIGFuIGludGVyZXN0IFxuICAgIGlmIChpbnRlcmVzdHMubGVuZ3RoID4gMCl7XG4gICAgICAgIGludGVyZXN0cy5mb3JFYWNoKGludGVyZXN0ID0+e1xuICAgICAgICBsZXQgc3RhcnQgPSBuZXcgRGF0ZShpbnRlcmVzdC5zdGFydCk7XG4gICAgICAgIGxldCBlbmQgPSBuZXcgRGF0ZShpbnRlcmVzdC5lbmQpO1xuICAgICAgICBsZXQgZHVyYXRpb24gPSBlbmQuZ2V0VGltZSgpIC0gc3RhcnQuZ2V0VGltZSgpO1xuICAgICAgICBsZXQgc2luY2VMYXN0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSBlbmQuZ2V0VGltZSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkludGVyZXN0OiBcIitpbnRlcmVzdC5iZWFjb24rXCIsIHNpbmNlTGFzdDogXCIrc2luY2VMYXN0K1wiLCBkdXJhdGlvbjogXCIrZHVyYXRpb24pO1xuICAgICAgICBcbiAgICAgICAgLy8gaWYgZHVyYXRpb24gID4gMSBtaW51dGUgdGhlbiBzZW5kIGludGVyZXN0XG4gICAgICAgIGlmKCBkdXJhdGlvbiA+IDYwMDAwKXtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiU2VuZGluZyBpbnRlcmVzdCBiOiBcIitpbnRlcmVzdC5iZWFjb24pXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkFjdHVhbCBpbXBsZW1lbnRhdGlvbiBwZW5kaW5nLi5cIik7XG4gICAgICAgICAgICBmaW5pc2hlZEludGVyZXN0cy5wdXNoKGludGVyZXN0KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcIkRlbGV0aW5nIGludGVyZXN0IGR1ZSB0byBleHBpcmluZyBjb250cmFjdDogXCIraW50ZXJlc3QuYmVhY29uKTtcbiAgICAgICAgdGhpcy5kZWxldGVJbnRlcmVzdChpbnRlcmVzdC5pZCk7XG4gICAgICAgIFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmluaXNoZWRJbnRlcmVzdHM7XG4gIH1cblxufSJdfQ==