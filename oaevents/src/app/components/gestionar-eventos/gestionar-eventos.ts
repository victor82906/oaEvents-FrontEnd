import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Cabecera } from '../cabecera/cabecera';
import { Footer } from '../footer/footer';
import { ModalError } from '../modal-error/modal-error';
import { ModalExito } from '../modal-exito/modal-exito';
import { ModalConfirmar } from '../modal-confirmar/modal-confirmar';

import { EventoService } from '../../services/evento/evento-service';
import { EventoOutputDto } from '../../model/evento';
import { Page } from '../../model/page';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-gestionar-eventos',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    Cabecera, 
    Footer, 
    ModalError, 
    ModalExito, 
    ModalConfirmar
  ],
  templateUrl: './gestionar-eventos.html',
  styleUrl: './gestionar-eventos.css',
})
export class GestionarEventos implements OnInit {
  page: Page<EventoOutputDto> | null = null;
  cargando = false;
  apiUrl = environment.apiUrl;

  // Filtro
  estadoFiltro: string = 'PENDIENTES'; // 'PENDIENTES' o 'ACEPTADOS'

  @ViewChild('modalError') modalError!: ModalError;
  @ViewChild('modalExito') modalExito!: ModalExito;
  @ViewChild('modalConfirmarCambio') modalConfirmarCambio!: ModalConfirmar;
  @ViewChild('modalConfirmarEliminacion') modalConfirmarEliminacion!: ModalConfirmar;

  constructor(
    private eventoService: EventoService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarEventos();
  }

  cargarEventos(numeroPagina: number = 0): void {
    this.cargando = true;

    if (this.estadoFiltro === 'ACEPTADOS') {
      this.eventoService.findAllAceptadosPaged(numeroPagina, 6, 'fecha,desc').subscribe({
        next: (page) => {
          this.page = page;
          this.cargando = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.modalError.abrirModal("Error al cargar", error.error.message);
          this.cargando = false;
          this.cdr.markForCheck();
        }
      });
    } else {
      this.eventoService.findAllPendientesPaged(numeroPagina, 6, 'fecha,desc').subscribe({
        next: (page) => {
          this.page = page;
          this.cargando = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.modalError.abrirModal("Error al cargar", error.error.message);
          this.cargando = false;
          this.cdr.markForCheck();
        }
      });
    }
  }

  onEstadoChange(): void {
    this.cargarEventos(0);
  }

  cambiarPagina(nuevaPagina: number): void {
    if (this.page && nuevaPagina >= 0 && nuevaPagina < this.page.totalPages) {
      this.cargarEventos(nuevaPagina);
    }
  }

  verEvento(id: number): void {
    this.router.navigate(['/evento'], { queryParams: { id: id } });
  }

  // Acciones
  confirmarCambioEstado(evento: EventoOutputDto): void {
    const accion = evento.aceptado ? 'Cancelar' : 'Aceptar';
    this.modalConfirmarCambio.abrirModal(
      `${accion} Evento`,
      `¿Estás seguro de que quieres ${accion.toLowerCase()} el evento "${evento.titulo}"?`,
      evento
    );
  }

  cambiarEstado(evento: EventoOutputDto): void {
    const metodoServicio = evento.aceptado
      ? this.eventoService.cancel(evento.id)
      : this.eventoService.accept(evento.id);

    metodoServicio.subscribe({
      next: () => {
        this.modalExito.abrirModal("Éxito", `El evento ha sido ${evento.aceptado ? 'cancelado' : 'aceptado'} correctamente.`);
        this.cargarEventos(this.page?.number || 0);
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.modalError.abrirModal("Error", error.error.message);
        this.cdr.markForCheck();
      }
    });
  }

  confirmarEliminacion(id: number): void {
    this.modalConfirmarEliminacion.abrirModal(
      'Eliminar Evento',
      '¿Estás seguro de que quieres eliminar este evento? Esta acción es irreversible.',
      id
    );
  }

  eliminarEvento(id: number): void {
    this.eventoService.deleteById(id).subscribe({
      next: () => {
        this.modalExito.abrirModal("Éxito", "El evento ha sido eliminado correctamente.");
        this.cargarEventos(this.page?.number || 0);
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.modalError.abrirModal("Error", error.error.message);
        this.cdr.markForCheck();
      }
    });
  }
}
