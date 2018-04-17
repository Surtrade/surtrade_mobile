export class Beacon {
    id: string;
    identificator: string;
    name: string;
    major: string;
    minor: string;
    role: string;
    active: boolean;
    keywords={};
    location_id: string;
    constructor(_major, _minor) {
        // this.id = _id;
        this.major = _major;
        this.minor = _minor;
        this.identificator = _major+_minor;
        // this.active = _active;
    }
  }

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