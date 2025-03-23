import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { OverviewComponent } from './overview/overview.component';

export default [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
      { 
        path: 'accounts',
        loadChildren: () => import('./accounts/accounts.routes')
      },
      { 
        path: 'transactions',
        loadChildren: () => import('./transactions/transactions.routes')
      }
    ]
  }
] satisfies Routes;
