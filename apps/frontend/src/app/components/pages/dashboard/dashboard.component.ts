import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="dashboard-container">
      <nav class="dashboard-nav">
        <!-- Add navigation here later -->
      </nav>
      <main class="dashboard-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      min-height: 100vh;
    }
    .dashboard-nav {
      width: 250px;
      background: #f8f9fa;
      padding: 1rem;
    }
    .dashboard-content {
      flex: 1;
      padding: 2rem;
    }
  `]
})
export class DashboardComponent {}
