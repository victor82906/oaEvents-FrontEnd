import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Cabecera } from '../cabecera/cabecera';
import { Footer } from '../footer/footer';
import { ModalError } from '../modal-error/modal-error';

import { EventoService } from '../../services/evento/evento-service';
import { EntradaService } from '../../services/entrada/entrada-service';
import { LocalidadService } from '../../services/localidad/localidad-service';
import { TipoEventoService } from '../../services/tipoEvento/tipoEvento-service';
import { AuthService } from '../../services/auth/auth-service';

import { EventoOutputDto } from '../../model/evento';
import { EntradaOutputDto } from '../../model/entrada';
import { LocalidadOutputDto } from '../../model/localidad';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-evento-comprador',
  standalone: true,
  imports: [CommonModule, Cabecera, Footer, ModalError],
  templateUrl: './evento-comprador.html',
  styleUrl: './evento-comprador.css',
})
export class EventoComprador implements OnInit {
  cargando: boolean = true;
  eventoId: number = 0;
  apiUrl = environment.apiUrl;
  
  evento: EventoOutputDto | null = null;
  tipoEventoNombre: string = '';
  entradas: any[] = [];

  @ViewChild('modalError') modalError!: ModalError;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventoService: EventoService,
    private entradaService: EntradaService,
    private localidadService: LocalidadService,
    private tipoEventoService: TipoEventoService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.eventoId = params['id'];
    });
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;
    this.eventoService.findById(this.eventoId).subscribe({
      next: (evento) => {
        this.evento = evento;
        this.cargarTipoEvento(evento.tipoEvento_id);
        this.cargarEntradas();
      },
      error: (error) => {
        this.cargando = false;
        console.error(error);
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

  cargarEntradas(): void {
    if (this.authService.getRol() === 'COMPRADOR') {
      const compradorId = this.authService.getId();
      this.entradaService.findByCompradorIdAndEventoId(compradorId, this.eventoId).subscribe({
        next: (entradas) => {
          this.entradas = entradas;
          this.cargarDetallesLocalidades();
          this.cargando = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.cargando = false;
          console.error(error);
          this.cdr.markForCheck();
        }
      });
    } else {
      this.cargando = false;
      this.cdr.markForCheck();
    }
  }

  cargarDetallesLocalidades(): void {
    this.entradas.forEach(entrada => {
      this.localidadService.findById(entrada.localidad_id).subscribe({
        next: (localidad) => {
          console.log(localidad);
          entrada.fila = localidad.fila;
          entrada.numero = localidad.numero;
          this.cdr.markForCheck();
        }
      });
    });
  }

  descargarEntrada(id: number): void {
    this.entradaService.descargarEntrada(id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `entrada-${id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        this.modalError.abrirModal("Error al descargar la entrada", error.error.message);
        console.error(error);
      }
    });
  }
}
