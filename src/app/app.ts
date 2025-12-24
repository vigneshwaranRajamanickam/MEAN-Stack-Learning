import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ItemListComponent } from './components/item-list/item-list.component';
import { ItemAddComponent } from './components/item-add/item-add.component';
import { ApiService } from './services/api.service';
import { ThemeService } from './services/theme.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ItemListComponent, ItemAddComponent, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('MEAN Stack Learning App');
  selectedServer: 'REST' | 'GRAPHQL' = 'REST';
  isUserMenuOpen = signal(false);

  constructor(private apiService: ApiService, public themeService: ThemeService, public authService: AuthService, private router: Router) {
    this.selectedServer = this.apiService.getMode();
  }

  onServerChange() {
    this.apiService.setMode(this.selectedServer);
  }

  toggleUserMenu() {
    this.isUserMenuOpen.update(v => !v);
  }

  closeUserMenu() {
    this.isUserMenuOpen.set(false);
  }

  logout() {
    this.authService.logout();
    this.closeUserMenu();
    this.router.navigate(['/login']);
  }
}
