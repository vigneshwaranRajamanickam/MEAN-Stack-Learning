import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  totalStores = 0;
  activeStores = 0;
  totalEmployees = 0; // Placeholder until we have an Employee API

  constructor(private storeService: StoreService) { }

  ngOnInit(): void {
    this.storeService.getStores().subscribe({
      next: (stores) => {
        this.totalStores = stores.length;
        // In this schema, stores don't have an explicit 'active' flag yet, 
        // so we'll assume all stores are active or just show total for now.
        // We can mimic 'active' as total for this iteration.
        this.activeStores = stores.length;

        // Mocking employees count for now
        this.totalEmployees = Math.floor(Math.random() * 50) + 10;
      },
      error: (err) => console.error('Failed to load store stats', err)
    });
  }
}
