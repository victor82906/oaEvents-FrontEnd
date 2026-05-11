import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cabecera } from '../cabecera/cabecera';
import { Footer } from '../footer/footer';
import { EventoService } from '../../services/evento/evento-service';
import { AuthService } from '../../services/auth/auth-service';
import { EventoOutputDto } from '../../model/evento';
import { Page } from '../../model/page';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule, FormsModule, Cabecera, Footer],
  templateUrl: './eventos.html',
  styleUrl: './eventos.css'
})
export class Eventos implements OnInit {
  eventosRecientes: EventoOutputDto[] = [];
  eventosSiguientes: EventoOutputDto[] = [];
  cargando: boolean = false;
  apiUrl = environment.apiUrl;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private eventoService: EventoService
  ) {}

  ngOnInit(): void {
    this.cargarEventos();
  }

  cargarEventos() {
    this.cargando = true;

    const fechaActual = new Date();
    const fechaPasada = new Date();
    fechaPasada.setFullYear(fechaActual.getFullYear() - 1);
    const fechaFutura = new Date();
    fechaFutura.setFullYear(fechaActual.getFullYear() + 1);

    const strActual = this.formatearFecha(fechaActual);
    const strPasada = this.formatearFecha(fechaPasada);
    const strFutura = this.formatearFecha(fechaFutura);

    // Eventos Recientes
    this.eventoService.findAceptadosByFechasPaged(strPasada, strActual, 0, 3).subscribe({
      next: (page: Page<EventoOutputDto>) => {
        this.eventosRecientes = page.content;
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar', error.error.message);
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });

    // Próximos Eventos
    this.eventoService.findAceptadosByFechasPaged(strActual, strFutura, 0, 3).subscribe({
      next: (page: Page<EventoOutputDto>) => {
        this.eventosSiguientes = page.content;
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar', error.error.message);
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  formatearFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const day = fecha.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  verEvento(id: number) {
    this.router.navigate(['/evento'], { queryParams: { id: id } });
  }

  comprarEntrada(eventoId: number) {
    this.router.navigate(['/evento'], { queryParams: { id: eventoId } });
  }
}
