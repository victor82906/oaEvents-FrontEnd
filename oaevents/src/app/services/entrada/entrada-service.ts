import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  EntradaOutputDto,
  EntradaInputDto,
  EntradaCompraLogueadoInputDto,
  EntradaCompraInputDto
} from '../../model/entrada';
import {Page} from '../../model/page';

@Injectable({
  providedIn: 'root',
})
export class EntradaService {

  private urlEntrada = environment.apiUrl + "/entrada";

  constructor(private http: HttpClient){}

  findAll(): Observable<EntradaOutputDto[]> {
    return this.http.get<EntradaOutputDto[]>(this.urlEntrada);
  }

  findAllPaged(page: number = 0, size: number = 10): Observable<Page<EntradaOutputDto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<EntradaOutputDto>>(this.urlEntrada + '/page', { params });
  }

  findByCompradorId(compradorId: number, page: number = 0, size: number = 10): Observable<Page<EntradaOutputDto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<EntradaOutputDto>>(this.urlEntrada + '/comprador/' + compradorId + '/page', { params });
  }

  findById(id: number): Observable<EntradaOutputDto> {
    return this.http.get<EntradaOutputDto>(this.urlEntrada + '/' + id);
  }

  comprarEntradasLogueado(entrada: EntradaCompraLogueadoInputDto): Observable<number[]> {
    return this.http.post<number[]>(this.urlEntrada + '/comprar/logueado', entrada);
  }

  comprarEntradas(entrada: EntradaCompraInputDto): Observable<number[]> {
    return this.http.post<number[]>(this.urlEntrada + '/comprar', entrada);
  }

  descargarEntrada(id: number): any {
    return this.http.get<any>(this.urlEntrada + id + '/descargar');
  }

  save(entrada: EntradaInputDto): Observable<EntradaOutputDto> {
    return this.http.post<EntradaOutputDto>(this.urlEntrada, entrada);
  }

  update(id: number, entrada: EntradaInputDto): Observable<EntradaOutputDto> {
    return this.http.put<EntradaOutputDto>(this.urlEntrada + '/' + id, entrada)
  }

  deleteById(id: number): Observable<any> {
    return this.http.delete(this.urlEntrada + '/' + id);
  }

}
