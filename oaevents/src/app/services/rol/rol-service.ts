import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RolOutputDto, RolInputDto } from '../../model/rol';

@Injectable({
  providedIn: 'root',
})
export class RolService {

  private urlRol = environment.apiUrl + "/rol";

  constructor(private http: HttpClient){}

  findAll(): Observable<RolOutputDto[]> {
    return this.http.get<RolOutputDto[]>(this.urlRol);
  }

  findById(id: number): Observable<RolOutputDto> {
    return this.http.get<RolOutputDto>(this.urlRol + '/' + id);
  }

  save(rol: RolInputDto): Observable<RolOutputDto> {
    return this.http.post<RolOutputDto>(this.urlRol, rol);
  }

  update(id: number, rol: RolInputDto): Observable<RolOutputDto> {
    return this.http.put<RolOutputDto>(this.urlRol + '/' + id, rol)
  }

  deleteById(id: number): Observable<any> {
    return this.http.delete(this.urlRol + '/' + id);
  }

}
