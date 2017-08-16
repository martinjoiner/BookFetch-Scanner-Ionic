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

  accessToken : string = 'No access token';

  constructor(  private formBuilder: FormBuilder,
                public navCtrl: NavController,
                public scanStorage: ScanStorage,
                private barcodeScanner: BarcodeScanner,
                public rest: RestProvider
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

  ionViewDidLoad() {
    this.getCountries();
    this.getAccessToken();
  }

  getCountries() {
    this.rest.getCountries()
       .subscribe(
         countries => this.countries = countries,
         error =>  this.errorMessage = <any>error);
  }

  getAccessToken() {
    this.rest.getAccessToken( 'fdjskl', '', 'BookFetch Scanner', 'flug9' )
      .subscribe(
        res => {
          console.log(res);
        }
        //accessToken => this.accessToken = accessToken
      );
  }

  // post(){
  //   this.http.post("https://httpbin.org/post", "firstname=Nic")
  //   .subscribe(data => {
  //       this.postMessage = data.json().data;

  //     }, error => {
  //       console.log(JSON.stringify(error.json()));
  //   });
  // }

}
