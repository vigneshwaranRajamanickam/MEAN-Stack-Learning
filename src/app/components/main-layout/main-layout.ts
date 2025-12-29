import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { RouterOutlet, Router } from '@angular/router';
import { SidenavComponent } from '../sidenav/sidenav';
import { AuthService } from '../../services/auth.service';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidenavComponent], // Add CommonModule
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayoutComponent {
  isSidebarOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private confirmDialogService: ConfirmDialogService
  ) { }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  async confirmLogout() {
    const confirmed = await this.confirmDialogService.confirm('Are you sure you want to log out?', 'Logout');
    if (confirmed) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}
