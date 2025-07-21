import { Injectable } from '@angular/core';
import {OAuthService,AuthConfig} from 'angular-oauth2-oidc';
import { authConfig } from '../auth.config';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  constructor(public oauthService:OAuthService,private router:Router) {
      this.oauthService.configure(authConfig);
      this.oauthService.setStorage(sessionStorage); 
      this.oauthService.loadDiscoveryDocumentAndTryLogin();
   }
   login() {
    this.oauthService.logOut();
    this.oauthService.initLoginFlow();
    setTimeout(() => {
      const claims = this.oauthService.getIdentityClaims();
    }, 1000);
  }
  
  logout() {
    this.oauthService.revokeTokenAndLogout().then(() => {
      this.router.navigate(['/login']);
    });
  }
  
   isLoggedIn():boolean{
    return this.oauthService.hasValidAccessToken();
   }
   get accessToken(): string {
    return this.oauthService.getAccessToken();
   }
   
}
