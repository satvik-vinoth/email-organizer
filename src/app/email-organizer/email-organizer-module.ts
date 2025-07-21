import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailOrganizerRoutingModule } from './email-organizer-routing-module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    EmailOrganizerRoutingModule,
    ReactiveFormsModule
  ]
})
export class EmailOrganizerModule { }
