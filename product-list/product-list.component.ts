import { Component, OnInit } from '@angular/core';
import {Product} from "../../common/product";
import {ProductService} from "../../services/product.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {


products: Product[]= [];
currentCategoryId: number | undefined;
searchMode: boolean | undefined;

  constructor(private productService: ProductService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
    this.listProducts();
  });
  }

listProducts(){
    this.searchMode = this.route.snapshot.paramMap.has('keyword')
    if (this.searchMode){
      this.handleSearchProducts();
    }
    else{
       this.handleListProducts();
    }
}

  handleSearchProducts() {
    const theKeyword: string | null = this.route.snapshot.paramMap.get('keyword');

    if (theKeyword) {
      // Now search for the products using keyword
      this.productService.searchProducts(theKeyword).subscribe(
        data => {
          this.products = data;
        },
        error => {
          console.error('Error fetching products', error);
        }
      );
    } else {
      console.error('Keyword is null');
    }
  }


  handleListProducts() {

    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId){
      //get the "id" param string. convert string to a number sing the "+" symbol


      // @ts-ignore
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    }
    else{
      // not category id available ... default to category id 1
      this.currentCategoryId = 1;
    }
    // now get the products for the given category id
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data =>{
        this.products = data;
      })

  }

  addToCart(theProduct: Product){
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`)
  }
}
