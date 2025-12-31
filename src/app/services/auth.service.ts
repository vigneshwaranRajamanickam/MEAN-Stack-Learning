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

  login(credentials: any): Observable<any> {
    if (this.apiService.getMode() === 'REST') {
      return this.http.post(`${this.restUrl}/auth/login`, credentials).pipe(
        tap((response: any) => {
          if (response.token) {
            this.setSession(response);
          }
        })
      );
    } else {
      // Note: GraphQL generic login might need update to return role/storeId if schema allows.
      // For now, let's assume REST is the primary for full auth features or GraphQL schema matches.
      const query = `
        mutation {
          login(email: "${credentials.email}", password: "${credentials.password}")
        }
      `;
      // Warning: The current GraphQL schema only returns a string token. 
      // To get full details, we might need a separate query or update schema to return an object.
      // Retaining existing behavior for GraphQL but favoring REST for new features.
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

  register(user: any): Observable<any> {
    if (this.apiService.getMode() === 'REST') {
      return this.http.post(`${this.restUrl}/auth/register`, user);
    } else {
      // Fallback for GraphQL if needed, but per plan using REST for full features
      return this.http.post(`${this.restUrl}/auth/register`, user);
    }
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.restUrl}/auth/forgot-password`, { email });
  }

  private setSession(response: any): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem('user_role', response.role);
    if (response.storeId) localStorage.setItem('store_id', response.storeId);
    this.isAuthenticated.set(true);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.isAuthenticated.set(true);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRole(): string | null {
    return localStorage.getItem('user_role');
  }

  getStoreId(): string | null {
    return localStorage.getItem('store_id');
  }

  getStoreName(): string {
    return localStorage.getItem('store_name') || 'MEAN App';
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('user_role');
    localStorage.removeItem('store_id');
    localStorage.removeItem('store_name');
    this.isAuthenticated.set(false);
  }
}
