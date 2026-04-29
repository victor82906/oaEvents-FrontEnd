import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {CompradorOutputDto} from '../../model/comprador';

@Injectable({
  providedIn: 'root',
})
export class CompradorService {

  private urlComprador = environment.apiUrl + "/comprador";

  constructor(private http: HttpClient){}

  findAll(): Observable<CompradorOutputDto[]> {
    return this.http.get<CompradorOutputDto[]>(this.urlComprador);
  }

  findById(id: number): Observable<CompradorOutputDto> {
    return this.http.get<CompradorOutputDto>(this.urlComprador + '/' + id);
  }

  save(comprador: CompradorOutputDto): Observable<CompradorOutputDto> {
    return this.http.post<CompradorOutputDto>(this.urlComprador, comprador);
  }

  update(id: number, comprador: CompradorOutputDto): Observable<CompradorOutputDto> {
    return this.http.put<CompradorOutputDto>(this.urlComprador + '/' + id, comprador)
  }

  deleteById(id: number): Observable<any> {
    return this.http.delete(this.urlComprador + '/' + id);
  }

}
