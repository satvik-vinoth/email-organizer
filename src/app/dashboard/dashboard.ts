import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Gmail } from '../services/gmail';
import { MatButtonModule } from '@angular/material/button';
import {  Router } from '@angular/router';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,MatButtonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  emails: any[] = [];
  loading=true;
  constructor(private gmail:Gmail,private router: Router,private auth:Auth){}

  async ngOnInit(){
    try{

      this.emails = await this.gmail.getInboxEmails(20);
  } catch (error){
    console.error('Failed to fetch mail',error)
  }finally{
    this.loading = false;
  }
  }

  getHeader(headers: any[], name: string): string {
    return headers.find(h => h.name === name)?.value || '';
  }
  Insights(){
    this.router.navigate(['/insights']);
  }
  compose(){
    this.router.navigate(['/compose']);
  }
  logout(){
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  decodeHtmlEntities(text: string): string {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }

  organize(){
    this.router.navigate(['/organizer']);
  }
  
  

}
