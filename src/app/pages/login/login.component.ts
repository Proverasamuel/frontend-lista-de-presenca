import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        const user = res.user;
        if (!user) return;

        // ✅ Redirecionamento baseado no papel do usuário
        if (user.role === 'delegado') {
          this.router.navigate(['/aulas']);
        } else if (user.role === 'aluno') {
          this.router.navigate(['/presenca']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        console.error('Erro de login:', err);
        this.error = err.error?.error?.message || 'Erro ao fazer login';
      },
    });
  }
}
