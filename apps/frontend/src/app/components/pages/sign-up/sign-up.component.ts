import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { faUser, faEnvelope, faLock, faPhone, faIdCard, faCalendar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  registerForm: FormGroup;
  loading = false;
  error = '';
  maxDate: string;
  faUser = faUser;
  faEnvelope = faEnvelope;
  faLock = faLock;
  faPhone = faPhone;
  faIdCard = faIdCard;
  faCalendar = faCalendar;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Set max date to today
    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];

    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)
      ]],
      confirmPassword: ['', Validators.required],
      phoneNumber: ['', [
        Validators.required, 
        Validators.pattern(/^\+?[\d\s-]{10,}$/)
      ]],
      dateOfBirth: ['', Validators.required],
      identification: this.formBuilder.group({
        type: ['', Validators.required],
        number: ['', Validators.required]
      })
    }, {
      validator: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const formValue = this.registerForm.value;
    const userData = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      password: formValue.password,
      phoneNumber: formValue.phoneNumber,
      dateOfBirth: formValue.dateOfBirth,
      identification: {
        type: formValue.identification?.type,
        number: formValue.identification?.number
      }
    };

    this.authService.register(userData).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        if (error?.error?.errors) {
          // Handle validation errors
          const validationErrors = error.error.errors.map((err: any) => err.msg).join('. ');
          this.error = validationErrors;
        } else {
          this.error = error?.error?.message || error?.message || 'An error occurred during registration';
        }
        this.loading = false;
      }
    });
  }
}
