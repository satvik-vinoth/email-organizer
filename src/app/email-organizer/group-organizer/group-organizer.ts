import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  imports:[CommonModule,ReactiveFormsModule],
  selector: 'app-group-organizer',
  templateUrl: './group-organizer.html',
  styleUrls: ['./group-organizer.css']
})
export class GroupOrganizer implements OnInit{
  showCreateGroup = false;
  groupForm: FormGroup;
  groups: any[] = [];

  groupGradients: string[] = [
    'linear-gradient(to right,rgb(255, 203, 205),rgb(255, 132, 98))',
    'linear-gradient(to right, #a1c4fd,rgb(29, 137, 183))',
    'linear-gradient(to right, #fbc2eb, #a6c1ee)',
    'linear-gradient(to right, #ff00cc, #333399)',
    'linear-gradient(to right, #2196f3, #f44336)',
    'linear-gradient(to right, #84fab0, #8fd3f4)',
    'linear-gradient(to right, #bdc3c7, #2c3e50)'
  ];
  

  constructor(private fb: FormBuilder, private router: Router) {
    this.groupForm = this.fb.group({
      name: ['', Validators.required],
      keywords: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const savedGroups = localStorage.getItem('emailGroups');
    if (savedGroups) {
      this.groups = JSON.parse(savedGroups);
    }
  }

  openCreateGroupPopup() {
    this.showCreateGroup = true;
  }

  closeCreateGroupPopup() {
    this.showCreateGroup = false;
    this.groupForm.reset();
  }

  createGroup() {
    if (this.groupForm.valid) {
      const { name, keywords } = this.groupForm.value;
      const keywordsArray = keywords.split(',').map((k: string) => k.trim());

      this.groups.push({ name, keywords: keywordsArray });
      localStorage.setItem('emailGroups', JSON.stringify(this.groups));

      this.closeCreateGroupPopup();
    }
  }

  goToGroup(group: any) {
    this.router.navigate(['/organizer/group'], {
      queryParams: {
        keywords: group.keywords.join(','),
        groupName: group.name
      }
    });
  }

  deleteGroup(index: number) {
    this.groups.splice(index, 1);
    localStorage.setItem('emailGroups', JSON.stringify(this.groups));
  }
  
}
