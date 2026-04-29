import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecintoService } from '../../services/recinto/recinto-service';
import { ZonaService } from '../../services/zona/zona-service';
import { LocalidadService } from '../../services/localidad/localidad-service';
import { RecintoOutputDto } from '../../model/recinto';
import { ZonaOutputDto } from '../../model/zona';
import { LocalidadOutputDto } from '../../model/localidad';

@Component({
  selector: 'app-mapa-recinto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa-recinto.html',
  styleUrl: './mapa-recinto.css',
})
export class MapaRecinto implements OnInit {
  recinto: RecintoOutputDto | null = null;
  zonas: ZonaOutputDto[] = [];
  localidades: LocalidadOutputDto[] = [];
  selectedZona: ZonaOutputDto | null = null;
  cargando: boolean = false;

  // NUEVO: Controla si vemos las zonas o los asientos
  modoAsientos: boolean = false;
  // NUEVO: Guarda el centro de cada polígono para pintar el número de zona
  centrosZonas: { [key: number]: { x: number, y: number } } = {};

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
        this.recinto = recintos[0];
        this.loadZonas(this.recinto.id);
      },
      error: (err) => {
        this.cargando = false;
        console.error(err);
      }
    });
  }

  loadZonas(recintoId: number): void {
    this.zonaService.findByRecintoId(recintoId).subscribe({
      next: (zonas) => {
        this.zonas = zonas;
        // Calculamos el centro de cada zona al cargarlas
        this.zonas.forEach(z => {
          this.centrosZonas[z.id] = this.calcularCentro(z.coordenadas);
        });

        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.cargando = false;
        console.error(err);
      }
    });
  }

  onZonaClick(zona: ZonaOutputDto): void {
    const nombreUpper = (zona.numero || '').toUpperCase();
    const esZonaEspecial = nombreUpper.includes('PISTA') ||
      nombreUpper.includes('FRONT') ||
      nombreUpper.includes('ESCENARIO');

    this.selectedZona = zona;

    // Si es pista, frontstage o escenario, NO entramos al modo asientos
    if (esZonaEspecial) {
      this.modoAsientos = false;
      this.localidades = [];
      return;
    }

    // Si es una zona normal, cargamos asientos y cambiamos la vista
    this.cargando = true;
    this.localidadService.findByZonaId(zona.id).subscribe({
      next: (localidades) => {
        this.localidades = localidades;
        this.modoAsientos = true; // Oculta zonas, muestra asientos
        this.cargando = false;
        this.cdr.markForCheck();
        console.log(this.localidades);
      },
      error: (err) => {
        this.cargando = false;
        console.error(err);
      }
    });
  }

  // NUEVO: Vuelve al estado inicial del mapa
  volverAZonas(): void {
    this.modoAsientos = false;
    this.selectedZona = null;
    this.localidades = [];
  }

  // NUEVO: Calcula la caja delimitadora (Bounding Box) del polígono para hallar su centro
  calcularCentro(coordenadas: string): { x: number, y: number } {
    if (!coordenadas) return { x: 0, y: 0 };
    const puntos = coordenadas.replace(/[\r\n\t]+/g, ' ').trim().split(' ');

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

    puntos.forEach(p => {
      const coords = p.split(',');
      if (coords.length >= 2) {
        const x = parseFloat(coords[0]);
        const y = parseFloat(coords[1]);
        if (!isNaN(x) && !isNaN(y)) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    });

    if (minX === Infinity) return { x: 0, y: 0 };
    return { x: minX + (maxX - minX) / 2, y: minY + (maxY - minY) / 2 };
  }
}
