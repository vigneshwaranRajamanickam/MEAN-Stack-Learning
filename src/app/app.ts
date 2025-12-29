import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ItemListComponent } from './components/item-list/item-list.component';
import { ItemAddComponent } from './components/item-add/item-add.component';
import { ApiService } from './services/api.service';
import { ThemeService } from './services/theme.service';
import { AuthService } from './services/auth.service';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogService } from './services/confirm-dialog.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ItemListComponent,
    ItemAddComponent,
    FormsModule,
    ConfirmDialogComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('MEAN Stack Learning App');
  isUserMenuOpen = signal(false);

  constructor(
    public apiService: ApiService,
    public themeService: ThemeService,
    public authService: AuthService,
    private router: Router,
    private confirmDialogService: ConfirmDialogService
  ) {
    // Mode handled by signal
  }

  onServerChange(mode: 'REST' | 'GRAPHQL') {
    this.apiService.setMode(mode);
  }

  toggleUserMenu() {
    this.isUserMenuOpen.update(v => !v);
  }

  closeUserMenu() {
    this.isUserMenuOpen.set(false);
  }

  async confirmLogout() {
    const confirmed = await this.confirmDialogService.confirm('Are you sure you want to log out?', 'Confirm Logout');
    if (confirmed) {
      this.logout();
    }
  }

  logout() {
    this.authService.logout();
    this.closeUserMenu();
    this.router.navigate(['/login']);
  }
}
