import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  userName: string;       // Backend expects "userName" with capital N
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8081/api';
  private loggedIn = new BehaviorSubject<boolean>(this.hasSession());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

  private hasSession(): boolean {
    return !!sessionStorage.getItem('isLoggedIn');
  }

  login(credentials: LoginRequest): Observable<string> {
    // Backend returns plain string, use responseType: 'text'
    // withCredentials: true sends session cookie back with each request
    return this.http.post(`${this.baseUrl}/auth/login`, credentials, {
      responseType: 'text',
      withCredentials: true
    }).pipe(
      tap(() => {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('email', credentials.email);
        this.loggedIn.next(true);
      })
    );
  }

  signup(data: SignupRequest): Observable<string> {
    return this.http.post(`${this.baseUrl}/auth/signup`, data, {
      responseType: 'text'
    });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/logout`, {}, {
      withCredentials: true,
      responseType: 'text'
    }).pipe(
      tap(() => {
        sessionStorage.clear();
        this.loggedIn.next(false);
      })
    );
  }

  getEmail(): string | null {
    return sessionStorage.getItem('email');
  }

  getUsername(): string | null {
    return sessionStorage.getItem('userName') || sessionStorage.getItem('email');
  }

  setUsername(name: string): void {
    sessionStorage.setItem('userName', name);
  }

  isLoggedIn(): boolean {
    return this.hasSession();
  }
}
