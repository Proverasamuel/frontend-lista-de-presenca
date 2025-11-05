import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AulasComponent } from './pages/aulas/aulas.component';
import { PresencaComponent } from './pages/presenca/presenca.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
   {
    path: 'aulas',
    component: AulasComponent,
    canActivate: [AuthGuard, RoleGuard], // ✅ só delegado
  },
  {
    path: 'presenca',
    component: PresencaComponent,
    canActivate: [AuthGuard], // ✅ qualquer aluno logado
  },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },


];
