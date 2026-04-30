import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EventoOutputDto, EventoInputDto } from '../../model/evento';
import { Page } from '../../model/page';

@Injectable({
  providedIn: 'root',
})
export class EventoService {

  private urlEvento = environment.apiUrl + "/evento";

  constructor(private http: HttpClient){}

  findAll(): Observable<EventoOutputDto[]> {
    return this.http.get<EventoOutputDto[]>(this.urlEvento);
  }

  findAllPaged(page: number = 0, size: number = 10): Observable<Page<EventoOutputDto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<EventoOutputDto>>(this.urlEvento + '/page', { params });
  }

  findAllAceptadosPaged(page: number = 0, size: number = 10): Observable<Page<EventoOutputDto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<EventoOutputDto>>(this.urlEvento + '/aceptados/page', { params });
  }

  findAllPendientesPaged(page: number = 0, size: number = 10): Observable<Page<EventoOutputDto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<EventoOutputDto>>(this.urlEvento + '/pendientes/page', { params });
  }

  findByEmpresaIdPaged(empresaId: number, page: number = 0, size: number = 10): Observable<Page<EventoOutputDto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<EventoOutputDto>>(this.urlEvento + '/empresa/' + empresaId + '/page', { params });
  }

  findAceptadosByEmpresaIdPaged(empresaId: number, page: number = 0, size: number = 10): Observable<Page<EventoOutputDto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<EventoOutputDto>>(this.urlEvento + '/empresa/' + empresaId + '/aceptados/page', { params });
  }

  findPendientesByEmpresaIdPaged(empresaId: number, page: number = 0, size: number = 10): Observable<Page<EventoOutputDto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<EventoOutputDto>>(this.urlEvento + '/empresa/' + empresaId + '/pendientes/page', { params });
  }

  findByTituloPaged(titulo: string, page: number = 0, size: number = 10): Observable<Page<EventoOutputDto>> {
    let params = new HttpParams()
      .set('titulo', titulo)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<EventoOutputDto>>(this.urlEvento + '/buscar/titulo/page', { params });
  }

  findByEmpresaIdAndTituloPaged(empresaId: number, titulo: string, page: number = 0, size: number = 10): Observable<Page<EventoOutputDto>> {
    let params = new HttpParams()
      .set('titulo', titulo)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<EventoOutputDto>>(this.urlEvento + '/empresa/' + empresaId + '/buscar/titulo/page', { params });
  }

  findByFechasPaged(fechaInicio: string, fechaFin: string, page: number = 0, size: number = 10): Observable<Page<EventoOutputDto>> {
    let params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<EventoOutputDto>>(this.urlEvento + '/buscar/fechas/page', { params });
  }

  findAceptadosByFechasPaged(fechaInicio: string, fechaFin: string, page: number = 0, size: number = 10): Observable<Page<EventoOutputDto>> {
    let params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<EventoOutputDto>>(this.urlEvento + '/buscar/aceptados/fechas/page', { params });
  }

  findById(id: number): Observable<EventoOutputDto> {
    return this.http.get<EventoOutputDto>(this.urlEvento + '/' + id);
  }

  save(evento: EventoInputDto): Observable<EventoOutputDto> {
    return this.http.post<EventoOutputDto>(this.urlEvento, evento);
  }

  addFoto(id: number, foto: File): Observable<EventoOutputDto> {
    const formData = new FormData();
    formData.append('archivo', foto);

    return this.http.post<EventoOutputDto>(this.urlEvento + '/' + id + '/foto', formData);
  }

  update(id: number, evento: EventoInputDto): Observable<EventoOutputDto> {
    return this.http.put<EventoOutputDto>(this.urlEvento + '/' + id, evento)
  }

  deleteById(id: number): Observable<any> {
    return this.http.delete(this.urlEvento + '/' + id);
  }

}
