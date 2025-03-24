import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SignUpComponent } from './sign-up.component';
import { AuthService } from '../../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { provideLocationMocks } from '@angular/common/testing';
import { of, throwError } from 'rxjs';
import { AuthResponse } from '../../../../models/AuthResponse';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;
  let mockCustomer: any;
  let mockAuthResponse: AuthResponse;

  beforeAll(() => {
    mockCustomer = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'Password123!',
      phoneNumber: '+1234567890',
      dateOfBirth: '1990-01-01',
      identification: {
        type: 'passport',
        number: 'ABC123456'
      }
    };

    mockAuthResponse = {
      token: 'fake-jwt-token',
      customer: {
        id: '1',
        email: mockCustomer.email,
        firstName: mockCustomer.firstName,
        lastName: mockCustomer.lastName
      }
    };
  });

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FontAwesomeModule,
        RouterModule.forRoot([])  // Provides a fully initialized router with an empty routes config
      ],
      providers: [
        provideLocationMocks(),
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    // Spy on the navigate method to intercept navigation calls.
    spyOn(router, 'navigate');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form by default', () => {
    expect(component.registerForm.valid).toBeFalse();
  });

  it('should validate required fields', () => {
    const form = component.registerForm;
    expect(form.get('firstName')?.errors?.['required']).toBeTrue();
    expect(form.get('lastName')?.errors?.['required']).toBeTrue();
    expect(form.get('email')?.errors?.['required']).toBeTrue();
    expect(form.get('password')?.errors?.['required']).toBeTrue();
    expect(form.get('phoneNumber')?.errors?.['required']).toBeTrue();
    expect(form.get('dateOfBirth')?.errors?.['required']).toBeTrue();
    expect(form.get('identification.type')?.errors?.['required']).toBeTrue();
    expect(form.get('identification.number')?.errors?.['required']).toBeTrue();
  });

  it('should validate email format', () => {
    const emailControl = component.registerForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.errors?.['email']).toBeTrue();
    
    emailControl?.setValue('test@example.com');
    expect(emailControl?.errors).toBeNull();
  });

  it('should validate password requirements', () => {
    const passwordControl = component.registerForm.get('password');
    passwordControl?.setValue('weak');
    expect(passwordControl?.errors?.['minlength']).toBeTruthy();
    expect(passwordControl?.errors?.['pattern']).toBeTruthy();
    
    passwordControl?.setValue('StrongPass123!');
    expect(passwordControl?.errors).toBeNull();
  });

  it('should validate password match', () => {
    const form = component.registerForm;
    form.get('password')?.setValue('StrongPass123!');
    form.get('confirmPassword')?.setValue('DifferentPass123!');
    expect(form.errors?.['mismatch']).toBeTrue();
    
    form.get('confirmPassword')?.setValue('StrongPass123!');
    expect(form.errors?.['mismatch']).toBeFalsy();
  });

  it('should create account and navigate to dashboard on successful registration', fakeAsync(() => {
    authService.register.and.returnValue(of(mockAuthResponse));
    
    component.registerForm.setValue({
      firstName: mockCustomer.firstName,
      lastName: mockCustomer.lastName,
      email: mockCustomer.email,
      password: mockCustomer.password,
      confirmPassword: mockCustomer.password,
      phoneNumber: mockCustomer.phoneNumber,
      dateOfBirth: mockCustomer.dateOfBirth,
      identification: mockCustomer.identification
    });

    component.onSubmit();
    tick();

    expect(authService.register).toHaveBeenCalledWith(mockCustomer);
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('');
  }));

  it('should handle registration errors', fakeAsync(() => {
    const errorMessage = 'Email already exists';
    authService.register.and.returnValue(throwError(() => ({ 
      error: { message: errorMessage } 
    })));
    
    component.registerForm.setValue({
      firstName: mockCustomer.firstName,
      lastName: mockCustomer.lastName,
      email: mockCustomer.email,
      password: mockCustomer.password,
      confirmPassword: mockCustomer.password,
      phoneNumber: mockCustomer.phoneNumber,
      dateOfBirth: mockCustomer.dateOfBirth,
      identification: mockCustomer.identification
    });

    component.onSubmit();
    tick();

    expect(component.error).toBe(errorMessage);
    expect(component.loading).toBeFalse();
    expect(router.navigate).not.toHaveBeenCalled();
  }));

  it('should handle validation errors from server', fakeAsync(() => {
    const validationErrors = [
      { msg: 'Invalid email format' },
      { msg: 'Password too weak' }
    ];
    
    authService.register.and.returnValue(throwError(() => ({ 
      error: { errors: validationErrors } 
    })));
    
    component.registerForm.setValue({
      firstName: mockCustomer.firstName,
      lastName: mockCustomer.lastName,
      email: mockCustomer.email,
      password: mockCustomer.password,
      confirmPassword: mockCustomer.password,
      phoneNumber: mockCustomer.phoneNumber,
      dateOfBirth: mockCustomer.dateOfBirth,
      identification: mockCustomer.identification
    });

    component.onSubmit();
    tick();

    expect(component.error).toBe('Invalid email format. Password too weak');
    expect(component.loading).toBeFalse();
  }));
});
