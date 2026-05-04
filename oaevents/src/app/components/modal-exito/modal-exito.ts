import {Component, EventEmitter, model, Output} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-exito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-exito.html',
  styleUrl: './modal-exito.css',
})
export class ModalExito {
  visible: boolean = false;
  titulo: string = 'Éxito';
  mensaje: string = 'Operación realizada correctamente.';

  @Output() modalCerrado = new EventEmitter<void>();

  abrirModal(titulo: string, mensaje: string): void {
    this.titulo = titulo;
    this.mensaje = mensaje;
    this.visible = true;
  }

  cerrarModal(): void {
    this.visible = false;
    this.modalCerrado.emit(); // Emitir evento al cerrar para recargar datos si es necesario
  }
}
