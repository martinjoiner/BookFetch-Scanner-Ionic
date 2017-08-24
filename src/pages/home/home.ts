import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AlertController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  const 

  private loginForm: FormGroup;

  public login_failed: boolean = false;

  constructor(  private formBuilder: FormBuilder,
                public navCtrl: NavController, 
                public alertCtrl: AlertController,
                public rest: RestProvider, 
  ) {

    this.loginForm = this.formBuilder.group({
      username: ['scanner@bookfetch.co.uk', Validators.required],
      password: ['', Validators.required],
    });
    
  }

  processLoginForm() {
    this.login_failed = false;
    this.getAccessToken( this.loginForm.value.username, this.loginForm.value.password );
  }

  getAccessToken( username: string, 
                  password: string ) {
    this.rest.getAccessToken( username, password )
      .subscribe(
        res => { 
          this.rest.setAccessToken(res.json().access_token); 
          console.log(res); 
        },
        res => {
          if( res.status == 401 ){
            this.login_failed = true;
          } 
        }
      );
  }

  discardToken() {
    this.rest.discardAccessToken();
  }

}
