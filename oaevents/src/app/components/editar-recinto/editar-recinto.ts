import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { RecintoService } from '../../services/recinto/recinto-service';
import { RecintoInputDto } from '../../model/recinto';

import { Cabecera } from '../cabecera/cabecera';
import { Footer } from '../footer/footer';
import { ModalError } from '../modal-error/modal-error';
import { ModalExito } from '../modal-exito/modal-exito';
import {PanelAdministracion} from '../panel-administracion/panel-administracion';

@Component({
  selector: 'app-editar-recinto',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Cabecera,
    Footer,
    ModalError,
    ModalExito,
    PanelAdministracion
  ],
  templateUrl: './editar-recinto.html',
  styleUrl: './editar-recinto.css'
})
export class EditarRecinto implements OnInit {

  editarRecintoForm!: FormGroup;
  id: number = 0;
  cargando: boolean = false;

  @ViewChild('modalError') modalError!: ModalError;
  @ViewChild('modalExito') modalExito!: ModalExito;

  constructor(
    private recintoService: RecintoService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    });

    this.editarRecintoForm = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required, Validators.pattern('^[679][0-9]{8}$')]),
      ubicacion: new FormControl('', [Validators.required]),
      mapa: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });

    this.cargarRecinto();
  }

  cargarRecinto() {
    this.cargando = true;
    this.recintoService.findById(this.id).subscribe({
      next: (recinto) => {
        this.editarRecintoForm.patchValue(recinto);
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
    if (this.editarRecintoForm.valid) {
      this.cargando = true;
      const recintoInput: RecintoInputDto = this.editarRecintoForm.value;

      this.recintoService.update(this.id, recintoInput).subscribe({
        next: () => {
          this.modalExito.abrirModal("Éxito", "Los datos del recinto se han actualizado correctamente.");
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
