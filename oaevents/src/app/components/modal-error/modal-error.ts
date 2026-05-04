import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-error.html',
  styleUrl: './modal-error.css',
})
export class ModalError {
  visible: boolean = false;
  titulo: string = 'Error';
  mensaje: string = 'Ha ocurrido un error inesperado.';

  abrirModal(titulo: string, mensaje: string): void {
    this.titulo = titulo;
    this.mensaje = mensaje;
    this.visible = true;
  }

  cerrarModal(): void {
    this.visible = false;
  }
}
