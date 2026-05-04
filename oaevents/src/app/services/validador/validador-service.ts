import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ValidadorOutputDto, ValidadorInputDto } from '../../model/validador';
import { Page } from '../../model/page';

@Injectable({
  providedIn: 'root',
})
export class ValidadorService {

  private urlValidador = environment.apiUrl + "/validador";

  constructor(private http: HttpClient){}

  findAll(): Observable<ValidadorOutputDto[]> {
    return this.http.get<ValidadorOutputDto[]>(this.urlValidador);
  }

  findAllPaged(page: number = 0, size: number = 10): Observable<Page<ValidadorOutputDto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<ValidadorOutputDto>>(this.urlValidador + '/page', { params });
  }

  buscar(termino: string, page: number = 0, size: number = 10, sort: string = 'nombre', direccion: string = 'asc' ): Observable<Page<ValidadorOutputDto>> {
    let params = new HttpParams()
      .set('termino', termino)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort + ',' + direccion);

    return this.http.get<Page<ValidadorOutputDto>>(this.urlValidador + '/buscar/page', { params });
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
