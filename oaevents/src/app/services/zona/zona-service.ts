import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ZonaOutputDto, ZonaInputDto } from '../../model/zona';

@Injectable({
  providedIn: 'root',
})
export class ZonaService {

  private urlZona = environment.apiUrl + "/zona";

  constructor(private http: HttpClient){}

  findAll(): Observable<ZonaOutputDto[]> {
    return this.http.get(this.urlZona);
  }

  findById(id: number): Observable<ZonaOutputDto> {
    return this.http.get(this.urlZona + '/' + id);
  }

  save(zona: ZonaInputDto): Observable<ZonaOutputDto> {
    return this.http.post(this.urlZona, zona);
  }

  update(id: number, zona: ZonaInputDto): Observable<ZonaOutputDto> {
    return this.http.put(this.urlZona + '/' + id, zona)
  }

  deleteById(id: number): Observable<any> {
    return this.http.delete(this.urlZona + '/' + id);
  }

}
