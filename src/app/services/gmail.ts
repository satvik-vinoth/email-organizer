import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from './auth';
import { firstValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class Gmail {

  
  constructor(private http: HttpClient, private auth:Auth) { }

  async getLatestEmails(maxResults?: number): Promise<any[]> {
    const token = this.auth.accessToken;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    const allMessages: any[] = [];
    let pageToken: string | undefined = undefined;
  
    do {
      let url = `https://gmail.googleapis.com/gmail/v1/users/me/messages`;
      const params: any = { headers };
  
      url += `?${maxResults ? `maxResults=${maxResults}` : 'maxResults=100'}`;
      if (pageToken) url += `&pageToken=${pageToken}`;
  
      const response: any = await firstValueFrom(this.http.get(url, params));
      const messages = response.messages || [];
  
      for (const msg of messages) {
        const msgDetail: any = await firstValueFrom(this.http.get(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
          { headers }
        ));
  
        allMessages.push(msgDetail);
      }
  
      pageToken = maxResults ? undefined : response.nextPageToken;
  
    } while (!maxResults && pageToken);
  
    return allMessages;
  }

  async getInboxEmails(maxResults?: number): Promise<any[]> {
    return this.getEmailsByLabel('INBOX', maxResults);
  }
  
  async getUnreadEmails(maxResults?: number): Promise<any[]> {
    return this.getEmailsByLabel('UNREAD', maxResults);
  }
  
  private async getEmailsByLabel(label: string, maxResults?: number): Promise<any[]> {
    const token = this.auth.accessToken;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    const allMessages: any[] = [];
    let pageToken: string | undefined = undefined;
  
    do {
      let url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?labelIds=${label}`;
      if (maxResults) url += `&maxResults=${maxResults}`;
      else url += `&maxResults=100`;
      if (pageToken) url += `&pageToken=${pageToken}`;
  
      const response: any = await firstValueFrom(this.http.get(url, { headers }));
      const messages = response.messages || [];
  
      for (const msg of messages) {
        const msgDetail: any = await firstValueFrom(this.http.get(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
          { headers }
        ));
  
        allMessages.push(msgDetail);
      }
  
      pageToken = maxResults ? undefined : response.nextPageToken;
  
    } while (!maxResults && pageToken);
  
    return allMessages;
  }

  async getEmailsByDateRange(from: string, to: string): Promise<any[]> {
    const token = this.auth.accessToken;
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const after = Math.floor(new Date(from).getTime() / 1000);
    const before = Math.floor(new Date(to).getTime() / 1000) + + 86400;
  
    const query = `after:${after} before:${before}`;
    const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${query}`;
  
    const response: any = await firstValueFrom(this.http.get(url, { headers }));
    const messages = response.messages || [];
  
    const emailDetails = [];
  
    for (const msg of messages) {
      const msgDetail: any = await firstValueFrom(
        this.http.get(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, { headers })
      );
      emailDetails.push(msgDetail);
    }
    return emailDetails;
  }

  async getAllLabels(): Promise<any[]> {
    const token = this.auth.accessToken;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    const url = `https://gmail.googleapis.com/gmail/v1/users/me/labels`;
    const response: any = await firstValueFrom(this.http.get(url, { headers }));
    return response.labels;
  }

  async searchSentEmails(to: string, maxResults: number = 10): Promise<any[]> {
    const token = this.auth.accessToken;
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  
    const query = `to:${to} in:sent`;
    const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=${maxResults}`;
  
    const response: any = await firstValueFrom(this.http.get(url, { headers }));
    const messages = response.messages || [];
  
    const detailedEmails = [];
  
    for (const msg of messages) {
      const msgDetail: any = await firstValueFrom(
        this.http.get(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, { headers })
      );
      detailedEmails.push(msgDetail);
    }
  
    return detailedEmails;
  }

  async sendEmail(to: string, subject: string, body: string): Promise<any> {
    const token = this.auth.accessToken;
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    const message = [
      `To: ${to}`,
      'Content-Type: text/html; charset=UTF-8',
      `Subject: ${subject}`,
      '',
      body
    ].join('\n');
  
    const base64EncodedEmail = btoa(unescape(encodeURIComponent(message)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, ''); 
  
    const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/send`;
    const payload = { raw: base64EncodedEmail };
  
    return await firstValueFrom(this.http.post(url, payload, { headers }));
  }

  decodeBase64(encoded: string): string {
    const decoded = atob(encoded.replace(/-/g, '+').replace(/_/g, '/'));
    try {
      return decodeURIComponent(escape(decoded));
    } catch {
      return decoded;
    }
  }
  
  extractPlainText(payload: any): string {
    if (!payload) return '';
    if (payload.parts && payload.parts.length) {
      for (const part of payload.parts) {
        if (part.mimeType === 'text/plain' && part.body?.data) {
          return this.decodeBase64(part.body.data);
        }
      }
    }
  
    return '';
  }
  
  
}
