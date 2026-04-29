import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RecintoOutputDto, RecintoInputDto } from '../../model/recinto';

@Injectable({
  providedIn: 'root',
})
export class RecintoService {

  private urlRecinto = environment.apiUrl + "/recinto";

  constructor(private http: HttpClient){}

  findAll(): Observable<RecintoOutputDto[]> {
    return this.http.get(this.urlRecinto);
  }

  findById(id: number): Observable<RecintoOutputDto> {
    return this.http.get(this.urlRecinto + '/' + id);
  }

  save(recinto: RecintoInputDto): Observable<RecintoOutputDto> {
    return this.http.post(this.urlRecinto, recinto);
  }

  update(id: number, recinto: RecintoInputDto): Observable<RecintoOutputDto> {
    return this.http.put(this.urlRecinto + '/' + id, recinto)
  }

  deleteById(id: number): Observable<any> {
    return this.http.delete(this.urlRecinto + '/' + id);
  }

}
