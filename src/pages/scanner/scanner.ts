import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import moment from 'moment';
import { ScanStorage } from '../../providers/scan-storage';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';

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
                public scanStorage: ScanStorage,
                private barcodeScanner: BarcodeScanner
  ) {

    this.scanForm = this.formBuilder.group({
      shop: ['nes', Validators.required],
      isbn: ['', Validators.required],
      condition: [''],
    });

    // this.scanStorage.normaliseScan({ 'sausage': 'fish' });

    // this.scanStorage.normaliseScan({ 
    //   'shop': 'Saaaffille Init',
    //   'isbn': '939393',
    //   'condition': '',
    //   'time': '2017-08-07 06:33:43'
    // });
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
          'shop': 'Cancer Research',
          'condition': ''
        });

      }
      this.scanData = barcodeData;
    }, (err) => {
      console.log("Error occured : " + err);
    }); 
  }

}
