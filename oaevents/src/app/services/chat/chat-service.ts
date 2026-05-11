import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChatOutputDto, ChatInputDto } from '../../model/chat';
import {Page} from '../../model/page';
import { Client, Message } from '@stomp/stompjs';
// @ts-ignore
import SockJS from 'sockjs-client/dist/sockjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  private urlChat = environment.apiUrl + "/chat";
  private wsUrl = environment.apiUrl + '/ws-chat';

  private stompClient: Client | null = null;
  private mensajesNuevosSubject: Subject<ChatOutputDto> = new Subject<ChatOutputDto>();

  constructor(private http: HttpClient){}

  findAll(): Observable<ChatOutputDto[]> {
    return this.http.get<ChatOutputDto[]>(this.urlChat);
  }

  findById(id: number): Observable<ChatOutputDto> {
    return this.http.get<ChatOutputDto>(this.urlChat + '/' + id);
  }

  save(chat: ChatInputDto): Observable<void> {
    return this.http.post<void>(this.urlChat, chat);
  }

  update(id: number, chat: ChatInputDto): Observable<ChatOutputDto> {
    return this.http.put<ChatOutputDto>(this.urlChat + '/' + id, chat)
  }

  deleteById(id: number): Observable<any> {
    return this.http.delete(this.urlChat + '/' + id);
  }

  getConversacion(emisorId: number, receptorId: number, page: number = 0, size: number = 10, sort: string = 'fecha,desc'): Observable<Page<ChatOutputDto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    return this.http.get<Page<ChatOutputDto>>(`${this.urlChat}/conversacion/${emisorId}/${receptorId}`, { params });
  }

  conectar() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(this.wsUrl),
      reconnectDelay: 5000,
      debug: (str) => console.log(str)
    });

    this.stompClient.onConnect = () => {
      this.stompClient?.subscribe('/user/queue/mensajes', (message: Message) => {
        if (message.body) {
          const mensajeRecibido: ChatOutputDto = JSON.parse(message.body);
          this.mensajesNuevosSubject.next(mensajeRecibido);
        }
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Error en STOMP: ', frame.headers['message']);
    };
    this.stompClient.activate();
  }

  getMensajesNuevos(): Observable<ChatOutputDto> {
    return this.mensajesNuevosSubject.asObservable();
  }

  desconectar() {
    if (this.stompClient !== null) {
      this.stompClient.deactivate();
    }
  }
  
}
