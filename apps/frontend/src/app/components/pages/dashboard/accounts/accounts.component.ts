import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="accounts-container">
      <h2>Accounts</h2>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .accounts-container {
      padding: 1rem;
    }
  `]
})
export class AccountsComponent {}
