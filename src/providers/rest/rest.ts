import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
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

  private readonly client_id : string = '1'; 
  private readonly client_secret : string = '8MaTJ1kOd8rjtPrY6RTUN0IxxTbp7Fz91R9xLzwx'; 

  private readonly storageKey: string = 'access_token';

  private readonly bookFetchUrl = 'http://bookfetch.co.uk/';
  
  public access_token: string;

  constructor(  public http: Http,
                private storage: Storage ) {
    // Pull access_token from storage
    this.storage.get(this.storageKey).then( access_token => {
      this.access_token = access_token
    });
  }

  private extractData(res: Response) {
    let body = res.json();
    console.log(body);
    return body || { };
  }

  private handleError(error: Response | any) {
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

  private buildRequestOptions( access_token?: string,
                                contentType: string = 'application/x-www-form-urlencoded' ) : RequestOptions {
    let headerData = {  'Content-Type': contentType
                        //'User-Agent': 'BookFetch Scanner App v1.0'
                      };

    if( access_token ){
      headerData['Authorization'] = 'Bearer ' + access_token;
    }

    let headers = new Headers(headerData);

    return new RequestOptions({headers: headers});
  }

  getAccessToken( username: string, 
                  password: string): Observable<any>{

    let options = this.buildRequestOptions();
    
    let url = this.bookFetchUrl + 'oauth/token';  

    // Construct the data 
    let body = 'grant_type=password' +
      '&client_id=' + this.client_id +
      '&client_secret=' + this.client_secret +
      '&username=' + username +
      '&password=' + password +
      '&scope=' + '';
    
    return this.http.post( url, body, options );
  }

  postScan( shop_code: string, 
            isbn: string ){

    let options = this.buildRequestOptions(this.access_token);

    let url = this.bookFetchUrl + 'api/scan';

    let body = 'isbn=' + isbn + 
      '&shop_code=' + shop_code;

    return this.http.post(url, body, options );

  }

  getShops() {
    let options = this.buildRequestOptions(this.access_token, 'application/json');

    let url = this.bookFetchUrl + 'api/myStockableShops';

    return this.http.get(url, options );
  }

  setAccessToken( newToken: string ) {
    this.access_token = newToken;
    this.save();
  }

  discardAccessToken() {
    this.access_token = null;
    this.save();
  }

  /**
   * Save the Scan queue to storage
   */
  save() {
    this.storage.set(this.storageKey, this.access_token );
  }

}
