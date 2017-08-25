import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Scan } from '../../model/scan';

/**
 * Accepts any old crap (pulled from storage, possibly 
 * from a previous version of the app) and
 * either returns a valid instance of Scan of null
 */
@Injectable()
export class ScansProvider {

  private readonly storageKey: string = 'scans';

  public scans: Scan[] = [];

  constructor( private storage: Storage ) { 
    // Pull from storage
    this.storage.get(this.storageKey).then((scans) => {
      var storedScans = JSON.parse(scans);
      if( storedScans != null ){
        for( let i in storedScans) {
          this.normaliseScan( storedScans[i] );
        }
        this.save();
      }
    });
  }

  /**
   * Takes an object representing a single scan, possibly created by a 
   * previous version of the app, and adds/converts the things needed.
   */
  normaliseScan ( vals ) {

    // Use this function to add/rename fields that may be absent in stored data from previous versions

    this.scans.push( vals );
  }

  /**
   * For adding a properly structured Scan object to the array
   */
  addAndSave ( vals: Scan ) {
    
    this.scans.push( vals );
    this.save();
  }

  /**
   * Save the Scan queue to storage
   */
  save () {
    this.storage.set(this.storageKey, JSON.stringify(this.scans) );
  }

  /**
   * Returns a scan from the queue
   */
  getAScan () : Scan {
    if( this.scans.length > 0 ){
      return this.scans[0];
    }
    return null;
  }

  deleteScan ( time: string,
               shop_code: string, 
               isbn: string ) : boolean {
    let deleted = false;
    // Iterate over the scans array,
    for( let i = 0, iLimit = this.scans.length; i < iLimit; i++ ){
      // Delete scans with matching time, shop_code and isbn
      if( this.scans[i].time == time && this.scans[i].shop_code == shop_code && this.scans[i].isbn == isbn ){
        this.scans.splice(i, 1);
        deleted = true;
        break;
      }
    }
    this.save();
    return deleted;
  }

}
