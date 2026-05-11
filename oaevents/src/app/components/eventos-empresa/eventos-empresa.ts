import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';

import { Cabecera } from '../cabecera/cabecera';
import { Footer } from '../footer/footer';
import { EventoService } from '../../services/evento/evento-service';
import { AuthService } from '../../services/auth/auth-service';
import { Page } from '../../model/page';
import { EventoOutputDto } from '../../model/evento';
import { environment } from '../../../environments/environment';
import { ModalError } from '../modal-error/modal-error';
import { ModalExito } from '../modal-exito/modal-exito';
import { ModalConfirmar } from '../modal-confirmar/modal-confirmar';

@Component({
  selector: 'app-eventos-empresa',
  standalone: true,
  imports: [CommonModule, FormsModule, Cabecera, Footer, ModalError, ModalExito, ModalConfirmar],
  templateUrl: './eventos-empresa.html',
  styleUrl: './eventos-empresa.css',
})
export class EventosEmpresa implements OnInit {
  page: Page<EventoOutputDto> | null = null;
  cargando: boolean = true;
  apiUrl = environment.apiUrl;
  empresaId: number = 0;

  terminoBusqueda: string = '';
  campoOrden: string = 'fecha';
  direccionOrden: string = 'desc';
  paginaActual: number = 0;
  tamanoPagina: number = 6;

  @ViewChild('modalError') modalError!: ModalError;
  @ViewChild('modalExito') modalExito!: ModalExito;
  @ViewChild('modalConfirmarEliminacion') modalConfirmarEliminacion!: ModalConfirmar;

  constructor(
    private eventoService: EventoService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.empresaId = params['empresaId'];
    });
    this.cargarEventos();
  }

  cargarEventos(): void {
    this.cargando = true;
    const sortParams = `${this.campoOrden},${this.direccionOrden}`;

    this.eventoService.findByEmpresaIdAndTituloPaged(this.empresaId, this.terminoBusqueda, this.paginaActual, this.tamanoPagina, sortParams).subscribe({
      next: (page) => {
        this.page = page;
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar eventos', error);
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  onBusquedaChange(): void {
    this.paginaActual = 0;
    this.cargarEventos();
  }

  onOrdenChange(): void {
    this.paginaActual = 0;
    this.cargarEventos();
  }

  cambiarPagina(nuevaPagina: number): void {
    if (this.page && nuevaPagina >= 0 && nuevaPagina < this.page.totalPages) {
      this.paginaActual = nuevaPagina;
      this.cargarEventos();
    }
  }

  verEvento(id: number): void {
    this.router.navigate(['/evento'], { queryParams: { id } });
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
        this.cargarEventos();
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.modalError.abrirModal("Error", error.error.message);
        this.cdr.markForCheck();
      }
    });
  }
}
