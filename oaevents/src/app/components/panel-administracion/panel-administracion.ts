import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-panel-administracion',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './panel-administracion.html',
  styleUrl: './panel-administracion.css',
})
export class PanelAdministracion {
  navLinks = [
    { path: '/buscar-comprador', label: 'Compradores', icon: 'group' },
    { path: '/buscar-empresa', label: 'Empresas', icon: 'store' },
    { path: '/buscar-validador', label: 'Validadores', icon: 'security' }
  ];
}
