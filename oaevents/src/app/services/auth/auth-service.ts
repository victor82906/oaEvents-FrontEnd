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

  getUser(): UsuarioOutputDto{
    return JSON.parse(localStorage.getItem('usuario') || '{}');
  }

  getId(): number{
    return this.getUser().id;
  }

  getNombre(): string{
    return this.getUser().nombre;
  }

  getRol(){
    return this.getUser().rol;
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getUserById(id: number): Observable<UsuarioOutputDto> {
    return this.http.get<UsuarioOutputDto>(this.apiUrl + "/usuario/" + id);
  }

  cambiarContrasena(id: number, contrasenas: CambiarContrasenaDto): Observable<any>{
    return this.http.post<any>(this.apiUrl + "/usuario/contrasena/" + id, contrasenas);
  }

  isAuth(): boolean {
    return this.getToken() ? true : false;
  }

}
