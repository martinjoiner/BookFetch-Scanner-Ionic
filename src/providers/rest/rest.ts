import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

/*
  Generated class for the RestProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class RestProvider {

  private apiUrl = 'https://restcountries.eu/rest/v2/all';
  private bookFetchUrl = 'http://loc.bookfetch.co.uk/';

  constructor(public http: Http) { }

  getCountries(): Observable<string[]> {
    return this.http.get(this.apiUrl)
                  .map(this.extractData)
                  .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    console.log(body);
    return body || { };
  }

  private handleError (error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  private buildRequestOptions( access_token?: string ){
    let headerData = {'Content-Type': 'application/x-www-form-urlencoded',
                                //'User-Agent': 'BookFetch Scanner App v1.0'
                              };

    if( access_token ){
      headerData['Authorization'] = 'Bearer ' + access_token;
    }

    let headers = new Headers(headerData);

    return new RequestOptions({headers: headers});
  }

  getAccessToken( client_id: string, 
                  client_secret: string, 
                  username: string, 
                  password: string): Observable<any>{

    let options = this.buildRequestOptions();
    
    let url = this.bookFetchUrl + 'oauth/token';  

    // Construct the data 
    let body = 'grant_type=password' +
      '&client_id=' + client_id +
      '&client_secret=' + client_secret +
      '&username=' + username +
      '&password=' + password +
      '&scope=' + '';
    
    return this.http.post( url, body, options )
                  .map(this.extractData)
                  .catch(this.handleError);

  }

  postScan( access_token:string, 
            shop_code: string, 
            isbn: string ){

    let options = this.buildRequestOptions(access_token);

    let url = this.bookFetchUrl + 'api/scan';

    let body = 'isbn=' + isbn + 
      '&shop_code=' + shop_code;

    return this.http.post(url, body, options );

  }

}
