import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ActionSheetController } from 'ionic-angular';
import moment from 'moment';
import { ScanStorage } from '../../providers/scan-storage';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { RestProvider } from '../../providers/rest/rest';
import { Scan } from '../../model/scan';

@Component({
  selector: 'page-scanner',
  templateUrl: 'scanner.html'
})
export class ScannerPage {

  private scanForm: FormGroup;

  scanData : {};
  private options : BarcodeScannerOptions;

  constructor(  private formBuilder: FormBuilder,
                public navCtrl: NavController,
                public actionSheetCtrl: ActionSheetController,
                public scanStorage: ScanStorage,
                private barcodeScanner: BarcodeScanner,
                public rest: RestProvider,
  ) {

    this.scanForm = this.formBuilder.group({
      shop_code: ['TENBS3', Validators.required],
      isbn: ['', Validators.required],
    });

  }

  processForm(){
    this.processScan(this.scanForm.value)
  }

  processScan( scannedVals ){

    scannedVals.time = moment().format('YYYY-MM-DD HH:mm:ss');

    this.scanStorage.addAndSave(scannedVals);

  }


  scan(){
    
    this.options = {
      prompt : "Scan your barcode "
    }
    this.barcodeScanner.scan(this.options).then((barcodeData) => {
      console.log(barcodeData);
      if( barcodeData.format === 'EAN_13' ){
        this.processScan({ 
          'isbn': barcodeData.text,
          'shop_code': this.scanForm.value.shop_code,
        });

      }
      this.scanData = barcodeData;
    }, (err) => {
      console.log("Error occured : " + err);
    }); 
  }


  post( scan?: Scan ) {

    if( !scan ){
      scan = this.scanStorage.getAScan();
    }

    if( scan == null ){
      return false;
    }

    this.rest.postScan( scan.shop_code, scan.isbn )
      .subscribe( res => { 
        console.log(res);
        if( res.status === 201 ){
          // Successfully created on bookfetch server, delete from here
          this.scanStorage.deleteScan( scan.time, scan.shop_code, scan.isbn );
        } 

      }, res => {
        if ( res.status === 422 ){
          console.warn('Deleting unprocessable entity');
          this.scanStorage.deleteScan( scan.time, scan.shop_code, scan.isbn );
        }
    });
  }


  openScanMenu( scan: Scan ) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Do what?',
      buttons: [
        {
          text: 'Try post to BookFetch.co.uk',
          role: 'destructive',
          handler: () => {
            this.post( scan );
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

}
