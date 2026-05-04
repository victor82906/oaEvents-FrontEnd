import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {CambiarContrasenaDto, UsuarioOutputDto} from '../../model/usuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUser(): any{
    return JSON.parse(localStorage.getItem('usuario') || '{"rol": {"nombre": ""}}');
  }

  getId(): number{
    return this.getUser().id;
  }

  getNombre(): string{
    return this.getUser().nombre;
  }

  getRol(){
    return this.getUser().rol.nombre;
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getUserById(id: number): any {
    return this.http.get(this.apiUrl + "/usuario/" + id);
  }

  isAuth(): boolean {
    return this.getToken() ? true : false;
  }

}
