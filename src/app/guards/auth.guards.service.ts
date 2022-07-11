import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {

  }
  canActivate() {

    return true;
    if (this.authService.getCurrentUser()) {
      // El usuario está autenticado
      return true;
    } else {
      // Redirigimos al usuario a la pantalla de login
      this.router.navigate(['/login']);
      return false;
    }

  }

}
