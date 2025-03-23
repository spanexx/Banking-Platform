import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accounts-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="accounts-list">
      <h3>Your Accounts</h3>
      <!-- Account list content will be added later -->
    </div>
  `,
  styles: [`
    .accounts-list {
      margin-top: 1rem;
    }
  `]
})
export class AccountsListComponent {}
