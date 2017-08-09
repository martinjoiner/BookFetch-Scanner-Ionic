import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Scan } from '../model/scan';

/**
 * Accepts any old crap (pulled from storage, possibly 
 * from a previous version of the app) and
 * either returns a valid instance of Scan of null
 */
@Injectable()
export class ScanStorage {

  private storageKey: string = 'scans';
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
    // If it hasn't got which shop it was recorded in, it's useless to us
    if( typeof vals.shop === 'undefined' ){
      return null;
    }
    if( typeof vals.time === 'undefined' ){
      vals.time = '2017-05-03 21:21:00';
    }
    // In version 2 of the app martin was called george
    if( typeof vals.george === 'string' ){
      vals.martin = vals.george;
    }
    if( typeof vals.martin === 'undefined' ){
      vals.martin = 1;
    }
    this.scans.push( vals );
  }

  /**
   * For adding a properly structured Scan object to the array
   */
  addAndSave ( vals: Scan ) {
    this.scans.push( vals );
    this.save();
  }

  save () {
    // Save to storage
    this.storage.set(this.storageKey, JSON.stringify(this.scans) );
  }

}
