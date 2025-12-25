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
    editImage: string = '';
    isUploading: boolean = false;
    selectedFile: File | null = null;

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
        this.editImage = item.image;
    }

    cancelEdit(): void {
        this.editingItemId = null;
        this.editName = '';
        this.editDescription = '';
        this.editImage = '';
        this.isUploading = false;
        this.selectedFile = null;
    }

    onFileSelected(event: any): void {
        const file: File = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            this.isUploading = true;
            this.apiService.uploadImage(file).subscribe({
                next: (res) => {
                    this.editImage = res.filePath;
                    this.isUploading = false;
                },
                error: (err) => {
                    console.error('Upload failed', err);
                    alert('Upload failed: ' + (err.error?.message || err.message || 'Unknown error'));
                    this.isUploading = false;
                }
            });
        }
    }

    saveEdit(): void {
        if (this.editingItemId) {
            const updatedItem = {
                name: this.editName,
                description: this.editDescription,
                image: this.editImage
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
