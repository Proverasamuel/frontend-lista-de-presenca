import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiKey = 'AIzaSyDvDLPMjP6ZId9eIkGQI5ZIl3dmLmPr5w0';
  private loginUrl = `https://backend-lista-de-presenca.onrender.com/api/users/login`;
  private registerUrl = `https://backend-lista-de-presenca.onrender.com/api/users/register`;

  constructor(private http: HttpClient) {}

  /** 🔑 Registrar novo utilizador */
  register(name:string, email: string, password: string, role: string): Observable<any> {
    return this.http.post(this.registerUrl, {
      name,
      email,
      password,
      role,
    });
  }

  /** 🔒 Login de utilizador */
 login(email: string, password: string): Observable<any> {
  return this.http.post(this.loginUrl, { email, password }).pipe(
    tap((res: any) => {
      if (res.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
      }
    })
  );
}

getUserData() {
  return JSON.parse(localStorage.getItem('user') || '{}');
}


  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn() {
    return !!this.getToken();
  }
}
