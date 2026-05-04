import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth/auth-service';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import { Cabecera } from '../cabecera/cabecera';
import { Footer } from '../footer/footer';
import {EventoOutputDto} from '../../model/evento';
import {EventoService} from '../../services/evento/evento-service';
import {Page} from '../../model/page';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule, Cabecera, Footer, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  eventosRecientes: EventoOutputDto[] = [];
  eventosSiguientes: EventoOutputDto[] = [];
  cargando: boolean = false;

  constructor(private router: Router, private authService: AuthService, private cdr: ChangeDetectorRef, private eventoService: EventoService) {}

  ngOnInit(): void {
    if(this.authService.getRol() == "RECINTO"){
      this.router.navigate(['/home-recinto']);
    }else if(this.authService.getRol() == "COMPRADOR"){
      this.router.navigate(['/home-comprador']);
    } else if(this.authService.getRol() == "EMPRESA"){
      this.router.navigate(['/home-empresa']);
    }

    this.cargarEventos();
  }

  cargarEventos() {
    this.cargando = true;

    const fechaActual = new Date();

    const fechaPasada = new Date();
    fechaPasada.setFullYear(fechaActual.getFullYear() - 1);

    const fechaFutura = new Date();
    fechaFutura.setFullYear(fechaActual.getFullYear() + 1);

    const strActual = this.formatearFecha(fechaActual);
    const strPasada = this.formatearFecha(fechaPasada);
    const strFutura = this.formatearFecha(fechaFutura);

    this.eventoService.findAceptadosByFechasPaged(strPasada, strActual, 0, 5).subscribe({
      next: (page: Page<EventoOutputDto>) => {
        this.eventosRecientes = page.content;
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar', error.error.message);
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });

    this.cargando = true;
    this.eventoService.findAceptadosByFechasPaged(strActual, strFutura, 0, 5).subscribe({
      next: (page: Page<EventoOutputDto>) => {
        this.eventosSiguientes = page.content;
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar', error.error.message);
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  formatearFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const day = fecha.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  verEvento(id: number) {
    this.router.navigate(['/evento'], { queryParams: { id: id } });
  }

}
