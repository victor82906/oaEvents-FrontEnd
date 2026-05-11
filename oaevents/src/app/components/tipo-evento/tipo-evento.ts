import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { TipoEventoService } from '../../services/tipoEvento/tipoEvento-service';
import { TipoEventoOutputDto } from '../../model/tipoEvento';

import { Cabecera } from '../cabecera/cabecera';
import { Footer } from '../footer/footer';
import { ModalConfirmar } from '../modal-confirmar/modal-confirmar';
import { ModalError } from '../modal-error/modal-error';
import { ModalExito } from '../modal-exito/modal-exito';

@Component({
  selector: 'app-tipo-evento',
  standalone: true,
  imports: [
    CommonModule,
    Cabecera,
    Footer,
    ModalConfirmar,
    ModalError,
    ModalExito,
    RouterLink
  ],
  templateUrl: './tipo-evento.html',
  styleUrl: './tipo-evento.css',
})
export class TipoEvento implements OnInit {

  tiposEvento: TipoEventoOutputDto[] = [];
  cargando = false;

  @ViewChild('modalConfirmar') modalConfirmar!: ModalConfirmar;
  @ViewChild('modalError') modalError!: ModalError;
  @ViewChild('modalExito') modalExito!: ModalExito;

  constructor(
    private tipoEventoService: TipoEventoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarTiposEvento();
  }

  cargarTiposEvento(): void {
    this.cargando = true;
    this.tipoEventoService.findAll().subscribe({
      next: (respuesta) => {
        this.tiposEvento = respuesta;
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

  confirmarEliminacion(id: number) {
    this.modalConfirmar.abrirModal(
      'Eliminar Tipo de Evento',
      '¿Estás seguro de que quieres eliminar este tipo de evento? Esta acción es irreversible.',
      id
    );
  }

  eliminarTipoEvento(id: number) {
    this.tipoEventoService.deleteById(id).subscribe({
      next: () => {
        this.modalExito.abrirModal("Éxito", "El tipo de evento ha sido eliminado correctamente.");
        this.cargarTiposEvento();
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.modalError.abrirModal("Error", error.error.message);
        this.cdr.markForCheck();
      }
    });
  }
}
