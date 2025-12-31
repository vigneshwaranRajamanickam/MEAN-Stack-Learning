import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {

        // Check if user is logged in
        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['/login']);
            return false;
        }

        // Check roles
        const expectedRoles = route.data['roles'] as Array<string>;
        const userRole = this.authService.getRole();

        if (expectedRoles && userRole && !expectedRoles.includes(userRole)) {
            // Role not authorized, redirect to home or unauthorized page
            this.router.navigate(['/']);
            return false;
        }

        return true;
    }
}
