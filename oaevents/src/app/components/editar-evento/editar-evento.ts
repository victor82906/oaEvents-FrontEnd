import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ModalError } from '../modal-error/modal-error';
import { ModalExito } from '../modal-exito/modal-exito';
import { Cabecera } from '../cabecera/cabecera';
import { Footer } from '../footer/footer';

import { EventoService } from '../../services/evento/evento-service';
import { EventoInputDto, EventoOutputDto } from '../../model/evento';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-editar-evento',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ModalError,
    ModalExito,
    Cabecera,
    Footer
  ],
  templateUrl: './editar-evento.html',
  styleUrl: './editar-evento.css',
})
export class EditarEvento implements OnInit {

  editarEvento!: FormGroup;
  cargando: boolean = false;
  eventoId: number = 0;
  eventoOriginal: EventoOutputDto | null = null;
  apiUrl = environment.apiUrl;

  imgSeleccionada: string | ArrayBuffer | null = null;
  archivoCapturado: File | null = null;

  @ViewChild('modalError') modalError!: ModalError;
  @ViewChild('modalExito') modalExito!: ModalExito;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  constructor(
    private eventoService: EventoService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.eventoId = params['id'];
    });

    this.editarEvento = new FormGroup({
      titulo: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required]),
      fecha: new FormControl('', [Validators.required])
    });

    if (this.eventoId) {
      this.cargarEvento();
    }
  }

  cargarEvento() {
    this.cargando = true;
    this.eventoService.findById(this.eventoId).subscribe({
      next: (evento) => {
        this.eventoOriginal = evento;
        
        // Formatear la fecha para input type="datetime-local" (YYYY-MM-DDTHH:mm)
        let fechaFormateada = '';
        if (evento.fecha) {
          const date = new Date(evento.fecha);
          const offset = date.getTimezoneOffset() * 60000;
          const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
          fechaFormateada = localISOTime;
        }

        this.editarEvento.patchValue({
          titulo: evento.titulo,
          descripcion: evento.descripcion,
          fecha: fechaFormateada
        });

        if (evento.foto) {
          this.imgSeleccionada = `${this.apiUrl}/${evento.foto}`;
        }

        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: (err) => this.manejarError(err)
    });
  }

  previsualizarFoto(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const size = Math.min(img.width, img.height);
          canvas.width = size;
          canvas.height = size;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            const xOffset = (img.width - size) / 2;
            const yOffset = (img.height - size) / 2;

            ctx.drawImage(img, xOffset, yOffset, size, size, 0, 0, size, size);

            canvas.toBlob((blob) => {
              if (blob) {
                this.archivoCapturado = new File([blob], file.name, { type: 'image/jpeg' });
                this.imgSeleccionada = canvas.toDataURL('image/jpeg', 0.9);
                this.cdr.detectChanges();
              }
            }, 'image/jpeg', 0.9);
          }
        };
        img.src = e.target.result;
      };

      reader.readAsDataURL(file);
    }
  }

  guardarEvento() {
    if (this.editarEvento.invalid || !this.eventoOriginal) {
      this.editarEvento.markAllAsTouched();
      return;
    }

    this.cargando = true;
    
    // Obtenemos los valores del formulario
    const formValues = this.editarEvento.value;
    
    // Construimos el objeto input con los datos inmutables y los nuevos
    const eventoActualizado: EventoInputDto = {
      titulo: formValues.titulo,
      descripcion: formValues.descripcion,
      fecha: formValues.fecha,
      tipoEvento_id: this.eventoOriginal.tipoEvento_id,
      empresa_id: this.eventoOriginal.empresa_id
    };

    this.eventoService.update(this.eventoId, eventoActualizado).subscribe({
      next: (eventoGuardado) => {
        if (this.archivoCapturado) {
          this.eventoService.addFoto(eventoGuardado.id, this.archivoCapturado).subscribe({
            next: () => {
              this.cargando = false;
              this.modalExito.abrirModal('¡Éxito!', 'El evento se ha actualizado correctamente.');
              this.cdr.markForCheck();
            },
            error: (err) => this.manejarError(err)
          });
        } else {
          this.cargando = false;
          this.modalExito.abrirModal('¡Éxito!', 'El evento se ha actualizado correctamente.');
          this.cdr.markForCheck();
        }
      },
      error: (err) => this.manejarError(err)
    });
  }

  manejarError(error: any) {
    this.cargando = false;
    this.modalError.abrirModal("Error", error.error?.message || 'Ha ocurrido un error al procesar la solicitud.');
    this.cdr.markForCheck();
  }
}
