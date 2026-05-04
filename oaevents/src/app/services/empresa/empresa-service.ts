import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EmpresaOutputDto, EmpresaInputDto } from '../../model/empresa';
import {Page} from '../../model/page';

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {

  private urlEmpresa = environment.apiUrl + "/empresa";

  constructor(private http: HttpClient){}

  findAll(): Observable<EmpresaOutputDto[]> {
    return this.http.get<EmpresaOutputDto[]>(this.urlEmpresa);
  }

  findAllPaged(page: number = 0, size: number = 10): Observable<Page<EmpresaOutputDto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<EmpresaOutputDto>>(this.urlEmpresa + '/page', { params });
  }

  findAllActivas(page: number = 0, size: number = 10): Observable<Page<EmpresaOutputDto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<EmpresaOutputDto>>(this.urlEmpresa + '/activas/page', { params });
  }

  findAllInactivas(page: number = 0, size: number = 10): Observable<Page<EmpresaOutputDto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<EmpresaOutputDto>>(this.urlEmpresa + '/inactivas/page', { params });
  }

  buscar(termino: string, page: number = 0, size: number = 10): Observable<Page<EmpresaOutputDto>> {
    let params = new HttpParams()
      .set('termino', termino)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<EmpresaOutputDto>>(this.urlEmpresa + '/buscar/page', { params });
  }

  buscarActivas(termino: string, page: number = 0, size: number = 10): Observable<Page<EmpresaOutputDto>> {
    let params = new HttpParams()
      .set('termino', termino)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<EmpresaOutputDto>>(this.urlEmpresa + '/activas/buscar/page', { params });
  }

  buscarInactivas(termino: string, page: number = 0, size: number = 10): Observable<Page<EmpresaOutputDto>> {
    let params = new HttpParams()
      .set('termino', termino)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<EmpresaOutputDto>>(this.urlEmpresa + '/inactivas/buscar/page', { params });
  }

  findById(id: number): Observable<EmpresaOutputDto> {
    return this.http.get<EmpresaOutputDto>(this.urlEmpresa + '/' + id);
  }

  save(empresa: EmpresaInputDto): Observable<EmpresaOutputDto> {
    return this.http.post<EmpresaOutputDto>(this.urlEmpresa, empresa);
  }

  update(id: number, empresa: EmpresaInputDto): Observable<EmpresaOutputDto> {
    return this.http.put<EmpresaOutputDto>(this.urlEmpresa + '/' + id, empresa);
  }

  activar(id: number): Observable<EmpresaOutputDto> {
    return this.http.patch<EmpresaOutputDto> (this.urlEmpresa + '/' + id + '/activar', null);
  }

  desactivar(id: number): Observable<EmpresaOutputDto> {
    return this.http.patch<EmpresaOutputDto> (this.urlEmpresa + '/' + id + '/desactivar', null);
  }

  deleteById(id: number): Observable<any> {
    return this.http.delete(this.urlEmpresa + '/' + id);
  }

}
