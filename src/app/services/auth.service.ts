import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private restUrl = 'http://localhost:3000/api';
  private graphqlUrl = 'http://localhost:3001/graphql';
  private tokenKey = 'auth_token';

  // Reactive auth state
  isAuthenticated = signal<boolean>(false);

  constructor(private http: HttpClient, private apiService: ApiService) {
    // Check initial state
    this.isAuthenticated.set(this.isLoggedIn());
  }

  register(user: any): Observable<any> {
    if (this.apiService.getMode() === 'REST') {
      return this.http.post(`${this.restUrl}/register`, user);
    } else {
      const query = `
        mutation {
          register(username: "${user.username}", email: "${user.email}", password: "${user.password}")
        }
      `;
      return this.http.post<any>(this.graphqlUrl, { query }).pipe(
        map(res => {
          if (res.errors) throw { error: { message: res.errors[0].message } };
          return res.data;
        })
      );
    }
  }

  login(credentials: any): Observable<any> {
    if (this.apiService.getMode() === 'REST') {
      return this.http.post(`${this.restUrl}/login`, credentials).pipe(
        tap((response: any) => {
          if (response.token) {
            this.setToken(response.token);
          }
        })
      );
    } else {
      const query = `
        mutation {
          login(email: "${credentials.email}", password: "${credentials.password}")
        }
      `;
      return this.http.post<any>(this.graphqlUrl, { query }).pipe(
        map(res => {
          if (res.errors) throw { error: { message: res.errors[0].message } };
          return { token: res.data.login };
        }),
        tap((response: any) => {
          if (response.token) {
            this.setToken(response.token);
          }
        })
      );
    }
  }

  forgotPassword(email: string): Observable<any> {
    if (this.apiService.getMode() === 'REST') {
      return this.http.post(`${this.restUrl}/forgot-password`, { email });
    } else {
      console.warn('Forgot Password not implemented in GraphQL, falling back to REST');
      return this.http.post(`${this.restUrl}/forgot-password`, { email });
    }
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.isAuthenticated.set(true);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticated.set(false);
  }
}
