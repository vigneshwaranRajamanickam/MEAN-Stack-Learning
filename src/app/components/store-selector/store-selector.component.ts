import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../../services/store.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-store-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './store-selector.component.html',
  styleUrls: ['./store-selector.component.css']
})
export class StoreSelectorComponent implements OnInit {
  stores: any[] = [];
  newStore = { name: '', address: '', phone: '' };
  isCreating = false;

  editingStore: any = null;

  constructor(private storeService: StoreService, private router: Router) { }

  ngOnInit(): void {
    this.loadStores();
  }

  loadStores() {
    this.storeService.getStores().subscribe({
      next: (res) => this.stores = res,
      error: (err) => console.error(err)
    });
  }

  selectStore(store: any) {
    if (this.editingStore) return; // Prevent selection while editing
    localStorage.setItem('store_id', store._id);
    localStorage.setItem('store_name', store.name);
    this.router.navigate(['/']); // Go to dashboard/home
  }

  isCurrentStore(storeId: string): boolean {
    return localStorage.getItem('store_id') === storeId;
  }

  startEdit(store: any, event: Event) {
    event.stopPropagation();
    this.editingStore = store;
    this.newStore = { ...store };
  }

  cancelEdit() {
    this.editingStore = null;
    this.newStore = { name: '', address: '', phone: '' };
  }

  createOrUpdateStore() {
    if (!this.newStore.name) return;
    this.isCreating = true;

    if (this.editingStore) {
      // Update Mode
      this.storeService.updateStore(this.editingStore._id, this.newStore).subscribe({
        next: (updatedStore) => {
          const index = this.stores.findIndex(s => s._id === updatedStore._id);
          if (index !== -1) this.stores[index] = updatedStore;
          this.cancelEdit();
          this.isCreating = false;
        },
        error: (err) => {
          alert('Failed to update store: ' + err.message);
          this.isCreating = false;
        }
      });
    } else {
      // Create Mode
      this.storeService.createStore(this.newStore).subscribe({
        next: (store) => {
          this.stores.push(store);
          this.newStore = { name: '', address: '', phone: '' };
          this.isCreating = false;
        },
        error: (err) => {
          alert('Failed to create store: ' + err.message);
          this.isCreating = false;
        }
      });
    }
  }
}
