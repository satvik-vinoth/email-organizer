import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  redirectUri: window.location.origin,
  clientId: '601461228422-juptkj18s6lm70tfn9lo2od9fbrmelj3.apps.googleusercontent.com',
  scope: 'openid profile email https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.send',
  strictDiscoveryDocumentValidation: false,
  showDebugInformation: true,
  customQueryParams: {
    prompt: 'consent', 
  }
};
