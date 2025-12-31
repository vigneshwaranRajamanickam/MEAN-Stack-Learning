import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-pos',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './pos.component.html',
    styleUrls: ['./pos.component.css']
})
export class PosComponent implements OnInit {
    products: any[] = [];
    filteredProducts: any[] = [];
    searchTerm: string = '';

    // Checkout state
    showCheckoutModal = false;
    customerName = '';
    customerPhone = '';
    paymentMethod = 'cash';
    isProcessing = false;

    constructor(
        private apiService: ApiService,
        public cartService: CartService,
        private http: HttpClient
    ) { }

    ngOnInit() {
        this.loadProducts();
    }

    loadProducts() {
        // Determine store context (this should ideally be in a global store service or ngrx)
        const storeId = localStorage.getItem('store_id');
        if (!storeId) {
            alert('No store selected. Please verify login.');
            return;
        }

        this.apiService.getItems(storeId).subscribe({
            next: (data) => {
                this.products = data;
                this.filteredProducts = data;
            },
            error: (err) => console.error(err)
        });
    }

    filterProducts() {
        if (!this.searchTerm) {
            this.filteredProducts = this.products;
        } else {
            const term = this.searchTerm.toLowerCase();
            this.filteredProducts = this.products.filter(p =>
                p.name.toLowerCase().includes(term) ||
                (p.sku && p.sku.toLowerCase().includes(term))
            );
        }
    }

    addToCart(product: any) {
        this.cartService.addToCart(product);
    }

    proceedToCheckout() {
        if (this.cartService.cartItems().length === 0) return;
        this.showCheckoutModal = true;
    }

    cancelCheckout() {
        this.showCheckoutModal = false;
    }

    submitOrder() {
        if (this.isProcessing) return;
        this.isProcessing = true;

        const storeId = localStorage.getItem('store_id');
        const orderData = {
            storeId,
            items: this.cartService.cartItems(),
            customerName: this.customerName,
            customerPhone: this.customerPhone,
            paymentMethod: this.paymentMethod
        };

        // Need to use the invoice route. ApiService doesn't have it yet, let's assume we add it or use http directly.
        this.http.post('http://localhost:3000/api/invoices', orderData, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
        }).subscribe({
            next: (res) => {
                alert('Order processed successfully!');
                this.cartService.clearCart();
                this.showCheckoutModal = false;
                this.isProcessing = false;
                // Also refresh products to update stock
                this.loadProducts();
                // Reset customer form
                this.customerName = '';
                this.customerPhone = '';
            },
            error: (err) => {
                alert('Failed to process order: ' + (err.error?.message || err.message));
                this.isProcessing = false;
            }
        });
    }
}
