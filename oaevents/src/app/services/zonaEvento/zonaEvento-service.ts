import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ZonaEventoOutputDto, ZonaEventoInputDto } from '../../model/zonaEvento';

@Injectable({
  providedIn: 'root',
})
export class ZonaEventoService {

  private urlZonaEvento = environment.apiUrl + "/zona-evento";

  constructor(private http: HttpClient){}

  findAll(): Observable<ZonaEventoOutputDto[]> {
    return this.http.get(this.urlZonaEvento);
  }

  findById(id: number): Observable<ZonaEventoOutputDto> {
    return this.http.get(this.urlZonaEvento + '/' + id);
  }

  save(zonaEvento: ZonaEventoInputDto): Observable<ZonaEventoOutputDto> {
    return this.http.post(this.urlZonaEvento, zonaEvento);
  }

  update(id: number, zonaEvento: ZonaEventoInputDto): Observable<ZonaEventoOutputDto> {
    return this.http.put(this.urlZonaEvento + '/' + id, zonaEvento)
  }

  deleteById(id: number): Observable<any> {
    return this.http.delete(this.urlZonaEvento + '/' + id);
  }

}
