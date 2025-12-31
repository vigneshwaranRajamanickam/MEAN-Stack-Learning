import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    stock: number;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    // Signal to hold cart items
    cartItems = signal<CartItem[]>([]);

    // Computed signal for total amount
    totalAmount = computed(() => {
        return this.cartItems().reduce((total, item) => total + (item.price * item.quantity), 0);
    });

    // Computed signal for total items count
    totalItemsCount = computed(() => {
        return this.cartItems().reduce((count, item) => count + item.quantity, 0);
    });

    addToCart(product: any) {
        this.cartItems.update(items => {
            const existingItem = items.find(i => i.productId === product._id);

            if (existingItem) {
                if (existingItem.quantity < product.stock) {
                    return items.map(i =>
                        i.productId === product._id
                            ? { ...i, quantity: i.quantity + 1 }
                            : i
                    );
                } else {
                    alert('Cannot add more than available stock!');
                    return items;
                }
            } else {
                if (product.stock > 0) {
                    return [...items, {
                        productId: product._id,
                        name: product.name,
                        price: product.price,
                        quantity: 1,
                        stock: product.stock
                    }];
                } else {
                    alert('Product is out of stock!');
                    return items;
                }
            }
        });
    }

    removeFromCart(productId: string) {
        this.cartItems.update(items => items.filter(i => i.productId !== productId));
    }

    updateQuantity(productId: string, quantity: number) {
        this.cartItems.update(items => {
            return items.map(item => {
                if (item.productId === productId) {
                    if (quantity > item.stock) {
                        alert(`Only ${item.stock} available`);
                        return { ...item, quantity: item.stock };
                    }
                    return { ...item, quantity: Math.max(1, quantity) };
                }
                return item;
            });
        });
    }

    clearCart() {
        this.cartItems.set([]);
    }
}
