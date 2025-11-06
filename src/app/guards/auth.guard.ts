import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = this.auth.getToken();
    const user = this.auth.getUserData();

    // Verifica se o token existe e se o user existe
    if (!token || !user) {
      this.auth.logout();
      this.router.navigate(['/login']);
      return false;
    }

    // (Opcional) Verificar se o token expirou
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      if (isExpired) {
        this.auth.logout();
        this.router.navigate(['/login']);
        return false;
      }
    } catch (e) {
      this.auth.logout();
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
