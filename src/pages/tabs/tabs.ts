import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { ScannerPage } from '../scanner/scanner';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ScannerPage;
  tab3Root = AboutPage;
  tab4Root = ContactPage;

  constructor() {

  }
}
