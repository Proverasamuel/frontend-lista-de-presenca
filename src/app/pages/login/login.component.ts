import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  rememberMe = false;
  error = '';
  loading = false;
  submitted = false;
  showPassword = false;
  currentYear = new Date().getFullYear();

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Verificar se há credenciais salvas
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      this.email = savedEmail;
      this.rememberMe = true;
    }
  }

  login() {
    this.submitted = true;
    this.error = '';
    this.loading = true;

    // Validação básica do formulário
    if (!this.email || !this.password) {
      this.error = 'Por favor, preencha todos os campos.';
      this.loading = false;
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.error = 'Por favor, insira um email válido.';
      this.loading = false;
      return;
    }

    // Salvar email se "Lembrar-me" estiver marcado
    if (this.rememberMe) {
      localStorage.setItem('rememberedEmail', this.email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    // Chamada do serviço de autenticação
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        this.loading = false;
        const user = res.user;
        
        if (!user) {
          this.error = 'Erro ao recuperar informações do usuário.';
          return;
        }

        // ✅ Redirecionamento baseado no papel do usuário
        this.handleUserRedirect(user);
      },
      error: (err) => {
        this.loading = false;
        console.error('Erro de login:', err);
        
        // Tratamento de erros específicos
        if (err.status === 401) {
          this.error = 'Email ou senha incorretos.';
        } else if (err.status === 0) {
          this.error = 'Erro de conexão. Verifique sua internet.';
        } else {
          this.error = err.error?.error?.message || 'Erro ao fazer login. Tente novamente.';
        }
      }
    });
  }

  private handleUserRedirect(user: any) {
    switch (user.role) {
      case 'delegado':
        this.router.navigate(['/dashboard']).then(success => {
          if (!success) {
            this.router.navigate(['/aulas']);
          }
        });
        break;
      case 'aluno':
        this.router.navigate(['/presenca']).then(success => {
          if (!success) {
            this.router.navigate(['/']);
          }
        });
        break;
      default:
        this.router.navigate(['/']);
        break;
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    const passwordField = document.getElementById('password') as HTMLInputElement;
    if (passwordField) {
      passwordField.type = this.showPassword ? 'text' : 'password';
    }
  }

  socialLogin(provider: 'google' | 'microsoft') {
    this.loading = true;
    this.error = '';

    // Simulação de login social (substituir pela implementação real)
    setTimeout(() => {
      this.loading = false;
      this.error = `Login com ${provider} ainda não implementado.`;
    }, 1500);
  }

  // Método para limpar erros quando o usuário começa a digitar
  onInputChange() {
    if (this.error) {
      this.error = '';
    }
  }
}