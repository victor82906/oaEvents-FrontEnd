import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ValidadorService } from '../../services/validador/validador-service';
import { ValidadorInputDto } from '../../model/validador';
import { Cabecera } from '../cabecera/cabecera';
import { Footer } from '../footer/footer';
import { PanelAdministracion } from '../panel-administracion/panel-administracion';
import { ModalError } from '../modal-error/modal-error';
import { ModalExito } from '../modal-exito/modal-exito';

@Component({
  selector: 'app-editar-validador',
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
  templateUrl: './editar-validador.html',
  styleUrl: './editar-validador.css'
})
export class EditarValidador implements OnInit {

  editarValidadorForm!: FormGroup;
  id: number = 0;
  cargando: boolean = false;

  @ViewChild('modalError') modalError!: ModalError;
  @ViewChild('modalExito') modalExito!: ModalExito;

  constructor(
    private validadorService: ValidadorService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    });

    this.editarValidadorForm = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]),
      dni: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{8}[A-Z]$')]),
      telefono: new FormControl('', [Validators.required, Validators.pattern('^[679][0-9]{8}$')]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });

    if (this.id) {
      this.cargarValidador();
    }
  }

  cargarValidador() {
    this.cargando = true;
    this.validadorService.findById(this.id).subscribe({
      next: (validador) => {
        this.editarValidadorForm.patchValue(validador);
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.cargando = false;
        this.modalError.abrirModal("Error al Cargar", error.error.message);
        this.cdr.markForCheck();
      }
    });
  }

  editar() {
    if (this.editarValidadorForm.valid) {
      this.cargando = true;
      const validadorInput: ValidadorInputDto = this.editarValidadorForm.value;

      this.validadorService.update(this.id, validadorInput).subscribe({
        next: () => {
          this.modalExito.abrirModal("Éxito", "Los datos del validador se han actualizado correctamente.");
          this.cargando = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.modalError.abrirModal("Error al Actualizar", error.error.message);
          this.cargando = false;
          this.cdr.markForCheck();
        }
      });
    }
  }
}
