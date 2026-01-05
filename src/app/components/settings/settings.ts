import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ThemeService } from '../../services/theme.service';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class SettingsComponent implements OnInit {
  storeName: string = '';
  storeAddress: string = '';

  constructor(
    public apiService: ApiService,
    public themeService: ThemeService,
    private confirmService: ConfirmDialogService
  ) { }

  ngOnInit() {
    this.storeName = localStorage.getItem('store_name') || 'MEAN Store';
    this.storeAddress = localStorage.getItem('store_address') || '';
  }

  async saveSettings() {
    localStorage.setItem('store_name', this.storeName);
    localStorage.setItem('store_address', this.storeAddress);
    await this.confirmService.alert('Settings saved successfully!', 'Success');
  }

  setMode(mode: 'REST' | 'GRAPHQL') {
    this.apiService.setMode(mode);
  }

  setTheme(theme: 'light' | 'dark') {
    this.themeService.setTheme(theme);
  }

  async resetDB() {
    const confirmed = await this.confirmService.confirm('WARNING: This will delete ALL data (Users, Stores, Products, Invoices). Are you sure?');
    if (confirmed) {
      this.apiService.resetCollections().subscribe({
        next: async (res) => await this.confirmService.alert(res.message, 'Reset Complete'),
        error: async (err) => await this.confirmService.alert('Reset failed: ' + err.message, 'Error')
      });
    }
  }
}
