import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMsg: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Clear local storage when navigating to login
    localStorage.clear();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          const role = this.authService.getRole();
          if (role === 'admin') {
            this.router.navigate(['/admin-dashboard']);
          } else if (this.authService.getStoreId()) {
            this.router.navigate(['/dashboard']);
          } else {
            // Non-admin user without a store selected (shouldn't happen often if flow is strict)
            // But if it does, maybe redirect to a user-specific "select store" or error page?
            // For now, let's assume they might need to go to store selector if permitted, or just home.
            // Since we restricted store selector to admins, we should probably auto-assign or handle this.
            // For this specific request, let's keep it simple: 
            this.router.navigate(['/pos']);
          }
        },
        error: (err) => {
          this.errorMsg = err.error?.message || 'Login failed';
        }
      });
    }
  }
}
