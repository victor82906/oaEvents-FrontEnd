import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {ModalError} from '../modal-error/modal-error';
import {ModalExito} from '../modal-exito/modal-exito';
import {EmpresaService} from '../../services/empresa/empresa-service';
import {ActivatedRoute} from '@angular/router';
import {EmpresaInputDto} from '../../model/empresa';
import { CommonModule } from '@angular/common';
import { Cabecera } from '../cabecera/cabecera';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-editar-empresa',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalError,
    ModalExito,
    Cabecera,
    Footer
  ],
  templateUrl: './editar-empresa.html',
  styleUrl: './editar-empresa.css',
})
export class EditarEmpresa implements OnInit{

  editarEmpresa!: FormGroup;
  id: number = 0;
  cargando: boolean = false;

  @ViewChild('modalError') modalError!: ModalError;
  @ViewChild('modalExito') modalExito!: ModalExito;

  constructor(private empresaService: EmpresaService, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    });

    this.cargarEmpresa();

    this.editarEmpresa = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      nombre: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required, Validators.pattern('^[679][0-9]{8}$')]),
      cif: new FormControl('', [Validators.required])
    });
  }

  cargarEmpresa() {
    this.cargando = true;
    this.empresaService.findById(this.id).subscribe({
      next: (empresaOutputDto) => {
        this.editarEmpresa.patchValue(empresaOutputDto);
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
    if (this.editarEmpresa.valid){
      this.cargando = true;
      const empresa: EmpresaInputDto = this.editarEmpresa.value;

      this.empresaService.update(this.id, empresa).subscribe({
        next: (empresaOutputDto) => {
          this.modalExito.abrirModal("Éxito", "La empresa se ha actualizado correctamente");
          this.cargando = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.modalError.abrirModal("Error", error.error.message);
          console.error(error);
          this.cargando = false;
          this.cdr.markForCheck();
        }
      });
    }
  }

}
