// import { Injectable, EventEmitter } from "@angular/core";
// import { Couchbase } from "nativescript-couchbase";
// @Injectable()
// export class LocationDatabaseService {
//     private database: any;
//     private pushReplicator: any;
//     private pullReplicator: any;
//     private listener: EventEmitter<any> = new EventEmitter();
//     public constructor() {
//         this.database = new Couchbase("location-db");
//         this.database.createView("locations", "1", function(document, emitter) {
//             if(document.documentType == "location") {
//                 emitter.emit(document._id, document);
//             }
//         });
//     }
//     public query(viewName: string): Array<any> {
//         return this.database.executeQuery(viewName);
//     }
//     public startReplication(gateway: string, bucket: string) {
//         this.pushReplicator = this.database.createPushReplication("http://" + gateway + ":4984/" + bucket);
//         this.pullReplicator = this.database.createPullReplication("http://" + gateway + ":4984/" + bucket);
//         this.pushReplicator.setContinuous(true);
//         this.pullReplicator.setContinuous(true);
//         this.database.addDatabaseChangeListener(changes => {
//             this.listener.emit(changes);
//         });
//         this.pushReplicator.start();
//         this.pullReplicator.start();
//     }
//     public getDatabase() {
//         return this.database;
//     }
//     public getChangeListener() {
//         return this.listener;
//     }
// } 
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYXRpb24uZGIuc2VydmljZS4yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9jYXRpb24uZGIuc2VydmljZS4yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDREQUE0RDtBQUM1RCxzREFBc0Q7QUFFdEQsZ0JBQWdCO0FBQ2hCLHlDQUF5QztBQUV6Qyw2QkFBNkI7QUFDN0IsbUNBQW1DO0FBQ25DLG1DQUFtQztBQUNuQyxnRUFBZ0U7QUFFaEUsNkJBQTZCO0FBQzdCLHdEQUF3RDtBQUN4RCxtRkFBbUY7QUFDbkYsd0RBQXdEO0FBQ3hELHdEQUF3RDtBQUN4RCxnQkFBZ0I7QUFDaEIsY0FBYztBQUNkLFFBQVE7QUFFUixtREFBbUQ7QUFDbkQsdURBQXVEO0FBQ3ZELFFBQVE7QUFFUixpRUFBaUU7QUFDakUsOEdBQThHO0FBQzlHLDhHQUE4RztBQUM5RyxtREFBbUQ7QUFDbkQsbURBQW1EO0FBQ25ELCtEQUErRDtBQUMvRCwyQ0FBMkM7QUFDM0MsY0FBYztBQUNkLHVDQUF1QztBQUN2Qyx1Q0FBdUM7QUFDdkMsUUFBUTtBQUVSLDZCQUE2QjtBQUM3QixnQ0FBZ0M7QUFDaEMsUUFBUTtBQUVSLG1DQUFtQztBQUNuQyxnQ0FBZ0M7QUFDaEMsUUFBUTtBQUVSLElBQUkiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgeyBJbmplY3RhYmxlLCBFdmVudEVtaXR0ZXIgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuLy8gaW1wb3J0IHsgQ291Y2hiYXNlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1jb3VjaGJhc2VcIjtcblxuLy8gQEluamVjdGFibGUoKVxuLy8gZXhwb3J0IGNsYXNzIExvY2F0aW9uRGF0YWJhc2VTZXJ2aWNlIHtcblxuLy8gICAgIHByaXZhdGUgZGF0YWJhc2U6IGFueTtcbi8vICAgICBwcml2YXRlIHB1c2hSZXBsaWNhdG9yOiBhbnk7XG4vLyAgICAgcHJpdmF0ZSBwdWxsUmVwbGljYXRvcjogYW55O1xuLy8gICAgIHByaXZhdGUgbGlzdGVuZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4vLyAgICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuLy8gICAgICAgICB0aGlzLmRhdGFiYXNlID0gbmV3IENvdWNoYmFzZShcImxvY2F0aW9uLWRiXCIpO1xuLy8gICAgICAgICB0aGlzLmRhdGFiYXNlLmNyZWF0ZVZpZXcoXCJsb2NhdGlvbnNcIiwgXCIxXCIsIGZ1bmN0aW9uKGRvY3VtZW50LCBlbWl0dGVyKSB7XG4vLyAgICAgICAgICAgICBpZihkb2N1bWVudC5kb2N1bWVudFR5cGUgPT0gXCJsb2NhdGlvblwiKSB7XG4vLyAgICAgICAgICAgICAgICAgZW1pdHRlci5lbWl0KGRvY3VtZW50Ll9pZCwgZG9jdW1lbnQpO1xuLy8gICAgICAgICAgICAgfVxuLy8gICAgICAgICB9KTtcbi8vICAgICB9XG5cbi8vICAgICBwdWJsaWMgcXVlcnkodmlld05hbWU6IHN0cmluZyk6IEFycmF5PGFueT4ge1xuLy8gICAgICAgICByZXR1cm4gdGhpcy5kYXRhYmFzZS5leGVjdXRlUXVlcnkodmlld05hbWUpO1xuLy8gICAgIH1cblxuLy8gICAgIHB1YmxpYyBzdGFydFJlcGxpY2F0aW9uKGdhdGV3YXk6IHN0cmluZywgYnVja2V0OiBzdHJpbmcpIHtcbi8vICAgICAgICAgdGhpcy5wdXNoUmVwbGljYXRvciA9IHRoaXMuZGF0YWJhc2UuY3JlYXRlUHVzaFJlcGxpY2F0aW9uKFwiaHR0cDovL1wiICsgZ2F0ZXdheSArIFwiOjQ5ODQvXCIgKyBidWNrZXQpO1xuLy8gICAgICAgICB0aGlzLnB1bGxSZXBsaWNhdG9yID0gdGhpcy5kYXRhYmFzZS5jcmVhdGVQdWxsUmVwbGljYXRpb24oXCJodHRwOi8vXCIgKyBnYXRld2F5ICsgXCI6NDk4NC9cIiArIGJ1Y2tldCk7XG4vLyAgICAgICAgIHRoaXMucHVzaFJlcGxpY2F0b3Iuc2V0Q29udGludW91cyh0cnVlKTtcbi8vICAgICAgICAgdGhpcy5wdWxsUmVwbGljYXRvci5zZXRDb250aW51b3VzKHRydWUpO1xuLy8gICAgICAgICB0aGlzLmRhdGFiYXNlLmFkZERhdGFiYXNlQ2hhbmdlTGlzdGVuZXIoY2hhbmdlcyA9PiB7XG4vLyAgICAgICAgICAgICB0aGlzLmxpc3RlbmVyLmVtaXQoY2hhbmdlcyk7XG4vLyAgICAgICAgIH0pO1xuLy8gICAgICAgICB0aGlzLnB1c2hSZXBsaWNhdG9yLnN0YXJ0KCk7XG4vLyAgICAgICAgIHRoaXMucHVsbFJlcGxpY2F0b3Iuc3RhcnQoKTtcbi8vICAgICB9XG5cbi8vICAgICBwdWJsaWMgZ2V0RGF0YWJhc2UoKSB7XG4vLyAgICAgICAgIHJldHVybiB0aGlzLmRhdGFiYXNlO1xuLy8gICAgIH1cblxuLy8gICAgIHB1YmxpYyBnZXRDaGFuZ2VMaXN0ZW5lcigpIHtcbi8vICAgICAgICAgcmV0dXJuIHRoaXMubGlzdGVuZXI7XG4vLyAgICAgfVxuXG4vLyB9Il19