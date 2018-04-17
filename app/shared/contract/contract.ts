export class Contract {
  location_id: number;
  customer_id: number;
  expire: Date;
  auto_authorize: number = 0;
  status: boolean;
  options = {}
  // constructor(public lat: number, public lng: number) {}
}