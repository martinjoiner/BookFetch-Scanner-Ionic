import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import moment from 'moment';
import { ScanStorage } from '../../providers/scan-storage';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { RestProvider } from '../../providers/rest/rest';

@Component({
  selector: 'page-scanner',
  templateUrl: 'scanner.html'
})
export class ScannerPage {

  private scanForm: FormGroup;

  scanData : {};
  private options : BarcodeScannerOptions;

  countries: string[];
  errorMessage: string;

  access_token : string = 'No access token';

  constructor(  private formBuilder: FormBuilder,
                public navCtrl: NavController,
                public scanStorage: ScanStorage,
                private barcodeScanner: BarcodeScanner,
                public rest: RestProvider
  ) {

    this.scanForm = this.formBuilder.group({
      shop_code: ['TENBS3', Validators.required],
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

  ionViewDidLoad() {
    //this.getCountries();
    this.getAccessToken();
  }

  getCountries() {
    this.rest.getCountries()
       .subscribe(
         countries => this.countries = countries,
         error =>  this.errorMessage = <any>error);
  }

  getAccessToken() {
    this.rest.getAccessToken( '1', '8MaTJ1kOd8rjtPrY6RTUN0IxxTbp7Fz91R9xLzwx', 'scanner@bookfetch.co.uk', 'secret' )
      .subscribe(
        res => this.access_token = res.access_token);
  }

  post() {

    let scan = this.scanStorage.getAScan();

    this.rest.postScan( this.access_token, scan.shop_code, scan.isbn )
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

}
