import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Cabecera } from '../cabecera/cabecera';
import { Footer } from '../footer/footer';
import { ModalError } from '../modal-error/modal-error';
import { EventoService } from '../../services/evento/evento-service';
import { EventoOutputDto } from '../../model/evento';
import { Page } from '../../model/page';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-eventos-comprador',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Cabecera,
    Footer,
    ModalError
  ],
  templateUrl: './eventos-comprador.html',
  styleUrl: './eventos-comprador.css'
})
export class EventosComprador implements OnInit {

  page: Page<EventoOutputDto> | null = null;
  cargando = false;
  compradorId: number = 0;
  apiUrl = environment.apiUrl;

  // --- Búsqueda y Ordenación ---
  terminoBusqueda: string = '';
  campoOrden: string = 'fecha';
  direccionOrden: string = 'desc';

  @ViewChild('modalError') modalError!: ModalError;

  constructor(
    private eventoService: EventoService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.compradorId = params['compradorId'];
    });

    this.cargarEventos();
  }

  cargarEventos(page: number = 0): void {
    this.cargando = true;
    const sort = `${this.campoOrden},${this.direccionOrden}`;
    this.eventoService.findByCompradorIdAndTituloPaged(this.compradorId, this.terminoBusqueda, page, 8, sort)
      .subscribe({
        next: (respuesta) => {
          this.page = respuesta;
          this.cargando = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error("Error al cargar eventos:", error);
          this.modalError.abrirModal("Error", error.error.message);
          this.cargando = false;
          this.cdr.markForCheck();
        }
      });
  }

  onBusquedaChange(): void {
    this.cargarEventos();
  }

  onOrdenChange(): void {
    this.cargarEventos();
  }

  cambiarPagina(nuevaPagina: number): void {
    this.cargarEventos(nuevaPagina);
  }

  verEvento(id: number): void {
    this.router.navigate(['/evento-comprador'], { queryParams: { id: id } });
  }

  esPasado(fecha: string): boolean {
    return new Date(fecha) < new Date();
  }
}
