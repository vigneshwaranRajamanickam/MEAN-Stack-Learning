import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngClass
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class SettingsComponent implements OnInit {
  currentMode: 'REST' | 'GRAPHQL' = 'REST';

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.currentMode = this.apiService.getMode();
  }

  setMode(mode: 'REST' | 'GRAPHQL') {
    this.apiService.setMode(mode);
    this.currentMode = mode;
  }
}
