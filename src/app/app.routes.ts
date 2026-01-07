import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { MainLayoutComponent } from './components/main-layout/main-layout';
import { DashboardComponent } from './components/dashboard/dashboard';
import { ProductListComponent } from './components/product-list/product-list';
import { SettingsComponent } from './components/settings/settings';
import { PosComponent } from './components/pos/pos.component';
import { StoreSelectorComponent } from './components/store-selector/store-selector.component';
import { authGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  {
    path: 'store-selector',
    component: StoreSelectorComponent,
    canActivate: [authGuard, RoleGuard],
    data: { roles: ['admin'] }
  },
  { path: 'admin-dashboard', loadComponent: () => import('./components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent), canActivate: [authGuard, RoleGuard], data: { roles: ['admin'] } },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'products', component: ProductListComponent },
      { path: 'invoices', loadComponent: () => import('./components/invoice-list/invoice-list.component').then(m => m.InvoiceListComponent) },
      { path: 'settings', component: SettingsComponent },
      { path: 'pos', component: PosComponent },
      // Redirect to store selector if no store is selected
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
