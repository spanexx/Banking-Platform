import { Routes } from '@angular/router';
import { SignInComponent } from './components/pages/sign-in/sign-in.component';
import { SignUpComponent } from './components/pages/sign-up/sign-up.component';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './components/pages/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { 
    path: 'dashboard', 
    loadChildren: () => import('./components/pages/dashboard/dashboard.routes'),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/sign-in' }
];
