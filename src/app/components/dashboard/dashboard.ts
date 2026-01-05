import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  stats = {
    productCount: 0,
    invoiceCount: 0
  };
  storeId: string | null = null;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.storeId = localStorage.getItem('store_id');
    if (this.storeId) {
      this.loadStats();
    }
  }

  loadStats() {
    // Determine store context
    const storeId = this.storeId;

    // Fetch products to count them
    this.apiService.getItems(storeId!).subscribe({
      next: (items) => {
        if (items) {
          this.stats.productCount = items.length;
          // Optional: Calculate total value or other stats from items if needed
        }
      },
      error: (err) => console.error('Failed to load products for stats', err)
    });

    // Also fetch invoices count if endpoint exists, otherwise default to 0 or mock
    this.apiService.getInvoices(storeId!).subscribe({
      next: (invoices) => {
        if (invoices) {
          this.stats.invoiceCount = invoices.length;
        }
      },
      error: (err) => {
        console.error('Failed to load invoices for stats (expected if backend missing)', err);
        // Fallback or leave as 0
      }
    });

    /* Deprecated: dedicated stats endpoint might not exist yet
    this.apiService.getDashboardStats(this.storeId!).subscribe({
      next: (data) => {
        if(data) {
             this.stats = data;
        }
      },
      error: (err) => console.error('Failed to load stats', err)
    });
    */
  }
}
