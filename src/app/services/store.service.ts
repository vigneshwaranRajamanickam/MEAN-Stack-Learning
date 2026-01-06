import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class StoreService {
    private apiUrl = `${environment.apiUrl}api/stores`;

    // Signal to hold current store context
    currentStore = signal<any>(null);

    constructor(private http: HttpClient, private authService: AuthService) {
        const storedStoreId = localStorage.getItem('store_id');
        // If we have a store ID but no details, we might need to fetch them.
        // For now, we rely on the ID being present in auth service.
    }

    getStores(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl, this.getHeaders());
    }

    createStore(store: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, store, this.getHeaders());
    }

    getStoreById(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`, this.getHeaders());
    }

    updateStore(id: string, store: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, store, this.getHeaders());
    }

    deleteStore(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`, this.getHeaders());
    }

    // Helper to get headers with token
    private getHeaders() {
        const token = this.authService.getToken();
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
        };
    }
}
