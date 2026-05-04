import {ChangeDetectorRef, Component, ViewChild, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';

import {ModalError} from '../modal-error/modal-error';
import {ModalExito} from '../modal-exito/modal-exito';
import {Validaciones} from '../../validators/validaciones';
import {ValidadorInputDto} from '../../model/validador';
import {ValidadorService} from '../../services/validador/validador-service';

import { Cabecera } from '../cabecera/cabecera';
import { Footer } from '../footer/footer';
import { PanelAdministracion } from '../panel-administracion/panel-administracion';

@Component({
  selector: 'app-registro-validador',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Cabecera,
    Footer,
    PanelAdministracion,
    ModalError,
    ModalExito
  ],
  templateUrl: './registro-validador.html',
  styleUrl: './registro-validador.css',
})
export class RegistroValidador implements OnInit {

  registroValidador!: FormGroup;
  verContrasena: boolean = false;

  @ViewChild('modalError') modalError!: ModalError;
  @ViewChild('modalExito') modalExito!: ModalExito;

  constructor(
    private validadorService: ValidadorService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.registroValidador = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      contrasena: new FormControl('', [Validators.required, Validators.minLength(8)]),
      repetirContrasena: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]),
      telefono: new FormControl('', [Validators.required, Validators.pattern('^[679][0-9]{8}$')]),
      dni: new FormControl('', [Validators.required, Validaciones.dniValido])
    }, {
      validators: Validaciones.contrasenaIgual
    });
  }

  registrar(){
    if (this.registroValidador.valid){
      const validador: ValidadorInputDto = this.registroValidador.value;

      this.validadorService.save(validador).subscribe({
        next: () => {
          this.modalExito.abrirModal("Éxito", "El validador se ha registrado correctamente");
          this.registroValidador.reset();
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.modalError.abrirModal("Error en el Registro", error.error.message);
          console.error(error);
          this.cdr.markForCheck();
        }
      });
    } else {
      this.registroValidador.markAllAsTouched();
    }
  }

  toggleContrasena() {
    this.verContrasena = !this.verContrasena;
  }
}
