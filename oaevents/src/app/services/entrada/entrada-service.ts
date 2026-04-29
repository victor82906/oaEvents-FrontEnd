import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EntradaOutputDto, EntradaInputDto } from '../../model/entrada';

@Injectable({
  providedIn: 'root',
})
export class EntradaService {

  private urlEntrada = environment.apiUrl + "/entrada";

  constructor(private http: HttpClient){}

  findAll(): Observable<EntradaOutputDto[]> {
    return this.http.get(this.urlEntrada);
  }

  findById(id: number): Observable<EntradaOutputDto> {
    return this.http.get(this.urlEntrada + '/' + id);
  }

  save(entrada: EntradaInputDto): Observable<EntradaOutputDto> {
    return this.http.post(this.urlEntrada, entrada);
  }

  update(id: number, entrada: EntradaInputDto): Observable<EntradaOutputDto> {
    return this.http.put(this.urlEntrada + '/' + id, entrada)
  }

  deleteById(id: number): Observable<any> {
    return this.http.delete(this.urlEntrada + '/' + id);
  }

}
