import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatService } from '../../services/chat/chat-service';
import { AuthService } from '../../services/auth/auth-service';
import { UsuarioService } from '../../services/usuario/usuario-service';
import { ChatOutputDto, ChatInputDto } from '../../model/chat';
import { UsuarioOutputDto } from '../../model/usuario';
import { Cabecera } from '../cabecera/cabecera';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Cabecera,
    Footer
  ],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('mensajesContainer') mensajesContainer!: ElementRef;

  mensajes: ChatOutputDto[] = [];
  nuevoMensaje: string = '';
  emisorId: number = 0;
  receptorId: number = 0;
  usuario: UsuarioOutputDto | null = null;
  cargando = false;
  enviando = false;

  private mensajesSub: Subscription | null = null;
  private debeScrollar = false;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.emisorId = this.authService.getId();
    this.route.queryParams.subscribe(params => {
      this.receptorId = Number(params['receptorId']);
    });

    this.cargarUsuario();
    this.cargarConversacion();

    this.chatService.conectar();

    this.mensajesSub = this.chatService.getMensajesNuevos().subscribe(msg => {
      if (
        (msg.emisor_id === this.emisorId && msg.receptor_id === this.receptorId) ||
        (msg.emisor_id === this.receptorId && msg.receptor_id === this.emisorId)
      ) {
        this.mensajes.push(msg);
        this.debeScrollar = true;
        this.cdr.markForCheck();
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.debeScrollar) {
      this.scrollAlFinal();
      this.debeScrollar = false;
    }
  }

  ngOnDestroy(): void {
    this.chatService.desconectar();
    this.mensajesSub?.unsubscribe();
  }

  cargarUsuario(): void {
    this.usuarioService.findById(this.receptorId).subscribe({
      next: (usuario: UsuarioOutputDto) => {
        this.usuario = usuario;
        this.cdr.markForCheck();
      },
      error: (error: any) => {
        console.error('Error al cargar usuario receptor:', error);
        this.cdr.markForCheck();
      }
    });
  }

  cargarConversacion(): void {
    this.cargando = true;
    this.chatService.getConversacion(this.emisorId, this.receptorId, 0, 40).subscribe({
      next: (page) => {
        this.mensajes = page.content.reverse();
        this.cargando = false;
        this.debeScrollar = true;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar conversación:', error);
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  enviarMensaje(): void {
    const texto = this.nuevoMensaje.trim();
    if (!texto || this.enviando) return;

    this.enviando = true;
    const chatInput: ChatInputDto = {
      mensaje: texto,
      receptor_id: this.receptorId
    };

    const mensajeTemporal: ChatOutputDto = {
      id: Date.now(), // ID falso temporal para que Angular no se queje
      emisor_id: this.emisorId,
      receptor_id: this.receptorId,
      mensaje: texto,
      fecha: new Date()
    };
    
    this.mensajes.push(mensajeTemporal);
    this.debeScrollar = true;

    this.chatService.save(chatInput).subscribe({
      next: () => {
        this.nuevoMensaje = '';
        this.enviando = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al enviar mensaje:', error);
        this.enviando = false;
        this.mensajes.pop(); 
        this.cdr.markForCheck();
      }
    });
  }

  esMio(msg: ChatOutputDto): boolean {
    return msg.emisor_id === this.emisorId;
  }

  scrollAlFinal(): void {
    try {
      const el = this.mensajesContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    } catch { }
  }

  onEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.enviarMensaje();
    }
  }
}
