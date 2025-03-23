import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faSignOutAlt, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  template: `
    <header class="header">
      <div class="header-content">
        <a routerLink="/" class="logo">WCB</a>
        
        <nav class="nav-menu">
          <ng-container *ngIf="authService.isAuthenticated(); else authLinks">
            <a routerLink="/dashboard" class="nav-link">Dashboard</a>
            <button (click)="onLogout()" class="nav-link logout-btn">
              <fa-icon [icon]="faSignOutAlt"></fa-icon>
              Logout
            </button>
          </ng-container>
          
          <ng-template #authLinks>
            <a routerLink="/sign-in" class="nav-link">
              <fa-icon [icon]="faSignInAlt"></fa-icon>
              Sign In
            </a>
          </ng-template>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: #ffffff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 1rem;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: bold;
      color: #3b82f6;
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: #2563eb;
      }
    }

    .nav-menu {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .nav-link {
      color: #4b5563;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s;

      &:hover {
        background: #f3f4f6;
        color: #3b82f6;
      }

      &.signup {
        background: #3b82f6;
        color: white;

        &:hover {
          background: #2563eb;
        }
      }
    }

    .logout-btn {
      background: none;
      border: none;
      cursor: pointer;
      font: inherit;
      
      &:hover {
        color: #dc2626;
      }
    }
  `]
})
export class HeaderComponent {
  faUser = faUser;
  faSignOutAlt = faSignOutAlt;
  faSignInAlt = faSignInAlt;

  constructor(public authService: AuthService, private router: Router) {}

  onLogout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/sign-in']);
   });
}

  
}
