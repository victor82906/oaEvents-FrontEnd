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
  isOpen = false;

  navLinks = [
    { path: '/buscar-comprador', label: 'Compradores', icon: 'group' },
    { path: '/buscar-empresa', label: 'Empresas', icon: 'store' },
    { path: '/buscar-validador', label: 'Validadores', icon: 'security' },
    { path: '/buscar-evento', label: 'Eventos', icon: 'event' },
    { path: '/gestionar-eventos', label: 'Gestion Eventos', icon: 'fact_check' },
    { path: '/tipo-evento', label: 'Tipos de Evento', icon: 'category' }
  ];

  togglePanel() {
    this.isOpen = !this.isOpen;
  }
}
