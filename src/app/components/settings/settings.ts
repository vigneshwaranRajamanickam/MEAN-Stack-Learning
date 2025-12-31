import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngClass
import { ApiService } from '../../services/api.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class SettingsComponent implements OnInit {
  constructor(public apiService: ApiService, public themeService: ThemeService) { }

  ngOnInit() {
    // No initialization needed as we use the service signal directly
  }

  setMode(mode: 'REST' | 'GRAPHQL') {
    this.apiService.setMode(mode);
  }

  setTheme(theme: 'light' | 'dark') {
    this.themeService.setTheme(theme);
  }

  resetDB() {
    if (confirm('WARNING: This will delete ALL data (Users, Stores, Products, Invoices). Are you sure?')) {
      this.apiService.resetCollections().subscribe({
        next: (res) => alert(res.message),
        error: (err) => alert('Reset failed: ' + err.message)
      });
    }
  }
}
