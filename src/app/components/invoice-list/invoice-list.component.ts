import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { PrintService } from '../../services/print.service';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {
  invoices: any[] = [];
  storeId: string | null = null;
  loading = true;

  constructor(
    private apiService: ApiService,
    private printService: PrintService
  ) { }

  ngOnInit() {
    this.storeId = localStorage.getItem('store_id');
    if (this.storeId) {
      this.loadInvoices();
    } else {
      this.loading = false;
    }
  }

  loadInvoices() {
    this.loading = true;
    this.apiService.getInvoices(this.storeId!).subscribe({
      next: (data) => {
        this.invoices = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load invoices', err);
        this.loading = false;
      }
    });
  }

  viewInvoice(invoice: any) {
    // Adapter to match PrintService expected format
    const receiptData = {
      storeName: localStorage.getItem('store_name') || 'Store', // Ideally should come from invoice data
      storeAddress: localStorage.getItem('store_address'), // Retrieve address
      customerName: invoice.customerName,
      items: invoice.items || [], // Mock items if not returned by list api, or fetch details
      totalAmount: invoice.totalAmount,
      date: invoice.date,
      invoiceNumber: invoice.invoiceNumber
    };
    this.printService.printReceipt(receiptData);
  }
}
