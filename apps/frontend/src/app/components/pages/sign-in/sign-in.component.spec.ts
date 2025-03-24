import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SignInComponent } from './sign-in.component';
import { AuthService } from '../../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { provideLocationMocks } from '@angular/common/testing';
import { of, throwError } from 'rxjs';
import { AuthResponse } from '../../../../models/AuthResponse';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;
  let mockCredentials: { email: string; password: string };
  let mockAuthResponse: AuthResponse;

  beforeAll(() => {
    mockCredentials = {
      email: 'test@example.com',
      password: 'Password123!'
    };

    mockAuthResponse = {
      token: 'fake-jwt-token',
      customer: {
        id: '1',
        email: mockCredentials.email,
        firstName: 'Test',
        lastName: 'User'
      }
    };
  });

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'isAuthenticated']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FontAwesomeModule,
        RouterModule.forRoot([])  // Provides a real router instance with an empty route config
      ],
      providers: [
        provideLocationMocks(),
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form by default', () => {
    expect(component.loginForm.valid).toBeFalse();
  });

  it('should validate required fields', () => {
    const form = component.loginForm;
    expect(form.get('email')?.errors?.['required']).toBeTrue();
    expect(form.get('password')?.errors?.['required']).toBeTrue();
  });

  it('should validate email format', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.errors?.['email']).toBeTrue();
    
    emailControl?.setValue('test@example.com');
    expect(emailControl?.errors).toBeNull();
  });

  it('should validate minimum password length', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('short');
    expect(passwordControl?.errors?.['minlength']).toBeTruthy();
    
    passwordControl?.setValue('validpassword');
    expect(passwordControl?.errors).toBeNull();
  });

  it('should check authentication status on init and navigate to dashboard if authenticated', () => {
    authService.isAuthenticated.and.returnValue(true);
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should log in and navigate to dashboard on successful login', fakeAsync(() => {
    authService.login.and.returnValue(of(mockAuthResponse));
    
    component.loginForm.setValue(mockCredentials);
    component.onSubmit();
    tick();

    expect(authService.login).toHaveBeenCalledWith(
      mockCredentials.email,
      mockCredentials.password
    );
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('');
  }));

  it('should handle login errors and not navigate', fakeAsync(() => {
    const errorMessage = 'Invalid credentials';
    authService.login.and.returnValue(throwError(() => ({ error: { message: errorMessage } })));
    
    component.loginForm.setValue(mockCredentials);
    component.onSubmit();
    tick();

    expect(component.error).toBe(errorMessage);
    expect(component.loading).toBeFalse();
    expect(router.navigate).not.toHaveBeenCalled();
  }));

  it('should not submit the form if it is invalid', () => {
    // With an invalid form (empty by default), onSubmit should exit early.
    component.onSubmit();
    expect(authService.login).not.toHaveBeenCalled();
  });
});
