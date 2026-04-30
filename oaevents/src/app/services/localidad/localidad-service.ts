import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LocalidadOutputDto, LocalidadInputDto } from '../../model/localidad';

@Injectable({
  providedIn: 'root',
})
export class LocalidadService {

  private urlLocalidad = environment.apiUrl + "/localidad";

  constructor(private http: HttpClient){}

  findAll(): Observable<LocalidadOutputDto[]> {
    return this.http.get<LocalidadOutputDto[]>(this.urlLocalidad);
  }

  findByZonaId(zonaId: number): Observable<LocalidadOutputDto[]> {
    return this.http.get<LocalidadOutputDto[]>(this.urlLocalidad + '/zona/' + zonaId);
  }

  findLocalidadesLibres(zonaEventoId: number): Observable<LocalidadOutputDto[]> {
    return this.http.get<LocalidadOutputDto[]>(this.urlLocalidad + '/' + zonaEventoId + '/libres');
  }

  findById(id: number): Observable<LocalidadOutputDto> {
    return this.http.get<LocalidadOutputDto>(this.urlLocalidad + '/' + id);
  }

  save(localidad: LocalidadInputDto): Observable<LocalidadOutputDto> {
    return this.http.post<LocalidadOutputDto>(this.urlLocalidad, localidad);
  }

  update(id: number, localidad: LocalidadInputDto): Observable<LocalidadOutputDto> {
    return this.http.put<LocalidadOutputDto>(this.urlLocalidad + '/' + id, localidad)
  }

  deleteById(id: number): Observable<any> {
    return this.http.delete(this.urlLocalidad + '/' + id);
  }

}
