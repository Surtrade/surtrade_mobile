import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { openUrl } from "utils/utils";

import { Shelf, Product } from "../../shared/shelf/shelf";
import { ShelfService } from "../../shared/shelf/shelf.service";


@Component({
    selector: "shelf",
    providers: [ShelfService],
    templateUrl: "pages/shelf/shelf.html",
    styleUrls:["pages/shelf/shelf-common.css"] 
})
export class ShelfComponent implements OnInit {
    private _beacon: string;
    public shelf: Shelf;
    public shelfTitle: string;
    public shelfProducts: Product[];

    constructor(
        private shelfService: ShelfService,
        private route: ActivatedRoute,
        private router: RouterExtensions,
    ) { console.log("Constructing Shelf component");}

    ngOnInit(): void {
        // TODO send beacon info from prev page
        this._beacon = this.route.snapshot.params["beacon"];

        this.verifyShelf();
        
    }

    public verifyShelf(){
      this.shelfService.getShelf(this._beacon)
          .subscribe(responseShelf => {
            if (!responseShelf.message){
              this.shelf = new Shelf(responseShelf.code, responseShelf.beacon);
              this.shelf.keywords = responseShelf.keywords;

              let products = []

              responseShelf.products.forEach(product => {
                  let productObj = new Product(product.code, product.name,product.description);
                  productObj.keywords = product.keywords;
                  productObj.image = product.image;
                  productObj.video = product.video;
                  productObj.remark = product.remark;
                  
                  products.push(productObj);
              });

              this.shelf.products = products;
              this.shelfProducts = products;

              // console.log("~~~~~~~~~~~~~~~~")
              // console.log("code: "+this.shelf.code);
              // console.log("beacon: "+this.shelf.beacon);
              // console.log("kewords"+this.shelf.keywords);
              // console.log("products: "+this.shelf.products.length);
              // this.shelf.products.forEach(product => {
              //   console.log("code: "+product.code);
              //   console.log("name: "+product.name);
              //   console.log("description: "+product.description);
              //   console.log("keywords: "+product.keywords);
              //   console.log("image: "+product.image);
              //   console.log("video: "+product.video);
              // });

              this.shelfTitle = this.shelf.code;

              // console.log("~ ~ ~ ~ ~ ~ ~ ~ ~")

            }else{
              console.log("message:"+responseShelf.message);
              // alert("Contract expired.");
              this.goMain();
            }
          },error => {
            console.log("error in shelf component");
            if (error.status == 401){
              alert("No available information for this Shelf.");
            }else if (error.status != 404){
              alert("Error getting shelf by beacon information: "+error);
            }
            this.goMain();
          });
    }
    public cancel(){
        this.goMain();
      }

    public goMain(){
        this.router.navigate(["/main"], {
            // animation: true,
            transition: {
                name: "slideRight",
                duration: 200,
                curve: "linear"
            }
          });
      }

    public playVideo(video){
      openUrl(video);
    }
}