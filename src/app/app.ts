declare var particlesJS: any;

import { Component, OnInit } from '@angular/core';
import {RouterModule, RouterOutlet } from '@angular/router';
import { authConfig } from './auth.config'; 
import { OAuthService } from 'angular-oauth2-oidc';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected title = 'gmail-smart-organizer';

  constructor(private oauthService: OAuthService) {}

  ngOnInit(): void {

    this.oauthService.configure(authConfig);

    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oauthService.hasValidAccessToken()) {
        console.log('✅ Logged in!');
      } else {
        console.warn('🚫 Not logged in');
      }
    });

    particlesJS.load('particles-js', 'assets/particles.json', () => {

    });
  }
}
  

