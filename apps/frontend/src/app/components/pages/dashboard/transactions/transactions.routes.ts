import { Routes } from '@angular/router';
import { TransactionsComponent } from './transactions.component';
import { TransactionsListComponent } from './transactions-list/transactions-list.component';

export default [
  {
    path: '',
    component: TransactionsComponent,
    children: [
      { path: '', component: TransactionsListComponent },
    //   { path: ':id', loadComponent: () => import('./transaction-details/transaction-details.component').then(m => m.TransactionDetailsComponent) }
    ]
  }
] satisfies Routes;
