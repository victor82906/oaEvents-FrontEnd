import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmpresaService } from '../../services/empresa/empresa-service';
import { EmpresaOutputDto } from '../../model/empresa';
import { Page } from '../../model/page';
import { Cabecera } from '../cabecera/cabecera';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-buscador-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Cabecera,
    Footer
  ],
  templateUrl: './buscador-chat.html',
  styleUrl: './buscador-chat.css'
})
export class BuscadorChat implements OnInit {

  page: Page<EmpresaOutputDto> | null = null;
  cargando = false;
  terminoBusqueda: string = '';

  constructor(
    private empresaService: EmpresaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarEmpresas();
  }

  cargarEmpresas(page: number = 0): void {
    this.cargando = true;
    this.empresaService.buscar(this.terminoBusqueda, page, 10).subscribe({
      next: (respuesta) => {
        this.page = respuesta;
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error("Error al cargar empresas:", error);
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  onBusquedaChange(): void {
    this.cargarEmpresas();
  }

  cambiarPagina(nuevaPagina: number): void {
    this.cargarEmpresas(nuevaPagina);
  }

  abrirChat(empresaId: number): void {
    this.router.navigate(['/chat'], { queryParams: { receptorId: empresaId } });
  }

}
