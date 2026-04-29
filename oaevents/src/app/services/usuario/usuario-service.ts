import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UsuarioOutputDto, UsuarioInputDto } from '../../model/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  private urlUsuario = environment.apiUrl + "/usuario";

  constructor(private http: HttpClient){}

  findAll(): Observable<UsuarioOutputDto[]> {
    return this.http.get(this.urlUsuario);
  }

  findById(id: number): Observable<UsuarioOutputDto> {
    return this.http.get(this.urlUsuario + '/' + id);
  }

  save(usuario: UsuarioInputDto): Observable<UsuarioOutputDto> {
    return this.http.post(this.urlUsuario, usuario);
  }

  update(id: number, usuario: UsuarioInputDto): Observable<UsuarioOutputDto> {
    return this.http.put(this.urlUsuario + '/' + id, usuario)
  }

  deleteById(id: number): Observable<any> {
    return this.http.delete(this.urlUsuario + '/' + id);
  }

}
