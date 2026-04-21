import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserProfile {
  userId: number;
  userName: string;   // backend sends "userName"
  email: string;
  phoneNumber: string;
  balance: number;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<UserProfile> {
    // withCredentials sends the session cookie — no Bearer token needed
    return this.http.get<UserProfile>(`${this.baseUrl}/user/profile`, {
      withCredentials: true
    });
  }
}
