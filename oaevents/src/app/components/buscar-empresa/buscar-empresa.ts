import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EmpresaService } from '../../services/empresa/empresa-service';
import { EmpresaOutputDto } from '../../model/empresa';
import { Page } from '../../model/page';
import { Cabecera } from '../cabecera/cabecera';
import { Footer } from '../footer/footer';
import { PanelAdministracion } from '../panel-administracion/panel-administracion';
import { ModalConfirmar } from '../modal-confirmar/modal-confirmar';
import { ModalError } from '../modal-error/modal-error';
import { ModalExito } from '../modal-exito/modal-exito';

@Component({
  selector: 'app-buscar-empresa',
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
  templateUrl: './buscar-empresa.html',
  styleUrl: './buscar-empresa.css'
})
export class BuscarEmpresa implements OnInit {

  page: Page<EmpresaOutputDto> | null = null;
  cargando = false;

  // --- Filtros ---
  terminoBusqueda: string = '';
  estadoFiltro: 'activas' | 'inactivas' = 'activas';

  @ViewChild('modalConfirmar') modalConfirmar!: ModalConfirmar;
  @ViewChild('modalError') modalError!: ModalError;
  @ViewChild('modalExito') modalExito!: ModalExito;

  constructor(
    private empresaService: EmpresaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarEmpresas();
  }

  cargarEmpresas(page: number = 0): void {
    this.cargando = true;
    const metodoServicio = this.estadoFiltro === 'activas'
      ? this.empresaService.buscarActivas(this.terminoBusqueda, page)
      : this.empresaService.buscarInactivas(this.terminoBusqueda, page);

    metodoServicio.subscribe({
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

  onFiltroChange(): void {
    this.cargarEmpresas();
  }

  cambiarPagina(nuevaPagina: number): void {
    this.cargarEmpresas(nuevaPagina);
  }

  editarEmpresa(id: number): void {
    this.router.navigate(['/editar-empresa'], { queryParams: { id: id } });
  }

  confirmarCambioEstado(empresa: EmpresaOutputDto): void {
    const accion = empresa.activa ? 'Desactivar' : 'Activar';
    this.modalConfirmar.abrirModal(
      `${accion} Empresa`,
      `¿Estás seguro de que quieres ${accion.toLowerCase()} la empresa "${empresa.nombre}"?`,
      empresa
    );
  }

  cambiarEstado(empresa: EmpresaOutputDto): void {
    const metodoServicio = empresa.activa
      ? this.empresaService.desactivar(empresa.id)
      : this.empresaService.activar(empresa.id);

    metodoServicio.subscribe({
      next: () => {
        this.modalExito.abrirModal("Éxito", `La empresa ha sido ${empresa.activa ? 'desactivada' : 'activada'} correctamente.`);
        this.cargarEmpresas(this.page?.number || 0);
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.modalError.abrirModal("Error", error.error.message);
        this.cdr.markForCheck();
      }
    });
  }
}
