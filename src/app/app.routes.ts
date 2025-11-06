import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AulasComponent } from './pages/aulas/aulas.component';
import { PresencaComponent } from './pages/presenca/presenca.component';
import { DelegadoComponent } from './layout/delegado/delegado.component';

export const routes: Routes = [
  // 🔐 Rotas protegidas (Delegado)
  {
    path: '',
    component: DelegadoComponent,
    canActivate: [AuthGuard], // protege o layout inteiro
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [RoleGuard], // apenas delegado
      },
      {
        path: 'aulas',
        component: AulasComponent,
        canActivate: [RoleGuard], // apenas delegado
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },

  // 👨‍🎓 Aluno
  {
    path: 'presenca',
    component: PresencaComponent,
    canActivate: [AuthGuard], // qualquer aluno logado
  },

  // 🔓 Público
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // 🚫 Rota inexistente → redireciona
  { path: '**', redirectTo: 'login' },
];
