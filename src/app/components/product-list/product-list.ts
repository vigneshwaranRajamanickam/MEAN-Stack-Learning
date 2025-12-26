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
    this.isAddModalOpen = true;
  }

  closeAddModal() {
    this.isAddModalOpen = false;
  }

  onItemAdded() {
    this.closeAddModal();
    this.getItems();
  }
}
