import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { HttpClient } from '@angular/common/http';
import { PrintService } from '../../services/print.service';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';

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

    storeName: string = '';
    currentDate = new Date();

    constructor(
        private apiService: ApiService,
        public cartService: CartService,
        private http: HttpClient,
        private printService: PrintService,
        private confirmService: ConfirmDialogService
    ) { }

    ngOnInit() {
        this.storeName = localStorage.getItem('store_name') || 'Store';
        this.loadProducts();
    }

    loadProducts() {
        const storeId = localStorage.getItem('store_id');
        if (!storeId) {
            this.confirmService.alert('No store selected. Please verify login.', 'Error');
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

        this.http.post('http://localhost:3000/api/invoices', orderData, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
        }).subscribe({
            next: async (res: any) => {
                await this.confirmService.alert('Order processed successfully!', 'Success');

                // Use shared PrintService
                const receiptData = {
                    storeName: this.storeName,
                    storeAddress: localStorage.getItem('store_address'),
                    customerName: this.customerName,
                    items: this.cartService.cartItems(),
                    totalAmount: this.cartService.totalAmount(),
                    date: new Date(),
                    invoiceNumber: res.invoiceNumber || 'NEW'
                };
                this.printService.printReceipt(receiptData);

                this.cartService.clearCart();
                this.showCheckoutModal = false;
                this.isProcessing = false;
                // Also refresh products to update stock
                this.loadProducts();
                // Reset customer form
                this.customerName = '';
                this.customerPhone = '';
            },
            error: async (err) => {
                await this.confirmService.alert('Failed to process order: ' + (err.error?.message || err.message), 'Error');
                this.isProcessing = false;
            }
        });
    }
}
