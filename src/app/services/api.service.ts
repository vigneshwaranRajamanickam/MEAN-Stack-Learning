import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private restUrl = 'http://localhost:3000/api/items';
    private graphqlUrl = 'http://localhost:3001/graphql';
    private currentMode: 'REST' | 'GRAPHQL' = 'REST';

    constructor(private http: HttpClient) { }

    setMode(mode: 'REST' | 'GRAPHQL') {
        this.currentMode = mode;
    }

    getMode() {
        return this.currentMode;
    }

    getItems(): Observable<any[]> {
        if (this.currentMode === 'REST') {
            return this.http.get<any[]>(this.restUrl);
        } else {
            const query = `
                query {
                    getItems {
                        id
                        name
                        description
                    }
                }
            `;
            return this.http.post<any>(this.graphqlUrl, { query }).pipe(
                map(result => result.data.getItems.map((item: any) => ({ ...item, _id: item.id })))
            );
        }
    }

    addItem(item: any): Observable<any> {
        if (this.currentMode === 'REST') {
            return this.http.post<any>(this.restUrl, item);
        } else {
            const query = `
                mutation {
                    addItem(name: "${item.name}", description: "${item.description}") {
                        id
                        name
                        description
                    }
                }
            `;
            return this.http.post<any>(this.graphqlUrl, { query });
        }
    }

    updateItem(id: string, item: any): Observable<any> {
        if (this.currentMode === 'REST') {
            return this.http.put<any>(`${this.restUrl}/${id}`, item);
        } else {
            const query = `
                mutation {
                    updateItem(id: "${id}", name: "${item.name}", description: "${item.description}") {
                        id
                        name
                        description
                    }
                }
            `;
            return this.http.post<any>(this.graphqlUrl, { query });
        }
    }

    deleteItem(id: string): Observable<any> {
        if (this.currentMode === 'REST') {
            return this.http.delete<any>(`${this.restUrl}/${id}`);
        } else {
            const query = `
                mutation {
                    deleteItem(id: "${id}")
                }
            `;
            return this.http.post<any>(this.graphqlUrl, { query });
        }
    }
}

