import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompradorService } from '../../services/comprador/comprador-service';
import { CompradorOutputDto } from '../../model/comprador';
import { Page } from '../../model/page';
import { ModalConfirmar } from '../modal-confirmar/modal-confirmar';
import { ModalError } from '../modal-error/modal-error';
import { ModalExito } from '../modal-exito/modal-exito';
import {Router, RouterLink} from '@angular/router';
import { Cabecera } from '../cabecera/cabecera';
import { Footer } from '../footer/footer';
import { PanelAdministracion } from '../panel-administracion/panel-administracion';

@Component({
  selector: 'app-buscar-comprador',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ModalConfirmar,
    ModalError,
    ModalExito,
    Cabecera,
    Footer,
    PanelAdministracion,
    RouterLink
  ],
  templateUrl: './buscar-comprador.html',
  styleUrl: './buscar-comprador.css'
})
export class BuscarComprador implements OnInit {

  page: Page<CompradorOutputDto> | null = null;
  cargando = false;

  // --- Búsqueda y Ordenación ---
  terminoBusqueda: string = '';
  campoOrden: string = 'nombre';
  direccionOrden: string = 'asc';

  @ViewChild('modalConfirmar') modalConfirmar!: ModalConfirmar;
  @ViewChild('modalError') modalError!: ModalError;
  @ViewChild('modalExito') modalExito!: ModalExito;

  constructor(
    private compradorService: CompradorService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarCompradores();
  }

  cargarCompradores(page: number = 0): void {
    this.cargando = true;
    this.compradorService.buscar(this.terminoBusqueda, page, 10, this.campoOrden, this.direccionOrden)
      .subscribe({
        next: (respuesta) => {
          this.page = respuesta;
          this.cargando = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error("Error al cargar compradores:", error);
          this.modalError.abrirModal("Error", error.error.message);
          this.cargando = false;
          this.cdr.markForCheck();
        }
      });
  }

  onBusquedaChange(): void {
    this.cargarCompradores();
  }

  onOrdenChange(): void {
    this.cargarCompradores();
  }

  cambiarPagina(nuevaPagina: number): void {
    this.cargarCompradores(nuevaPagina);
  }

  editarComprador(id: number) {
    this.router.navigate(['/editar-comprador'], { queryParams: { id: id } });
  }

  confirmarEliminacion(id: number) {
    this.modalConfirmar.abrirModal(
      'Eliminar Comprador',
      '¿Estás seguro de que quieres eliminar este comprador? Esta acción es irreversible.',
      id
    );
  }

  eliminarComprador(id: number) {
    this.compradorService.deleteById(id).subscribe({
      next: () => {
        this.modalExito.abrirModal("Éxito", "El comprador ha sido eliminado correctamente.");
        this.cargarCompradores(this.page?.number || 0);
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.modalError.abrirModal("Error", error.error.message);
        console.error(error);
        this.cdr.markForCheck();
      }
    });
  }
}
