declare var webkitSpeechRecognition: any;
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Gmail } from '../services/gmail';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-compose',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './compose.html',
  styleUrl: './compose.css'
})
export class Compose {
  isListening = false;
  recognition: any;
  composeForm!: FormGroup;
  pastEmails: any[] = [];
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private gmail: Gmail) {}

  ngOnInit(): void {
    this.composeForm = this.fb.group({
      to: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      body: ['', Validators.required]
    });

    // Watch 'to' field and fetch past emails
    this.composeForm.get('to')?.valueChanges.subscribe(async (value) => {
      if (this.composeForm.get('to')?.valid) {
        this.pastEmails = await this.gmail.searchSentEmails(value);
      } else {
        this.pastEmails = [];
      }
    });
  }

  async sendEmail() {
    if (this.composeForm.invalid) {
      this.composeForm.markAllAsTouched();
      return alert('Please fill all fields correctly.');
    }

    const { to, subject, body } = this.composeForm.value;

    try {
      await this.gmail.sendEmail(to, subject, body);
      alert('Email sent!');
      this.composeForm.reset();
      this.pastEmails = [];
    } catch (err: any) {
      console.error('Full error:', err);
      console.error('Gmail API Message:', err?.error?.error?.message);
      alert('Failed to send email: ' + (err?.error?.error?.message || 'Unknown error'));
    }
    
  }

  getSubject(email: any): string {
    const header = email.payload.headers.find((h: any) => h.name === 'Subject');
    return header?.value || '(No Subject)';
  }

  loadEmail(email: any): void {
    const subject = this.getSubject(email);
    const body = email.snippet || '';
  
    this.composeForm.patchValue({
      subject: this.decodeHtmlEntities(subject),
      body: this.decodeHtmlEntities(body)
    });
  }

  startListening() {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech Recognition not supported in this browser.');
      return;
    }
  
    this.recognition = new webkitSpeechRecognition();
    this.recognition.lang = 'en-US';
    this.recognition.interimResults = true; // Optional: show partial results
    this.recognition.continuous = true;
  
    let finalTranscript = this.composeForm.get('body')?.value || '';
  
    this.recognition.onstart = () => {
      this.isListening = true;
    };
  
    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += ' ' + transcript;
        } else {
          interimTranscript += transcript;
        }
      }
  
      this.composeForm.patchValue({
        body: finalTranscript + ' ' + interimTranscript
      });
    };
  
    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
      alert('Speech recognition error: ' + event.error);
    };
  
    this.recognition.onend = () => {
      this.isListening = false;
    };
  
    this.recognition.start();
  }
  
  stopListening() {
    if (this.recognition) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  decodeHtmlEntities(text: string): string {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }
  
  
}

