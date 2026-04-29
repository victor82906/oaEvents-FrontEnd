import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EventoOutputDto, EventoInputDto } from '../../model/evento';

@Injectable({
  providedIn: 'root',
})
export class EventoService {

  private urlEvento = environment.apiUrl + "/evento";

  constructor(private http: HttpClient){}

  findAll(): Observable<EventoOutputDto[]> {
    return this.http.get(this.urlEvento);
  }

  findById(id: number): Observable<EventoOutputDto> {
    return this.http.get(this.urlEvento + '/' + id);
  }

  save(evento: EventoInputDto): Observable<EventoOutputDto> {
    return this.http.post(this.urlEvento, evento);
  }

  update(id: number, evento: EventoInputDto): Observable<EventoOutputDto> {
    return this.http.put(this.urlEvento + '/' + id, evento)
  }

  deleteById(id: number): Observable<any> {
    return this.http.delete(this.urlEvento + '/' + id);
  }

}
