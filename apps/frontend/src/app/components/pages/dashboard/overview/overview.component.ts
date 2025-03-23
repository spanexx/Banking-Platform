import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overview-container">
      <h2>Dashboard Overview</h2>
      <!-- Add overview content here later -->
    </div>
  `,
  styles: [`
    .overview-container {
      padding: 1rem;
    }
  `]
})
export class OverviewComponent {}
