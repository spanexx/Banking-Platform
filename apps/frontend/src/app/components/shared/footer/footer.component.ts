import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>Quick Links</h3>
          <nav>
            <a routerLink="/about">About Us</a>
            <a routerLink="/contact">Contact</a>
            <a routerLink="/privacy">Privacy Policy</a>
            <a routerLink="/terms">Terms of Service</a>
          </nav>
        </div>
        
        <div class="footer-section">
          <h3>Support</h3>
          <nav>
            <a routerLink="/faq">FAQ</a>
            <a routerLink="/help">Help Center</a>
            <a href="tel:+1234567890">Contact Support</a>
          </nav>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; {{ currentYear }} Bank App. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #1a1a1a;
      color: #ffffff;
      padding: 3rem 1rem 1rem;
      margin-top: auto;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
    }

    .footer-section {
      h3 {
        color: #ffffff;
        font-size: 1.1rem;
        margin-bottom: 1rem;
      }

      nav {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        a {
          color: #9ca3af;
          text-decoration: none;
          transition: color 0.2s;

          &:hover {
            color: #ffffff;
          }
        }
      }
    }

    .footer-bottom {
      grid-column: 1 / -1;
      text-align: center;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #333;
      
      p {
        color: #9ca3af;
        font-size: 0.875rem;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
