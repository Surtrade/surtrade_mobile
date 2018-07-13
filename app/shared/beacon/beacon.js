"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Beacon = /** @class */ (function () {
    function Beacon(_major, _minor) {
        this.keywords = {};
        // this.id = _id;
        this.major = _major;
        this.minor = _minor;
        this.identificator = _major + _minor;
        // this.active = _active;
    }
    return Beacon;
}());
exports.Beacon = Beacon;
//  data = {
//         UUID: "B9407F30-F5F8-466E-AFF9-25556B57FE6D",
//         beacons: [
//             {"name" : "ice", "role": "store", "major": "4047", "minor": "16521", "keywords":{"retail": ["electronics"]}},
//             {"name" : "blueberry", "role": "item", "major": "8476","minor": "44062", "keywords":{"electronics": ["televisions", "sound systems"]}},
//             {"name" : "mint", "role": "item", "major": "53796", "minor": "21456", "keywords":{"electronics": ["cellphones"]}},
//             {"name" : "lemon", "role": "store", "major": "47217", "minor": "36695", "keywords":{"retail": ["groceries","electronics"]}},
//             {"name" : "candy", "role": "item", "major": "41517", "minor": "64785", "keywords":{"electronics": ["televisions"]}},
//             {"name" : "beetroot", "role": "item", "major": "59589", "minor": "2388", "keywords":{"food": ["bread"]}}       
//         ]
//     };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVhY29uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYmVhY29uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7SUFVSSxnQkFBWSxNQUFNLEVBQUUsTUFBTTtRQUYxQixhQUFRLEdBQUMsRUFBRSxDQUFDO1FBR1IsaUJBQWlCO1FBQ2pCLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxhQUFhLEdBQUcsTUFBTSxHQUFDLE1BQU0sQ0FBQztRQUNuQyx5QkFBeUI7SUFDN0IsQ0FBQztJQUNILGFBQUM7QUFBRCxDQUFDLEFBakJILElBaUJHO0FBakJVLHdCQUFNO0FBbUJuQixZQUFZO0FBQ1osd0RBQXdEO0FBQ3hELHFCQUFxQjtBQUNyQiw0SEFBNEg7QUFDNUgsc0pBQXNKO0FBQ3RKLGlJQUFpSTtBQUVqSSwySUFBMkk7QUFDM0ksbUlBQW1JO0FBQ25JLDhIQUE4SDtBQUM5SCxZQUFZO0FBQ1osU0FBUyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBCZWFjb24ge1xuICAgIGlkOiBzdHJpbmc7XG4gICAgaWRlbnRpZmljYXRvcjogc3RyaW5nO1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBtYWpvcjogc3RyaW5nO1xuICAgIG1pbm9yOiBzdHJpbmc7XG4gICAgcm9sZTogc3RyaW5nO1xuICAgIGFjdGl2ZTogYm9vbGVhbjtcbiAgICBrZXl3b3Jkcz17fTtcbiAgICBsb2NhdGlvbl9pZDogc3RyaW5nO1xuICAgIGNvbnN0cnVjdG9yKF9tYWpvciwgX21pbm9yKSB7XG4gICAgICAgIC8vIHRoaXMuaWQgPSBfaWQ7XG4gICAgICAgIHRoaXMubWFqb3IgPSBfbWFqb3I7XG4gICAgICAgIHRoaXMubWlub3IgPSBfbWlub3I7XG4gICAgICAgIHRoaXMuaWRlbnRpZmljYXRvciA9IF9tYWpvcitfbWlub3I7XG4gICAgICAgIC8vIHRoaXMuYWN0aXZlID0gX2FjdGl2ZTtcbiAgICB9XG4gIH1cblxuLy8gIGRhdGEgPSB7XG4vLyAgICAgICAgIFVVSUQ6IFwiQjk0MDdGMzAtRjVGOC00NjZFLUFGRjktMjU1NTZCNTdGRTZEXCIsXG4vLyAgICAgICAgIGJlYWNvbnM6IFtcbi8vICAgICAgICAgICAgIHtcIm5hbWVcIiA6IFwiaWNlXCIsIFwicm9sZVwiOiBcInN0b3JlXCIsIFwibWFqb3JcIjogXCI0MDQ3XCIsIFwibWlub3JcIjogXCIxNjUyMVwiLCBcImtleXdvcmRzXCI6e1wicmV0YWlsXCI6IFtcImVsZWN0cm9uaWNzXCJdfX0sXG4vLyAgICAgICAgICAgICB7XCJuYW1lXCIgOiBcImJsdWViZXJyeVwiLCBcInJvbGVcIjogXCJpdGVtXCIsIFwibWFqb3JcIjogXCI4NDc2XCIsXCJtaW5vclwiOiBcIjQ0MDYyXCIsIFwia2V5d29yZHNcIjp7XCJlbGVjdHJvbmljc1wiOiBbXCJ0ZWxldmlzaW9uc1wiLCBcInNvdW5kIHN5c3RlbXNcIl19fSxcbi8vICAgICAgICAgICAgIHtcIm5hbWVcIiA6IFwibWludFwiLCBcInJvbGVcIjogXCJpdGVtXCIsIFwibWFqb3JcIjogXCI1Mzc5NlwiLCBcIm1pbm9yXCI6IFwiMjE0NTZcIiwgXCJrZXl3b3Jkc1wiOntcImVsZWN0cm9uaWNzXCI6IFtcImNlbGxwaG9uZXNcIl19fSxcblxuLy8gICAgICAgICAgICAge1wibmFtZVwiIDogXCJsZW1vblwiLCBcInJvbGVcIjogXCJzdG9yZVwiLCBcIm1ham9yXCI6IFwiNDcyMTdcIiwgXCJtaW5vclwiOiBcIjM2Njk1XCIsIFwia2V5d29yZHNcIjp7XCJyZXRhaWxcIjogW1wiZ3JvY2VyaWVzXCIsXCJlbGVjdHJvbmljc1wiXX19LFxuLy8gICAgICAgICAgICAge1wibmFtZVwiIDogXCJjYW5keVwiLCBcInJvbGVcIjogXCJpdGVtXCIsIFwibWFqb3JcIjogXCI0MTUxN1wiLCBcIm1pbm9yXCI6IFwiNjQ3ODVcIiwgXCJrZXl3b3Jkc1wiOntcImVsZWN0cm9uaWNzXCI6IFtcInRlbGV2aXNpb25zXCJdfX0sXG4vLyAgICAgICAgICAgICB7XCJuYW1lXCIgOiBcImJlZXRyb290XCIsIFwicm9sZVwiOiBcIml0ZW1cIiwgXCJtYWpvclwiOiBcIjU5NTg5XCIsIFwibWlub3JcIjogXCIyMzg4XCIsIFwia2V5d29yZHNcIjp7XCJmb29kXCI6IFtcImJyZWFkXCJdfX0gICAgICAgXG4vLyAgICAgICAgIF1cbi8vICAgICB9OyJdfQ==