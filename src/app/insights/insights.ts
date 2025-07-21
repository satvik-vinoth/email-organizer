import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Gmail } from '../services/gmail';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';


@Component({
  selector: 'app-insights',
  imports: [CommonModule, ReactiveFormsModule,NgChartsModule],
  templateUrl: './insights.html',
  styleUrl: './insights.css'
})
export class Insights implements OnInit{
  labelMap: { [id: string]: string } = {};
  labelCounts: { [category: string]: number } = {};
  dateForm!: FormGroup;
  results!: any;
  total!: number;
  public pieChartLabels: string[] = [];
  public pieChartType: 'pie' = 'pie'; 


  public pieChartData: ChartData<'pie'> = {
    datasets: [
      {
        data: [11, 11],
        backgroundColor: ['#c44d6f', '#2e86c1'],
        borderWidth: 0 
      }
    ]
  };
  

  
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'white',
          font: {
            size: 14,
            weight: 'bold'
          },
        }
      },
    },
  };



  constructor(private gmail:Gmail,private fb: FormBuilder){}

  ngOnInit(): void {
    this.dateForm = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
    });
    this.gmail.getAllLabels().then(labels => {
      for (const label of labels) {
        this.labelMap[label.id] = label.name;
      }
    });
  }
  analyzeEmails() {
    const { fromDate, toDate } = this.dateForm.value;

    if (this.dateForm.valid) {
      this.gmail.getEmailsByDateRange(fromDate, toDate).then((emails) => {
        this.total=emails?.length
        this.results=this.analyzeSenders(emails)
        this.analyzeLabels(emails);
        this.updatePieChart();
      });
    }
    
  }
  analyzeSenders(emailDetails: any[]) {
    const senderMap: {
      [email: string]: {
        count: number;
        lastContacted: number; 
        labelId?: string;
      }
    } = {};
  
    const categories = [
      'CATEGORY_PRIMARY',
      'CATEGORY_PROMOTIONS',
      'CATEGORY_SOCIAL',
      'CATEGORY_UPDATES',
      'CATEGORY_FORUMS'
    ];
  
    for (const email of emailDetails) {
      const fromHeader = email.payload.headers.find((h: any) => h.name === 'From');
      const timestamp = parseInt(email.internalDate); 
      if (!fromHeader || isNaN(timestamp)) continue;
  
      const match = fromHeader.value.match(/<(.+?)>/);
      const emailAddr = match ? match[1].toLowerCase() : fromHeader.value.toLowerCase();
  
      const categoryLabels = email.labelIds?.filter((labelId: string) => labelId.startsWith("CATEGORY_")) || [];

  
      if (!senderMap[emailAddr]) {
        senderMap[emailAddr] = {
          count: 1,
          lastContacted: timestamp,
          labelId: categoryLabels
        };
      } else {
        senderMap[emailAddr].count += 1;
        if (timestamp > senderMap[emailAddr].lastContacted) {
          senderMap[emailAddr].lastContacted = timestamp;
        }
        if (!senderMap[emailAddr].labelId && categoryLabels) {
          senderMap[emailAddr].labelId = categoryLabels;
        }
      }
    }
  
    const results = Object.entries(senderMap).map(([email, info]) => ({
      email,
      count: info.count,
      lastContacted: new Date(info.lastContacted).toLocaleString(),
      label: this.labelMap[info.labelId || ''] || 'Unknown'
    }));
    results.sort((a, b) => b.count - a.count);
    return results;
  }
  

  analyzeLabels(emailDetails: any[]) {
    const labelCounts: { [labelId: string]: number } = {};
  
    const categories = [
      'CATEGORY_PRIMARY',
      'CATEGORY_PROMOTIONS',
      'CATEGORY_SOCIAL',
      'CATEGORY_UPDATES',
      'CATEGORY_FORUMS'
    ];
  
    for (const email of emailDetails) {
      if (!email.labelIds) continue;

      const categoryLabels = email.labelIds?.filter((labelId: string) => labelId.startsWith("CATEGORY_")) || [];
      if (categoryLabels) {
        for (const categoryLabel of categoryLabels){
        labelCounts[categoryLabel] = (labelCounts[categoryLabel] || 0) + 1;
      }
      }
    }
  
    this.labelCounts = labelCounts;
    this.updatePieChart(); 
  }
  

  updatePieChart() {
    this.pieChartData = {
      labels: Object.keys(this.labelCounts).map(id => this.labelMap[id] || id),
      datasets: [
        {
          data: Object.values(this.labelCounts),
        },
      ],
    };
  }
  
  

}
