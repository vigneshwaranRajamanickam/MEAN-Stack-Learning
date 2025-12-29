import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';

@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './confirm-dialog.component.html',
    styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
    constructor(public confirmService: ConfirmDialogService) { }

    onConfirm() {
        this.confirmService.resolve(true);
    }

    onCancel() {
        this.confirmService.resolve(false);
    }
}
