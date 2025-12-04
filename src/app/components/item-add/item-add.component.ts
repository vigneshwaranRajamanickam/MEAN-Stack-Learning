import { Component, EventEmitter, Output } from '@angular/core';
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
        description: ''
    };

    @Output() itemAdded = new EventEmitter<void>();

    constructor(private apiService: ApiService) { }

    addItem(): void {
        if (this.newItem.name && this.newItem.description) {
            this.apiService.addItem(this.newItem).subscribe(() => {
                this.itemAdded.emit();
                this.newItem = { name: '', description: '' }; // Reset form
            });
        }
    }
}
