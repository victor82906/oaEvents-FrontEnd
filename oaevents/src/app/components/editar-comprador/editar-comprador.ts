import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {ModalError} from '../modal-error/modal-error';
import {ModalExito} from '../modal-exito/modal-exito';
import {CompradorService} from '../../services/comprador/comprador-service';
import {ActivatedRoute} from '@angular/router';
import {Validaciones} from '../../validators/validaciones';
import {CompradorInputDto} from '../../model/comprador';
import { CommonModule } from '@angular/common';
import { Cabecera } from '../cabecera/cabecera';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-editar-comprador',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalError,
    ModalExito,
    Cabecera,
    Footer
  ],
  templateUrl: './editar-comprador.html',
  styleUrl: './editar-comprador.css',
})
export class EditarComprador implements OnInit{

  editarComprador!: FormGroup;
  id: number = 0;
  cargando: boolean = false;

  @ViewChild('modalError') modalError!: ModalError;
  @ViewChild('modalExito') modalExito!: ModalExito;

  constructor(private compradorService: CompradorService, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    });

    this.cargarComprador();

    this.editarComprador = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      nombre: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]),
      telefono: new FormControl('', [Validators.required, Validators.pattern('^[679][0-9]{8}$')]),
      dni: new FormControl('', [Validators.required, Validaciones.dniValido]),
      apellidos: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')])
    });
  }

  cargarComprador() {
    this.cargando = true;
    this.compradorService.findById(this.id).subscribe({
      next: (compradorOutputDto) => {
        this.editarComprador.patchValue(compradorOutputDto);
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error(error);
        this.modalError.abrirModal("Error al cargar", error.error.message);
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  editar(){
    if (this.editarComprador.valid){
      this.cargando = true;
      const comprador: CompradorInputDto = this.editarComprador.value;

      this.compradorService.update(this.id, comprador).subscribe({
        next: (compradorOutputDto) => {
          this.modalExito.abrirModal("Éxito", "El ciudadano se ha actualizado correctamente");
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
  }

}
