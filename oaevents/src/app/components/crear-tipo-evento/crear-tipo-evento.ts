import {ChangeDetectorRef, Component, ViewChild, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {ModalError} from '../modal-error/modal-error';
import {ModalExito} from '../modal-exito/modal-exito';
import {TipoEventoInputDto} from '../../model/tipoEvento';
import {TipoEventoService} from '../../services/tipoEvento/tipoEvento-service';

import { Cabecera } from '../cabecera/cabecera';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-crear-tipo-evento',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Cabecera,
    Footer,
    ModalError,
    ModalExito
  ],
  templateUrl: './crear-tipo-evento.html',
  styleUrl: './crear-tipo-evento.css',
})
export class CrearTipoEvento implements OnInit {

  crearTipoEventoForm!: FormGroup;

  @ViewChild('modalError') modalError!: ModalError;
  @ViewChild('modalExito') modalExito!: ModalExito;

  constructor(
    private tipoEventoService: TipoEventoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.crearTipoEventoForm = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]),
    });
  }

  crear(){
    if (this.crearTipoEventoForm.valid){
      const tipoEvento: TipoEventoInputDto = this.crearTipoEventoForm.value;
      tipoEvento.nombre = tipoEvento.nombre.toUpperCase().trim();

      this.tipoEventoService.save(tipoEvento).subscribe({
        next: () => {
          this.modalExito.abrirModal("Éxito", "El tipo de evento se ha creado correctamente");
          this.crearTipoEventoForm.reset();
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.modalError.abrirModal("Error al crear", error.error.message);
          console.error(error);
          this.cdr.markForCheck();
        }
      });
    } else {
      this.crearTipoEventoForm.markAllAsTouched();
    }
  }

}
