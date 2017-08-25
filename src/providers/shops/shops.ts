import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { RestProvider } from '../../providers/rest/rest';
import { Storage } from '@ionic/storage';

/*
  Generated class for the ShopsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ShopsProvider {

  private readonly storageKey: string = 'scans';

  public shops = [];

  constructor(  public http: Http,
                public rest: RestProvider,
                private storage: Storage ) {

    // Pull shops from storage
    this.storage.get(this.storageKey).then( shops => {
      this.shops = JSON.parse(shops);
    });

  }

  refresh() {
    this.rest.getShops().subscribe(
      res => {
        if( res.status == 200 ){
          this.shops = res.json();
          this.save();
        }
      }
    );
  }

  /**
   * Save the Scan queue to storage
   */
  save() {
    this.storage.set(this.storageKey, JSON.stringify(this.shops) );
  }

}
