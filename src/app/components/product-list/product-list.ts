import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { ItemAddComponent } from '../item-add/item-add.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ItemAddComponent],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductListComponent implements OnInit {
  items: any[] = [];
  isAddModalOpen = false;
  selectedItem: any = null;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getItems();
  }

  getItems() {
    this.apiService.getItems().subscribe({
      next: (data) => this.items = data,
      error: (err) => console.error('Failed to get items', err)
    });
  }

  openAddModal() {
    this.selectedItem = null;
    this.isAddModalOpen = true;
  }

  startEdit(item: any) {
    this.selectedItem = item;
    this.isAddModalOpen = true;
  }

  deleteItem(item: any) {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      this.apiService.deleteItem(item._id).subscribe({
        next: () => this.getItems(),
        error: (err) => alert('Failed to delete item: ' + err.message)
      });
    }
  }

  closeAddModal() {
    this.isAddModalOpen = false;
    this.selectedItem = null;
  }

  onItemAdded() {
    this.closeAddModal();
    this.getItems();
  }

  resetCollections() {
    if (confirm('Are you sure you want to delete ALL products? This cannot be undone.')) {
      this.apiService.resetCollections().subscribe({
        next: () => {
          alert('All items have been deleted.');
          this.getItems();
        },
        error: (err) => alert('Failed to reset: ' + err.message)
      });
    }
  }
}
