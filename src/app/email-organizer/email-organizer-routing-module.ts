import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupOrganizer } from './group-organizer/group-organizer';
import { GroupDetails } from './group-details/group-details';

const routes: Routes = [
  { path: '', component: GroupOrganizer },
  { path: 'group', component: GroupDetails }

  
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailOrganizerRoutingModule { }
