import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faShieldAlt, faChartLine, faMobileAlt, faGlobe } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  faShieldAlt = faShieldAlt;
  faChartLine = faChartLine;
  faMobileAlt = faMobileAlt;
  faGlobe = faGlobe;

  features = [
    {
      icon: this.faShieldAlt,
      title: 'Secure Banking',
      description: 'Bank with confidence using our state-of-the-art security measures'
    },
    {
      icon: this.faChartLine,
      title: 'Smart Investments',
      description: 'Grow your wealth with our expert investment solutions'
    },
    {
      icon: this.faMobileAlt,
      title: 'Mobile Banking',
      description: 'Access your accounts anytime, anywhere with our mobile app'
    },
    {
      icon: this.faGlobe,
      title: 'Global Reach',
      description: 'International banking services across multiple currencies'
    }
  ];
}
