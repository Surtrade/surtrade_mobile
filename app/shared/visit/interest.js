"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Interest = (function () {
    function Interest(_customer_id, _beacon, _start, _end) {
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
    return Interest;
}());
exports.Interest = Interest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlcmVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBO0lBU0ksa0JBQVksWUFBWSxFQUFFLE9BQU8sRUFBRSxNQUFtQixFQUFFLElBQWlCO1FBQXRDLHVCQUFBLEVBQUEsYUFBYSxJQUFJLEVBQUU7UUFBRSxxQkFBQSxFQUFBLFdBQVcsSUFBSSxFQUFFO1FBRHpFLGFBQVEsR0FBQyxFQUFFLENBQUM7UUFFUixJQUFJLENBQUMsV0FBVyxHQUFHLFlBQVksQ0FBQztRQUNoQyxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQztRQUN0QixJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztRQUNwQixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUNyQixJQUFJLENBQUMsTUFBTSxHQUFDLElBQUksQ0FBQztJQUNyQixDQUFDO0lBQ0gsZUFBQztBQUFELENBQUMsQUFqQkgsSUFpQkc7QUFqQlUsNEJBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgSW50ZXJlc3Qge1xuICAgIGlkOiBzdHJpbmc7XG4gICAgY3VzdG9tZXJfaWQ6IHN0cmluZztcbiAgICBiZWFjb246IHN0cmluZztcbiAgICBzdGFydDogRGF0ZTtcbiAgICBlbmQ6IERhdGU7XG4gICAgY3JlYXRpbmc6IGJvb2xlYW47XG4gICAgYWN0aXZlOiBib29sZWFuO1xuICAgIGtleXdvcmRzPXt9O1xuICAgIGNvbnN0cnVjdG9yKF9jdXN0b21lcl9pZCwgX2JlYWNvbiwgX3N0YXJ0ID0gbmV3IERhdGUoKSwgX2VuZCA9IG5ldyBEYXRlKCkpIHtcbiAgICAgICAgdGhpcy5jdXN0b21lcl9pZCA9IF9jdXN0b21lcl9pZDtcbiAgICAgICAgdGhpcy5iZWFjb24gPSBfYmVhY29uO1xuICAgICAgICB0aGlzLnN0YXJ0ID0gX3N0YXJ0O1xuICAgICAgICB0aGlzLmVuZCA9IF9lbmQ7XG4gICAgICAgIHRoaXMuY3JlYXRpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLmFjdGl2ZT10cnVlO1xuICAgIH1cbiAgfSJdfQ==