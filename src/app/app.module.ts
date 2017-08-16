import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';

import { AboutPage } from '../pages/about/about';
import { ScannerPage } from '../pages/scanner/scanner';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { ScanStorage } from '../providers/scan-storage';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { HttpModule } from '@angular/http';
import { RestProvider } from '../providers/rest/rest';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ScannerPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ScannerPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ScanStorage,
    BarcodeScanner,
    RestProvider,
  ]
})
export class AppModule {}
