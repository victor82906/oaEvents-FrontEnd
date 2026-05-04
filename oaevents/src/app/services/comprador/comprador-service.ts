import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {CompradorInputDto, CompradorOutputDto} from '../../model/comprador';
import {Page} from '../../model/page';

@Injectable({
  providedIn: 'root',
})
export class CompradorService {

  private urlComprador = environment.apiUrl + "/comprador";

  constructor(private http: HttpClient){}

  findAll(): Observable<CompradorOutputDto[]> {
    return this.http.get<CompradorOutputDto[]>(this.urlComprador);
  }

  findAllPaged(page: number = 0, size: number = 10): Observable<Page<CompradorOutputDto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<CompradorOutputDto>>(this.urlComprador + '/page', { params });
  }

  buscar(termino: string, page: number = 0, size: number = 10, sort: string = 'nombre', direccion: string = 'asc' ): Observable<Page<CompradorOutputDto>> {
    let params = new HttpParams()
      .set('termino', termino)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort + ',' + direccion);

    return this.http.get<Page<CompradorOutputDto>>(this.urlComprador + '/buscar/page', { params });
  }

  findById(id: number): Observable<CompradorOutputDto> {
    return this.http.get<CompradorOutputDto>(this.urlComprador + '/' + id);
  }

  save(comprador: CompradorInputDto): Observable<CompradorOutputDto> {
    return this.http.post<CompradorOutputDto>(this.urlComprador, comprador);
  }

  update(id: number, comprador: CompradorInputDto): Observable<CompradorOutputDto> {
    return this.http.put<CompradorOutputDto>(this.urlComprador + '/' + id, comprador)
  }

  deleteById(id: number): Observable<any> {
    return this.http.delete(this.urlComprador + '/' + id);
  }

}
