import { Injectable, OnInit } from '@angular/core';
import { Category } from '../model/category';
import { Product } from '../model/product';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { throwError as observableThrowError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Cart } from '../model/cart';

@Injectable({
  providedIn: 'root',
})
export class DataObjectService {
  public data: any = [];
  public products: Product[] = [];
  public cart: Cart[] = [];

  constructor(private http: HttpClient) {}

  getCategorysData(): Observable<Category> {
    return this.http.get<Category>('http://localhost:8080/categories').pipe(
      tap((data) => data),
      catchError(this.errorHandler)
    );
  }

 
  getProductsData(): Observable<Product[]> {
    return this.http.get<Product[]>('http://localhost:8080/Products').pipe(
      tap((products) => products),
      catchError(this.errorHandler)
    );
  }

  getCartData(): Observable<Cart[]> {
    return this.http.get<Cart[]>('http://localhost:8080/Cart').pipe(
      tap((cart) => cart),
      catchError(this.errorHandler)
    );
  }

  errorHandler(error: HttpErrorResponse) {
    return observableThrowError(error.message || 'Server Error');
  }

  saveCartData(cartProducts: Cart) {
    this.http
      .post('http://localhost:8080/cart', cartProducts)
      .subscribe((res: Response) => {});
    console.log(' Product Added to Cart Successfully');
  }

  async checkForExistence(id: number) {
    this.cart = await this.getCartData().toPromise();
    for (let i = 0; i < this.cart.length; i++) {
      if (this.cart[i].id == id) {
        return this.cart[i].count;
      }
    }
    return -1;
  }
  updateCart(cartProduct: Cart) {
    return this.http.put(
      'http://localhost:8080/cart/' + cartProduct.id,
      cartProduct
    );
  }

  deleteCart(id: number) {
    return this.http.delete('http://localhost:8080/cart/' + id);
  }
}
