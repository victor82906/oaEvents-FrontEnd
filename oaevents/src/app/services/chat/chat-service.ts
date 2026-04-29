import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChatOutputDto, ChatInputDto } from '../../model/chat';

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  private urlChat = environment.apiUrl + "/chat";

  constructor(private http: HttpClient){}

  findAll(): Observable<ChatOutputDto[]> {
    return this.http.get<ChatOutputDto[]>(this.urlChat);
  }

  findById(id: number): Observable<ChatOutputDto> {
    return this.http.get<ChatOutputDto>(this.urlChat + '/' + id);
  }

  save(chat: ChatInputDto): Observable<ChatOutputDto> {
    return this.http.post<ChatOutputDto>(this.urlChat, chat);
  }

  update(id: number, chat: ChatInputDto): Observable<ChatOutputDto> {
    return this.http.put<ChatOutputDto>(this.urlChat + '/' + id, chat)
  }

  deleteById(id: number): Observable<any> {
    return this.http.delete(this.urlChat + '/' + id);
  }

  getConversacion(emisorId: number, receptorId: number, page: number = 0, size: number = 10, sort: string = 'fecha,desc'): Observable<ChatOutputDto[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    return this.http.get<ChatOutputDto[]>(`${this.urlChat}/conversacion/${emisorId}/${receptorId}`, { params });
  }

}
