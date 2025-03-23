import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transactions-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="transactions-list">
      <h3>Recent Transactions</h3>
      <!-- Transaction list content will be added later -->
    </div>
  `,
  styles: [`
    .transactions-list {
      margin-top: 1rem;
    }
  `]
})
export class TransactionsListComponent {}
