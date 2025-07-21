import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Gmail } from '../../services/gmail';

@Component({
  selector: 'app-group-details',
  imports: [ReactiveFormsModule],
  templateUrl: './group-details.html',
  styleUrl: './group-details.css'
})
export class GroupDetails implements OnInit{
  emails: any[] = [];
  groupName: string = '';
  keywords: string[] = [];
  dateForm!: FormGroup;
  show=false;

  constructor(private gmail:Gmail,private route: ActivatedRoute,private fb: FormBuilder) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.groupName = params.get('groupName') || '';
      const keywordString = params.get('keywords') || '';
      this.keywords = keywordString.split(',').map(k => k.trim());
    });
    this.dateForm = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
    });
  }
  showEmails(): void {
    const { fromDate, toDate } = this.dateForm.value;
  
    if (this.dateForm.valid) {
      this.gmail.getEmailsByDateRange(fromDate, toDate).then((emails) => {
        const matchedEmails = emails.filter(email => {
          const subject = this.getHeader(email.payload.headers, 'Subject') || '';
          const body = this.gmail.extractPlainText(email.payload) || '';
          const combinedText = (subject + ' ' + body).toLowerCase();

          return this.keywords.some(keyword => {
            const lowerKeyword = keyword.toLowerCase();
            return combinedText.includes(lowerKeyword);
          });
        });
  
        this.emails = matchedEmails;
        this.show = true;
      });
    }
  }
  
          
  decodeHtmlEntities(text: string): string {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }
  getHeader(headers: any[], name: string): string {
    return headers.find(h => h.name === name)?.value || '';
  }
}
