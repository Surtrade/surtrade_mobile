export class Product {
    id: number;
    name: string;
    code: string;
    description: string;
    keywords: any;
    image: string;
    video: string;
    remark: string;

    constructor(code, name, description=""){
        this.code = code;
        this.name = name;
        this.description = description;
    }
}

export class Shelf {
    id: number;
    beacon: string;
    active: boolean;
    code: string;
    created_dt: Date;
    keywords={};
    products: Array<Product>;
    
    constructor(code, beacon) {
        this.code = code;
        this.beacon = beacon;
    }
}

export class ProductsByRemark {
    remark: string;
    products: Product [];

    constructor(remark) {
        this.remark = remark;
    }
}