"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Product = /** @class */ (function () {
    function Product(code, name, description) {
        if (description === void 0) { description = ""; }
        this.code = code;
        this.name = name;
        this.description = description;
    }
    return Product;
}());
exports.Product = Product;
var Shelf = /** @class */ (function () {
    function Shelf(code, beacon) {
        this.keywords = {};
        this.code = code;
        this.beacon = beacon;
    }
    return Shelf;
}());
exports.Shelf = Shelf;
var ProductsByRemark = /** @class */ (function () {
    function ProductsByRemark(remark) {
        this.remark = remark;
    }
    return ProductsByRemark;
}());
exports.ProductsByRemark = ProductsByRemark;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlbGYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzaGVsZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBO0lBVUksaUJBQVksSUFBSSxFQUFFLElBQUksRUFBRSxXQUFjO1FBQWQsNEJBQUEsRUFBQSxnQkFBYztRQUNsQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztJQUNuQyxDQUFDO0lBQ0wsY0FBQztBQUFELENBQUMsQUFmRCxJQWVDO0FBZlksMEJBQU87QUFpQnBCO0lBU0ksZUFBWSxJQUFJLEVBQUUsTUFBTTtRQUh4QixhQUFRLEdBQUMsRUFBRSxDQUFDO1FBSVIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDekIsQ0FBQztJQUNMLFlBQUM7QUFBRCxDQUFDLEFBYkQsSUFhQztBQWJZLHNCQUFLO0FBZWxCO0lBSUksMEJBQVksTUFBTTtRQUNkLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3pCLENBQUM7SUFDTCx1QkFBQztBQUFELENBQUMsQUFQRCxJQU9DO0FBUFksNENBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIFByb2R1Y3Qge1xuICAgIGlkOiBudW1iZXI7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIGNvZGU6IHN0cmluZztcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nO1xuICAgIGtleXdvcmRzOiBhbnk7XG4gICAgaW1hZ2U6IHN0cmluZztcbiAgICB2aWRlbzogc3RyaW5nO1xuICAgIHJlbWFyazogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoY29kZSwgbmFtZSwgZGVzY3JpcHRpb249XCJcIil7XG4gICAgICAgIHRoaXMuY29kZSA9IGNvZGU7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTaGVsZiB7XG4gICAgaWQ6IG51bWJlcjtcbiAgICBiZWFjb246IHN0cmluZztcbiAgICBhY3RpdmU6IGJvb2xlYW47XG4gICAgY29kZTogc3RyaW5nO1xuICAgIGNyZWF0ZWRfZHQ6IERhdGU7XG4gICAga2V5d29yZHM9e307XG4gICAgcHJvZHVjdHM6IEFycmF5PFByb2R1Y3Q+O1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKGNvZGUsIGJlYWNvbikge1xuICAgICAgICB0aGlzLmNvZGUgPSBjb2RlO1xuICAgICAgICB0aGlzLmJlYWNvbiA9IGJlYWNvbjtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQcm9kdWN0c0J5UmVtYXJrIHtcbiAgICByZW1hcms6IHN0cmluZztcbiAgICBwcm9kdWN0czogUHJvZHVjdCBbXTtcblxuICAgIGNvbnN0cnVjdG9yKHJlbWFyaykge1xuICAgICAgICB0aGlzLnJlbWFyayA9IHJlbWFyaztcbiAgICB9XG59Il19