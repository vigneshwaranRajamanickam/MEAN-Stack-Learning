import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private restUrl = 'http://localhost:3000/api/products';
    private graphqlUrl = 'http://localhost:3000/graphql';

    // Reactive signal for mode
    public mode = signal<'REST' | 'GRAPHQL'>((localStorage.getItem('server_mode') as 'REST' | 'GRAPHQL') || 'REST');

    private uploadUrl = 'http://localhost:3000/api/upload';

    constructor(private http: HttpClient) { }

    setMode(mode: 'REST' | 'GRAPHQL') {
        this.mode.set(mode);
        localStorage.setItem('server_mode', mode);
    }

    getMode() {
        return this.mode();
    }

    getItems(storeId?: string): Observable<any[]> {
        if (this.mode() === 'REST') {
            const url = storeId ? `${this.restUrl}?storeId=${storeId}` : this.restUrl;
            return this.http.get<any[]>(url);
        } else {
            const query = `
                query {
                    getProducts {
                        id
                        name
                        description
                        image
                        price
                        stock
                    }
                }
            `;
            return this.http.post<any>(this.graphqlUrl, { query }).pipe(
                map(result => result.data.getProducts.map((item: any) => ({ ...item, _id: item.id })))
            );
        }
    }

    addItem(item: any): Observable<any> {
        if (this.mode() === 'REST') {
            return this.http.post<any>(this.restUrl, item);
        } else {
            const query = `
                mutation {
                    addProduct(name: "${item.name}", description: "${item.description}", image: "${item.image || ''}", price: ${item.price || 0}, stock: ${item.stock || 0}) {
                        id
                        name
                        description
                        image
                        price
                        stock
                    }
                }
            `;
            return this.http.post<any>(this.graphqlUrl, { query });
        }
    }

    updateItem(id: string, item: any): Observable<any> {
        if (this.mode() === 'REST') {
            return this.http.put<any>(`${this.restUrl}/${id}`, item);
        } else {
            const query = `
                mutation {
                    updateProduct(id: "${id}", name: "${item.name}", description: "${item.description}", image: "${item.image || ''}", price: ${item.price || 0}, stock: ${item.stock || 0}) {
                        id
                        name
                        description
                        image
                        price
                        stock
                    }
                }
            `;
            return this.http.post<any>(this.graphqlUrl, { query });
        }
    }

    deleteItem(id: string): Observable<any> {
        if (this.mode() === 'REST') {
            return this.http.delete<any>(`${this.restUrl}/${id}`);
        } else {
            const query = `
                mutation {
                    deleteProduct(id: "${id}")
                }
            `;
            return this.http.post<any>(this.graphqlUrl, { query });
        }
    }

    uploadImage(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('image', file);
        return this.http.post<any>(this.uploadUrl, formData);
    }

    bulkUpload(products: any[], storeId?: string): Observable<any> {
        const url = storeId ? `${this.restUrl}/bulk?storeId=${storeId}` : `${this.restUrl}/bulk`;
        return this.http.post<any>(url, products);
    }

    resetCollections(): Observable<any> {
        // Global reset for testing/verification
        return this.http.delete<any>(`http://localhost:3000/api/reset/all`);
    }
}

