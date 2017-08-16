import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

/*
  Generated class for the RestProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class RestProvider {

  private apiUrl = 'https://restcountries.eu/rest/v2/all';

  constructor(public http: Http) {
    console.log('Hello RestProvider Provider');
  }

  getCountries(): Observable<string[]> {
    return this.http.get(this.apiUrl)
                  .map(this.extractData)
                  .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
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

  getAccessToken( client_id: string, 
                  client_secret: string, 
                  username: string, 
                  password: string){

    let headers = new Headers();

    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    //headers.append('User-Agent', 'BookFetch Scanner App v1.0');
    
    let url = 'http://bookfetch.co.uk/oauth/token';

    // Construct the data 
    let data = {
      'grant_type': 'password',
      'client_id': client_id,
      'client_secret': client_secret,
      'username': username,
      'password': password,
      'scope': ''
    };
    
    return this.http.post( url, JSON.stringify(data), {headers: headers} )
                  .map(this.extractData);
                  //.catch(this.handleError);

  }

}
