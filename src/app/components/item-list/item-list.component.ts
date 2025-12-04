import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-item-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './item-list.component.html',
    styleUrl: './item-list.component.css'
})
export class ItemListComponent implements OnInit {
    items: any[] = [];
    editingItemId: string | null = null;
    editName: string = '';
    editDescription: string = '';

    constructor(private apiService: ApiService) { }

    ngOnInit(): void {
        this.getItems();
    }

    getItems(): void {
        this.apiService.getItems().subscribe(data => {
            this.items = data;
        });
    }

    startEdit(item: any): void {
        this.editingItemId = item._id;
        this.editName = item.name;
        this.editDescription = item.description;
    }

    cancelEdit(): void {
        this.editingItemId = null;
        this.editName = '';
        this.editDescription = '';
    }

    saveEdit(): void {
        if (this.editingItemId) {
            const updatedItem = {
                name: this.editName,
                description: this.editDescription
            };
            this.apiService.updateItem(this.editingItemId, updatedItem).subscribe(() => {
                this.getItems();
                this.cancelEdit();
            });
        }
    }

    deleteItem(id: string): void {
        this.apiService.deleteItem(id).subscribe(() => {
            this.getItems(); // Refresh list
        });
    }
}
