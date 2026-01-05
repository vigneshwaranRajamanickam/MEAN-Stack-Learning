import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ConfirmDialogService {
    isOpen = signal(false);
    title = signal('Confirm');
    message = signal('Are you sure?');
    type = signal<'confirm' | 'alert'>('confirm');

    private resolveRef: ((value: boolean) => void) | null = null;

    confirm(message: string, title: string = 'Confirm'): Promise<boolean> {
        this.message.set(message);
        this.title.set(title);
        this.type.set('confirm');
        this.isOpen.set(true);

        return new Promise<boolean>((resolve) => {
            this.resolveRef = resolve;
        });
    }

    alert(message: string, title: string = 'Alert'): Promise<boolean> {
        this.message.set(message);
        this.title.set(title);
        this.type.set('alert');
        this.isOpen.set(true);

        return new Promise<boolean>((resolve) => {
            this.resolveRef = resolve;
        });
    }

    resolve(result: boolean) {
        this.isOpen.set(false);
        if (this.resolveRef) {
            this.resolveRef(result);
            this.resolveRef = null;
        }
    }
}
