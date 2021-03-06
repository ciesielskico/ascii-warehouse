import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Product } from '../models/product.model';

@Injectable()
export class ProductService {

  static SORT_OPTIONS = [
    'size',
    'price',
    'id'
  ];

  private API = 'http://localhost:8000/api/';
  private productsUrl = this.API + 'products';

  constructor(
    private _http: Http
  ) { }

  /**
   * Returns a list of products
   * sort: sort by SORT_OPTIONS
   * limit: how many products to fetch
   * skip: how many products to skip (pagination0)
   */
  getProducts(sort?: string, limit?: number, skip?: number): Observable<Product[]> {
    let query = '?sort=' + sort || ProductService.SORT_OPTIONS[0];

    if (limit) {
      query += '&limit=' + limit;
    }
    
    if (skip) {
      query += '&skip=' + skip;
    }

    return this.get(this.productsUrl + query);
  }

  private get(url: string) {
    console.log('get: ' + url);
    return this._http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  /**
   * Converts new-line delimited JSON objects into a JSON array,
   * by wrapping the JSON string in '[]' brackets and replacing new-lines with commas
   * (except for the last).
   */
  private extractData(res: Response) {
    let rawJsonObjects = res.text().split('\n');

    let rawJson = '[';
    for (let i = 0; i < rawJsonObjects.length; i++) {
      let obj = rawJsonObjects[i];
      if (obj.length > 0) {
        if (i < rawJsonObjects.length - 2) {
          rawJson += rawJsonObjects[i] + ',';
        } else {
          rawJson += rawJsonObjects[i];
        }
      }
    }
    rawJson += ']';

    let body = JSON.parse(rawJson);
    console.log('got: ' + body.length + ' objects');
    return body || {};
  }

  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }

}

