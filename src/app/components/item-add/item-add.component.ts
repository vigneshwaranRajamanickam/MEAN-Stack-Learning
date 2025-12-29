import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
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
export class ItemAddComponent implements OnChanges {
    @Input() item: any = null;
    newItem = {
        name: '',
        description: '',
        image: '',
        price: null
    };
    selectedFile: File | null = null;
    isUploading = false;

    @Output() itemAdded = new EventEmitter<void>();

    constructor(private apiService: ApiService, private router: Router) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['item'] && this.item) {
            this.newItem = { ...this.item };
        } else if (changes['item'] && !this.item) {
            this.resetForm();
        }
    }

    resetForm() {
        this.newItem = {
            name: '',
            description: '',
            image: '',
            price: null
        };
        this.selectedFile = null;
    }

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

    saveItem(): void {
        if (this.newItem.name && this.newItem.description) {
            if (this.item && this.item._id) {
                // Edit Mode
                this.apiService.updateItem(this.item._id, this.newItem).subscribe(() => {
                    this.itemAdded.emit();
                    this.resetForm();
                });
            } else {
                // Add Mode
                this.apiService.addItem(this.newItem).subscribe(() => {
                    this.itemAdded.emit();
                    this.resetForm();
                });
            }
        }
    }
}
