import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-item-add',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './item-add.component.html',
    styleUrl: './item-add.component.css'
})
export class ItemAddComponent {
    newItem = {
        name: '',
        description: '',
        image: ''
    };
    selectedFile: File | null = null;
    isUploading = false;

    @Output() itemAdded = new EventEmitter<void>();

    constructor(private apiService: ApiService, private router: Router) { }


    onFileSelected(event: any): void {
        const file: File = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            this.isUploading = true;
            this.apiService.uploadImage(file).subscribe({
                next: (res) => {
                    this.newItem.image = res.filePath;
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

    addItem(): void {
        if (this.newItem.name && this.newItem.description) {
            this.apiService.addItem(this.newItem).subscribe(() => {
                this.itemAdded.emit(); // Emit event so parent can close modal/refresh
                // Reset form
                this.newItem = { name: '', description: '', image: '' };
                this.selectedFile = null;
            });
        }
    }
}
