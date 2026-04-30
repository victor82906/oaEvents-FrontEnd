import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { QrOutputDto, QrInputDto, CheckQrDto } from '../../model/qr';

@Injectable({
  providedIn: 'root',
})
export class QrService {

  private urlQr = environment.apiUrl + "/qr";

  constructor(private http: HttpClient){}

  findAll(): Observable<QrOutputDto[]> {
    return this.http.get<QrOutputDto[]>(this.urlQr);
  }

  findById(id: number): Observable<QrOutputDto> {
    return this.http.get<QrOutputDto>(this.urlQr + '/' + id);
  }

  save(qr: QrInputDto): Observable<QrOutputDto> {
    return this.http.post<QrOutputDto>(this.urlQr, qr);
  }

  checkQr(checkQrDto: CheckQrDto): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(this.urlQr + '/check', checkQrDto);
  }

  update(id: number, qr: QrInputDto): Observable<QrOutputDto> {
    return this.http.put<QrOutputDto>(this.urlQr + '/' + id, qr)
  }

  deleteById(id: number): Observable<any> {
    return this.http.delete(this.urlQr + '/' + id);
  }

}
