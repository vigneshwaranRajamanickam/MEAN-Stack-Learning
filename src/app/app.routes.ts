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
  { path: 'store-selector', component: StoreSelectorComponent, canActivate: [authGuard] },
  {
    path: 'pos',
    component: PosComponent,
    canActivate: [authGuard]
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'products', component: ProductListComponent },
      { path: 'settings', component: SettingsComponent },
      // Redirect to store selector if no store is selected (logic can be in guard or component)
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
