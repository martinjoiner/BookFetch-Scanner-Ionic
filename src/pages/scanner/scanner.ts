import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import moment from 'moment';
import { ScanStorage } from '../../providers/scan-storage';

@Component({
  selector: 'page-scanner',
  templateUrl: 'scanner.html'
})
export class ScannerPage {

  private scanForm: FormGroup;

  constructor(  private formBuilder: FormBuilder,
                public navCtrl: NavController,
                public scanStorage: ScanStorage
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

  processScan(){

    var scan = this.scanForm.value;
    scan.time = moment().format('YYYY-MM-DD HH:mm:ss');

    this.scanStorage.addAndSave(scan);

  }

}
