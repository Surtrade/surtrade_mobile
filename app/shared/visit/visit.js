"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Visit = /** @class */ (function () {
    function Visit(_customer_id, _beacon, _start, _end) {
        if (_start === void 0) { _start = new Date(); }
        if (_end === void 0) { _end = new Date(); }
        this.keywords = {};
        this.customer_id = _customer_id;
        this.beacon = _beacon;
        this.start = _start;
        this.end = _end;
        this.creating = true;
        this.active = true;
    }
    return Visit;
}());
exports.Visit = Visit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlzaXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ2aXNpdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBO0lBU0ksZUFBWSxZQUFZLEVBQUUsT0FBTyxFQUFFLE1BQW1CLEVBQUUsSUFBaUI7UUFBdEMsdUJBQUEsRUFBQSxhQUFhLElBQUksRUFBRTtRQUFFLHFCQUFBLEVBQUEsV0FBVyxJQUFJLEVBQUU7UUFEekUsYUFBUSxHQUFDLEVBQUUsQ0FBQztRQUVSLElBQUksQ0FBQyxXQUFXLEdBQUcsWUFBWSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUMsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFDSCxZQUFDO0FBQUQsQ0FBQyxBQWpCSCxJQWlCRztBQWpCVSxzQkFBSyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBWaXNpdCB7XG4gICAgaWQ6IHN0cmluZztcbiAgICBjdXN0b21lcl9pZDogc3RyaW5nO1xuICAgIGJlYWNvbjogc3RyaW5nO1xuICAgIHN0YXJ0OiBEYXRlO1xuICAgIGVuZDogRGF0ZTtcbiAgICBjcmVhdGluZzogYm9vbGVhbjtcbiAgICBhY3RpdmU6IGJvb2xlYW47XG4gICAga2V5d29yZHM9e307XG4gICAgY29uc3RydWN0b3IoX2N1c3RvbWVyX2lkLCBfYmVhY29uLCBfc3RhcnQgPSBuZXcgRGF0ZSgpLCBfZW5kID0gbmV3IERhdGUoKSkge1xuICAgICAgICB0aGlzLmN1c3RvbWVyX2lkID0gX2N1c3RvbWVyX2lkO1xuICAgICAgICB0aGlzLmJlYWNvbiA9IF9iZWFjb247XG4gICAgICAgIHRoaXMuc3RhcnQgPSBfc3RhcnQ7XG4gICAgICAgIHRoaXMuZW5kID0gX2VuZDtcbiAgICAgICAgdGhpcy5jcmVhdGluZyA9IHRydWU7XG4gICAgICAgIHRoaXMuYWN0aXZlPXRydWU7XG4gICAgfVxuICB9Il19