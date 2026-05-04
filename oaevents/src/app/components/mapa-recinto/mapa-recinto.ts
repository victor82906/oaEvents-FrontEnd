import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecintoService } from '../../services/recinto/recinto-service';
import { ZonaService } from '../../services/zona/zona-service';
import { LocalidadService } from '../../services/localidad/localidad-service';
import { RecintoOutputDto } from '../../model/recinto';
import { ZonaOutputDto } from '../../model/zona';
import { LocalidadOutputDto } from '../../model/localidad';
import { Cabecera } from '../cabecera/cabecera';
import { Footer } from '../footer/footer';

interface FilaInfo {
  numero: string;
  y: number;
  minX: number;
  maxX: number;
}

@Component({
  selector: 'app-mapa-recinto',
  standalone: true,
  imports: [CommonModule, Cabecera, Footer],
  templateUrl: './mapa-recinto.html',
  styleUrl: './mapa-recinto.css',
})
export class MapaRecinto implements OnInit {
  recinto: RecintoOutputDto | null = null;
  zonas: ZonaOutputDto[] = [];
  localidades: LocalidadOutputDto[] = [];
  selectedZona: ZonaOutputDto | null = null;
  cargando: boolean = false;

  viewBoxDinamico: string | null = null;
  viewBoxLímites = { minX: 0, maxX: 0 };
  aspectRatioStyle: string = '0';
  readonly TAMANO_LOCALIDAD = 40;

  infoZonaPista: { nombre: string, aforo: number } | null = null;
  centrosZonas: { [key: number]: { x: number, y: number } } = {};
  filasInfo: FilaInfo[] = [];

  constructor(
    private recintoService: RecintoService,
    private zonaService: ZonaService,
    private localidadService: LocalidadService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargando = true;
    this.recintoService.findAll().subscribe({
      next: (recintos) => {
        if (recintos.length > 0) {
          this.recinto = recintos[0];
          this.volverAVistaGeneral();
          this.loadZonas(this.recinto.id);
        } else {
          this.cargando = false;
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  loadZonas(recintoId: number): void {
    this.zonaService.findByRecintoId(recintoId).subscribe({
      next: (zonas) => {
        console.log(zonas);
        this.zonas = zonas;
        this.zonas.forEach(z => {
          this.centrosZonas[z.id] = this.calcularCentroPoligono(z.coordenadas);
        });
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  onZonaClick(zona: ZonaOutputDto): void {
    this.infoZonaPista = null;
    this.selectedZona = zona;
    this.cargando = true; // Mostramos el spinner mientras cuenta

    // Siempre pedimos las localidades al servidor para contarlas con exactitud
    this.localidadService.findByZonaId(zona.id).subscribe({
      next: (localidades) => {

        if (zona.pista) {
          // ES PISTA: Usamos el .length para el aforo, pero NO las guardamos para dibujar
          this.infoZonaPista = { nombre: zona.numero, aforo: localidades.length };
          this.localidades = [];
          this.filasInfo = [];

          // Mantenemos la vista del mapa general
          if (this.recinto) {
            this.viewBoxDinamico = this.recinto.mapa;
            const [, , width, height] = (this.recinto.mapa || '0 0 0 0').split(' ').map(Number);
            this.aspectRatioStyle = width > 0 ? `${(height / width) * 100}%` : '100%';
          }
        } else {
          // NO ES PISTA (Grada): Guardamos las localidades y hacemos zoom
          this.localidades = localidades;
          this.ajustarViewBoxParaLocalidades(localidades);
          this.procesarFilas(localidades);
        }

        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  procesarFilas(localidades: LocalidadOutputDto[]): void {
    const filasMap = new Map<string, { sumY: number, count: number }>();

    localidades.forEach(loc => {
      if (!filasMap.has(loc.fila)) {
        filasMap.set(loc.fila, { sumY: 0, count: 0 });
      }
      const fila = filasMap.get(loc.fila)!;
      fila.sumY += loc.posY;
      fila.count++;
    });

    this.filasInfo = Array.from(filasMap.entries()).map(([numero, data]) => ({
      numero,
      y: data.sumY / data.count,
      minX: this.viewBoxLímites.minX,
      maxX: this.viewBoxLímites.maxX,
    }));
  }

  ajustarViewBoxParaLocalidades(localidades: LocalidadOutputDto[]): void {
    if (localidades.length === 0) {
      this.volverAVistaGeneral();
      return;
    };

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    const paddingHorizontal = this.TAMANO_LOCALIDAD * 3;
    const paddingVertical = this.TAMANO_LOCALIDAD * 1.5;

    localidades.forEach(loc => {
      minX = Math.min(minX, loc.posX);
      maxX = Math.max(maxX, loc.posX);
      minY = Math.min(minY, loc.posY);
      maxY = Math.max(maxY, loc.posY);
    });

    const x = minX - paddingHorizontal;
    const y = minY - paddingVertical;
    const width = (maxX - minX) + this.TAMANO_LOCALIDAD + (paddingHorizontal * 2);
    const height = (maxY - minY) + this.TAMANO_LOCALIDAD + (paddingVertical * 2);

    this.viewBoxLímites = { minX: x, maxX: x + width };

    this.viewBoxDinamico = `${x} ${y} ${width} ${height}`;
    this.aspectRatioStyle = width > 0 ? `${(height / width) * 100}%` : '100%';
  }

  volverAVistaGeneral(): void {
    this.selectedZona = null;
    this.localidades = [];
    this.infoZonaPista = null;
    this.filasInfo = [];
    if (this.recinto) {
      this.viewBoxDinamico = this.recinto.mapa;
      const [, , width, height] = (this.recinto.mapa || '0 0 0 0').split(' ').map(Number);
      this.aspectRatioStyle = width > 0 ? `${(height / width) * 100}%` : '100%';
    }
    this.viewBoxLímites = { minX: 0, maxX: 0 };
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
}
