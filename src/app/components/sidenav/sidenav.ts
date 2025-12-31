import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {
  storeName: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private confirmDialogService: ConfirmDialogService
  ) { }

  ngOnInit() {
    this.storeName = this.authService.getStoreName();
  }

  async confirmLogout() {
    const confirmed = await this.confirmDialogService.confirm('Are you sure you want to log out?', 'Logout');
    if (confirmed) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.confirmLogout();
  }
}
