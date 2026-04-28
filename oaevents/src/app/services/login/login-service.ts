import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  private urlToken = environment.apiUrl + '/auth/login';
  private urlUsuario = environment.apiUrl + '/auth/who';

  constructor(private http: HttpClient) {}

  getTokenFromServer(usuario: any): Observable<any> {
    return this.http.post(this.urlToken, usuario);
  }

  getUsuarioFromServer(token: string): Observable<any> {
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get(this.urlUsuario, {headers});
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('usuario');
  }

  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  setUsuario(usuario: any): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

}
