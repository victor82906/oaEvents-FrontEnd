import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Cabecera } from '../cabecera/cabecera';
import { Footer } from '../footer/footer';
import { ModalError } from '../modal-error/modal-error';

import { EventoService } from '../../services/evento/evento-service';
import { RecintoService } from '../../services/recinto/recinto-service';
import { ZonaService } from '../../services/zona/zona-service';
import { ZonaEventoService } from '../../services/zonaEvento/zonaEvento-service';
import { TipoEventoService } from '../../services/tipoEvento/tipoEvento-service';
import { EmpresaService } from '../../services/empresa/empresa-service';

import { EventoOutputDto } from '../../model/evento';
import { ZonaOutputDto } from '../../model/zona';
import { ZonaEventoOutputDto } from '../../model/zonaEvento';
import { EmpresaOutputDto } from '../../model/empresa';
import { environment } from '../../../environments/environment';

interface ZonaConfig {
  zona: ZonaOutputDto;
  habilitada: boolean;
  precio: number | null;
  bloqueada: boolean;
}

@Component({
  selector: 'app-evento',
  standalone: true,
  imports: [CommonModule, Cabecera, Footer, ModalError],
  templateUrl: './evento.html',
  styleUrl: './evento.css',
})
export class Evento implements OnInit {
  cargando: boolean = true;
  eventoId: number = 0;
  evento: EventoOutputDto | null = null;
  tipoEventoNombre: string = '';
  entradasVendidas: number = 0;
  empresa: EmpresaOutputDto | null = null;

  recinto: any = null;
  zonas: ZonaOutputDto[] = [];
  zonasConfig: Map<number, ZonaConfig> = new Map();
  centrosZonas: { [key: number]: { x: number, y: number } } = {};
  zonaSeleccionada: ZonaConfig | null = null;

  apiUrl = environment.apiUrl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventoService: EventoService,
    private recintoService: RecintoService,
    private zonaService: ZonaService,
    private zonaEventoService: ZonaEventoService,
    private tipoEventoService: TipoEventoService,
    private empresaService: EmpresaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.eventoId = params['id'];
    });
    this.cargarDatosEvento();
  }

  cargarDatosEvento() {
    this.cargando = true;

    this.eventoService.findById(this.eventoId).subscribe({
      next: (evento) => {
        this.evento = evento;
        this.cargarEntradasVendidas(evento.id);
        this.cargarTipoEvento(evento.tipoEvento_id);
        this.cargarRecintoYZonas(evento.id);
        this.cargarEmpresa(evento.empresa_id);
      },
      error: (err) => {
        console.error('Error cargando evento', err);
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  cargarEntradasVendidas(id: number) {
    this.eventoService.entradasVendidas(id).subscribe({
      next: (cantidad) => {
        this.entradasVendidas = cantidad;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error cargando entradas', err);
      }
    });
  }

  cargarEmpresa(id: number) {
    this.empresaService.findById(id).subscribe({
      next: (empresa) => {
        this.empresa = empresa;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error cargando empresa', err);
      }
    });
  }

  cargarTipoEvento(id: number) {
    this.tipoEventoService.findAll().subscribe({
      next: (tipos) => {
        const tipo = tipos.find(t => t.id == id);
        this.tipoEventoNombre = tipo ? tipo.nombre.toUpperCase() : 'DESCONOCIDO';
        this.cdr.markForCheck();
      }
    });
  }

  cargarRecintoYZonas(eventoId: number) {
    this.recintoService.findAll().subscribe({
      next: (recintos) => {
        if (recintos.length > 0) {
          this.recinto = recintos[0];
          this.zonaService.findByRecintoId(this.recinto.id).subscribe({
            next: (zonas) => {
              this.zonas = zonas;
              this.cargarZonasEvento(eventoId);
            }
          });
        }
      }
    });
  }

  cargarZonasEvento(eventoId: number) {
    this.zonaEventoService.findByEventoId(eventoId).subscribe({
      next: (zonasEvento) => {
        this.zonasConfig.clear();

        const zonaEventoMap = new Map<number, ZonaEventoOutputDto>();
        zonasEvento.forEach(ze => zonaEventoMap.set(ze.zona_id, ze));

        this.zonas.forEach(z => {
          this.centrosZonas[z.id] = this.calcularCentroPoligono(z.coordenadas);
          const ze = zonaEventoMap.get(z.id);
          this.zonasConfig.set(z.id, {
            zona: z,
            habilitada: ze ? ze.habilitada : false,
            precio: ze ? ze.precio : null,
            bloqueada: false
          });
        });

        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error cargando zonas evento', err);
        this.cargando = false;
        this.cdr.markForCheck();
      }
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

  getColorZona(zonaId: number): string {
    const config = this.zonasConfig.get(zonaId);
    if (!config) return 'transparent';
    if (!config.habilitada || config.precio === null || config.precio <= 0) return '#6c757d'; // Gris si no está habilitada o no tiene precio
    return 'var(--primary-color)'; // Verde habilitada
  }

  seleccionarZona(zonaId: number) {
    const config = this.zonasConfig.get(zonaId);
    if (config) {
      this.zonaSeleccionada = config;
      this.cdr.markForCheck();
    }
  }

  comprarEntrada() {
    // Navigate to ticket purchase page when implemented
  }
}
