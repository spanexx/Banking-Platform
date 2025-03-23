import { Routes } from '@angular/router';
import { AccountsComponent } from './accounts.component';
import { AccountsListComponent } from './accounts-list/accounts-list.component';

export default [
  {
    path: '',
    component: AccountsComponent,
    children: [
      { path: '', component: AccountsListComponent },
    //   { path: ':id', loadComponent: () => import('./account-details/account-details.component').then(m => m.AccountDetailsComponent) }
    ]
  }
] satisfies Routes;
