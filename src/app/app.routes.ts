import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
// Assuming you have other components like Home or Items List
import { ItemListComponent } from './components/item-list/item-list.component';
import { ItemAddComponent } from './components/item-add/item-add.component';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'product-add', component: ItemAddComponent, canActivate: [authGuard] },
  { path: 'products', component: ItemListComponent, canActivate: [authGuard] },
  // { path: '', component: ItemListComponent }, // Default route
  { path: '', redirectTo: '/login', pathMatch: 'full' } // Redirect to login for now if no home
];
