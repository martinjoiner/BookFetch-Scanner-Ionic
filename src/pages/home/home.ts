import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  horses: Array<object> = [];

  constructor(  public navCtrl: NavController, 
                public actionSheetCtrl: ActionSheetController,
                public alertCtrl: AlertController 
  ) {
    
    this.horses = [ 
      { name: 'Lightning' }, 
      { name: 'Nelly' },
      { name: 'Donkey' },
    ];
    
  }

  openMenu() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Modify your album',
      buttons: [
        {
          text: 'Add Horse',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
            this.horses.push( { name: 'Redrum' } );
          }
        },{
          text: 'Destoy Horse',
          handler: () => {
            console.log('Archive clicked');
            var pointer = Math.floor( Math.random() * this.horses.length);
            this.horses.splice( pointer, 1 );
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
