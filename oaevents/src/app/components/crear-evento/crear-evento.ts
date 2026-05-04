/*
import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ModalError} from '../modal-error/modal-error';
import {ModalExito} from '../modal-exito/modal-exito';
import {Cabecera} from '../cabecera/cabecera';
import {Footer} from '../footer/footer';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {ZonaEventoService} from '../../services/zonaEvento/zonaEvento-service';
import {ZonaService} from '../../services/zona/zona-service';
import {TipoEventoService} from '../../services/tipoEvento/tipoEvento-service';
import {TipoEventoOutputDto} from '../../model/tipoEvento';
import {EventoInputDto} from '../../model/evento';
import {EventoService} from '../../services/evento/evento-service';
import {RecintoService} from '../../services/recinto/recinto-service';
import {ZonaOutputDto} from '../../model/zona';

@Component({
  selector: 'app-crear-evento',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalError,
    ModalExito,
    Cabecera,
    Footer
  ],
  templateUrl: './crear-evento.html',
  styleUrl: './crear-evento.css',
})
export class CrearEvento implements OnInit {

  crearEvento!: FormGroup;
  cargando: boolean = false;
  empresaId: number = 0;
  tipoEventoId: number = 0;
  tiposEvento: TipoEventoOutputDto[] = [];
  zonas: ZonaOutputDto[] = [];
  imgSeleccionada: string | ArrayBuffer | null = null;
  archivoCapturado: File | null = null;

  @ViewChild('modalError') modalError!: ModalError;
  @ViewChild('modalExito') modalExito!: ModalExito;

  constructor(
    private recintoService: RecintoService,
    private eventoService: EventoService,
    private zonaEventoService: ZonaEventoService,
    private zonaService: ZonaService,
    private tipoEventoService: TipoEventoService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.empresaId = params['empresaId'];
    });

    this.cargarTiposEvento();
    this.cargarRecinto();

    this.crearEvento = new FormGroup({
      titulo: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required]),
      fecha: new FormControl('', [Validators.required])
    });
  }

  guardarEvento() {
    const evento: EventoInputDto = this.crearEvento.value;
    evento.tipoEvento_id = this.tipoEventoId;
    evento.empresa_id = this.empresaId;

    this.eventoService.save(evento).subscribe({
      next: () => {

      },
      error: (error) => {
        this.modalError.abrirModal("Error al cargar", error.error.message);
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  cargarRecinto() {
    this.cargando = true;
    this.recintoService.findAll().subscribe({
      next: (recintos) => {
        this.cargarZonas(recintos[0].id);
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.modalError.abrirModal("Error al cargar", error.error.message);
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  cargarZonas(recintoId: number) {
    this.cargando = true;
    this.zonaService.findByRecintoId(recintoId).subscribe({
      next: (zonas) => {
        this.zonas = zonas;
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.modalError.abrirModal("Error al cargar", error.error.message);
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  cargarTiposEvento() {
    this.cargando = true;
    this.tipoEventoService.findAll().subscribe({
      next: (tiposEventoOutputDto) => {
        this.tiposEvento = tiposEventoOutputDto;
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.modalError.abrirModal("Error al cargar", error.error.message);
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  guardarZonaEventos() {

  }

  previsualizarFoto(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.archivoCapturado = file;
      const reader = new FileReader();

      // Se ejecuta cuando el archivo se ha leído
      reader.onload = (e) => {
        this.imgSeleccionada = reader.result;
        this.cdr.detectChanges();
      }
      // Lee la imagen como una URL de datos (Base64)
      reader.readAsDataURL(file);
    }
  }

}*/

import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';

import { ModalError } from '../modal-error/modal-error';
import { ModalExito } from '../modal-exito/modal-exito';
import { Cabecera } from '../cabecera/cabecera';
import { Footer } from '../footer/footer';

import { ZonaEventoService } from '../../services/zonaEvento/zonaEvento-service';
import { ZonaService } from '../../services/zona/zona-service';
import { TipoEventoService } from '../../services/tipoEvento/tipoEvento-service';
import { EventoService } from '../../services/evento/evento-service';
import { RecintoService } from '../../services/recinto/recinto-service';

import { TipoEventoOutputDto } from '../../model/tipoEvento';
import { EventoInputDto } from '../../model/evento';
import { ZonaOutputDto } from '../../model/zona';
import {ZonaEventoInputDto, ZonaEventoOutputDto} from '../../model/zonaEvento';

interface ZonaConfig {
  zona: ZonaOutputDto;
  habilitada: boolean;
  precio: number | null;
  bloqueada: boolean;
}

@Component({
  selector: 'app-crear-evento',
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
  templateUrl: './crear-evento.html',
  styleUrl: './crear-evento.css',
})
export class CrearEvento implements OnInit {

  crearEvento!: FormGroup;
  cargando: boolean = false;
  empresaId: number = 0;

  tiposEvento: TipoEventoOutputDto[] = [];
  recinto: any = null;
  zonas: ZonaOutputDto[] = [];

  zonasConfig: Map<number, ZonaConfig> = new Map();
  zonaSeleccionada: ZonaConfig | null = null;
  tipoEventoSeleccionadoNombre: string = '';

  imgSeleccionada: string | ArrayBuffer | null = null;
  archivoCapturado: File | null = null;

  centrosZonas: { [key: number]: { x: number, y: number } } = {};

  @ViewChild('modalError') modalError!: ModalError;
  @ViewChild('modalExito') modalExito!: ModalExito;
  @ViewChild('precioInput', { static: false }) precioInput!: ElementRef;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef; // Referencia para vaciar el input de la foto

  constructor(
    private recintoService: RecintoService,
    private eventoService: EventoService,
    private zonaEventoService: ZonaEventoService,
    private zonaService: ZonaService,
    private tipoEventoService: TipoEventoService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.empresaId = params['empresaId'];
    });

    this.cargarTiposEvento();
    this.cargarRecinto();

    this.crearEvento = new FormGroup({
      titulo: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required]),
      fecha: new FormControl('', [Validators.required]),
      tipoEvento_id: new FormControl('', [Validators.required])
    });

    this.crearEvento.get('tipoEvento_id')?.valueChanges.subscribe(id => {
      const tipo = this.tiposEvento.find(t => t.id == id);
      this.tipoEventoSeleccionadoNombre = tipo ? (tipo as any).nombre?.toUpperCase() : '';
      this.aplicarReglasZonas();
    });
  }

  cargarTiposEvento() {
    this.cargando = true;
    this.tipoEventoService.findAll().subscribe({
      next: (tipos) => {
        this.tiposEvento = tipos;
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: (err) => this.manejarError(err)
    });
  }

  cargarRecinto() {
    this.cargando = true;
    this.recintoService.findAll().subscribe({
      next: (recintos) => {
        if (recintos.length > 0) {
          this.recinto = recintos[0];
          this.cargarZonas(this.recinto.id);
        }
      },
      error: (err) => this.manejarError(err)
    });
  }

  cargarZonas(recintoId: number) {
    this.zonaService.findByRecintoId(recintoId).subscribe({
      next: (zonas) => {
        this.zonas = zonas;
        this.zonasConfig.clear();

        this.zonas.forEach(z => {
          this.centrosZonas[z.id] = this.calcularCentroPoligono(z.coordenadas);
          this.zonasConfig.set(z.id, {
            zona: z,
            habilitada: true,
            precio: null,
            bloqueada: false
          });
        });

        this.aplicarReglasZonas();
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: (err) => this.manejarError(err)
    });
  }

  calcularCentroPoligono(coordenadas: string): { x: number, y: number } {
    if (!coordenadas) return { x: 0, y: 0 };
    const puntos = coordenadas.split(' ').map(p => {
      const [x, y] = p.split(',').map(Number);
      return { x, y };
    });

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    puntos.forEach(p => {
      if (!isNaN(p.x) && !isNaN(p.y)) {
        minX = Math.min(minX, p.x);
        maxX = Math.max(maxX, p.x);
        minY = Math.min(minY, p.y);
        maxY = Math.max(maxY, p.y);
      }
    });

    if (minX === Infinity) return { x: 0, y: 0 };
    return { x: minX + (maxX - minX) / 2, y: minY + (maxY - minY) / 2 };
  }

  aplicarReglasZonas() {
    this.zonasConfig.forEach(config => {
      const num = config.zona.numero.toUpperCase();
      const esDeportivo = this.tipoEventoSeleccionadoNombre === 'DEPORTIVO';

      if (num === 'ESCE') {
        config.habilitada = false;
        config.bloqueada = true;
        config.precio = null;
      }
      else if (esDeportivo && (num === 'PISTA' || num === 'FRONT' || config.zona.pista)) {
        config.habilitada = false;
        config.bloqueada = true;
        config.precio = null;
      }
      else {
        if (config.bloqueada) {
          config.habilitada = true;
        }
        config.bloqueada = false;
      }
    });

    if (this.zonaSeleccionada && this.zonaSeleccionada.bloqueada) {
      this.zonaSeleccionada = null;
    }

    this.cdr.markForCheck();
  }

  seleccionarZona(zona: ZonaOutputDto) {
    const config = this.zonasConfig.get(zona.id);
    if (config && !config.bloqueada) {
      this.zonaSeleccionada = config;

      setTimeout(() => {
        if (this.precioInput) {
          this.precioInput.nativeElement.focus();
        }
      }, 50);
    }
  }

  getColorZona(zonaId: number): string {
    const config = this.zonasConfig.get(zonaId);
    if (!config) return 'transparent';
    if (!config.habilitada) return '#6c757d';
    if (config.precio === null || config.precio <= 0) return '#dc3545';
    return 'var(--primary-color)';
  }

  get formularioListo(): boolean {
    if (this.crearEvento.invalid || this.zonasConfig.size === 0) return false;

    let todasListas = true;
    this.zonasConfig.forEach(config => {
      if (config.habilitada && (config.precio === null || config.precio <= 0)) {
        todasListas = false;
      }
    });
    return todasListas;
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
    if (!this.formularioListo) {
      this.crearEvento.markAllAsTouched();
      return;
    }

    this.cargando = true;
    const evento: EventoInputDto = this.crearEvento.value;
    evento.empresa_id = this.empresaId;

    this.eventoService.save(evento).subscribe({
      next: (eventoGuardado) => {
        if (this.archivoCapturado) {
          this.eventoService.addFoto(eventoGuardado.id, this.archivoCapturado).subscribe({
            next: () => this.guardarZonaEventos(eventoGuardado.id),
            error: () => this.guardarZonaEventos(eventoGuardado.id)
          });
        } else {
          this.guardarZonaEventos(eventoGuardado.id);
        }
      },
      error: (err) => this.manejarError(err)
    });
  }

  guardarZonaEventos(eventoId: number) {
    const peticiones: Observable<ZonaEventoOutputDto>[] = [];

    this.zonasConfig.forEach(config => {
      const ze: ZonaEventoInputDto = {
        precio: config.precio || 0,
        habilitada: config.habilitada,
        evento_id: eventoId,
        zona_id: config.zona.id
      };
      peticiones.push(this.zonaEventoService.save(ze));
    });

    forkJoin(peticiones).subscribe({
      next: () => {
        this.cargando = false;
        this.reiniciarFormulario(); // Limpiamos la pantalla por detrás
        this.modalExito.abrirModal('¡Éxito!', 'El evento y sus zonas se han creado correctamente.');
        this.cdr.markForCheck();
      },
      error: (err) => this.manejarError(err)
    });
  }

  reiniciarFormulario() {
    // 1. Vaciamos el formulario reactivo (esto disparará las valueChanges y reseteará la habilitación de zonas)
    this.crearEvento.reset({
      titulo: '',
      descripcion: '',
      fecha: '',
      tipoEvento_id: ''
    });

    // 2. Quitamos la foto visual y la foto capturada
    this.imgSeleccionada = null;
    this.archivoCapturado = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = ''; // Borramos la ruta visual del explorador de archivos
    }

    // 3. Quitamos la selección de zona actual
    this.zonaSeleccionada = null;

    // 4. Limpiamos manualmente los precios de las zonas
    this.zonasConfig.forEach(config => {
      config.precio = null;
    });
  }

  manejarError(error: any) {
    this.cargando = false;
    this.modalError.abrirModal("Error", error.error?.message || 'Ha ocurrido un error al procesar la solicitud.');
    this.cdr.markForCheck();
  }
}
