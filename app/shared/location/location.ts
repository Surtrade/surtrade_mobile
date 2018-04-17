export class Location {
  documetType: string = "location";
  address: string;
  ne_lat: number;
  ne_lng: number;
  sw_lat: number;
  sw_lng: number;
  type: string;
  name: string;
  id: number;
  constructor(public lat: number, public lng: number) {}
}