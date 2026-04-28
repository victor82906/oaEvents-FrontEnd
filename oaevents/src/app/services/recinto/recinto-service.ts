import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
class RecintoService {

  private urlRecinto = environment.apiUrl + "/recinto";

  constructor(private http: HttpClient){}

  findAll(): Observable<any> {
    return this.http.get(this.urlRecinto);
  }

  findById(id: number): Observable<any> {
    return this.http.get(this.urlRecinto + '/' + id);
  }

}
