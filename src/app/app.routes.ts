import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { Insights } from './insights/insights';
import { Compose } from './compose/compose';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {path:'login',component:Login},
    {path:'dashboard',component:Dashboard},
    {path:'insights',component:Insights},
    {path:'compose',component:Compose},
    { path: 'organizer', loadChildren: () => import('./email-organizer/email-organizer-module').then(m => m.EmailOrganizerModule) },
];
