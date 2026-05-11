import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Cabecera } from '../cabecera/cabecera';
import { Footer } from '../footer/footer';
import { ModalError } from '../modal-error/modal-error';
import { ModalExito } from '../modal-exito/modal-exito';

import { EventoService } from '../../services/evento/evento-service';
import { RecintoService } from '../../services/recinto/recinto-service';
import { ZonaService } from '../../services/zona/zona-service';
import { ZonaEventoService } from '../../services/zonaEvento/zonaEvento-service';
import { LocalidadService } from '../../services/localidad/localidad-service';
import { EntradaService } from '../../services/entrada/entrada-service';
import { TipoEventoService } from '../../services/tipoEvento/tipoEvento-service';
import { AuthService } from '../../services/auth/auth-service';

import { EventoOutputDto } from '../../model/evento';
import { ZonaOutputDto } from '../../model/zona';
import { ZonaEventoOutputDto } from '../../model/zonaEvento';
import { LocalidadOutputDto } from '../../model/localidad';
import { EmpresaOutputDto } from '../../model/empresa';
import { EntradaCompraLogueadoInputDto, EntradaCompraInputDto } from '../../model/entrada';
import { Validaciones } from '../../validators/validaciones';
import { environment } from '../../../environments/environment';

const MAX_ENTRADAS = 8;

interface FilaInfo {
  numero: string;
  y: number;
  minX: number;
  maxX: number;
}

interface ZonaConfig {
  zona: ZonaOutputDto;
  habilitada: boolean;
  precio: number | null;
  zonaEventoId: number | null;
}

@Component({
  selector: 'app-comprar-entrada',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Cabecera, Footer, ModalError, ModalExito],
  templateUrl: './comprar-entrada.html',
  styleUrl: './comprar-entrada.css',
})
export class ComprarEntrada implements OnInit {
  // Estado general
  cargando: boolean = true;
  comprando: boolean = false;
  eventoId: number = 0;
  apiUrl = environment.apiUrl;
  isLogueado: boolean = false;

  // Evento
  evento: EventoOutputDto | null = null;
  tipoEventoNombre: string = '';

  // Recinto y zonas
  recinto: any = null;
  zonas: ZonaOutputDto[] = [];
  zonasConfig: Map<number, ZonaConfig> = new Map();
  centrosZonas: { [key: number]: { x: number, y: number } } = {};

  // Zona seleccionada y localidades
  zonaSeleccionada: ZonaConfig | null = null;
  localidades: LocalidadOutputDto[] = [];
  localidadesLibresIds: Set<number> = new Set();
  localidadesSeleccionadas: LocalidadOutputDto[] = [];

  // Modo pista (sin asientos numerados)
  cantidadPista: number = 0;

  // Mapa dinámico
  viewBoxDinamico: string | null = null;
  viewBoxLimites = { minX: 0, maxX: 0 };
  aspectRatioStyle: string = '0';
  readonly TAMANO_LOCALIDAD = 40;
  filasInfo: FilaInfo[] = [];

  // Formulario logueado (solo tarjeta)
  formLogueado!: FormGroup;

  // Formulario no logueado
  formNoLogueado!: FormGroup;

  @ViewChild('modalError') modalError!: ModalError;
  @ViewChild('modalExito') modalExito!: ModalExito;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventoService: EventoService,
    private recintoService: RecintoService,
    private zonaService: ZonaService,
    private zonaEventoService: ZonaEventoService,
    private localidadService: LocalidadService,
    private entradaService: EntradaService,
    private tipoEventoService: TipoEventoService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.isLogueado = this.authService.isAuth();

    this.formLogueado = new FormGroup({
      tarjetaCredito: new FormControl('', [Validators.required, Validaciones.tarjetaValida]),
    });

    this.formNoLogueado = new FormGroup({
      nombreComprador: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]),
      emailComprador: new FormControl('', [Validators.required, Validators.email]),
      dniComprador: new FormControl('', [Validators.required, Validaciones.dniValido]),
      tarjetaCredito: new FormControl('', [Validators.required, Validaciones.tarjetaValida]),
    });

    this.route.queryParams.subscribe(params => {
      this.eventoId = params['id'];
      this.cargarDatos();
    });
  }

  cargarDatos(): void {
    this.cargando = true;
    this.eventoService.findById(this.eventoId).subscribe({
      next: (evento) => {
        this.evento = evento;
        this.cargarTipoEvento(evento.tipoEvento_id);
        this.cargarRecintoYZonas(evento.id);
      },
      error: () => {
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  cargarTipoEvento(id: number): void {
    this.tipoEventoService.findAll().subscribe({
      next: (tipos) => {
        const tipo = tipos.find(t => t.id == id);
        this.tipoEventoNombre = tipo ? tipo.nombre.toUpperCase() : '';
        this.cdr.markForCheck();
      }
    });
  }

  cargarRecintoYZonas(eventoId: number): void {
    this.recintoService.findAll().subscribe({
      next: (recintos) => {
        if (recintos.length > 0) {
          this.recinto = recintos[0];
          this.volverAVistaGeneral();
          this.zonaService.findByRecintoId(this.recinto.id).subscribe({
            next: (zonas) => {
              this.zonas = zonas;
              this.zonas.forEach(z => {
                this.centrosZonas[z.id] = this.calcularCentroPoligono(z.coordenadas);
              });
              this.cargarZonasEvento(eventoId);
            }
          });
        }
      }
    });
  }

  cargarZonasEvento(eventoId: number): void {
    this.zonaEventoService.findByEventoId(eventoId).subscribe({
      next: (zonasEvento) => {
        this.zonasConfig.clear();
        const zonaEventoMap = new Map<number, ZonaEventoOutputDto>();
        zonasEvento.forEach(ze => zonaEventoMap.set(ze.zona_id, ze));

        this.zonas.forEach(z => {
          const ze = zonaEventoMap.get(z.id);
          this.zonasConfig.set(z.id, {
            zona: z,
            habilitada: ze ? ze.habilitada : false,
            precio: ze ? ze.precio : null,
            zonaEventoId: ze ? ze.id : null
          });
        });

        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  onZonaClick(config: ZonaConfig): void {
    if (!config.habilitada || config.precio === null) return;

    this.zonaSeleccionada = config;
    this.localidades = [];
    this.localidadesLibresIds.clear();
    this.localidadesSeleccionadas = [];
    this.cantidadPista = 0;
    this.cargando = true;

    if (!config.zonaEventoId) return;

    // Si es pista, no cargamos el layout de localidades, pero sí las IDs libres para elegir aleatoriamente al comprar
    if (config.zona.pista) {
      this.localidadService.findLocalidadesLibres(config.zonaEventoId!).subscribe({
        next: (libres) => {
          this.localidadesLibresIds = new Set(libres.map(l => l.id));
          this.cargando = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.cargando = false;
          this.cdr.markForCheck();
        }
      });
      return;
    }

    this.localidadService.findByZonaId(config.zona.id).subscribe({
      next: (todasLocalidades) => {
        this.localidades = todasLocalidades;
        this.ajustarViewBoxParaLocalidades(todasLocalidades);
        this.procesarFilas(todasLocalidades);

        this.localidadService.findLocalidadesLibres(config.zonaEventoId!).subscribe({
          next: (libres) => {
            this.localidadesLibresIds = new Set(libres.map(l => l.id));
            this.cargando = false;
            this.cdr.markForCheck();
          },
          error: () => {
            this.cargando = false;
            this.cdr.markForCheck();
          }
        });
      },
      error: () => {
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  toggleLocalidad(localidad: LocalidadOutputDto): void {
    if (!this.isLibre(localidad.id)) return;

    const index = this.localidadesSeleccionadas.findIndex(l => l.id === localidad.id);
    if (index >= 0) {
      this.localidadesSeleccionadas.splice(index, 1);
    } else {
      if (this.localidadesSeleccionadas.length >= MAX_ENTRADAS) {
        this.modalError.abrirModal('Límite alcanzado', `Solo puedes seleccionar un máximo de ${MAX_ENTRADAS} entradas.`);
        return;
      }
      this.localidadesSeleccionadas.push(localidad);
    }
    this.cdr.markForCheck();
  }

  isLibre(localidadId: number): boolean {
    return this.localidadesLibresIds.has(localidadId);
  }

  isSeleccionada(localidadId: number): boolean {
    return this.localidadesSeleccionadas.some(l => l.id === localidadId);
  }

  getColorLocalidad(localidad: LocalidadOutputDto): string {
    if (!this.isLibre(localidad.id)) return 'var(--error-color)';
    if (this.isSeleccionada(localidad.id)) return 'var(--primary-color)';
    return 'var(--secondary-color)';
  }

  getColorZona(zonaId: number): string {
    const config = this.zonasConfig.get(zonaId);
    if (!config) return '#6c757d';
    if (!config.habilitada || config.precio === null) return '#6c757d';
    return 'var(--primary-color)';
  }

  get esPista(): boolean {
    return this.zonaSeleccionada?.zona?.pista ?? false;
  }

  get precioUnitario(): number {
    return this.zonaSeleccionada?.precio ?? 0;
  }

  get precioTotal(): number {
    if (this.esPista) return this.precioUnitario * this.cantidadPista;
    return this.precioUnitario * this.localidadesSeleccionadas.length;
  }

  get cantidadSeleccionada(): number {
    return this.esPista ? this.cantidadPista : this.localidadesSeleccionadas.length;
  }

  aumentarCantidadPista(): void {
    if (this.cantidadPista < MAX_ENTRADAS) {
      this.cantidadPista++;
      this.cdr.markForCheck();
    }
  }

  disminuirCantidadPista(): void {
    if (this.cantidadPista > 0) {
      this.cantidadPista--;
      this.cdr.markForCheck();
    }
  }

  private obtenerIdsAleatoriasPista(): number[] {
    const libresArray = Array.from(this.localidadesLibresIds);
    // Mezclamos el array aleatoriamente
    const shuffled = libresArray.sort(() => 0.5 - Math.random());
    // Cogemos las primeras N localidades según la cantidad seleccionada
    return shuffled.slice(0, this.cantidadPista);
  }

  volverAVistaGeneral(): void {
    this.zonaSeleccionada = null;
    this.localidades = [];
    this.localidadesLibresIds.clear();
    this.localidadesSeleccionadas = [];
    this.cantidadPista = 0;
    this.filasInfo = [];
    if (this.recinto) {
      this.viewBoxDinamico = this.recinto.mapa;
      const [, , width, height] = (this.recinto.mapa || '0 0 0 0').split(' ').map(Number);
      this.aspectRatioStyle = width > 0 ? `${(height / width) * 100}%` : '100%';
    }
    this.viewBoxLimites = { minX: 0, maxX: 0 };
  }

  ajustarViewBoxParaLocalidades(localidades: LocalidadOutputDto[]): void {
    if (localidades.length === 0) { this.volverAVistaGeneral(); return; }
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    const pH = this.TAMANO_LOCALIDAD * 3;
    const pV = this.TAMANO_LOCALIDAD * 1.5;

    localidades.forEach(loc => {
      minX = Math.min(minX, loc.posX);
      maxX = Math.max(maxX, loc.posX);
      minY = Math.min(minY, loc.posY);
      maxY = Math.max(maxY, loc.posY);
    });

    const x = minX - pH;
    const y = minY - pV;
    const width = (maxX - minX) + this.TAMANO_LOCALIDAD + (pH * 2);
    const height = (maxY - minY) + this.TAMANO_LOCALIDAD + (pV * 2);

    this.viewBoxLimites = { minX: x, maxX: x + width };
    this.viewBoxDinamico = `${x} ${y} ${width} ${height}`;
    this.aspectRatioStyle = width > 0 ? `${(height / width) * 100}%` : '100%';
  }

  procesarFilas(localidades: LocalidadOutputDto[]): void {
    const filasMap = new Map<string, { sumY: number, count: number }>();
    localidades.forEach(loc => {
      if (!filasMap.has(loc.fila)) filasMap.set(loc.fila, { sumY: 0, count: 0 });
      const fila = filasMap.get(loc.fila)!;
      fila.sumY += loc.posY;
      fila.count++;
    });
    this.filasInfo = Array.from(filasMap.entries()).map(([numero, data]) => ({
      numero,
      y: data.sumY / data.count,
      minX: this.viewBoxLimites.minX,
      maxX: this.viewBoxLimites.maxX,
    }));
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
        minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
        minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
      }
    });
    if (minX === Infinity) return { x: 0, y: 0 };
    return { x: minX + (maxX - minX) / 2, y: minY + (maxY - minY) / 2 };
  }

  comprar(): void {
    if (this.cantidadSeleccionada === 0) {
      this.modalError.abrirModal('Sin selección', 'Selecciona al menos una entrada para continuar.');
      return;
    }
    if (!this.zonaSeleccionada?.zonaEventoId) return;

    if (this.isLogueado) {
      this.comprarLogueado();
    } else {
      this.comprarNoLogueado();
    }
  }

  private comprarLogueado(): void {
    if (this.formLogueado.invalid) {
      this.formLogueado.markAllAsTouched();
      return;
    }

    this.comprando = true;
    const localidadIds = this.esPista
      ? this.obtenerIdsAleatoriasPista()
      : this.localidadesSeleccionadas.map(l => l.id);

    const dto: EntradaCompraLogueadoInputDto = {
      localidad_ids: localidadIds,
      zonaEvento_id: this.zonaSeleccionada!.zonaEventoId!,
      evento_id: this.eventoId,
      tarjetaCredito: this.formLogueado.value.tarjetaCredito
    };

    this.entradaService.comprarEntradasLogueado(dto).subscribe({
      next: (ids: number[]) => {
        this.comprando = false;
        this.descargarEntradas(ids);
        this.modalExito.abrirModal('¡Compra exitosa!', `Has comprado ${ids.length} entrada(s). Las descargas comenzarán automáticamente.`);
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.comprando = false;
        this.modalError.abrirModal('Error en la compra', error.error?.message || 'No se pudo completar la compra.');
        this.cdr.markForCheck();
      }
    });
  }

  private comprarNoLogueado(): void {
    if (this.formNoLogueado.invalid) {
      this.formNoLogueado.markAllAsTouched();
      return;
    }

    this.comprando = true;
    const val = this.formNoLogueado.value;
    const localidadIds = this.esPista
      ? this.obtenerIdsAleatoriasPista()
      : this.localidadesSeleccionadas.map(l => l.id);

    const dto: EntradaCompraInputDto = {
      localidad_ids: localidadIds,
      zonaEvento_id: this.zonaSeleccionada!.zonaEventoId!,
      evento_id: this.eventoId,
      tarjetaCredito: val.tarjetaCredito,
      nombreComprador: val.nombreComprador,
      emailComprador: val.emailComprador,
      dniComprador: val.dniComprador
    };

    this.entradaService.comprarEntradas(dto).subscribe({
      next: (ids: number[]) => {
        this.comprando = false;
        this.descargarEntradas(ids);
        this.modalExito.abrirModal('¡Compra exitosa!', `Has comprado ${ids.length} entrada(s). Las descargas comenzarán automáticamente.`);
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.comprando = false;
        this.modalError.abrirModal('Error en la compra', error.error?.message || 'No se pudo completar la compra.');
        this.cdr.markForCheck();
      }
    });
  }

  descargarEntradas(ids: number[]): void {
    let descargadas = 0;
    ids.forEach((id, index) => {
      setTimeout(() => {
        this.entradaService.descargarEntrada(id).subscribe({
          next: (blob: Blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `entrada-${id}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
            
            descargadas++;
            if (descargadas === ids.length) {
              // Esperamos un pequeño margen para que el navegador procese la última descarga y el usuario vea el éxito
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            }
          },
          error: () => {
            descargadas++;
            if (descargadas === ids.length) {
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            }
          }
        });
      }, index * 500); // Mantenemos el delay para evitar que el navegador bloquee descargas múltiples
    });
  }
}
