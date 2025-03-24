import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

interface AuthResponse {
  token: string;
  customer: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let mockCustomer: any;
  let mockAuthResponse: AuthResponse;
  const tokenKey = 'auth_token';

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

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a new user', fakeAsync(() => {
    service.register(mockCustomer).subscribe(response => {
      expect(response).toEqual(mockAuthResponse);
      expect(localStorage.getItem('auth_token')).toBe(mockAuthResponse.token);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}${environment.auth.register}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCustomer);
    req.flush(mockAuthResponse);

    tick();
  }));

  it('should login with registered customer', fakeAsync(() => {
    const { email, password } = mockCustomer;
    
    service.login(email, password).subscribe(response => {
      expect(response).toEqual(mockAuthResponse);
      expect(localStorage.getItem('auth_token')).toBe(mockAuthResponse.token);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}${environment.auth.login}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email, password });
    req.flush(mockAuthResponse);

    tick();
  }));

  it('should handle logout', fakeAsync(() => {
    // Set token first
    localStorage.setItem('auth_token', mockAuthResponse.token);
    
    service.logout().subscribe(() => {
      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}${environment.auth.logout}`);
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'Logged out successfully' });

    tick();
  }));

  it('should check authentication status', () => {
    expect(service.isAuthenticated()).toBeFalse();
    localStorage.setItem(tokenKey, mockAuthResponse.token);
    expect(service.isAuthenticated()).toBeTrue();
  });
});
