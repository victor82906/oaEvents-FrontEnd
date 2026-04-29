import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TipoEventoOutputDto, TipoEventoInputDto } from '../../model/tipoEvento';

@Injectable({
  providedIn: 'root',
})
export class TipoEventoService {

  private urlTipoEvento = environment.apiUrl + "/tipo-evento";

  constructor(private http: HttpClient){}

  findAll(): Observable<TipoEventoOutputDto[]> {
    return this.http.get(this.urlTipoEvento);
  }

  findById(id: number): Observable<TipoEventoOutputDto> {
    return this.http.get(this.urlTipoEvento + '/' + id);
  }

  save(tipoEvento: TipoEventoInputDto): Observable<TipoEventoOutputDto> {
    return this.http.post(this.urlTipoEvento, tipoEvento);
  }

  update(id: number, tipoEvento: TipoEventoInputDto): Observable<TipoEventoOutputDto> {
    return this.http.put(this.urlTipoEvento + '/' + id, tipoEvento)
  }

  deleteById(id: number): Observable<any> {
    return this.http.delete(this.urlTipoEvento + '/' + id);
  }

}
