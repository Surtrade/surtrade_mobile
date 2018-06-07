export class Interest {
    id: string;
    customer_id: string;
    beacon: string;
    start: Date;
    end: Date;
    creating: boolean;
    active: boolean;
    keywords={};
    constructor(_customer_id, _beacon, _start = new Date(), _end = new Date()) {
        this.customer_id = _customer_id;
        this.beacon = _beacon;
        this.start = _start;
        this.end = _end;
        this.creating = true;
        this.active=true;
    }
  }