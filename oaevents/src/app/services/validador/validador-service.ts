import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ValidadorOutputDto, ValidadorInputDto } from '../../model/validador';

@Injectable({
  providedIn: 'root',
})
export class ValidadorService {

  private urlValidador = environment.apiUrl + "/validador";

  constructor(private http: HttpClient){}

  findAll(): Observable<ValidadorOutputDto[]> {
    return this.http.get<ValidadorOutputDto[]>(this.urlValidador);
  }

  findById(id: number): Observable<ValidadorOutputDto> {
    return this.http.get<ValidadorOutputDto>(this.urlValidador + '/' + id);
  }

  save(validador: ValidadorInputDto): Observable<ValidadorOutputDto> {
    return this.http.post<ValidadorOutputDto>(this.urlValidador, validador);
  }

  update(id: number, validador: ValidadorInputDto): Observable<ValidadorOutputDto> {
    return this.http.put<ValidadorOutputDto>(this.urlValidador + '/' + id, validador)
  }

  deleteById(id: number): Observable<any> {
    return this.http.delete(this.urlValidador + '/' + id);
  }

}
