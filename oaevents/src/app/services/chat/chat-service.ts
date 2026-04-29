import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'YOUR_API_BASE_URL/chat';

  constructor(private http: HttpClient) { }

  // Example method:
  // getChats(): Observable<any[]> {
  //   return this.http.get<any[]>(this.apiUrl);
  // }
}
