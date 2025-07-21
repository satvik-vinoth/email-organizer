

import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Auth } from '../services/auth';
import {  Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';



@Component({
  selector: 'app-login',
  imports: [CommonModule,MatButtonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],

})
export class Login implements OnInit{
  
  constructor(private auth:Auth,private router: Router){

  }
  
  ngOnInit() {
    this.auth.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.auth.isLoggedIn()) {
        this.router.navigate(['/dashboard']);
      }
    });

  }
  login(){
    this.auth.login();
  }

}
