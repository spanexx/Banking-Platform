import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="transactions-container">
      <h2>Transactions</h2>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .transactions-container {
      padding: 1rem;
    }
  `]
})
export class TransactionsComponent {}
