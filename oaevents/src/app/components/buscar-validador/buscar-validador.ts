import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ValidadorService } from '../../services/validador/validador-service';
import { ValidadorOutputDto } from '../../model/validador';
import { Page } from '../../model/page';
import { Cabecera } from '../cabecera/cabecera';
import { Footer } from '../footer/footer';
import { PanelAdministracion } from '../panel-administracion/panel-administracion';
import { ModalConfirmar } from '../modal-confirmar/modal-confirmar';
import { ModalError } from '../modal-error/modal-error';
import { ModalExito } from '../modal-exito/modal-exito';

@Component({
  selector: 'app-buscar-validador',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Cabecera,
    Footer,
    PanelAdministracion,
    ModalConfirmar,
    ModalError,
    ModalExito,
    RouterLink
  ],
  templateUrl: './buscar-validador.html',
  styleUrl: './buscar-validador.css'
})
export class BuscarValidador implements OnInit {

  page: Page<ValidadorOutputDto> | null = null;
  cargando = false;

  // --- Búsqueda y Ordenación ---
  terminoBusqueda: string = '';
  campoOrden: string = 'nombre';
  direccionOrden: string = 'asc';

  @ViewChild('modalConfirmar') modalConfirmar!: ModalConfirmar;
  @ViewChild('modalError') modalError!: ModalError;
  @ViewChild('modalExito') modalExito!: ModalExito;

  constructor(
    private validadorService: ValidadorService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarValidadores();
  }

  cargarValidadores(page: number = 0): void {
    this.cargando = true;
    this.validadorService.buscar(this.terminoBusqueda, page, 10, this.campoOrden, this.direccionOrden)
      .subscribe({
        next: (respuesta) => {
          this.page = respuesta;
          this.cargando = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.modalError.abrirModal("Error", error.error.message);
          this.cargando = false;
          this.cdr.markForCheck();
        }
      });
  }

  onBusquedaChange(): void {
    this.cargarValidadores();
  }

  onOrdenChange(): void {
    this.cargarValidadores();
  }

  cambiarPagina(nuevaPagina: number): void {
    this.cargarValidadores(nuevaPagina);
  }

  editarValidador(id: number) {
    this.router.navigate(['/editar-validador'], { queryParams: { id: id } });
  }

  confirmarEliminacion(id: number) {
    this.modalConfirmar.abrirModal(
      'Eliminar Validador',
      '¿Estás seguro de que quieres eliminar este validador? Esta acción es irreversible.',
      id
    );
  }

  eliminarValidador(id: number) {
    this.validadorService.deleteById(id).subscribe({
      next: () => {
        this.modalExito.abrirModal("Éxito", "El validador ha sido eliminado correctamente.");
        this.cargarValidadores(this.page?.number || 0);
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.modalError.abrirModal("Error", error.error.message);
        this.cdr.markForCheck();
      }
    });
  }
}
