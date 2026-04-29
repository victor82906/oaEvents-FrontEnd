import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EmpresaOutputDto, EmpresaInputDto } from '../../model/empresa';

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {

  private urlEmpresa = environment.apiUrl + "/empresa";

  constructor(private http: HttpClient){}

  findAll(): Observable<EmpresaOutputDto[]> {
    return this.http.get(this.urlEmpresa);
  }

  findById(id: number): Observable<EmpresaOutputDto> {
    return this.http.get(this.urlEmpresa + '/' + id);
  }

  save(empresa: EmpresaInputDto): Observable<EmpresaOutputDto> {
    return this.http.post(this.urlEmpresa, empresa);
  }

  update(id: number, empresa: EmpresaInputDto): Observable<EmpresaOutputDto> {
    return this.http.put(this.urlEmpresa + '/' + id, empresa)
  }

  deleteById(id: number): Observable<any> {
    return this.http.delete(this.urlEmpresa + '/' + id);
  }

}
