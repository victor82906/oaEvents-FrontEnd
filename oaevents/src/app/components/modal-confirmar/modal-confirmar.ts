import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-confirmar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-confirmar.html',
  styleUrl: './modal-confirmar.css',
})
export class ModalConfirmar {
  visible: boolean = false;
  titulo: string = 'Confirmar Acción';
  mensaje: string = '¿Estás seguro de que deseas realizar esta acción?';
  datosExtra: any = null;

  @Output() confirmar = new EventEmitter<any>();
  @Output() cancelar = new EventEmitter<void>();

  abrirModal(titulo: string, mensaje: string, datos?: any): void {
    this.titulo = titulo;
    this.mensaje = mensaje;
    this.datosExtra = datos;
    this.visible = true;
  }

  onConfirmar(): void {
    this.visible = false;
    this.confirmar.emit(this.datosExtra);
  }

  onCancelar(): void {
    this.visible = false;
    this.cancelar.emit();
  }
}
